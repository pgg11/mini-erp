package com.erp.backend.repository;

import com.erp.backend.model.BaseMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BaseMaterialRepository extends JpaRepository<BaseMaterial, Long> {

    List<BaseMaterial> findByIsActiveTrue();
}