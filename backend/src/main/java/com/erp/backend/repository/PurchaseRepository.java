package com.erp.backend.repository;

import com.erp.backend.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    // Aquí podríamos agregar consultas personalizadas si necesitamos filtrar compras por fecha o proveedor
}