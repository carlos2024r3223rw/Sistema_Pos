/*
SQLyog Community v13.1.8 (64 bit)
MySQL - 10.4.32-MariaDB : Database - sistema_pos
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`sistema_pos` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `sistema_pos`;

/*Table structure for table `arqueo_caja` */

DROP TABLE IF EXISTS `arqueo_caja`;

CREATE TABLE `arqueo_caja` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_caja` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_apertura` datetime DEFAULT current_timestamp(),
  `fecha_cierre` datetime DEFAULT NULL,
  `monto_inicial` decimal(10,2) NOT NULL,
  `monto_final` decimal(10,2) DEFAULT NULL,
  `total_ventas` decimal(10,2) DEFAULT 0.00,
  `monto_diferencia` decimal(10,2) DEFAULT 0.00,
  `estado` enum('Abierta','Cerrada') DEFAULT 'Abierta',
  PRIMARY KEY (`id`),
  KEY `id_caja` (`id_caja`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `arqueo_caja_ibfk_1` FOREIGN KEY (`id_caja`) REFERENCES `cajas` (`id`),
  CONSTRAINT `arqueo_caja_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `arqueo_caja` */

/*Table structure for table `cajas` */

DROP TABLE IF EXISTS `cajas`;

CREATE TABLE `cajas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_caja` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `cajas` */

insert  into `cajas`(`id`,`nombre_caja`) values 
(1,'Caja General');

/*Table structure for table `categorias` */

DROP TABLE IF EXISTS `categorias`;

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `categorias` */

insert  into `categorias`(`id`,`nombre`,`fecha_creacion`) values 
(1,'General','2026-01-16 22:06:16'),
(2,'Bebidas','2026-01-16 22:06:16');

/*Table structure for table `clientes` */

DROP TABLE IF EXISTS `clientes`;

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `documento` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `compras_realizadas` int(11) DEFAULT 0,
  `ultima_compra` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `documento` (`documento`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `clientes` */

insert  into `clientes`(`id`,`nombre`,`documento`,`telefono`,`direccion`,`email`,`compras_realizadas`,`ultima_compra`) values 
(1,'Público General','00000000',NULL,'Ciudad',NULL,0,NULL);

/*Table structure for table `detalle_ventas` */

DROP TABLE IF EXISTS `detalle_ventas`;

CREATE TABLE `detalle_ventas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_venta` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `descuento` decimal(10,2) DEFAULT 0.00,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_venta` (`id_venta`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id`),
  CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `detalle_ventas` */

/*Table structure for table `empresa` */

DROP TABLE IF EXISTS `empresa`;

CREATE TABLE `empresa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `ruc_nit` varchar(20) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `simbolo_moneda` varchar(5) DEFAULT '$',
  `impuesto_porcentaje` decimal(5,2) DEFAULT 0.00,
  `nombre_impresora` varchar(100) DEFAULT NULL,
  `mensaje_ticket` text DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `empresa` */

insert  into `empresa`(`id`,`nombre`,`ruc_nit`,`direccion`,`telefono`,`email`,`simbolo_moneda`,`impuesto_porcentaje`,`nombre_impresora`,`mensaje_ticket`,`logo_url`) values 
(1,'Mi Tienda POS',NULL,'Calle Principal #123',NULL,NULL,'$',0.00,NULL,'¡Gracias por su preferencia!',NULL);

/*Table structure for table `productos` */

DROP TABLE IF EXISTS `productos`;

CREATE TABLE `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo_barras` varchar(50) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_compra` decimal(10,2) NOT NULL DEFAULT 0.00,
  `precio_venta` decimal(10,2) NOT NULL DEFAULT 0.00,
  `precio_mayoreo` decimal(10,2) DEFAULT 0.00,
  `stock_actual` int(11) NOT NULL DEFAULT 0,
  `stock_minimo` int(11) DEFAULT 5,
  `id_categoria` int(11) DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `ventas_acumuladas` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_barras` (`codigo_barras`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `productos` */

insert  into `productos`(`id`,`codigo_barras`,`nombre`,`descripcion`,`precio_compra`,`precio_venta`,`precio_mayoreo`,`stock_actual`,`stock_minimo`,`id_categoria`,`imagen_url`,`ventas_acumuladas`) values 
(1,'123456','Coca Cola 3L',NULL,1.50,2.50,0.00,100,5,2,NULL,0);

/*Table structure for table `usuarios` */

DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` enum('Admin','Cajero','Vendedor') DEFAULT 'Cajero',
  `estado` tinyint(4) DEFAULT 1,
  `foto_perfil` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `usuarios` */

insert  into `usuarios`(`id`,`nombre`,`email`,`password_hash`,`rol`,`estado`,`foto_perfil`) values 
(1,'Administrador','admin@admin.com','$2y$10$C7.W/3Z...','Admin',1,NULL);

/*Table structure for table `ventas` */

DROP TABLE IF EXISTS `ventas`;

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_venta` datetime DEFAULT current_timestamp(),
  `id_usuario` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT 1,
  `id_arqueo` int(11) NOT NULL,
  `tipo_comprobante` enum('Ticket','Factura') DEFAULT 'Ticket',
  `serie_comprobante` varchar(10) DEFAULT NULL,
  `num_comprobante` varchar(20) DEFAULT NULL,
  `impuesto` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `pago_con` decimal(10,2) NOT NULL,
  `cambio` decimal(10,2) NOT NULL,
  `metodo_pago` varchar(50) DEFAULT 'Efectivo',
  `estado` enum('Completado','Anulado') DEFAULT 'Completado',
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_arqueo` (`id_arqueo`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`),
  CONSTRAINT `ventas_ibfk_3` FOREIGN KEY (`id_arqueo`) REFERENCES `arqueo_caja` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `ventas` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
