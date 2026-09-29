package com.erp.backend.controller;

import com.erp.backend.model.Recipe;
import com.erp.backend.service.RecipeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public ResponseEntity<List<Recipe>> getAllActive() {
        return ResponseEntity.ok(recipeService.getAllActive());
    }

    @PostMapping
    public ResponseEntity<Recipe> create(@RequestBody Recipe recipe) {
        Recipe created = recipeService.createRecipe(recipe);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}