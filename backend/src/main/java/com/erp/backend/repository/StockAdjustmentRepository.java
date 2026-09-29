package com.erp.backend.repository;

import com.erp.backend.model.StockAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockAdjustmentRepository extends JpaRepository<StockAdjustment, Long> {
    
    List<StockAdjustment> findAllByOrderByCreatedAtDesc();

    // Permite ver todo el historial de ajustes de una marca específica
    List<StockAdjustment> findByCommercialMaterialIdOrderByCreatedAtDesc(Long commercialMaterialId);
}