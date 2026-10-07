# Week 10 AI Prompt Log — FOODHUB

Week 10 allows AI for test scaffolding, but the team designs the QA and performs the manual bug hunt.

## Key prompts

| Prompt | Result | Attribution |
|---|---|---|
| "Create a feature-by-scenario QA matrix for the FOODHUB menu, customer, cart, checkout, order, sales, auth, and failure states." | docs/test-matrix.md | AI-assisted, then reviewed |
| "Create a manual QA run sheet for happy, boundary, invalid, empty, permissions, and adversarial scenarios." | docs/qa-run-sheet.md | AI-generated, then reviewed |
| "Create a concise bug report template using title, reproduction steps, expected vs actual, and P0/P1/P2 severity." | docs/bug-report-template.md | AI-generated, then reviewed |
| "Add automated tests for critical FOODHUB paths identified by the Week 10 matrix without making feature changes." | week10.test.js | AI-assisted, then reviewed |

## Attribution

### AI-generated / AI-assisted
- QA matrix scaffolding.
- QA run sheet.
- Bug report template.
- Week 10 critical-path regression tests.

### Existing project code
- FOODHUB application features, controllers, validation, services, and frontend behavior.

## Review responsibility
The team must perform the manual QA pass and record real PASS/FAIL outcomes. AI-assisted test scaffolding does not substitute for the required manual bug-hunting session.
