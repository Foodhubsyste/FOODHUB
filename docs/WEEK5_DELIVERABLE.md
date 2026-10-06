# FOODHUB — Week 5 Deliverable 2

## Backend Controllers, Routing, Validation and Automated Tests

### Objectives

Week 5 completes the logic layer using the required pipeline:

**Route → Validation → Thin Controller → Service/Data Layer → Response**

The FOODHUB implementation now uses real controllers and services instead of placeholder controller stubs.

## 1. Thin controller architecture

Implemented:

- `controllers/menuController.js`
- `controllers/customerController.js`
- `controllers/orderController.js`
- `controllers/reportController.js`
- `controllers/authController.js`

Controllers are intentionally small. They:

1. receive validated request data;
2. call the service/data layer;
3. translate service results into the standard response envelope.

Validation and persistence are not duplicated inside the controllers.

## 2. Validation middleware

Implemented in:

`middleware/validation.js`

Validation runs before the controller and stores accepted input in:

`req.validatedBody`

The middleware covers:

- menu create/update rules;
- customer create/update rules;
- order create rules;
- order update status/payment/fulfillment rules;
- delivery-location validation.

Invalid requests return HTTP 422 using the standard error envelope.

## 3. Service/data layer

Implemented in:

- `services/database.js`
- `services/foodhubService.js`

The service layer performs the actual application work:

- CRUD operations;
- customer session creation/update;
- order creation;
- stock checking and deduction;
- cancellation stock restoration;
- cancelled-order reactivation checks;
- customer order totals;
- completed-order sales synchronization;
- dashboard calculations.

This keeps persistence/business logic outside the controllers.

## 4. Standard response envelope

### Success

```json
{
  "status": 201,
  "data": {},
  "error": null,
  "message": "Success"
}
```

### Validation/error

```json
{
  "status": 422,
  "data": null,
  "error": "Validation message",
  "field": "field_name",
  "message": "Validation message"
}
```

All controller responses use this consistent shape.

## 5. Automated tests

`week5.test.js` uses Arrange–Act–Assert and covers:

| Area | Happy path | Validation/failure | Edge/business case |
|---|---|---|---|
| Menu | Create item | Missing name | Zero price |
| Customer | Create customer | Invalid phone | Short address |
| Orders | Pickup order | Missing menu item | Zero quantity |
| Delivery | Delivery order | Invalid delivery data | Fulfillment/location preserved |
| API | Successful response | Standard error envelope | Consistent response fields |
| Architecture | Routes use controllers | Controllers avoid validation | Controllers delegate to services |

Existing project tests also cover authentication, stock restoration, sales synchronization, frontend bindings, and fulfillment display.

## 6. CI / merge rule

The project uses GitHub Actions to run the automated test suite on pushes and pull requests to `main`.

The `pretest` script syntax-checks the server, frontend, validation middleware, services, controllers and routes before Jest runs.

**Rule:** a failing test suite blocks the Week 5 pull request.

## 7. AI-assisted implementation

This Week 5 implementation is being completed with **AI ON**, according to the current project instruction provided by the student.

The repository therefore records the actual AI-assisted implementation rather than claiming that AI was not used.

If the instructor separately requires an observed individual checkpoint, that checkpoint should only be marked complete after the student performs and verifies it according to the instructor's current rules.

## 8. Week 5 checklist

- [x] Routing structure implemented
- [x] Validation middleware implemented
- [x] Thin controllers implemented
- [x] Service/data layer implemented
- [x] Standard success/error response envelope
- [x] CRUD routes wired end-to-end
- [x] Automated Arrange–Act–Assert tests
- [x] Delivery/pickup behavior covered
- [x] CI syntax/test gate configured
- [x] Obsolete controller stubs removed
- [ ] Instructor-observed individual checkpoint — verify current instructor requirement

## 9. Week 6 handoff

The Week 5 logic layer is now separated and tested so the interface can consume stable API responses during the next phase.
