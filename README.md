# SmartPOS

**A faster checkout flow with inventory and sales history in the same system.**

SmartPOS is a full-stack point-of-sale and inventory-management project for small retail businesses. It connects the cashier's checkout workflow with the product catalog, stock levels, customer records, and sales history—so day-to-day operations can be managed from one interface.

## What the system can do

- **Run checkout:** Search products by name or barcode, manage a cart, calculate change, and print a receipt.
- **Keep inventory current:** Create and update products, manage stock, upload images, and filter low-stock items.
- **Review past sales:** Inspect transactions, view line items, and reprint receipts.
- **Manage customers:** Maintain a customer directory and update customer details.
- **Track store performance:** Review sales and inventory metrics on the dashboard.
- **Configure the store:** Set business details, currency, tax rate, and receipt text.
- **Control access:** Provide role-aware access for administrators, cashiers, and sales staff.

Checkout uses database transactions so the sale record and stock update succeed or roll back together.

## Screens and workflows

The React frontend is organized around the daily retail workflow: dashboard, point of sale, products, sales history, customers, and store settings. The PHP API handles data operations, while MySQL stores products, customers, sales, and related records.

## Technology

| Layer | Stack |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router |
| Backend | PHP 8+, JSON API, PDO |
| Database | MySQL or MariaDB (InnoDB) |

## Run locally

### Requirements

- PHP 8 or later
- MySQL or MariaDB
- Node.js 18 or later and npm
- A local server such as XAMPP, WampServer, or Laragon

### 1. Set up the database

1. Start the local web server and database.
2. Create a database named `sistema_pos`.
3. Import `Base de datos utilizada.sql` using a tool such as phpMyAdmin.
4. Configure the connection in `api/config/db.php` for your local database.

### 2. Start the PHP API

Place the project under your web server's document root. For XAMPP, for example:

```text
C:\xampp\htdocs\sistema_pos
```

Start Apache and MySQL. The products endpoint should return JSON at:

```text
http://localhost/sistema_pos/api/productos.php
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. The development proxy in `frontend/vite.config.ts` should forward `/api` requests to the PHP application. Adjust the proxy if the project is installed under a different path.

## Repository map

- `frontend/` — React single-page application.
- `api/` — PHP endpoints for authentication, products, sales, customers, and store settings.
- `Base de datos utilizada.sql` — database schema and sample data.

## Demo and security

This repository is a portfolio demonstration, not a hardened production deployment. Review the database seed and replace sample passwords before use. Do not use real customer data or expose the local database/API publicly without appropriate authentication, validation, and deployment protections.

## License

This project is released under the MIT License. See [LICENSE](LICENSE) for details.