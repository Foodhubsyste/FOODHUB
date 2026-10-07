# FOODHUB Final Presentation — Deliverable 4

## Slide 1 — Problem
Small food sellers need a simple way to manage menu items, customers, pre-orders, inventory, and sales.

## Slide 2 — Solution
FOODHUB provides separate Admin and Customer workflows, menu/customer/order management, cart and checkout, pickup/delivery scheduling, inventory tracking, and sales reporting.

## Slide 3 — Architecture
Follow one real request:

UI form → Fetch → route → validation → controller → service/data → standardized response → UI feedback.

## Slide 4 — Quality
Show the QA process from Week 10:
- feature × scenario matrix
- critical-path automated tests
- adversarial testing
- P0/P1/P2 triage

## Slide 5 — Reliability
Show the Week 6–8 feedback system:
- loading
- success
- inline 422 validation
- 404 not-found
- general/server failure
- network Retry
- delete confirmation

## Slide 6 — Deployment
Show the live public URL, production environment configuration, and health check.

## Slide 7 — Live Demo
Use the deployed URL:
1. Admin login
2. Dashboard
3. Menu create/edit/delete
4. Customer ordering
5. Order management
6. One graceful failure
7. Return to dashboard/result

## Slide 8 — Lessons
Discuss architecture, validation, asynchronous UI, code review, manual QA, deployment, and responsible AI use.

## Slide 9 — Closing
State the value delivered and the main lessons from the full build.

## Presenter note

The actual class demo should be based on the deployed application. Replace placeholders with real evidence immediately before presentation.


## Database slide note

**Current datastore:** The deployed Node/Express application currently uses the JSON persistence adapter. The repository also includes a normalized MySQL schema, seed data, and ERD as the planned relational database design.

Do not describe the deployed application as MySQL-backed unless the running Railway service is actually migrated and configured for MySQL.
