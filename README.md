# LA CASA IMPERIAL

## Descripción del Monorepositorio

El mono repositorio `La Casa imperial` está organizado utilizando Nx para gestionar múltiples aplicaciones y librerías en un solo repositorio. Este enfoque facilita la reutilización de código y la gestión de dependencias, ofreciendo una arquitectura escalable y eficiente para proyectos complejos.

### Contenido del Monorepositorio

#### API (`apps/api`)
- **Tecnología**: NestJS
- **Descripción**: Una API desarrollada con NestJS que sirve como backend para las aplicaciones del panel web y la tienda online. Proporciona servicios de autenticación, gestión de datos y lógica de negocio.
- **Características**:
  - Servicios RESTful para interacción con datos.
  - Autenticación y autorización.
  - Integración con bases de datos y otros servicios externos.

#### Panel Web (`apps/panel`)
- **Tecnología**: Angular
- **Descripción**: Una aplicación web destinada a la administración interna del sistema. Incluye funcionalidades como gestión de usuarios, informes, y otras herramientas de administración.
- **Características**:
  - Dashboard intuitivo y personalizable.
  - Gestión de usuarios y roles.
  - Visualización de estadísticas e informes.

#### Tienda Online (`apps/store`)
- **Tecnología**: Angular
- **Descripción**: Una aplicación web de comercio electrónico para ofrecer productos y servicios a los clientes. Incluye funcionalidades como catálogo de productos, carrito de compras, y procesamiento de pagos.
- **Características**:
  - Catálogo de productos con filtrado y búsqueda.
  - Integración con sistemas de pago.
  - Gestión de órdenes y envíos.



### Librerías Compartidas (`libs/`)
- **Core**: Funciones utilitarias compartidas entre las aplicaciones.
- **Schemas**: Modelos de datos reutilizados en el panel web, la tienda online y la API.

### Beneficios del Monorepositorio
- **Reutilización de Código**: Facilita compartir y reutilizar módulos y componentes entre diferentes aplicaciones.
- **Gestión Centralizada**: Permite manejar dependencias y configuraciones de manera centralizada, reduciendo la complejidad.
- **Desarrollo Coordinado**: Favorece la colaboración entre equipos de desarrollo, facilitando el trabajo en paralelo en diferentes partes del sistema.
