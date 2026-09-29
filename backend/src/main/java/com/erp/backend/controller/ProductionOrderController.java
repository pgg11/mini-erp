package com.erp.backend.controller;

import com.erp.backend.model.ProductionOrder;
import com.erp.backend.service.ProductionOrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/production-orders")
public class ProductionOrderController {

    private final ProductionOrderService service;

    public ProductionOrderController(ProductionOrderService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ProductionOrder>> getAll() {
        return ResponseEntity.ok(service.getAllOrders());
    }

    // 1. Planificar / Crear la orden
    @PostMapping
    public ResponseEntity<ProductionOrder> create(@RequestBody ProductionOrder order) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createOrder(order));
    }

    // 2. Ejecutar / Completar la orden (Descuenta stock y calcula costos)
    @PostMapping("/{id}/complete")
    public ResponseEntity<ProductionOrder> completeOrder(@PathVariable Long id) {
        return ResponseEntity.ok(service.completeOrder(id));
    }
}