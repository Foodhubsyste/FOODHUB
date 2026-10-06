# FOODHUB API Routes — Week 5

**Base URL:** `/api`  
**Response envelope:** `{ status, data, error, message }`

Week 5 uses the pipeline:

**Route → Validation Middleware → Thin Controller → Data/Service Layer → Response**

## Public customer routes

| Method | Path | Validation | Controller | Purpose |
|---|---|---|---|---|
| GET | `/menu` | — | `menuController.list` | View menu |
| GET | `/menu/:id` | — | `menuController.show` | View one menu item |
| POST | `/customers/session` | customer | `customerController.session` | Register/login customer |
| POST | `/orders` | order | `orderController.create` | Place customer order |
| GET | `/customers/:id/orders` | — | `customerController.orders` | View customer order history |

## Admin CRUD routes

Admin routes require a Bearer token from `POST /api/admin/login`.

### Menu

| Method | Path | Validation | Controller |
|---|---|---|---|
| GET | `/menu` | — | `menuController.list` |
| GET | `/menu/:id` | — | `menuController.show` |
| POST | `/menu` | `validateMenu` | `menuController.create` |
| PUT | `/menu/:id` | `validateMenu(partial)` | `menuController.update` |
| DELETE | `/menu/:id` | — | `menuController.remove` |

### Customers

| Method | Path | Validation | Controller |
|---|---|---|---|
| GET | `/customers` | — | `customerController.list` |
| GET | `/customers/:id` | — | `customerController.show` |
| POST | `/customers` | `validateCustomer` | `customerController.create` |
| PUT | `/customers/:id` | `validateCustomer(partial)` | `customerController.update` |
| DELETE | `/customers/:id` | — | `customerController.remove` |

### Orders

| Method | Path | Validation | Controller |
|---|---|---|---|
| GET | `/orders` | — | `orderController.list` |
| GET | `/orders/:id` | — | `orderController.show` |
| POST | `/orders` | `orderValidator` | `orderController.create` |
| PUT | `/orders/:id` | `orderUpdateValidator` | `orderController.update` |
| DELETE | `/orders/:id` | — | `orderController.remove` |

## Reports

| Method | Path | Controller |
|---|---|---|
| GET | `/sales` | `reportController.sales` |
| GET | `/dashboard` | `reportController.dashboard` |

## Authentication

| Method | Path | Controller |
|---|---|---|
| POST | `/admin/login` | `authController.login` |
| POST | `/admin/logout` | `authController.logout` |
| GET | `/health` | server health handler |

## Standard success response

```json
{
  "status": 201,
  "data": { "id": "M006" },
  "error": null,
  "message": "Menu item created"
}
```

## Standard error response

```json
{
  "status": 422,
  "data": null,
  "error": "Name must be 2–100 characters",
  "field": "name",
  "message": "Name must be 2–100 characters"
}
```

The controller does not perform validation. Validation middleware places accepted input in `req.validatedBody`; the controller passes it to the service layer and shapes the response.
