package com.erp.backend.model;

public enum AdjustmentReason {
    WASTE,                // Merma, rotura de envase o vencimiento
    COUNT_CORRECTION,     // Diferencia detectada en recuento físico de depósito
    INITIAL_STOCK,        // Carga de inventario inicial sin factura de compra
    INTERNAL_CONSUMPTION  // Uso interno o pruebas de cocina/laboratorio
}