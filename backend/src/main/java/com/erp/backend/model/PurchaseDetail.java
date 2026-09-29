package com.erp.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "purchase_details")
@Data
public class PurchaseDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_id", nullable = false)
    private Purchase purchase;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commercial_material_id", nullable = false)
    private CommercialMaterial commercialMaterial;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantity; // Cuánto se compró (ej. 50.00 kg)

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice; // A qué precio unitario se pagó
}