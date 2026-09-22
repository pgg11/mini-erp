package com.erp.backend.controller; // Ajusta tu paquete

import com.erp.backend.model.CommercialMaterial;
import com.erp.backend.service.CommercialMaterialService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/commercial-materials")
public class CommercialMaterialController {

    private final CommercialMaterialService service;

    public CommercialMaterialController(CommercialMaterialService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CommercialMaterial>> getAllActive() {
        return ResponseEntity.ok(service.getAllActive());
    }

    // Endpoint útil para el frontend: "Dame todas las marcas de Harina 0000"
    @GetMapping("/by-base/{baseMaterialId}")
    public ResponseEntity<List<CommercialMaterial>> getByBaseMaterial(@PathVariable Long baseMaterialId) {
        return ResponseEntity.ok(service.getActiveByBaseMaterial(baseMaterialId));
    }

    @PostMapping
    public ResponseEntity<CommercialMaterial> create(@RequestBody CommercialMaterial material) {
        CommercialMaterial created = service.create(material);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        service.softDelete(id);
        return ResponseEntity.noContent().build();
    }
}