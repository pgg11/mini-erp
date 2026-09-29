package com.erp.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_adjustments")
@Data
public class StockAdjustment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commercial_material_id", nullable = false)
    private CommercialMaterial commercialMaterial;

    // Puede ser positivo (ej: +5.00 por recuento) o negativo (ej: -1.50 por merma)
    @Column(name = "quantity_change", precision = 10, scale = 2, nullable = false)
    private BigDecimal quantityChange;

    // Foto de auditoría: cuánto stock había justo antes del ajuste
    @Column(name = "previous_stock", precision = 10, scale = 2, nullable = false)
    private BigDecimal previousStock;

    // Foto de auditoría: cómo quedó el stock después del ajuste
    @Column(name = "new_stock", precision = 10, scale = 2, nullable = false)
    private BigDecimal newStock;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdjustmentReason reason;

    @Column(length = 255)
    private String notes; // Ej: "Bolsa rota por humedad en el depósito"

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}