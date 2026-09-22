package com.erp.backend.service;

import com.erp.backend.model.BaseMaterial;
import com.erp.backend.repository.BaseMaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BaseMaterialService {

    private final BaseMaterialRepository repository;

    // Inyección de dependencias a través del constructor
    public BaseMaterialService(BaseMaterialRepository repository) {
        this.repository = repository;
    }

    public List<BaseMaterial> getAllActive() {
        return repository.findByIsActiveTrue();
    }

    public BaseMaterial create(BaseMaterial material) {
        // Aquí podríamos agregar validaciones (ej. que el nombre no esté vacío)
        return repository.save(material);
    }

    public void softDelete(Long id) {
        BaseMaterial material = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo base no encontrado"));
        
        // Hacemos el borrado lógico cambiando el estado
        material.setIsActive(false);
        repository.save(material);
    }
}