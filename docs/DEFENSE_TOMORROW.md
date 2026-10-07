# FOODHUB Defense — Tomorrow's Quick Guide

**Important:** Use this to rehearse. During the actual oral defense, follow your instructor's AI-OFF and unassisted rule.

## 30-second opening

"Good day. Our system is FOODHUB, a home food pre-order management system. It has separate Admin and Customer workflows. Admin manages menu items, customers, orders, and sales, while customers browse food, manage a cart, and place pickup or delivery orders. The system uses asynchronous requests, server-side validation, business logic in a service layer, and consistent user feedback."

## 60-second architecture explanation

"An action starts in the browser UI. The frontend sends a Fetch request to an Express route. The route runs validation middleware. If valid, the thin controller delegates to the service layer. The service applies business rules and reads or updates the data store. The controller sends a standardized response, and the frontend displays the result using loading, success, empty, not-found, or error feedback."

## 60-second database explanation

"Our current deployed Node application persists data in a JSON file. The domain is organized around menu items, customers, orders, order items, and sales. We also prepared a normalized MySQL schema with foreign keys between customers and orders, orders and order items, and menu items and order items. The SQL schema is ready for a relational migration, while the current deployment still uses the JSON adapter."

## Main demo order

1. Open the Railway URL.
2. Show Admin and Customer entry.
3. Admin login.
4. Dashboard.
5. Menu create.
6. Menu update.
7. Menu delete with confirmation.
8. Customer workflow.
9. Add food to cart.
10. Choose pickup or delivery.
11. Schedule the order.
12. Place order.
13. Return to Admin Orders.
14. Update the order status.
15. Show success feedback.
16. Demonstrate one safe invalid input and explain the 422 path.

## Core defense questions

### What problem does the system solve?

It centralizes menu, customer, ordering, inventory, and sales workflows instead of relying on disconnected manual records.

### Why did you choose Express and Node.js?

It provides a lightweight HTTP server with routes and middleware that fit the JavaScript frontend and make the request pipeline clear.

### Why use controllers?

Controllers keep HTTP coordination separate from business and data logic.

### Why use a service layer?

It keeps business rules such as stock checking, order totals, cancellation restoration, and sales synchronization in one place.

### Where does validation happen?

In `middleware/validation.js`, before controller logic. Browser validation can improve user experience, but the server remains the authoritative validation gate.

### What happens with invalid input?

The validation middleware returns HTTP 422 with a field and message. The frontend keeps the form visible and displays that validation error.

### What happens if a record does not exist?

The API returns 404 and the interface shows a not-found state instead of a blank result.

### What happens if the server or network fails?

The frontend maps the failure to a human-readable message and can provide Retry for retryable reads/actions.

### Why disable buttons while waiting?

To reduce duplicate submissions while an asynchronous request is pending.

### How does inventory work?

Before an order is created, the service checks stock, calculates subtotals and the total, deducts stock, and marks an item unavailable when stock reaches zero. Cancellation restores the quantity.

### How does sales work?

A sale is created when an order becomes completed. If the order moves away from completed, the corresponding sales record is removed.

### Why support pickup and delivery?

They represent two fulfillment workflows. Delivery requires a valid delivery location, and both modes require a schedule.

### Why use an order_items table in MySQL?

One order can contain many menu items, so order_items models that one-to-many relationship without fixed columns such as item1, item2, and item3.

### What is a foreign key?

It enforces a valid relationship, such as an order referencing a customer that exists.

### What would you improve?

"A strong next step would be to migrate the running JSON persistence adapter to persistent MySQL so customer and order history survives host restarts, and to add deeper browser end-to-end automation."

## Code-defense method

For any file, answer in this order:

**Purpose → Inputs → Main logic → Output → Error handling → Why this approach**

Example:

"My controller receives the HTTP request, uses the validated body, calls the service, and returns a standard response. It does not contain the business rules because those belong in the service layer."

## What not to claim

- Do not claim the deployed app is MySQL-backed if the running service still uses JSON.
- Do not claim a manual test passed unless you actually ran it.
- Do not claim a peer review happened unless GitHub shows the submitted review.
- Do not memorize code you cannot explain.
- Do not use AI during the actual unassisted defense.
