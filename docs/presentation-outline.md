# FOODHUB Final Presentation Outline — Week 12

## Slide 1 — Title
FOODHUB — Maramag Home Food Pre-Order Manager

Team members, course, and section.

## Slide 2 — Problem
Explain the problem the project addresses: manual food-order handling and the difficulty of tracking menu items, customers, orders, stock, and sales.

## Slide 3 — Solution
Show the Admin dashboard, Customer ordering flow, menu/customer/order management, pickup/delivery scheduling, inventory, and sales tracking.

## Slide 4 — Architecture
Explain one request path:
UI form → Fetch request → route → validation → controller → service/data → standardized response → UI update.

## Slide 5 — Data and Business Rules
Explain menu records, customer records, orders, stock deduction/restoration, and sales synchronization for completed orders.

## Slide 6 — Reliability
Show loading feedback, empty states, 422 validation, 404 not-found, general/server failure, network Retry, and delete confirmation.

## Slide 7 — Live Demo
Use the deployed application, not localhost. Recommended flow: public URL → Admin login → dashboard → menu create/edit/delete → Customer → cart → checkout → Admin order update → graceful failure.

## Slide 8 — What We Learned
Discuss request/response flow, validation, error handling, code review, QA, deployment, and responsible AI-assisted development.

## Slide 9 — Closing
State the final value of the system and thank the reviewers.
