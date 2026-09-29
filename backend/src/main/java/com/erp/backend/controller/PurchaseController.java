package com.erp.backend.controller;

import com.erp.backend.model.Purchase;
import com.erp.backend.service.PurchaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping
    public ResponseEntity<Purchase> registerPurchase(@RequestBody Purchase purchase) {
        Purchase savedPurchase = purchaseService.registerPurchase(purchase);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPurchase);
    }

    @GetMapping
    public ResponseEntity<List<Purchase>> getAll() {
        return ResponseEntity.ok(purchaseService.getAllPurchases());
    }
}