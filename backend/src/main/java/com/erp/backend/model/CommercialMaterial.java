package com.erp.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "commercial_materials")
@Data
public class CommercialMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "base_material_id", nullable = false)
    private BaseMaterial baseMaterial;

    @Column(nullable = false)
    private String brand;

    @Column(name = "reference_cost", precision = 10, scale = 2)
    private BigDecimal referenceCost;

    @Column(name = "current_stock", precision = 10, scale = 2, nullable = false)
    private BigDecimal currentStock = BigDecimal.ZERO;

    @Version
    private Integer version;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}