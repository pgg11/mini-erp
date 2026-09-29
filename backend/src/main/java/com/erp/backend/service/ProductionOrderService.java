package com.erp.backend.service;

import com.erp.backend.model.*;
import com.erp.backend.repository.CommercialMaterialRepository;
import com.erp.backend.repository.ProductionOrderRepository;
import com.erp.backend.repository.RecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductionOrderService {

    private final ProductionOrderRepository orderRepository;
    private final RecipeRepository recipeRepository;
    private final CommercialMaterialRepository commercialRepository;

    public ProductionOrderService(ProductionOrderRepository orderRepository,
                                  RecipeRepository recipeRepository,
                                  CommercialMaterialRepository commercialRepository) {
        this.orderRepository = orderRepository;
        this.recipeRepository = recipeRepository;
        this.commercialRepository = commercialRepository;
    }

    public List<ProductionOrder> getAllOrders() {
        return orderRepository.findAll();
    }

    public ProductionOrder createOrder(ProductionOrder order) {
        Recipe recipe = recipeRepository.findById(order.getRecipe().getId())
                .orElseThrow(() -> new RuntimeException("Receta no encontrada"));
        
        order.setRecipe(recipe);
        order.setStatus(ProductionStatus.PLANNED);
        return orderRepository.save(order);
    }

    @Transactional
    public ProductionOrder completeOrder(Long orderId) {
        ProductionOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden de producción no encontrada"));

        if (order.getStatus() == ProductionStatus.COMPLETED) {
            throw new IllegalStateException("La orden ya fue completada anteriormente.");
        }
        if (order.getStatus() == ProductionStatus.CANCELLED) {
            throw new IllegalStateException("No se puede completar una orden cancelada.");
        }

        Recipe recipe = order.getRecipe();
        BigDecimal multiplier = order.getBatchMultiplier();
        BigDecimal totalOrderCost = BigDecimal.ZERO;

        // Recorrer cada ingrediente requerido por la receta
        for (RecipeItem item : recipe.getItems()) {
            BigDecimal requiredQuantity = item.getQuantity().multiply(multiplier);
            Long baseMaterialId = item.getBaseMaterial().getId();

            // Buscar todas las marcas activas de este insumo base
            List<CommercialMaterial> availableMaterials = commercialRepository
                    .findByBaseMaterialIdAndIsActiveTrue(baseMaterialId);

            BigDecimal remainingToDeduct = requiredQuantity;

            for (CommercialMaterial commercial : availableMaterials) {
                if (remainingToDeduct.compareTo(BigDecimal.ZERO) <= 0) {
                    break;
                }

                BigDecimal currentStock = commercial.getCurrentStock();
                if (currentStock.compareTo(BigDecimal.ZERO) > 0) {
                    // Determinar cuánto podemos sacar de esta marca específica
                    BigDecimal deduction = currentStock.min(remainingToDeduct);
                    
                    // Descontar stock
                    commercial.setCurrentStock(currentStock.subtract(deduction));
                    commercialRepository.save(commercial);

                    // Sumar al costo de producción (cantidad usada * costo de referencia de la marca)
                    BigDecimal unitCost = commercial.getReferenceCost() != null ? commercial.getReferenceCost() : BigDecimal.ZERO;
                    totalOrderCost = totalOrderCost.add(deduction.multiply(unitCost));

                    // Actualizar cuánto nos falta descontar
                    remainingToDeduct = remainingToDeduct.subtract(deduction);
                }
            }

            // Si después de revisar todas las marcas sigue faltando insumo, abortar toda la transacción
            if (remainingToDeduct.compareTo(BigDecimal.ZERO) > 0) {
                throw new RuntimeException("Stock insuficiente para el insumo base: " 
                        + item.getBaseMaterial().getName() + ". Faltan: " + remainingToDeduct 
                        + " " + item.getBaseMaterial().getUnitOfMeasure());
            }
        }

        // Marcar la orden como completada y registrar costo y fecha
        order.setTotalProductionCost(totalOrderCost);
        order.setStatus(ProductionStatus.COMPLETED);
        order.setCompletedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }
}