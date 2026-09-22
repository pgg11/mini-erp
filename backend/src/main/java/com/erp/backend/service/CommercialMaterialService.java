package com.erp.backend.service; // Ajusta tu paquete

import com.erp.backend.model.BaseMaterial;
import com.erp.backend.model.CommercialMaterial;
import com.erp.backend.repository.BaseMaterialRepository;
import com.erp.backend.repository.CommercialMaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommercialMaterialService {

    private final CommercialMaterialRepository commercialRepository;
    private final BaseMaterialRepository baseRepository;

    // Inyectamos ambos repositorios porque necesitamos validar que el Insumo Base exista
    public CommercialMaterialService(CommercialMaterialRepository commercialRepository, BaseMaterialRepository baseRepository) {
        this.commercialRepository = commercialRepository;
        this.baseRepository = baseRepository;
    }

    public List<CommercialMaterial> getAllActive() {
        return commercialRepository.findByIsActiveTrue();
    }

    public List<CommercialMaterial> getActiveByBaseMaterial(Long baseMaterialId) {
        return commercialRepository.findByBaseMaterialIdAndIsActiveTrue(baseMaterialId);
    }

    public CommercialMaterial create(CommercialMaterial request) {
        // 1. Validamos que en la petición venga el ID del Insumo Base
        if (request.getBaseMaterial() == null || request.getBaseMaterial().getId() == null) {
            throw new IllegalArgumentException("Debe especificar el ID del insumo base.");
        }
        
        // 2. Buscamos el Insumo Base en la BD
        BaseMaterial base = baseRepository.findById(request.getBaseMaterial().getId())
                .orElseThrow(() -> new RuntimeException("Insumo base no encontrado con ID: " + request.getBaseMaterial().getId()));
        
        // 3. Asociamos la entidad real y guardamos
        request.setBaseMaterial(base);
        return commercialRepository.save(request);
    }

    public void softDelete(Long id) {
        CommercialMaterial material = commercialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo comercial no encontrado"));
        material.setIsActive(false);
        commercialRepository.save(material);
    }
}