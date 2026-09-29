package com.erp.backend.service;

import com.erp.backend.model.BaseMaterial;
import com.erp.backend.model.Recipe;
import com.erp.backend.model.RecipeItem;
import com.erp.backend.repository.BaseMaterialRepository;
import com.erp.backend.repository.RecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final BaseMaterialRepository baseMaterialRepository;

    public RecipeService(RecipeRepository recipeRepository, BaseMaterialRepository baseMaterialRepository) {
        this.recipeRepository = recipeRepository;
        this.baseMaterialRepository = baseMaterialRepository;
    }

    public List<Recipe> getAllActive() {
        return recipeRepository.findByIsActiveTrue();
    }

    @Transactional
    public Recipe createRecipe(Recipe recipe) {
        // Validar e interconectar los items de la receta
        if (recipe.getItems() != null) {
            for (RecipeItem item : recipe.getItems()) {
                item.setRecipe(recipe);
                
                BaseMaterial base = baseMaterialRepository.findById(item.getBaseMaterial().getId())
                        .orElseThrow(() -> new RuntimeException("Insumo base no encontrado para la receta"));
                item.setBaseMaterial(base);
            }
        }
        return recipeRepository.save(recipe);
    }
}