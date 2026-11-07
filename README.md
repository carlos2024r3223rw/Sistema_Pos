# SmartPOS — Point of Sale & Inventory Management System

A modern, fast, and responsive full-stack **Point of Sale (POS)** and **Inventory Management System** built with **React**, **TypeScript**, **Tailwind CSS**, **PHP**, and **MySQL**. Designed to streamline retail store operations, manage product stock in real time, handle cash flow, and generate printable thermal receipts.

---

## Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Database Overview](#-database-overview)
- [Getting Started & Installation](#-getting-started--installation)
  - [Prerequisites](#1-prerequisites)
  - [Database Setup](#2-database-setup)
  - [Backend Setup](#3-backend-setup)
  - [Frontend Setup](#4-frontend-setup)
- [Default Login Credentials](#-default-login-credentials)
- [API Reference](#-api-reference)
- [License](#-license)

---

## Project Overview

**SmartPOS** is an end-to-end POS solution tailored for small-to-medium retail stores, convenience shops, and supermarkets. It bridges a modern single-page frontend with an efficient, lightweight PHP REST API.

The system empowers cashiers with a seamless checkout experience (interactive product grid, barcode search, instant change calculation, and receipt generation), while providing store managers with inventory tracking, sales history, low-stock warnings, and store customization settings.

---

##  Key Features

###  1. Point of Sale (POS) Terminal
- **Fast Cashier Workflow:** Visual product catalog with category filter tabs and real-time text/barcode search.
- **Dynamic Cart:** Instant quantity increment/decrement, subtotal calculation, and item removal.
- **Payment & Change Calculation:** Cash payment inputs with real-time change calculation and payment method selection.
- **Thermal Receipt Printing:** Instant 80mm/58mm receipt preview and direct browser printing with automated formatting.
- **Keyboard Shortcuts:** Keyboard-friendly checkout (press `Enter` to dismiss or finalize).

###  2. Real-Time Inventory & Product Catalog
- **Product Management:** Create, view, and edit products with barcode, purchase price, retail price, and stock levels.
- **Image Upload & Support:** Local image uploading with automatic file storage (`/uploads/productos`) and remote URL preview.
- **Stock Depletion:** Automatic stock decrement upon successful checkout wrapped in atomic database transactions.
- **Low Stock Alerts:** Color-coded badges and dedicated low-stock filters to prevent stockouts.

###  3. Analytics & Dashboard
- **Sales Overview:** Today's gross sales revenue calculation.
- **Stock Health:** Real-time count of active products and items reaching the reorder point (low stock).
- **Quick Navigation:** Jump straight from metric cards to relevant modules.

###  4. Sales History & Receipt Re-printing
- **Audit Log:** Chronological record of completed transactions showing cashier name, timestamp, and grand total.
- **Order Breakdown:** View individual line items, unit prices, and quantities for past sales.
- **Ticket Re-printing:** One-click re-generation of thermal receipts for previous orders.

###  5. Customer Relationship Management (CRM)
- **Customer Directory:** Register customer profiles with document ID, phone, address, and email.
- **Quick Lookup & Update:** Full CRUD capabilities with responsive modals.

###  6. Business Settings & Customization
- **Store Profile:** Configure business name, tax identification (RUC/NIT/Tax ID), phone number, and physical address.
- **Localization:** Set default currency symbol (`$`, `€`, `S/`, etc.) and tax rate (VAT/IVA).
- **Receipt Customization:** Customizable receipt header and footer thank-you message.

###  7. Authentication & Security
- **Secure Access:** Login page with token storage and session validation.
- **Role-Based Access Control (RBAC):** Schema support for `Admin`, `Cajero` (Cashier), and `Vendedor` (Salesperson) roles.
- **Database Transactions:** ACID-compliant checkout with rollbacks if stock or order insertion encounters an issue.

---

##  Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Alerts & Modals:** [SweetAlert2](https://sweetalert2.github.io/)
- **HTTP Client:** Native `fetch` + [Axios](https://axios-http.com/)

### Backend
- **Language:** [PHP 8.x](https://www.php.net/) (RESTful endpoints, JSON responses)
- **Database Driver:** PDO (Prepared statements & transactions)
- **CORS Support:** Integrated headers for local development and decoupling

### Database
- **Engine:** [MySQL](https://www.mysql.com/) / [MariaDB](https://mariadb.org/) (InnoDB with foreign keys and relational integrity)

---

##  System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   React 19 Frontend                    │
│   (Vite + TypeScript + Tailwind CSS + Lucide Icons)     │
└───────────────────────────┬────────────────────────────┘
                            │
               HTTP / JSON (REST API Calls)
                            │
┌───────────────────────────▼────────────────────────────┐
│                    PHP Backend API                     │
│  - Endpoint Routers (ventas.php, productos.php, etc.)  │
│  - PDO Database Abstraction & Prepared Statements      │
│  - File Upload Handler (uploads/productos/)            │
└───────────────────────────┬────────────────────────────┘
                            │
                      SQL Queries
                            │
┌───────────────────────────▼────────────────────────────┐
│                  MySQL / MariaDB                       │
│  - usuarios, productos, categorias, clientes,          │
│  - ventas, detalle_ventas, arqueo_caja, empresa        │
└────────────────────────────────────────────────────────┘
```

---

##  Project Structure

```text
Sistema_Pos/
├── api/                             # PHP REST API Endpoints
│   ├── config/
│   │   └── db.php                   # Database connection (PDO)
│   ├── actualizar_producto.php      # Update product endpoint
│   ├── categorias.php               # Categories list endpoint
│   ├── clientes.php                 # Customer CRUD operations
│   ├── configuracion.php            # Store configuration endpoint
│   ├── crear_producto.php           # Create product endpoint
│   ├── dashboard_stats.php          # Metric calculations for dashboard
│   ├── detalle_venta.php            # Sale line items lookup
│   ├── guardar_producto.php         # Product create/update with file upload
│   ├── guardar_venta.php            # Transactional sale processor
│   ├── login.php                    # User authentication endpoint
│   ├── productos.php                # Product catalog endpoint
│   └── ventas.php                   # Sales history query
├── frontend/                        # React SPA Application
│   ├── public/                      # Static web assets
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.tsx          # Navigation sidebar & logout
│   │   ├── pages/
│   │   │   ├── Clientes.tsx         # Customer management page
│   │   │   ├── Configuracion.tsx    # Store settings page
│   │   │   ├── Dashboard.tsx        # Analytics overview page
│   │   │   ├── Historial.tsx        # Sales history & ticket reprint
│   │   │   ├── Login.tsx            # Login screen
│   │   │   ├── Productos.tsx        # Product catalog & stock manager
│   │   │   └── Ventas.tsx           # POS checkout terminal & ticket modal
│   │   ├── App.tsx                  # Main router & auth guard
│   │   └── main.tsx                 # React entry point
│   ├── download_images.cjs          # Script to fetch demo product images
│   ├── package.json                 # Frontend dependencies
│   ├── tailwind.config.js           # Tailwind configuration
│   └── vite.config.ts               # Vite configuration and proxy setup
├── uploads/                         # Uploaded product images
│   └── productos/
├── Base de datos utilizada.sql      # Full database schema and seed data
└── README.md                        # Project documentation
```

---

##  Database Overview

The system includes a relational MySQL schema (`sistema_pos`) with foreign key constraints:

| Table | Description |
|---|---|
| `usuarios` | System users, roles (`Admin`, `Cajero`, `Vendedor`), and passwords. |
| `productos` | Product catalog (name, barcode, purchase price, retail price, stock, image). |
| `categorias` | Product categories for organization and filtering. |
| `clientes` | Customer records with contact and tax identification details. |
| `ventas` | Sales header records (date, total, payment method, cash paid, change). |
| `detalle_ventas` | Line items for each sale linking product, quantity, unit price, and subtotal. |
| `cajas` & `arqueo_caja` | Cash registers and shift cash reconciliations / register opening & closing. |
| `empresa` | Store metadata (name, address, tax rate, currency symbol, ticket message). |

---

##  Getting Started & Installation

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Local Web Server:** [XAMPP](https://www.apachefriends.org/), [WampServer](https://www.wampserver.com/), or [Laragon](https://laragon.org/) (with **PHP 8.0+** and **MySQL/MariaDB**).
- **Node.js:** v18.0.0 or higher.
- **npm** or **pnpm**.

---

### 2. Database Setup
1. Start the **Apache** and **MySQL** services in your local server control panel (e.g., XAMPP).
2. Open your database manager (e.g., [phpMyAdmin](http://localhost/phpmyadmin) or SQLyog).
3. Create a new database named `sistema_pos` with charset `utf8mb4_general_ci`.
4. Import the provided SQL dump file:
   ```bash
   Base de datos utilizada.sql
   ```
5. Verify the tables and initial seed data are populated.

---

### 3. Backend Setup
1. Clone or copy the `Sistema_Pos` project into your web server's root directory:
   - For XAMPP on Windows:
     ```bash
     C:\xampp\htdocs\sistema_pos
     ```
2. Verify the database credentials in `api/config/db.php`:
   ```php
   $host = "localhost";
   $db_name = "sistema_pos";
   $username = "root";
   $password = ""; // Your MySQL password if set
   ```
3. Test that the API is reachable in your browser by visiting:
   ```text
   http://localhost/sistema_pos/api/productos.php
   ```
   *(It should return a JSON array with products).*

---

### 4. Frontend Setup
1. Open a terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the browser and visit the local development URL (default is `http://localhost:5173`).

> **Note on API Proxy:** The `vite.config.ts` includes a proxy mapping `/api` requests to `http://localhost/sistema_pos/api`, so no extra CORS configuration is required during local development.

---

##  Default Login Credentials

Use the preconfigured administrator credentials from the database seed:

- **Username:** `admin`
- **Password:** `123456`
- **Role:** `Admin`

---

##  API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/login.php` | Authenticate user credentials and generate session token |
| `GET` | `/api/dashboard_stats.php` | Retrieve total revenue, active products count, and low-stock count |
| `GET` | `/api/productos.php` | Retrieve all products in the catalog |
| `POST` | `/api/guardar_producto.php` | Create or update a product (supports `multipart/form-data` image upload) |
| `GET` | `/api/categorias.php` | Retrieve all product categories |
| `POST` | `/api/guardar_venta.php` | Process and record a transaction, update stock levels |
| `GET` | `/api/ventas.php` | Retrieve sales history log |
| `GET` | `/api/detalle_venta.php?id={id}` | Retrieve line item details for a specific sale |
| `GET` | `/api/clientes.php` | Retrieve list of registered customers |
| `POST` | `/api/clientes.php` | Register a new customer |
| `PUT` | `/api/clientes.php` | Update an existing customer record |
| `DELETE` | `/api/clientes.php` | Delete a customer record |
| `GET` | `/api/configuracion.php` | Retrieve business and receipt configuration |
| `POST` | `/api/configuracion.php` | Save or update business settings |

---

##  License

This project is open-source and available under the [MIT License](LICENSE). Feel free to use, modify, and distribute it for personal, academic, or commercial projects.

