# SmartPOS — Point of Sale and Inventory Management

SmartPOS is a full-stack point-of-sale and inventory-management application for small retail businesses. Cashiers can process sales and print receipts, while managers can maintain products, review sales, track stock, and configure store details.

## Features

- Product catalog with category and barcode search.
- Cart, payment entry, change calculation, and receipt printing.
- Inventory management with image uploads and low-stock filters.
- Sales history with line-item details and receipt reprints.
- Customer directory and store configuration.
- Dashboard metrics for sales and stock levels.
- Login and role-aware interface for administrators, cashiers, and sales staff.
- Transactional checkout that records the sale and updates stock together.

## Technology

| Layer | Tools |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router |
| Backend | PHP 8+, REST-style JSON endpoints, PDO |
| Database | MySQL or MariaDB with InnoDB |

## Local setup

### Prerequisites

- PHP 8 or later.
- MySQL or MariaDB.
- Node.js 18 or later and npm.
- A local web server such as XAMPP, WampServer, or Laragon.

### 1. Create and seed the database

1. Start the local web server and database.
2. Create a database named `sistema_pos`.
3. Import `Base de datos utilizada.sql` using a database tool such as phpMyAdmin.
4. Configure the connection in `api/config/db.php` for your local database.

Do not commit production database credentials. Review the provided SQL seed data and replace any sample passwords before using the application outside a local demo.

### 2. Start the PHP API

Place the project under your local web server's document root. For XAMPP, for example:

```text
C:\xampp\htdocs\sistema_pos
```

Start Apache and MySQL, then check that the API responds at:

```text
http://localhost/sistema_pos/api/productos.php
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. The development proxy in `frontend/vite.config.ts` should forward `/api` requests to the local PHP application; adjust it if your project is installed under a different path.

## Repository layout

- `frontend/` — React single-page application.
- `api/` — PHP endpoints for products, sales, customers, configuration, and dashboard data.
- `Base de datos utilizada.sql` — database schema and sample data.

## API overview

The PHP API includes endpoints for authentication, product and category lookup, product writes, checkout, sales history, customer management, and store configuration. See the `api/` directory for the current route names and request formats.

## Demo and security

This repository is a software demonstration, not a hardened production deployment. Seeded account details may be present in the SQL file; inspect and change them before use. Do not use real customer information or expose the local database/API publicly without adding appropriate authentication, validation, and deployment protections.

## License

The repository includes an MIT license. See [LICENSE](LICENSE) for the full terms.