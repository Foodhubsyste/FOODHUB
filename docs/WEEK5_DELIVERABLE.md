# Week 5 — Deliverable 2
## FOODHUB: Controllers, Logic & Automated Tests

This document maps the FOODHUB implementation to the Week 5 lab requirements.

> **Source basis:** Week 5 requires thin controllers, standardized responses, Arrange–Act–Assert tests, meaningful happy-path/failure/edge coverage, a green suite, and an individual AI-off checkpoint. The checkpoint must be completed individually and honestly by each student.

### 1. Week 5 objectives

- Route → validation → controller/logic → data → response pipeline
- Standard success and error response envelopes
- Automated tests using Arrange–Act–Assert
- Happy-path, validation-failure, and edge-case coverage
- No merge to `main` while CI is red

### 2. FOODHUB response standard

FOODHUB API responses use the following envelope:

```json
{
  "status": 200,
  "data": {},
  "error": null,
  "message": "Success"
}
```

Validation failures use the same envelope:

```json
{
  "status": 422,
  "data": null,
  "error": "Validation message",
  "field": "field_name",
  "message": "Validation message"
}
```

### 3. Logic covered by the application

#### Menu
- GET all menu items
- GET one menu item
- POST a menu item with validation
- PUT a menu item with validation
- DELETE a menu item with order-history protection

#### Customers
- GET all customers
- GET one customer
- POST a customer with validation
- PUT a customer with validation
- DELETE a customer with order-history protection

#### Orders
- GET all orders
- GET one order
- POST an order with validation and stock checks
- PUT an order with status/payment/stock/sales synchronization
- DELETE only cancelled orders

#### Sales
- Completed orders create a sale record.
- Orders that stop being completed are removed from sales.

### 4. Arrange–Act–Assert test coverage

The automated suite covers:

| Area | Happy path | Validation/failure | Edge/business case |
|---|---|---|---|
| Admin authentication | Login succeeds | Invalid credentials rejected | Protected API rejects missing token |
| Customer | Session/register succeeds | Invalid customer data rejected | Duplicate/invalid contact handling |
| Menu | Menu can be read | Invalid menu/order item rejected | Stock reaches zero / unavailable |
| Orders | Pickup order succeeds | Invalid order item rejected | Cancellation restores stock |
| Delivery | Delivery order succeeds | Missing delivery location rejected | Fulfillment is preserved |
| Sales | Completed order creates sale | Non-completed order removes sale | Payment method is preserved |
| Frontend | Required files/bindings exist | Invalid legacy bindings are rejected | Multi-element selectors use `$$` |

### 5. CI / merge rule

GitHub Actions runs the test suite on pushes and pull requests to `main`.

**Rule:** no code should be merged into `main` while the test suite is failing.

### 6. Individual AI-off checkpoint

The Week 5 handout requires each team member to complete a small route task **alone, without AI, without teammate help, and without copy-paste**, while the instructor observes.

**Status: PENDING INDIVIDUAL COMPLETION**

Do not mark this checkpoint as completed in the repository unless the student actually performed it under the instructor's rules.

Suggested evidence to record after the real checkpoint:

- Student/member:
- Route assigned:
- Validation handled:
- Controller/logic implemented:
- Test written:
- Instructor verification:
- Date:

### 7. Deliverable 2 checklist

- [x] Routing structure documented
- [x] Validation rules documented
- [x] CRUD logic implemented in FOODHUB
- [x] Standard API response envelope implemented
- [x] Automated tests exist
- [x] CI blocks failing test suites
- [ ] Each member's AI-off checkpoint completed and verified
- [ ] Final Deliverable 2 submission assembled

### 8. Week 6 handoff

Week 5 completes the logic/testing foundation. Week 6 can use the tested API while building the interface and recording required AI prompt logs.
