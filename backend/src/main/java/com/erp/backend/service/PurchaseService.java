package com.erp.backend.service;

import com.erp.backend.model.CommercialMaterial;
import com.erp.backend.model.Purchase;
import com.erp.backend.model.PurchaseDetail;
import com.erp.backend.model.Supplier;
import com.erp.backend.repository.CommercialMaterialRepository;
import com.erp.backend.repository.PurchaseRepository;
import com.erp.backend.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final SupplierRepository supplierRepository;
    private final CommercialMaterialRepository commercialMaterialRepository;

    public PurchaseService(PurchaseRepository purchaseRepository, 
                           SupplierRepository supplierRepository, 
                           CommercialMaterialRepository commercialMaterialRepository) {
        this.purchaseRepository = purchaseRepository;
        this.supplierRepository = supplierRepository;
        this.commercialMaterialRepository = commercialMaterialRepository;
    }

    @Transactional // Todo se guarda o nada se guarda (Atomicidad)
    public Purchase registerPurchase(Purchase purchase) {
        // 1. Validar y asociar el Proveedor
        Supplier supplier = supplierRepository.findById(purchase.getSupplier().getId())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        purchase.setSupplier(supplier);

        if (purchase.getPurchaseDate() == null) {
            purchase.setPurchaseDate(LocalDateTime.now());
        }

        BigDecimal calculatedTotal = BigDecimal.ZERO;

        // 2. Procesar cada renglón de la compra
        for (PurchaseDetail detail : purchase.getDetails()) {
            // Asociar el detalle a la compra principal
            detail.setPurchase(purchase);

            // Buscar el insumo comercial que se está comprando
            CommercialMaterial material = commercialMaterialRepository.findById(detail.getCommercialMaterial().getId())
                    .orElseThrow(() -> new RuntimeException("Insumo comercial no encontrado ID: " + detail.getCommercialMaterial().getId()));
            
            detail.setCommercialMaterial(material);

            // A. ACTUALIZAR STOCK: Sumar la cantidad comprada al stock actual
            BigDecimal currentStock = material.getCurrentStock() != null ? material.getCurrentStock() : BigDecimal.ZERO;
            material.setCurrentStock(currentStock.add(detail.getQuantity()));

            // B. ACTUALIZAR COSTO DE REFERENCIA: El nuevo costo pasa a ser el precio unitario de la última compra
            material.setReferenceCost(detail.getUnitPrice());

            // Guardar los cambios del insumo comercial (esto disparará también el bloqueo optimista si fuera necesario)
            commercialMaterialRepository.save(material);

            // C. Calcular subtotal del renglón y sumarlo al total general
            BigDecimal subtotal = detail.getQuantity().multiply(detail.getUnitPrice());
            calculatedTotal = calculatedTotal.add(subtotal);
        }

        // Asignar el monto total calculado
        purchase.setTotalAmount(calculatedTotal);

        // 3. Guardar la compra (gracias a CascadeType.ALL, los detalles se guardan solos)
        return purchaseRepository.save(purchase);
    }

    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }
}