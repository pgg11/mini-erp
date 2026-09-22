package com.erp.backend.controller; // Ajusta según tu estructura

import com.erp.backend.model.BaseMaterial;
import com.erp.backend.service.BaseMaterialService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/base-materials")
public class BaseMaterialController {

    private final BaseMaterialService service;

    public BaseMaterialController(BaseMaterialService service) {
        this.service = service;
    }

    // Endpoint para listar todos los insumos activos
    @GetMapping
    public ResponseEntity<List<BaseMaterial>> getAllActive() {
        return ResponseEntity.ok(service.getAllActive());
    }

    // Endpoint para crear un nuevo insumo
    @PostMapping
    public ResponseEntity<BaseMaterial> create(@RequestBody BaseMaterial material) {
        BaseMaterial created = service.create(material);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Endpoint para hacer el borrado lógico
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        service.softDelete(id);
        return ResponseEntity.noContent().build();
    }
}