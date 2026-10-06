# FOODHUB — Maramag Home Food Pre-Order Manager

A complete CRUD web application for small home-based food sellers to manage menu items, customers, pre-orders, stock, and sales.

## Features
- Dashboard with order, customer, menu, revenue, and low-stock statistics
- Menu item CRUD with validation and stock tracking
- Customer CRUD with Philippine mobile-number validation
- Order creation with customer/menu selection, stock validation, automatic totals, and stock deduction
- Order status and payment updates
- Automatic sales record when an order is completed
- Sales records view
- Persistent JSON data store in `data/db.json`
- Responsive browser interface
- REST API under `/api`

## Run locally
```bash
npm install
npm start
```
Open `http://localhost:4444`.

## API
- `GET/POST/PUT/DELETE /api/menu`
- `GET/POST/PUT/DELETE /api/customers`
- `GET/POST/PUT/DELETE /api/orders`
- `GET /api/sales`
- `GET /api/dashboard`
- `GET /api/health`

## Project structure
- `server.js` — Express server and REST API
- `public/index.html` — application interface
- `public/app.js` — frontend behavior and API calls
- `public/styles.css` — UI styling
- `data/db.json` — persistent application data
