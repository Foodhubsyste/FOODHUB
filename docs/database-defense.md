# FOODHUB Database Defense Notes

## 1. What database does the current system use?

The current running Node/Express application uses a JSON file database at `data/db.json`. The repository also contains a MySQL schema package in `database/schema.sql` as the relational database design.

**Say this:** "Our current implementation persists data in JSON for the deployed Node application. We also prepared a normalized MySQL schema that mirrors the same domain for a database-backed production migration."

## 2. Why are there separate tables?

The relational design separates entities so each table has one main responsibility:
- `menu_items` — food catalog and stock.
- `customers` — customer records.
- `orders` — order header and status.
- `order_items` — products inside each order.
- `sales` — completed-sale records.

This avoids putting repeated item columns inside the order record.

## 3. How are the tables related?

Customer 1 → many Orders.

Order 1 → many Order Items.

Menu Item 1 → many Order Items.

Completed Order 1 → one Sale.

## 4. Why use a separate order_items table?

An order can contain multiple foods. Instead of columns such as `item1`, `item2`, and `item3`, `order_items` stores one row per line item.

## 5. Why store item_name_snapshot?

An order should retain the name that was ordered even if the menu item is later renamed. The snapshot supports historical consistency.

## 6. What is a foreign key?

A foreign key connects related tables and prevents invalid references, such as an order pointing to a customer ID that does not exist.

## 7. What happens to stock when an order is placed?

The service checks available stock first, calculates the order items and total, deducts the quantity, and marks the item unavailable if stock reaches zero.

## 8. What happens when an order is cancelled?

The service restores the order quantities to menu stock and updates the customer's order count. A completed-order sales record is also removed when the order is no longer completed.

## 9. Why is sales separate?

Sales is a reporting record. The current application synchronizes a sale when an order becomes completed, and removes that sale if the order is later moved back from completed.

## 10. Why not store the admin password in the database?

The current application uses environment-based admin credentials. That keeps production credentials out of source-controlled data. The Week 11 configuration also requires explicit admin credentials in production.

## 11. What would you improve?

"Our next production improvement would be to migrate the running JSON persistence adapter to the prepared MySQL schema so customer/order history survives host restarts and horizontal deployments."
