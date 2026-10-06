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
- Responsive browser interface with Admin and Customer dashboards
- Week 6 reusable view components with loading, empty, and error states
- Customer cart, pickup/delivery checkout, scheduling, and order history
- Admin order workflow: pending → confirmed → ready → completed/cancelled
- Automatic stock deduction/restoration and sales synchronization
- Automated Jest/Supertest regression tests and GitHub Actions CI
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
- `public/components.js` — reusable Week 6 view components
- `public/app.js` — frontend behavior and API calls
- `public/styles.css` — UI styling
- `data/db.json` — persistent application data


## User Roles

FOODHUB now starts with a role selection screen:

- **Admin** — signs in and manages the menu, customers, orders, inventory, dashboard, and sales.
- **Customer** — enters full name, Philippine phone number, and address, then gets a customer dashboard where they can browse available food, add items to a cart, place an order, and view their order history.

### Admin demo login

Default local/demo credentials:

- Username: `admin`
- Password: `foodhub123`

For Railway, set these environment variables to change the credentials:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

The admin login uses a server-side session token, while customer registration/session information is stored in the application's current JSON database.

## Fully functional branch

The repository includes a dedicated branch named `fully-functional-system` containing the complete demo-ready implementation and frontend fixes. Use this branch when testing the full FOODHUB workflow in VS Code.

### Full workflow

**Admin:** login → dashboard → menu CRUD → customer CRUD → order management → payment/status updates → sales/revenue.

**Customer:** register/session → browse/search menu → cart → choose pickup or delivery → choose schedule → place order → view order history.

### Test the system

```bash
npm install
npm test
npm start
```

The test suite also performs JavaScript syntax checks before running API regression tests.
