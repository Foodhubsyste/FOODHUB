# FOODHUB Database Guide

## Current status

The current Node/Express application uses a JSON file store by default at `data/db.json`. The repository now also contains a normalized MySQL schema so the team can explain and provision the relational database design during defense or future production migration.

## Files

- `database/schema.sql` — creates the `foodhub` database, tables, indexes, constraints, sample records, and reporting views.
- `database/seed.sql` — idempotent seed for the base menu/customers.
- `docs/database-defense.md` — defense-ready explanation.
- `services/database.js` — current application persistence adapter; defaults to JSON unless the application is migrated to MySQL.

## Tables

### menu_items
Stores food catalog and inventory values.

### customers
Stores customer identity, contact information, address, and order count.

### orders
Stores one customer order, fulfillment choice, schedule, payment state, and order status.

### order_items
Stores the line items belonging to an order. The item name is also saved as a snapshot so historical orders retain what was ordered even if a menu name later changes.

### sales
Stores completed-order sales records for reporting.

## Relationships

- One customer → many orders.
- One order → many order_items.
- One menu item → many order_items.
- One completed order → one sales record.

The foreign keys protect orphan records and enforce the domain relationships.

## Important production note

The SQL schema is a real relational design, but adding the schema file alone does not change the running application's persistence layer. To switch the live application to MySQL, the service/data adapter must be migrated and the host must provide MySQL connection variables.

## Defense answer

"The database is normalized around menu items, customers, orders, order items, and sales. Orders reference customers, and order items connect orders to menu items. Foreign keys maintain referential integrity. In the current version, the running Node app persists to JSON; the SQL schema is the relational database design prepared for a MySQL migration or production deployment."
