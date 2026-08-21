#  Modelo de Dominio

Este documento define las entidades principales del negocio (Objetos de Dominio) y cómo interactúan entre sí. El diseño prioriza la abstracción y la flexibilidad, separando los conceptos comerciales de las implementaciones.

## Diagrama de Clases (UML)

El siguiente diagrama ilustra las relaciones estructurales del sistema:

```mermaid
classDiagram
    %% Módulo de Usuarios y Accesos
    class Usuario {
        +String username
        +String passwordHash
    }
    class Rol {
        +String nombreRol
    }
    Usuario "*" --> "1" Rol : posee

    %% Módulo de Inventario y Catálogo
    class InsumoBase {
        +String nombre
        +String unidadDeMedida
    }
    class InsumoComercial {
        +String marca
        +Decimal costoReferencia
        +Decimal stockActual
    }
    class Producto {
        +String nombre
        +Decimal precioVenta
        +Integer stockActual
    }
    class ItemReceta {
        +Decimal cantidadNecesaria
    }
    
    InsumoBase "1" <-- "*" InsumoComercial : es variante de
    Producto "1" *-- "*" ItemReceta : compuesto por
    ItemReceta "*" --> "1" InsumoBase : requiere (abstracción)

    %% Módulo de Compras (Abastecimiento)
    class Proveedor {
        +String razonSocial
    }
    class Compra {
        +LocalDateTime fecha
        +Decimal montoTotal
    }
    class DetalleCompra {
        +Decimal cantidad
        +Decimal precioUnitario
    }
    
    Compra "*" --> "1" Proveedor : comprada a
    Compra "1" *-- "*" DetalleCompra : contiene
    DetalleCompra "*" --> "1" InsumoComercial : abastece

    %% Módulo de Producción y Mermas
    class ProduccionDiaria {
        +LocalDateTime fecha
        +String observaciones
    }
    class DetalleProduccion {
        +Integer cantidadElaborada
    }
    class AjusteStock {
        +LocalDateTime fecha
        +Decimal cantidadAjustada
        +String tipoAjuste
        +String justificacion
    }
    
    ProduccionDiaria "1" *-- "*" DetalleProduccion : registra
    DetalleProduccion "*" --> "1" Producto : elabora
    AjusteStock "*" --> "1" InsumoComercial : afecta stock de

    %% Módulo de Finanzas (Socios)
    class Socio {
        +String nombre
    }
    class MovimientoCapital {
        +LocalDateTime fecha
        +Decimal monto
        +String tipoMovimiento
    }
    
    Socio "1" *-- "*" MovimientoCapital : realiza