SmartPOS - Sistema de Gestión de Ventas e Inventario
Este proyecto es un sistema de gestión de ventas e inventario desarrollado con un enfoque académico y profesional para optimizar procesos comerciales. La plataforma permite el control de stock en tiempo real, la gestión de catálogos de productos y el procesamiento de ventas de forma ágil y segura.

 Características Principales
Punto de Venta (POS): Interfaz optimizada para el procesamiento rápido de ventas con cálculo automático de cambio.

Gestión de Inventario: Control detallado de existencias con alertas visuales para productos con bajo stock.

Catálogo Interactivo: Visualización de productos mediante tarjetas (cards) con soporte para imágenes y búsqueda dinámica.

API Robusta: Backend desarrollado en PHP para una comunicación eficiente con la base de datos MySQL.

 Tecnologías Utilizadas
Frontend
React + TypeScript: Para una interfaz de usuario reactiva y tipado seguro.

Tailwind CSS: Diseño moderno, responsivo y personalizado.

Lucide-React: Set de iconos profesionales y consistentes.

SweetAlert2: Notificaciones y cuadros de diálogo elegantes.

Backend
PHP: Procesamiento de lógica de negocio y API REST.

MySQL: Almacenamiento persistente de datos.

PDO: Conexión segura y eficiente a la base de datos.

 Estructura del Proyecto
/api: Archivos del servidor PHP (Conexión, obtención de productos, registro de ventas).

/frontend: Aplicación de React con TypeScript y estilos Tailwind.

/uploads/productos: Carpeta destinada al almacenamiento de imágenes de productos.

 Instalación y Configuración
1. Requisitos Previos
Contar con un servidor local como XAMPP para ejecutar PHP y MySQL.

Tener instalado Node.js para la gestión de dependencias del frontend.

2. Configuración del Backend
Copia la carpeta del proyecto en C:/xampp/htdocs/.

Importa el archivo SQL proporcionado en tu gestor de base de datos (PHPMyAdmin o SQLyog) para crear la base de datos sistema_pos.

Verifica la configuración en api/config/db.php.

3. Configuración del Frontend
Navega a la carpeta del frontend mediante la terminal: cd frontend.

Instala las dependencias necesarias: npm install.

Inicia el servidor de desarrollo: npm run dev.
