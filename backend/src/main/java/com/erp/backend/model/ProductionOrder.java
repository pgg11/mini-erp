package com.erp.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "production_orders")
@Data
public class ProductionOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    // Cuántos lotes o multiplicador de la receta vamos a fabricar (ej: 2.00 = el doble de la receta base)
    @Column(name = "batch_multiplier", precision = 10, scale = 2, nullable = false)
    private BigDecimal batchMultiplier;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductionStatus status = ProductionStatus.PLANNED;

    // Costo total calculado al momento de completar la orden según los insumos comerciales consumidos
    @Column(name = "total_production_cost", precision = 10, scale = 2)
    private BigDecimal totalProductionCost;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}