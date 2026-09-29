package com.erp.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "recipe_items")
@Data
public class RecipeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    // Una receta puede consumir un insumo base (ej. Harina genérica)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "base_material_id", nullable = false)
    private BaseMaterial baseMaterial;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantity; // Cantidad necesaria para la receta (ej. 0.250)
}