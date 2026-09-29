package com.erp.backend.service;

import com.erp.backend.model.CommercialMaterial;
import com.erp.backend.model.StockAdjustment;
import com.erp.backend.repository.CommercialMaterialRepository;
import com.erp.backend.repository.StockAdjustmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class StockAdjustmentService {

    private final StockAdjustmentRepository adjustmentRepository;
    private final CommercialMaterialRepository commercialRepository;

    public StockAdjustmentService(StockAdjustmentRepository adjustmentRepository,
                                  CommercialMaterialRepository commercialRepository) {
        this.adjustmentRepository = adjustmentRepository;
        this.commercialRepository = commercialRepository;
    }

    public List<StockAdjustment> getAllAdjustments() {
        return adjustmentRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<StockAdjustment> getByCommercialMaterial(Long commercialMaterialId) {
        return adjustmentRepository.findByCommercialMaterialIdOrderByCreatedAtDesc(commercialMaterialId);
    }

    @Transactional
    public StockAdjustment registerAdjustment(StockAdjustment adjustment) {
        if (adjustment.getQuantityChange() == null || adjustment.getQuantityChange().compareTo(BigDecimal.ZERO) == 0) {
            throw new IllegalArgumentException("La cantidad a ajustar debe ser distinta de cero.");
        }

        CommercialMaterial material = commercialRepository.findById(adjustment.getCommercialMaterial().getId())
                .orElseThrow(() -> new RuntimeException("Insumo comercial no encontrado."));

        BigDecimal previousStock = material.getCurrentStock() != null ? material.getCurrentStock() : BigDecimal.ZERO;
        BigDecimal newStock = previousStock.add(adjustment.getQuantityChange());

        // Regla de integridad física: el depósito nunca puede tener stock negativo
        if (newStock.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException("El ajuste dejaría el stock en negativo (" + newStock 
                    + "). Stock actual disponible: " + previousStock);
        }

        // 1. Actualizar el stock real del insumo comercial
        material.setCurrentStock(newStock);
        commercialRepository.save(material);

        // 2. Completar los datos de auditoría y guardar el registro histórico
        adjustment.setCommercialMaterial(material);
        adjustment.setPreviousStock(previousStock);
        adjustment.setNewStock(newStock);

        return adjustmentRepository.save(adjustment);
    }
}