package com.erp.backend.controller;

import com.erp.backend.model.Supplier;
import com.erp.backend.repository.SupplierRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierRepository repository;

    public SupplierController(SupplierRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<Supplier>> getAllActive() {
        return ResponseEntity.ok(repository.findByIsActiveTrue());
    }

    @PostMapping
    public ResponseEntity<Supplier> create(@RequestBody Supplier supplier) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(supplier));
    }
}