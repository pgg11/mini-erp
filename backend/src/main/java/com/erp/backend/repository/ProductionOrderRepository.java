package com.erp.backend.repository;

import com.erp.backend.model.ProductionOrder;
import com.erp.backend.model.ProductionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductionOrderRepository extends JpaRepository<ProductionOrder, Long> {
    List<ProductionOrder> findByStatus(ProductionStatus status);
}