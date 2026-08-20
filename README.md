# Mini-ERP Backend API

## Acerca del Proyecto

**Mini-ERP Backend** es una API RESTful robusta diseñada para centralizar y gestionar las operaciones núcleo (core) de una pequeña y mediana empresa (PyME). Desarrollado con un fuerte enfoque en prácticas de ingeniería backend corporativa y Programación Orientada a Objetos, este sistema modela un motor de inventario generalizable que administra materias primas, productos terminados, compras a proveedores y órdenes de producción.

Aunque la arquitectura está diseñada para ser agnóstica al dominio comercial y fácilmente escalable mediante nuevos módulos, el caso de uso base implementa el flujo de gestión integral de un emprendimiento de producción de alimentos (budines artesanales). Esto demuestra la capacidad del sistema para resolver problemas reales, como el manejo de listas de materiales, la actualización de costos por inflación y el control estricto de transacciones de stock.

El proyecto está diseñado para ser desplegado de manera ágil en entornos contenerizados sobre sistemas operativos Linux, garantizando portabilidad y facilidad de configuración.

## Stack Tecnológico Core
- **Lenguaje:** Java 
- **Framework:** Spring Boot (REST, Data JPA, etc.)
- **Base de Datos:** PostgreSQL
- **Infraestructura:** Docker & Docker Compose
- **Arquitectura:** Patrón multicapa (Controlador, Servicio, Repositorio)

---