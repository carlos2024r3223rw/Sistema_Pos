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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `arqueo_caja` */

insert  into `arqueo_caja`(`id`,`id_caja`,`id_usuario`,`fecha_apertura`,`fecha_cierre`,`monto_inicial`,`monto_final`,`total_ventas`,`monto_diferencia`,`estado`) values 
(1,1,1,'2026-01-17 09:53:44',NULL,100.00,NULL,0.00,0.00,'Abierta');

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `clientes` */

insert  into `clientes`(`id`,`nombre`,`documento`,`telefono`,`direccion`,`email`,`compras_realizadas`,`ultima_compra`) values 
(1,'Público General','00000000',NULL,'Ciudad',NULL,0,NULL),
(2,'Juan Perez','052648-9',NULL,'Casa #1',NULL,0,NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `detalle_ventas` */

insert  into `detalle_ventas`(`id`,`id_venta`,`id_producto`,`cantidad`,`precio_unitario`,`descuento`,`subtotal`) values 
(1,3,1,1,2.50,0.00,2.50),
(2,4,1,1,2.50,0.00,2.50),
(3,5,1,4,2.50,0.00,10.00),
(4,6,1,2,2.50,0.00,5.00),
(5,7,3,5,11.50,0.00,57.50),
(6,8,2,3,2.00,0.00,6.00),
(7,9,2,2,2.00,0.00,4.00),
(8,10,1,2,2.50,0.00,5.00),
(9,11,1,3,2.50,0.00,7.50);

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
(1,'Tienda real POS',NULL,'Calle Principal #123',NULL,NULL,'$',3.00,NULL,'¡Gracias por su preferencia!',NULL);

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
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_barras` (`codigo_barras`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=203 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `productos` */

insert  into `productos`(`id`,`codigo_barras`,`nombre`,`descripcion`,`precio_compra`,`precio_venta`,`precio_mayoreo`,`stock_actual`,`stock_minimo`,`id_categoria`,`imagen_url`,`ventas_acumuladas`,`imagen`) values 
(1,'123456','Coca Cola 3L',NULL,1.50,2.50,0.00,83,5,2,NULL,0,'uploads/productos/coca_cola.png'),
(2,'21515','Pepsi 2L',NULL,0.00,2.00,0.00,43,5,NULL,NULL,0,NULL),
(3,'24410011','Leche Lays Vainilla',NULL,0.00,11.50,0.00,0,5,NULL,NULL,0,'https://placehold.co/200x200/eb520d/white?text=Leche+Lays+Vainilla'),
(4,'42875671','Leche Nestle Fresa',NULL,0.00,17.30,0.00,83,5,NULL,NULL,0,'https://placehold.co/200x200/cc32e4/white?text=Leche+Nestle+Fresa'),
(5,'18470568','Leche Pepsi Naranja',NULL,0.00,19.20,0.00,54,5,NULL,NULL,0,'https://placehold.co/200x200/cd1e9a/white?text=Leche+Pepsi+Naranja'),
(6,'64081495','Leche Milka Limon',NULL,0.00,5.10,0.00,68,5,NULL,NULL,0,'https://placehold.co/200x200/1618d6/white?text=Leche+Milka+Limon'),
(7,'10376678','Leche Pepsi Menta',NULL,0.00,0.90,0.00,37,5,NULL,NULL,0,'https://placehold.co/200x200/dd2666/white?text=Leche+Pepsi+Menta'),
(8,'68457241','Papas Pepsi Chocolate',NULL,0.00,8.80,0.00,5,5,NULL,NULL,0,'https://placehold.co/200x200/8755ba/white?text=Papas+Pepsi+Chocolate'),
(9,'72659457','Papas CocaCola Fresa',NULL,0.00,4.50,0.00,11,5,NULL,NULL,0,'https://placehold.co/200x200/74a5a5/white?text=Papas+CocaCola+Fresa'),
(10,'19830406','Chicle Milka Limon',NULL,0.00,7.80,0.00,25,5,NULL,NULL,0,'https://placehold.co/200x200/2bf0e6/white?text=Chicle+Milka+Limon'),
(11,'87472660','Galletas Corona Picante',NULL,0.00,13.30,0.00,42,5,NULL,NULL,0,'https://placehold.co/200x200/6a4338/white?text=Galletas+Corona+Picante'),
(12,'91308463','Chocolate Ideal Fresa',NULL,0.00,19.30,0.00,21,5,NULL,NULL,0,'https://placehold.co/200x200/c871a/white?text=Chocolate+Ideal+Fresa'),
(13,'18904800','Chocolate Lays Fresa',NULL,0.00,15.20,0.00,87,5,NULL,NULL,0,'https://placehold.co/200x200/a830d5/white?text=Chocolate+Lays+Fresa'),
(14,'87707842','Galletas Pepsi Fresa',NULL,0.00,19.00,0.00,85,5,NULL,NULL,0,'https://placehold.co/200x200/164561/white?text=Galletas+Pepsi+Fresa'),
(15,'34942107','Yogurt Milka Picante',NULL,0.00,5.90,0.00,50,5,NULL,NULL,0,'https://placehold.co/200x200/1ac7ba/white?text=Yogurt+Milka+Picante'),
(16,'60389079','Arroz Lays Picante',NULL,0.00,7.10,0.00,69,5,NULL,NULL,0,'https://placehold.co/200x200/16a7b1/white?text=Arroz+Lays+Picante'),
(17,'70571678','Queso CocaCola Chocolate',NULL,0.00,11.10,0.00,50,5,NULL,NULL,0,'https://placehold.co/200x200/ede311/white?text=Queso+CocaCola+Chocolate'),
(18,'69467507','Chocolate Diana Vainilla',NULL,0.00,1.00,0.00,29,5,NULL,NULL,0,'https://placehold.co/200x200/a15626/white?text=Chocolate+Diana+Vainilla'),
(19,'10160424','Papas Bimbo Limon',NULL,0.00,10.30,0.00,4,5,NULL,NULL,0,'https://placehold.co/200x200/7990f1/white?text=Papas+Bimbo+Limon'),
(20,'86926352','Arroz Diana Chocolate',NULL,0.00,11.40,0.00,33,5,NULL,NULL,0,'https://placehold.co/200x200/9c205f/white?text=Arroz+Diana+Chocolate'),
(21,'31532010','Agua Milka Vainilla',NULL,0.00,18.50,0.00,52,5,NULL,NULL,0,'https://placehold.co/200x200/d481f1/white?text=Agua+Milka+Vainilla'),
(22,'88380004','Agua Corona Vainilla',NULL,0.00,8.90,0.00,29,5,NULL,NULL,0,'https://placehold.co/200x200/33fd57/white?text=Agua+Corona+Vainilla'),
(23,'93649715','Agua CocaCola Naranja',NULL,0.00,8.50,0.00,24,5,NULL,NULL,0,'https://placehold.co/200x200/dd7020/white?text=Agua+CocaCola+Naranja'),
(24,'59605100','Chicle Lays Limon',NULL,0.00,2.60,0.00,35,5,NULL,NULL,0,'https://placehold.co/200x200/4051ac/white?text=Chicle+Lays+Limon'),
(25,'56471350','Queso Milka Picante',NULL,0.00,0.80,0.00,61,5,NULL,NULL,0,'https://placehold.co/200x200/a0c7a6/white?text=Queso+Milka+Picante'),
(26,'39408896','Agua Diana Chocolate',NULL,0.00,1.00,0.00,97,5,NULL,NULL,0,'https://placehold.co/200x200/14af05/white?text=Agua+Diana+Chocolate'),
(27,'15221485','Cerveza Diana Vainilla',NULL,0.00,13.30,0.00,94,5,NULL,NULL,0,'https://placehold.co/200x200/5e46d7/white?text=Cerveza+Diana+Vainilla'),
(28,'75896828','Detergente Nestle Naranja',NULL,0.00,18.10,0.00,77,5,NULL,NULL,0,'https://placehold.co/200x200/62c717/white?text=Detergente+Nestle+Naranja'),
(29,'58807671','Chicle Pepsi Fresa',NULL,0.00,10.00,0.00,60,5,NULL,NULL,0,'https://placehold.co/200x200/642dcb/white?text=Chicle+Pepsi+Fresa'),
(30,'96518193','Chicle Pepsi Vainilla',NULL,0.00,5.70,0.00,90,5,NULL,NULL,0,'https://placehold.co/200x200/ecbf8f/white?text=Chicle+Pepsi+Vainilla'),
(31,'57992842','Agua Lays Vainilla',NULL,0.00,9.80,0.00,74,5,NULL,NULL,0,'https://placehold.co/200x200/cb827e/white?text=Agua+Lays+Vainilla'),
(32,'45309587','Leche Milka Picante',NULL,0.00,1.90,0.00,51,5,NULL,NULL,0,'https://placehold.co/200x200/a4a6b/white?text=Leche+Milka+Picante'),
(33,'25136098','Arroz Ideal Chocolate',NULL,0.00,2.40,0.00,22,5,NULL,NULL,0,'https://placehold.co/200x200/77180c/white?text=Arroz+Ideal+Chocolate'),
(34,'45630480','Galletas Lays Original',NULL,0.00,13.60,0.00,70,5,NULL,NULL,0,'https://placehold.co/200x200/8920be/white?text=Galletas+Lays+Original'),
(35,'13520552','Galletas Nestle Vainilla',NULL,0.00,15.40,0.00,54,5,NULL,NULL,0,'https://placehold.co/200x200/36fb89/white?text=Galletas+Nestle+Vainilla'),
(36,'76549809','Jugo Ideal Menta',NULL,0.00,7.30,0.00,40,5,NULL,NULL,0,'https://placehold.co/200x200/646fa4/white?text=Jugo+Ideal+Menta'),
(37,'90593741','Chicle Diana Fresa',NULL,0.00,7.60,0.00,91,5,NULL,NULL,0,'https://placehold.co/200x200/2483a/white?text=Chicle+Diana+Fresa'),
(38,'10765399','Papas Maggi Original',NULL,0.00,8.90,0.00,5,5,NULL,NULL,0,'https://placehold.co/200x200/b71eb2/white?text=Papas+Maggi+Original'),
(39,'43578136','Papas Diana Original',NULL,0.00,14.40,0.00,40,5,NULL,NULL,0,'https://placehold.co/200x200/67fb35/white?text=Papas+Diana+Original'),
(40,'31061133','Jamón Nestle Menta',NULL,0.00,13.70,0.00,77,5,NULL,NULL,0,'https://placehold.co/200x200/7ea37c/white?text=Jam%C3%B3n+Nestle+Menta'),
(41,'98031040','Cerveza Milka Chocolate',NULL,0.00,11.90,0.00,32,5,NULL,NULL,0,'https://placehold.co/200x200/c56ceb/white?text=Cerveza+Milka+Chocolate'),
(42,'84120171','Arroz Diana Picante',NULL,0.00,5.60,0.00,9,5,NULL,NULL,0,'https://placehold.co/200x200/13084c/white?text=Arroz+Diana+Picante'),
(43,'15736720','Queso Ideal Menta',NULL,0.00,14.40,0.00,6,5,NULL,NULL,0,'https://placehold.co/200x200/36304/white?text=Queso+Ideal+Menta'),
(44,'20467692','Jamón Diana Chocolate',NULL,0.00,16.00,0.00,76,5,NULL,NULL,0,'https://placehold.co/200x200/a34421/white?text=Jam%C3%B3n+Diana+Chocolate'),
(45,'64322316','Pan Corona Fresa',NULL,0.00,5.30,0.00,65,5,NULL,NULL,0,'https://placehold.co/200x200/72525b/white?text=Pan+Corona+Fresa'),
(46,'65076091','Agua Milka Naranja',NULL,0.00,13.00,0.00,86,5,NULL,NULL,0,'https://placehold.co/200x200/6b382e/white?text=Agua+Milka+Naranja'),
(47,'81045824','Agua Nestle Chocolate',NULL,0.00,6.40,0.00,12,5,NULL,NULL,0,'https://placehold.co/200x200/9e9723/white?text=Agua+Nestle+Chocolate'),
(48,'93973185','Agua Danone Vainilla',NULL,0.00,1.30,0.00,16,5,NULL,NULL,0,'https://placehold.co/200x200/2c5294/white?text=Agua+Danone+Vainilla'),
(49,'84222952','Queso Nestle Chocolate',NULL,0.00,14.40,0.00,7,5,NULL,NULL,0,'https://placehold.co/200x200/24b0e3/white?text=Queso+Nestle+Chocolate'),
(50,'69732024','Galletas Corona Limon',NULL,0.00,10.20,0.00,78,5,NULL,NULL,0,'https://placehold.co/200x200/5b5b25/white?text=Galletas+Corona+Limon'),
(51,'98753813','Jabón Bimbo Naranja',NULL,0.00,18.50,0.00,9,5,NULL,NULL,0,'https://placehold.co/200x200/83cb61/white?text=Jab%C3%B3n+Bimbo+Naranja'),
(52,'87688240','Jabón CocaCola Original',NULL,0.00,2.00,0.00,59,5,NULL,NULL,0,'https://placehold.co/200x200/5e69cc/white?text=Jab%C3%B3n+CocaCola+Original'),
(53,'14220276','Jugo Bimbo Original',NULL,0.00,6.30,0.00,0,5,NULL,NULL,0,'https://placehold.co/200x200/a93c06/white?text=Jugo+Bimbo+Original'),
(54,'80379755','Pan Maggi Limon',NULL,0.00,5.20,0.00,10,5,NULL,NULL,0,'https://placehold.co/200x200/30d030/white?text=Pan+Maggi+Limon'),
(55,'66641730','Leche Diana Vainilla',NULL,0.00,17.40,0.00,19,5,NULL,NULL,0,'https://placehold.co/200x200/43f27c/white?text=Leche+Diana+Vainilla'),
(56,'50379091','Agua Lays Original',NULL,0.00,8.70,0.00,16,5,NULL,NULL,0,'https://placehold.co/200x200/2d177d/white?text=Agua+Lays+Original'),
(57,'68296840','Chicle CocaCola Chocolate',NULL,0.00,4.00,0.00,77,5,NULL,NULL,0,'https://placehold.co/200x200/6b9c34/white?text=Chicle+CocaCola+Chocolate'),
(58,'59204907','Agua CocaCola Naranja',NULL,0.00,0.90,0.00,47,5,NULL,NULL,0,'https://placehold.co/200x200/94397b/white?text=Agua+CocaCola+Naranja'),
(59,'90412040','Agua Bimbo Fresa',NULL,0.00,12.90,0.00,35,5,NULL,NULL,0,'https://placehold.co/200x200/f5a902/white?text=Agua+Bimbo+Fresa'),
(60,'51974838','Jabón Milka Menta',NULL,0.00,16.60,0.00,91,5,NULL,NULL,0,'https://placehold.co/200x200/75d923/white?text=Jab%C3%B3n+Milka+Menta'),
(61,'32687086','Jugo Bimbo Limon',NULL,0.00,6.80,0.00,55,5,NULL,NULL,0,'https://placehold.co/200x200/65a77c/white?text=Jugo+Bimbo+Limon'),
(62,'55807409','Jabón Bimbo Limon',NULL,0.00,16.70,0.00,80,5,NULL,NULL,0,'https://placehold.co/200x200/10ea9b/white?text=Jab%C3%B3n+Bimbo+Limon'),
(63,'46919855','Queso Maggi Limon',NULL,0.00,8.10,0.00,29,5,NULL,NULL,0,'https://placehold.co/200x200/e25c42/white?text=Queso+Maggi+Limon'),
(64,'35627142','Papas CocaCola Limon',NULL,0.00,17.60,0.00,48,5,NULL,NULL,0,'https://placehold.co/200x200/5bbdf0/white?text=Papas+CocaCola+Limon'),
(65,'67527188','Chocolate Bimbo Chocolate',NULL,0.00,7.70,0.00,100,5,NULL,NULL,0,'https://placehold.co/200x200/aec7e1/white?text=Chocolate+Bimbo+Chocolate'),
(66,'41796810','Jugo Corona Fresa',NULL,0.00,17.80,0.00,84,5,NULL,NULL,0,'https://placehold.co/200x200/3820e3/white?text=Jugo+Corona+Fresa'),
(67,'97679508','Jabón Ideal Limon',NULL,0.00,11.70,0.00,53,5,NULL,NULL,0,'https://placehold.co/200x200/d9dc4f/white?text=Jab%C3%B3n+Ideal+Limon'),
(68,'66902846','Yogurt Milka Menta',NULL,0.00,13.80,0.00,9,5,NULL,NULL,0,'https://placehold.co/200x200/cc5ff8/white?text=Yogurt+Milka+Menta'),
(69,'77651126','Agua Bimbo Fresa',NULL,0.00,17.70,0.00,45,5,NULL,NULL,0,'https://placehold.co/200x200/899515/white?text=Agua+Bimbo+Fresa'),
(70,'29486532','Jamón CocaCola Naranja',NULL,0.00,12.40,0.00,99,5,NULL,NULL,0,'https://placehold.co/200x200/43f626/white?text=Jam%C3%B3n+CocaCola+Naranja'),
(71,'79881461','Pan CocaCola Limon',NULL,0.00,10.80,0.00,26,5,NULL,NULL,0,'https://placehold.co/200x200/a73b66/white?text=Pan+CocaCola+Limon'),
(72,'41965911','Chicle Lays Picante',NULL,0.00,3.40,0.00,55,5,NULL,NULL,0,'https://placehold.co/200x200/489eab/white?text=Chicle+Lays+Picante'),
(73,'29932511','Queso Diana Vainilla',NULL,0.00,4.60,0.00,65,5,NULL,NULL,0,'https://placehold.co/200x200/45b686/white?text=Queso+Diana+Vainilla'),
(74,'20781599','Jugo Pepsi Menta',NULL,0.00,5.90,0.00,17,5,NULL,NULL,0,'https://placehold.co/200x200/5d4599/white?text=Jugo+Pepsi+Menta'),
(75,'40973798','Yogurt Bimbo Naranja',NULL,0.00,17.20,0.00,75,5,NULL,NULL,0,'https://placehold.co/200x200/474f6c/white?text=Yogurt+Bimbo+Naranja'),
(76,'53333642','Queso Danone Naranja',NULL,0.00,18.40,0.00,17,5,NULL,NULL,0,'https://placehold.co/200x200/9fd368/white?text=Queso+Danone+Naranja'),
(77,'75490444','Cerveza Corona Menta',NULL,0.00,10.00,0.00,81,5,NULL,NULL,0,'https://placehold.co/200x200/f314af/white?text=Cerveza+Corona+Menta'),
(78,'98598697','Galletas Milka Chocolate',NULL,0.00,5.00,0.00,18,5,NULL,NULL,0,'https://placehold.co/200x200/92ce89/white?text=Galletas+Milka+Chocolate'),
(79,'72655528','Jabón CocaCola Naranja',NULL,0.00,10.90,0.00,43,5,NULL,NULL,0,'https://placehold.co/200x200/ac852d/white?text=Jab%C3%B3n+CocaCola+Naranja'),
(80,'15309205','Jamón Maggi Vainilla',NULL,0.00,6.30,0.00,39,5,NULL,NULL,0,'https://placehold.co/200x200/8c0b9c/white?text=Jam%C3%B3n+Maggi+Vainilla'),
(81,'62868477','Yogurt Milka Vainilla',NULL,0.00,4.60,0.00,27,5,NULL,NULL,0,'https://placehold.co/200x200/ad82c3/white?text=Yogurt+Milka+Vainilla'),
(82,'18466541','Yogurt CocaCola Chocolate',NULL,0.00,0.50,0.00,85,5,NULL,NULL,0,'https://placehold.co/200x200/76b286/white?text=Yogurt+CocaCola+Chocolate'),
(83,'72830795','Yogurt Maggi Naranja',NULL,0.00,2.30,0.00,15,5,NULL,NULL,0,'https://placehold.co/200x200/c1e5a7/white?text=Yogurt+Maggi+Naranja'),
(84,'41219347','Jabón Corona Naranja',NULL,0.00,11.20,0.00,9,5,NULL,NULL,0,'https://placehold.co/200x200/b942b6/white?text=Jab%C3%B3n+Corona+Naranja'),
(85,'97142430','Arroz Ideal Naranja',NULL,0.00,3.50,0.00,47,5,NULL,NULL,0,'https://placehold.co/200x200/c95d2a/white?text=Arroz+Ideal+Naranja'),
(86,'31208461','Jabón Pepsi Vainilla',NULL,0.00,12.20,0.00,47,5,NULL,NULL,0,'https://placehold.co/200x200/18a982/white?text=Jab%C3%B3n+Pepsi+Vainilla'),
(87,'28292132','Chocolate Pepsi Menta',NULL,0.00,1.60,0.00,6,5,NULL,NULL,0,'https://placehold.co/200x200/f8509/white?text=Chocolate+Pepsi+Menta'),
(88,'52216594','Chicle Nestle Vainilla',NULL,0.00,8.20,0.00,84,5,NULL,NULL,0,'https://placehold.co/200x200/5c415d/white?text=Chicle+Nestle+Vainilla'),
(89,'93849998','Jugo CocaCola Original',NULL,0.00,8.40,0.00,47,5,NULL,NULL,0,'https://placehold.co/200x200/1b3e55/white?text=Jugo+CocaCola+Original'),
(90,'96609484','Jamón Corona Vainilla',NULL,0.00,1.40,0.00,76,5,NULL,NULL,0,'https://placehold.co/200x200/d7ad4d/white?text=Jam%C3%B3n+Corona+Vainilla'),
(91,'58179667','Pan CocaCola Fresa',NULL,0.00,4.00,0.00,45,5,NULL,NULL,0,'https://placehold.co/200x200/c47587/white?text=Pan+CocaCola+Fresa'),
(92,'56586710','Leche Lays Chocolate',NULL,0.00,1.30,0.00,31,5,NULL,NULL,0,'https://placehold.co/200x200/f664be/white?text=Leche+Lays+Chocolate'),
(93,'61851973','Chicle CocaCola Limon',NULL,0.00,13.20,0.00,35,5,NULL,NULL,0,'https://placehold.co/200x200/c3cb14/white?text=Chicle+CocaCola+Limon'),
(94,'93668913','Detergente Danone Menta',NULL,0.00,5.10,0.00,67,5,NULL,NULL,0,'https://placehold.co/200x200/1b60/white?text=Detergente+Danone+Menta'),
(95,'99258208','Leche Maggi Original',NULL,0.00,14.40,0.00,56,5,NULL,NULL,0,'https://placehold.co/200x200/ebec70/white?text=Leche+Maggi+Original'),
(96,'61047391','Arroz Maggi Fresa',NULL,0.00,2.70,0.00,85,5,NULL,NULL,0,'https://placehold.co/200x200/ab768a/white?text=Arroz+Maggi+Fresa'),
(97,'70432655','Cerveza Bimbo Vainilla',NULL,0.00,12.20,0.00,78,5,NULL,NULL,0,'https://placehold.co/200x200/1a432b/white?text=Cerveza+Bimbo+Vainilla'),
(98,'14607881','Leche Milka Picante',NULL,0.00,16.50,0.00,93,5,NULL,NULL,0,'https://placehold.co/200x200/eab620/white?text=Leche+Milka+Picante'),
(99,'31077257','Chocolate Milka Limon',NULL,0.00,13.20,0.00,7,5,NULL,NULL,0,'https://placehold.co/200x200/395a61/white?text=Chocolate+Milka+Limon'),
(100,'10025308','Jabón Diana Menta',NULL,0.00,3.90,0.00,86,5,NULL,NULL,0,'https://placehold.co/200x200/88750e/white?text=Jab%C3%B3n+Diana+Menta'),
(101,'65121010','Agua Lays Limon',NULL,0.00,4.70,0.00,80,5,NULL,NULL,0,'https://placehold.co/200x200/87362a/white?text=Agua+Lays+Limon'),
(102,'14224438','Queso Bimbo Original',NULL,0.00,15.60,0.00,16,5,NULL,NULL,0,'https://placehold.co/200x200/512752/white?text=Queso+Bimbo+Original'),
(103,'19521365','Agua Corona Vainilla',NULL,0.00,8.60,0.00,89,5,NULL,NULL,0,'https://placehold.co/200x200/51ecb0/white?text=Agua+Corona+Vainilla'),
(104,'38929661','Jabón Nestle Chocolate',NULL,0.00,9.80,0.00,12,5,NULL,NULL,0,'https://placehold.co/200x200/4c2f84/white?text=Jab%C3%B3n+Nestle+Chocolate'),
(105,'13833432','Galletas CocaCola Naranja',NULL,0.00,3.20,0.00,62,5,NULL,NULL,0,'https://placehold.co/200x200/2cfe65/white?text=Galletas+CocaCola+Naranja'),
(106,'97241381','Chocolate Maggi Picante',NULL,0.00,11.00,0.00,62,5,NULL,NULL,0,'https://placehold.co/200x200/17f9f6/white?text=Chocolate+Maggi+Picante'),
(107,'29634309','Pan Lays Original',NULL,0.00,15.50,0.00,30,5,NULL,NULL,0,'https://placehold.co/200x200/20fcd2/white?text=Pan+Lays+Original'),
(108,'74352165','Pan Corona Menta',NULL,0.00,15.20,0.00,39,5,NULL,NULL,0,'https://placehold.co/200x200/92d90d/white?text=Pan+Corona+Menta'),
(109,'68650713','Jabón Pepsi Vainilla',NULL,0.00,19.80,0.00,41,5,NULL,NULL,0,'https://placehold.co/200x200/b66d4b/white?text=Jab%C3%B3n+Pepsi+Vainilla'),
(110,'96203683','Yogurt Diana Chocolate',NULL,0.00,5.90,0.00,97,5,NULL,NULL,0,'https://placehold.co/200x200/ecc4b3/white?text=Yogurt+Diana+Chocolate'),
(111,'42757022','Leche Nestle Fresa',NULL,0.00,8.50,0.00,84,5,NULL,NULL,0,'https://placehold.co/200x200/df6a18/white?text=Leche+Nestle+Fresa'),
(112,'50323673','Arroz Danone Original',NULL,0.00,9.50,0.00,58,5,NULL,NULL,0,'https://placehold.co/200x200/8d6631/white?text=Arroz+Danone+Original'),
(113,'18331602','Pan Diana Original',NULL,0.00,17.20,0.00,39,5,NULL,NULL,0,'https://placehold.co/200x200/53b264/white?text=Pan+Diana+Original'),
(114,'22281658','Jugo Milka Fresa',NULL,0.00,2.90,0.00,58,5,NULL,NULL,0,'https://placehold.co/200x200/acac4e/white?text=Jugo+Milka+Fresa'),
(115,'52340177','Jamón Diana Original',NULL,0.00,13.40,0.00,59,5,NULL,NULL,0,'https://placehold.co/200x200/33f6f9/white?text=Jam%C3%B3n+Diana+Original'),
(116,'69239654','Jabón Nestle Chocolate',NULL,0.00,1.00,0.00,32,5,NULL,NULL,0,'https://placehold.co/200x200/292419/white?text=Jab%C3%B3n+Nestle+Chocolate'),
(117,'36739018','Jabón Bimbo Original',NULL,0.00,16.30,0.00,72,5,NULL,NULL,0,'https://placehold.co/200x200/9ab64/white?text=Jab%C3%B3n+Bimbo+Original'),
(118,'66348104','Arroz Milka Limon',NULL,0.00,1.90,0.00,42,5,NULL,NULL,0,'https://placehold.co/200x200/e28229/white?text=Arroz+Milka+Limon'),
(119,'37007115','Queso Lays Limon',NULL,0.00,14.30,0.00,41,5,NULL,NULL,0,'https://placehold.co/200x200/fb6efb/white?text=Queso+Lays+Limon'),
(120,'16990396','Pan Milka Original',NULL,0.00,19.20,0.00,78,5,NULL,NULL,0,'https://placehold.co/200x200/4ca9ca/white?text=Pan+Milka+Original'),
(121,'54801704','Detergente Pepsi Original',NULL,0.00,5.70,0.00,63,5,NULL,NULL,0,'https://placehold.co/200x200/682a3f/white?text=Detergente+Pepsi+Original'),
(122,'94598998','Cerveza Corona Chocolate',NULL,0.00,5.90,0.00,30,5,NULL,NULL,0,'https://placehold.co/200x200/2c92dc/white?text=Cerveza+Corona+Chocolate'),
(123,'74712890','Arroz Danone Picante',NULL,0.00,3.80,0.00,91,5,NULL,NULL,0,'https://placehold.co/200x200/4641b9/white?text=Arroz+Danone+Picante'),
(124,'17856267','Galletas Milka Chocolate',NULL,0.00,11.90,0.00,53,5,NULL,NULL,0,'https://placehold.co/200x200/71ce41/white?text=Galletas+Milka+Chocolate'),
(125,'47970353','Papas Diana Picante',NULL,0.00,13.70,0.00,67,5,NULL,NULL,0,'https://placehold.co/200x200/536b48/white?text=Papas+Diana+Picante'),
(126,'78733967','Jugo Diana Chocolate',NULL,0.00,9.90,0.00,19,5,NULL,NULL,0,'https://placehold.co/200x200/700380/white?text=Jugo+Diana+Chocolate'),
(127,'98696656','Papas Bimbo Vainilla',NULL,0.00,18.10,0.00,7,5,NULL,NULL,0,'https://placehold.co/200x200/d0260c/white?text=Papas+Bimbo+Vainilla'),
(128,'61673492','Pan Maggi Chocolate',NULL,0.00,0.80,0.00,62,5,NULL,NULL,0,'https://placehold.co/200x200/3ce3f6/white?text=Pan+Maggi+Chocolate'),
(129,'17434987','Jamón Danone Fresa',NULL,0.00,4.40,0.00,76,5,NULL,NULL,0,'https://placehold.co/200x200/4ae652/white?text=Jam%C3%B3n+Danone+Fresa'),
(130,'22454013','Leche Milka Original',NULL,0.00,3.90,0.00,18,5,NULL,NULL,0,'https://placehold.co/200x200/d204e7/white?text=Leche+Milka+Original'),
(131,'49829300','Arroz Danone Naranja',NULL,0.00,7.10,0.00,13,5,NULL,NULL,0,'https://placehold.co/200x200/d253bb/white?text=Arroz+Danone+Naranja'),
(132,'50064244','Jabón CocaCola Picante',NULL,0.00,16.80,0.00,13,5,NULL,NULL,0,'https://placehold.co/200x200/2011eb/white?text=Jab%C3%B3n+CocaCola+Picante'),
(133,'77373657','Jugo Maggi Naranja',NULL,0.00,7.00,0.00,16,5,NULL,NULL,0,'https://placehold.co/200x200/467d25/white?text=Jugo+Maggi+Naranja'),
(134,'93048685','Arroz Lays Menta',NULL,0.00,17.50,0.00,68,5,NULL,NULL,0,'https://placehold.co/200x200/d7bb75/white?text=Arroz+Lays+Menta'),
(135,'95588334','Papas Milka Menta',NULL,0.00,6.00,0.00,62,5,NULL,NULL,0,'https://placehold.co/200x200/5d00f7/white?text=Papas+Milka+Menta'),
(136,'48585255','Papas CocaCola Original',NULL,0.00,8.40,0.00,31,5,NULL,NULL,0,'https://placehold.co/200x200/6c5466/white?text=Papas+CocaCola+Original'),
(137,'71687282','Pan Ideal Original',NULL,0.00,14.40,0.00,96,5,NULL,NULL,0,'https://placehold.co/200x200/18b10b/white?text=Pan+Ideal+Original'),
(138,'29125212','Yogurt Maggi Menta',NULL,0.00,8.80,0.00,15,5,NULL,NULL,0,'https://placehold.co/200x200/5ee206/white?text=Yogurt+Maggi+Menta'),
(139,'34259134','Agua CocaCola Limon',NULL,0.00,14.80,0.00,38,5,NULL,NULL,0,'https://placehold.co/200x200/6919c1/white?text=Agua+CocaCola+Limon'),
(140,'61690447','Arroz CocaCola Naranja',NULL,0.00,17.90,0.00,90,5,NULL,NULL,0,'https://placehold.co/200x200/78fe86/white?text=Arroz+CocaCola+Naranja'),
(141,'97020924','Leche Ideal Menta',NULL,0.00,11.80,0.00,37,5,NULL,NULL,0,'https://placehold.co/200x200/7e039c/white?text=Leche+Ideal+Menta'),
(142,'70828772','Papas Danone Naranja',NULL,0.00,6.50,0.00,85,5,NULL,NULL,0,'https://placehold.co/200x200/5dead1/white?text=Papas+Danone+Naranja'),
(143,'79140074','Arroz Bimbo Menta',NULL,0.00,2.00,0.00,25,5,NULL,NULL,0,'https://placehold.co/200x200/9fe3b6/white?text=Arroz+Bimbo+Menta'),
(144,'74563547','Galletas Nestle Menta',NULL,0.00,10.00,0.00,20,5,NULL,NULL,0,'https://placehold.co/200x200/d87239/white?text=Galletas+Nestle+Menta'),
(145,'55876263','Leche Pepsi Fresa',NULL,0.00,4.70,0.00,77,5,NULL,NULL,0,'https://placehold.co/200x200/366a/white?text=Leche+Pepsi+Fresa'),
(146,'32954735','Queso CocaCola Menta',NULL,0.00,14.50,0.00,77,5,NULL,NULL,0,'https://placehold.co/200x200/8bdba7/white?text=Queso+CocaCola+Menta'),
(147,'96728641','Jamón Lays Picante',NULL,0.00,3.20,0.00,68,5,NULL,NULL,0,'https://placehold.co/200x200/5971f/white?text=Jam%C3%B3n+Lays+Picante'),
(148,'36510665','Yogurt Pepsi Fresa',NULL,0.00,0.60,0.00,54,5,NULL,NULL,0,'https://placehold.co/200x200/b6bd69/white?text=Yogurt+Pepsi+Fresa'),
(149,'88574361','Galletas Nestle Menta',NULL,0.00,11.20,0.00,17,5,NULL,NULL,0,'https://placehold.co/200x200/dcaad6/white?text=Galletas+Nestle+Menta'),
(150,'47993099','Jugo Milka Naranja',NULL,0.00,5.70,0.00,22,5,NULL,NULL,0,'https://placehold.co/200x200/d2c7c3/white?text=Jugo+Milka+Naranja'),
(151,'85611192','Leche Milka Menta',NULL,0.00,19.70,0.00,15,5,NULL,NULL,0,'https://placehold.co/200x200/8f97b5/white?text=Leche+Milka+Menta'),
(152,'98441241','Yogurt CocaCola Limon',NULL,0.00,13.70,0.00,91,5,NULL,NULL,0,'https://placehold.co/200x200/2f9a54/white?text=Yogurt+CocaCola+Limon'),
(153,'89385758','Chicle Diana Original',NULL,0.00,1.00,0.00,99,5,NULL,NULL,0,'https://placehold.co/200x200/bd0957/white?text=Chicle+Diana+Original'),
(154,'86730970','Jabón Ideal Menta',NULL,0.00,13.50,0.00,51,5,NULL,NULL,0,'https://placehold.co/200x200/17194e/white?text=Jab%C3%B3n+Ideal+Menta'),
(155,'70232819','Arroz Maggi Menta',NULL,0.00,12.60,0.00,60,5,NULL,NULL,0,'https://placehold.co/200x200/2ec723/white?text=Arroz+Maggi+Menta'),
(156,'95578590','Yogurt Nestle Vainilla',NULL,0.00,7.50,0.00,17,5,NULL,NULL,0,'https://placehold.co/200x200/7ea445/white?text=Yogurt+Nestle+Vainilla'),
(157,'49961281','Arroz Diana Limon',NULL,0.00,17.70,0.00,13,5,NULL,NULL,0,'https://placehold.co/200x200/92f533/white?text=Arroz+Diana+Limon'),
(158,'56608056','Queso Corona Vainilla',NULL,0.00,15.60,0.00,80,5,NULL,NULL,0,'https://placehold.co/200x200/cf32fa/white?text=Queso+Corona+Vainilla'),
(159,'72021050','Queso CocaCola Menta',NULL,0.00,6.90,0.00,15,5,NULL,NULL,0,'https://placehold.co/200x200/db8dc/white?text=Queso+CocaCola+Menta'),
(160,'36644429','Pan Diana Picante',NULL,0.00,4.40,0.00,73,5,NULL,NULL,0,'https://placehold.co/200x200/481393/white?text=Pan+Diana+Picante'),
(161,'17438976','Jugo Ideal Vainilla',NULL,0.00,8.90,0.00,58,5,NULL,NULL,0,'https://placehold.co/200x200/783131/white?text=Jugo+Ideal+Vainilla'),
(162,'80143464','Queso Pepsi Chocolate',NULL,0.00,11.80,0.00,82,5,NULL,NULL,0,'https://placehold.co/200x200/88c9ed/white?text=Queso+Pepsi+Chocolate'),
(163,'11249753','Jugo Corona Chocolate',NULL,0.00,18.40,0.00,61,5,NULL,NULL,0,'https://placehold.co/200x200/bcbce0/white?text=Jugo+Corona+Chocolate'),
(164,'37483145','Queso Maggi Naranja',NULL,0.00,17.40,0.00,8,5,NULL,NULL,0,'https://placehold.co/200x200/1a47c1/white?text=Queso+Maggi+Naranja'),
(165,'93133016','Detergente Bimbo Vainilla',NULL,0.00,12.80,0.00,20,5,NULL,NULL,0,'https://placehold.co/200x200/b9238d/white?text=Detergente+Bimbo+Vainilla'),
(166,'85137267','Arroz Milka Menta',NULL,0.00,15.30,0.00,58,5,NULL,NULL,0,'https://placehold.co/200x200/efec03/white?text=Arroz+Milka+Menta'),
(167,'42316076','Queso CocaCola Picante',NULL,0.00,2.70,0.00,87,5,NULL,NULL,0,'https://placehold.co/200x200/7f27ea/white?text=Queso+CocaCola+Picante'),
(168,'41536925','Pan Corona Limon',NULL,0.00,12.40,0.00,97,5,NULL,NULL,0,'https://placehold.co/200x200/38b6a3/white?text=Pan+Corona+Limon'),
(169,'60516767','Galletas Bimbo Vainilla',NULL,0.00,19.00,0.00,56,5,NULL,NULL,0,'https://placehold.co/200x200/fca74c/white?text=Galletas+Bimbo+Vainilla'),
(170,'68032472','Pan Lays Fresa',NULL,0.00,1.60,0.00,54,5,NULL,NULL,0,'https://placehold.co/200x200/a39666/white?text=Pan+Lays+Fresa'),
(171,'93568880','Queso Lays Menta',NULL,0.00,13.10,0.00,37,5,NULL,NULL,0,'https://placehold.co/200x200/ac017/white?text=Queso+Lays+Menta'),
(172,'71304798','Agua Ideal Vainilla',NULL,0.00,1.80,0.00,62,5,NULL,NULL,0,'https://placehold.co/200x200/3c289e/white?text=Agua+Ideal+Vainilla'),
(173,'54208828','Chocolate Pepsi Picante',NULL,0.00,11.50,0.00,20,5,NULL,NULL,0,'https://placehold.co/200x200/686ded/white?text=Chocolate+Pepsi+Picante'),
(174,'60632851','Chocolate Nestle Menta',NULL,0.00,4.10,0.00,91,5,NULL,NULL,0,'https://placehold.co/200x200/427f02/white?text=Chocolate+Nestle+Menta'),
(175,'48299106','Chocolate Pepsi Original',NULL,0.00,13.40,0.00,95,5,NULL,NULL,0,'https://placehold.co/200x200/86180a/white?text=Chocolate+Pepsi+Original'),
(176,'31740633','Yogurt CocaCola Original',NULL,0.00,19.40,0.00,71,5,NULL,NULL,0,'https://placehold.co/200x200/1f58ac/white?text=Yogurt+CocaCola+Original'),
(177,'55439899','Chicle Diana Chocolate',NULL,0.00,1.40,0.00,97,5,NULL,NULL,0,'https://placehold.co/200x200/8e24c7/white?text=Chicle+Diana+Chocolate'),
(178,'30534680','Papas Bimbo Menta',NULL,0.00,9.90,0.00,47,5,NULL,NULL,0,'https://placehold.co/200x200/88277/white?text=Papas+Bimbo+Menta'),
(179,'10857526','Cerveza Nestle Fresa',NULL,0.00,12.70,0.00,42,5,NULL,NULL,0,'https://placehold.co/200x200/f13e72/white?text=Cerveza+Nestle+Fresa'),
(180,'94289329','Yogurt Ideal Vainilla',NULL,0.00,15.20,0.00,27,5,NULL,NULL,0,'https://placehold.co/200x200/e55162/white?text=Yogurt+Ideal+Vainilla'),
(181,'29705711','Agua Nestle Picante',NULL,0.00,6.50,0.00,91,5,NULL,NULL,0,'https://placehold.co/200x200/fd8a22/white?text=Agua+Nestle+Picante'),
(182,'16102133','Agua Bimbo Picante',NULL,0.00,15.00,0.00,66,5,NULL,NULL,0,'https://placehold.co/200x200/76c3b0/white?text=Agua+Bimbo+Picante'),
(183,'19283276','Jugo CocaCola Naranja',NULL,0.00,9.50,0.00,79,5,NULL,NULL,0,'https://placehold.co/200x200/fe333a/white?text=Jugo+CocaCola+Naranja'),
(184,'45965417','Jamón Milka Naranja',NULL,0.00,10.00,0.00,83,5,NULL,NULL,0,'https://placehold.co/200x200/367d96/white?text=Jam%C3%B3n+Milka+Naranja'),
(185,'47489807','Queso CocaCola Limon',NULL,0.00,13.00,0.00,83,5,NULL,NULL,0,'https://placehold.co/200x200/883f22/white?text=Queso+CocaCola+Limon'),
(186,'87911331','Pan Lays Limon',NULL,0.00,11.80,0.00,34,5,NULL,NULL,0,'https://placehold.co/200x200/4183a9/white?text=Pan+Lays+Limon'),
(187,'93261462','Papas Nestle Picante',NULL,0.00,4.90,0.00,57,5,NULL,NULL,0,'https://placehold.co/200x200/824f68/white?text=Papas+Nestle+Picante'),
(188,'85999164','Queso Corona Fresa',NULL,0.00,8.80,0.00,10,5,NULL,NULL,0,'https://placehold.co/200x200/f62c21/white?text=Queso+Corona+Fresa'),
(189,'26140642','Agua Corona Limon',NULL,0.00,15.80,0.00,61,5,NULL,NULL,0,'https://placehold.co/200x200/b2c539/white?text=Agua+Corona+Limon'),
(190,'74533591','Jamón Ideal Menta',NULL,0.00,4.70,0.00,1,5,NULL,NULL,0,'https://placehold.co/200x200/3e82e7/white?text=Jam%C3%B3n+Ideal+Menta'),
(191,'89003791','Galletas Ideal Picante',NULL,0.00,12.60,0.00,87,5,NULL,NULL,0,'https://placehold.co/200x200/444a0b/white?text=Galletas+Ideal+Picante'),
(192,'83021401','Pan Lays Limon',NULL,0.00,9.40,0.00,15,5,NULL,NULL,0,'https://placehold.co/200x200/33ac6d/white?text=Pan+Lays+Limon'),
(193,'45490457','Agua Nestle Naranja',NULL,0.00,2.00,0.00,13,5,NULL,NULL,0,'https://placehold.co/200x200/f498d3/white?text=Agua+Nestle+Naranja'),
(194,'76617480','Leche Nestle Vainilla',NULL,0.00,3.80,0.00,73,5,NULL,NULL,0,'https://placehold.co/200x200/1c158c/white?text=Leche+Nestle+Vainilla'),
(195,'58628245','Chocolate Milka Picante',NULL,0.00,13.10,0.00,98,5,NULL,NULL,0,'https://placehold.co/200x200/bdcd09/white?text=Chocolate+Milka+Picante'),
(196,'73871249','Detergente Milka Chocolate',NULL,0.00,19.70,0.00,59,5,NULL,NULL,0,'https://placehold.co/200x200/7941f4/white?text=Detergente+Milka+Chocolate'),
(197,'47714720','Agua Bimbo Naranja',NULL,0.00,2.00,0.00,83,5,NULL,NULL,0,'https://placehold.co/200x200/91bcb1/white?text=Agua+Bimbo+Naranja'),
(198,'10841022','Pan Lays Original',NULL,0.00,16.40,0.00,9,5,NULL,NULL,0,'https://placehold.co/200x200/33719b/white?text=Pan+Lays+Original'),
(199,'74079049','Detergente Diana Original',NULL,0.00,15.60,0.00,82,5,NULL,NULL,0,'https://placehold.co/200x200/aa390d/white?text=Detergente+Diana+Original'),
(200,'42334818','Agua Pepsi Menta',NULL,0.00,1.40,0.00,47,5,NULL,NULL,0,'https://placehold.co/200x200/89b5f2/white?text=Agua+Pepsi+Menta'),
(201,'64771707','Jamón Ideal Menta',NULL,0.00,7.50,0.00,79,5,NULL,NULL,0,'https://placehold.co/200x200/f2755f/white?text=Jam%C3%B3n+Ideal+Menta'),
(202,'58417154','Agua CocaCola Chocolate',NULL,0.00,15.80,0.00,4,5,NULL,NULL,0,'https://placehold.co/200x200/428498/white?text=Agua+CocaCola+Chocolate');

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
(1,'admin','admin','123456','Admin',1,NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `ventas` */

insert  into `ventas`(`id`,`fecha_venta`,`id_usuario`,`id_cliente`,`id_arqueo`,`tipo_comprobante`,`serie_comprobante`,`num_comprobante`,`impuesto`,`total`,`pago_con`,`cambio`,`metodo_pago`,`estado`) values 
(3,'2026-01-17 14:39:16',1,1,1,'Ticket',NULL,NULL,0.00,2.50,2.50,0.00,'Efectivo','Completado'),
(4,'2026-01-17 14:39:23',1,1,1,'Ticket',NULL,NULL,0.00,2.50,2.50,0.00,'Efectivo','Completado'),
(5,'2026-01-17 14:40:15',1,1,1,'Ticket',NULL,NULL,0.00,10.00,10.00,0.00,'Efectivo','Completado'),
(6,'2026-01-17 15:31:15',1,1,1,'Ticket',NULL,NULL,0.00,5.00,5.00,0.00,'Efectivo','Completado'),
(7,'2026-01-17 15:31:26',1,1,1,'Ticket',NULL,NULL,0.00,57.50,60.00,2.50,'Efectivo','Completado'),
(8,'2026-01-17 15:31:34',1,1,1,'Ticket',NULL,NULL,0.00,6.00,7.00,1.00,'Efectivo','Completado'),
(9,'2026-01-17 15:48:38',1,1,1,'Ticket',NULL,NULL,0.00,4.00,4.00,0.00,'Efectivo','Completado'),
(10,'2026-01-17 16:07:43',1,1,1,'Ticket',NULL,NULL,0.00,5.00,5.00,0.00,'Efectivo','Completado'),
(11,'2026-01-17 16:13:05',1,1,1,'Ticket',NULL,NULL,0.00,7.50,8.00,0.50,'Efectivo','Completado');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
