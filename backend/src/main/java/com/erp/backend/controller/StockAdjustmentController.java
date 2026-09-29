package com.erp.backend.controller;

import com.erp.backend.model.StockAdjustment;
import com.erp.backend.service.StockAdjustmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/adjustments")
public class StockAdjustmentController {

    private final StockAdjustmentService service;

    public StockAdjustmentController(StockAdjustmentService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<StockAdjustment>> getAll() {
        return ResponseEntity.ok(service.getAllAdjustments());
    }

    @GetMapping("/material/{commercialMaterialId}")
    public ResponseEntity<List<StockAdjustment>> getByMaterial(@PathVariable Long commercialMaterialId) {
        return ResponseEntity.ok(service.getByCommercialMaterial(commercialMaterialId));
    }

    @PostMapping
    public ResponseEntity<StockAdjustment> create(@RequestBody StockAdjustment adjustment) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registerAdjustment(adjustment));
    }
}