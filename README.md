# Entre Migas - Mini ERP

Un Sistema de Gestión Integral (Mini-ERP) desarrollado para un emprendimiento real de budines artesanales.

El objetivo de este proyecto fue digitalizar la cadena de producción de "Entre Migas", reemplazando múltiples planillas aisladas por una solución centralizada y segura. El sistema gestiona desde la compra de insumos hasta las órdenes de producción diaria, garantizando la trazabilidad, el control de mermas y la seguridad de los datos.

## Funcionalidades Principales

- **Gestión de Inventario y Mermas:** Control de stock en tiempo real y registro de pérdidas operativas.
- **Compras y Proveedores:** Seguimiento de ingresos de mercadería, gestión de costos y actualización automática de stock.
- **Motor de Recetas:** Estandarización de proporciones e ingredientes para mantener la calidad y calcular costos de producción.
- **Órdenes de Producción:** Planificación del trabajo diario en cocina, descontando automáticamente los insumos utilizados según las recetas.
- **Control de Acceso:** Sistema de usuarios con roles (Administrador / Usuario) que restringe el acceso a módulos sensibles tanto en la interfaz visual como en la API REST.

## Stack Tecnológico

- **Backend:** Java 17, Spring Boot 3, Spring Security, Spring Data JPA.
- **Frontend:** React.js, Vite.
- **Base de Datos:** PostgreSQL 15.
- **Seguridad:** JSON Web Tokens (JWT) con algoritmo HS256, BCrypt Password Encoder.
- **Infraestructura:** Docker & Docker Compose

## Decisiones Técnicas y Arquitectura

1. **Arquitectura Stateless y Seguridad (JWT):** 
   Se implementó autenticación mediante tokens JWT para mantener el backend sin estado, mejorando el rendimiento y facilitando el escalado. Las credenciales se almacenan encriptadas en la base de datos utilizando BCrypt.
2. **Autorización en Dos Capas:** 
   La restricción de acceso se valida en el frontend (mediante renderizado condicional decodificando el payload del JWT con `atob()`) y se aplica de manera estricta en el backend utilizando `SecurityFilterChain` y validación de roles de Spring Security.
3. **Gestión de Usuarios Cerrada (Por diseño):** 
   Por requerimientos del negocio, el sistema no cuenta con registro público. La creación de personal está restringida exclusivamente al rol `ADMIN` a través de un endpoint protegido. La arquitectura permite extender el sistema para habilitar auto-registro si el modelo de negocio evoluciona.
4. **Contenerización Integral:** 
   Todo el entorno (Base de Datos, API y Frontend) está empaquetado en contenedores Docker y orquestado mediante `docker-compose`. Las conexiones de red internas se resuelven nativamente mediante DNS de Docker (ej. pasando `DB_HOST=postgres` por variables de entorno), lo que garantiza que el sistema funcione de manera idéntica en el entorno de desarrollo local y en producción.

## Instalación y Despliegue Local

### Requisitos Previos
- Docker y Docker Compose instalados.
- Git.

### Pasos

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/pgg11/mini-erp.git](https://github.com/pgg11/mini-erp.git)
   cd mini-erp
2. Configurar las variables de entorno:
   Dentro de la carpeta `backend`, renombra el archivo `.env.example` a `.env` y configura tus credenciales locales:
   ```bash
   cp ./backend/.env.example ./backend/.env
   ```
3. Levantar la infraestructura con Docker:
   ```bash
   docker compose up --build -d
   ```
4. Acceder al sistema:
   - **Frontend (Interfaz Gráfica):** `http://localhost:80`
   - **Backend (API REST):** `http://localhost:8080`