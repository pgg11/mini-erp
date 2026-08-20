## Historias de Usuario (Alcance del Proyecto)

**Estados:** `(Pendiente)` | `(En curso)` | `(Finalizada)`

### Bloque 1: Autenticación y Control de Acceso (Roles)
* **HU 1.1 - Inicio de Sesión:** Como usuario, quiero iniciar sesión en el sistema mediante credenciales para acceder a mis funcionalidades. *(Pendiente)*
* **HU 1.2 - Gestión de Roles:** Como administrador, quiero asignar roles (ej. Operario, Administrador) para restringir el acceso a operaciones críticas financieras o de eliminación de registros. *(Pendiente)*

### Bloque 2: Gestión de Insumos e Inventario
* **HU 2.1 - Catálogo Base:** Como usuario, quiero registrar, editar y consultar insumos base especificando su unidad de medida (kg, litros, unidades). *(Pendiente)*
* **HU 2.2 - Stock por Marca:** Como usuario, al consultar el stock, quiero ver las cantidades disponibles discriminadas por insumo y por su respectiva **marca**. *(Pendiente)*

### Bloque 3: Compras y Abastecimiento
* **HU 3.1 - Registro de Compras:** Como usuario, quiero registrar una orden de compra indicando el proveedor, fecha, e insumos adquiridos, especificando la **marca** y precio exacto de esa compra. *(Pendiente)*
* **HU 3.2 - Actualización de Stock y Costos:** Como sistema, al confirmar una compra, quiero incrementar el stock del insumo/marca correspondiente y actualizar su precio de costo de referencia. *(Pendiente)*

### Bloque 4: Gestión de Productos y Recetas (BOM)
* **HU 4.1 - Definición de Productos:** Como usuario, quiero crear y editar productos terminados definiendo su receta (qué insumos base lleva y en qué cantidades). *(Pendiente)*
* **HU 4.2 - Costeo Automático:** Como sistema, quiero calcular automáticamente el costo de producción sugerido basándome en el costo actual de los insumos que componen la receta. *(Pendiente)*

### Bloque 5: Producción Diaria y Mermas
* **HU 5.1 - Registro de Producción:** Como usuario, quiero cargar la "Producción del Día" detallando los productos y cantidades elaboradas. *(Pendiente)*
* **HU 5.2 - Descuento de Insumos:** Como sistema, al confirmar la producción del día, quiero descontar automáticamente del stock los insumos consumidos. *(Pendiente)*
* **HU 5.3 - Registro de Mermas/Ajustes:** Como usuario, quiero registrar pérdidas de insumos o productos (merma) con una descripción del motivo para mantener la auditoría del inventario. *(Pendiente)*

### Bloque 6: Finanzas, Balances y Socios
* **HU 6.1 - Registro de Inversiones:** Como socio, quiero registrar los aportes de capital que realizo al emprendimiento para tener un historial de quién invirtió qué cantidad. *(Pendiente)*
* **HU 6.2 - Dashboard de Balances:** Como administrador, quiero visualizar un balance general que contraste los gastos (compras), el valor del capital inmovilizado (stock actual valorizado) y las ganancias/ventas hasta el momento. *(Pendiente)*
* **HU 6.3 - División de Gastos/Ganancias:** Como sistema, quiero calcular la proporción correspondiente a cada socio en base a sus inversiones iniciales y registros financieros. *(Pendiente)*