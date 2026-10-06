# FOODHUB Validation Matrix — Week 5

Validation is handled before the controller. A rejected request returns the standard error envelope and never reaches the controller.

## Menu

| Route | Field | Rule |
|---|---|---|
| POST `/menu` | name | required, string, 2–100 characters |
| POST `/menu` | price | required, finite number, greater than 0 |
| POST/PUT | description | optional, string, max 250 characters |
| POST/PUT | category | optional, string, 2–50 characters |
| POST/PUT | stock_quantity | optional, integer, 0 or greater |
| POST/PUT | status | optional, `available` or `unavailable` |

PUT uses partial validation: only supplied fields are checked.

## Customers

| Route | Field | Rule |
|---|---|---|
| POST `/customers` | full_name | required, string, 2–100 characters |
| POST `/customers` | contact_number | required, Philippine `09XXXXXXXXX`, 11 digits |
| POST `/customers` | address | required, string, 5–250 characters |
| POST/PUT | preferences | optional, text |

PUT uses partial validation.

## Orders

| Route | Field | Rule |
|---|---|---|
| POST `/orders` | customer_id | required and valid customer reference |
| POST `/orders` | items | non-empty array |
| POST `/orders` | items[].menu_id | required and existing menu item |
| POST `/orders` | items[].quantity | integer, at least 1 |
| POST/PUT | order_status | pending, confirmed, ready, completed, cancelled |
| POST/PUT | fulfillment_type | pickup or delivery |
| POST | scheduled_datetime | valid future date/time |
| POST | delivery_location | required for delivery, 5–250 characters |
| PUT | payment_status | unpaid, partial, paid |
| PUT | delivery_location | optional, 5–250 characters when supplied |
| PUT | scheduled_datetime | valid date/time when supplied |

Business rules such as stock availability, duplicate customers, cancellation stock restoration, and sales synchronization are handled by the service layer after validation.

## Error envelope

```json
{
  "status": 422,
  "data": null,
  "error": "Price must be a positive number",
  "field": "price",
  "message": "Price must be a positive number"
}
```

## Authorization

Admin CRUD/report routes require a valid Bearer token. Customer-facing menu, session, order creation, and order-history endpoints remain public for the FOODHUB customer flow.

## Week 5 testing rule

The automated suite covers:
- happy paths
- validation failures
- edge/boundary cases
- business rules
- standardized response envelopes
- controller/service architecture bindings

A failing suite must block the PR.
