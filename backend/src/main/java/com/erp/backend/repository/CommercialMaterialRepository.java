package com.erp.backend.repository;

import com.erp.backend.model.CommercialMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommercialMaterialRepository extends JpaRepository<CommercialMaterial, Long> {
    List<CommercialMaterial> findByIsActiveTrue();
    
    List<CommercialMaterial> findByBaseMaterialIdAndIsActiveTrue(Long baseMaterialId);
}