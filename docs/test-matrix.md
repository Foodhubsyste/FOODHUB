# Week 10 — FOODHUB Manual QA Test Matrix

Week 10 is a feature-freeze QA pass. The lab asks the team to test every feature across happy, boundary, invalid, empty, and permissions scenarios and save the matrix here.

## Status key
- PASS = manually verified by the team.
- FAIL = manually verified and a defect was observed.
- PENDING = not yet executed in the running browser by the team.

No manual result is claimed here unless it has actually been executed.

| Feature | Happy | Boundary | Invalid | Empty | Permissions |
|---|---|---|---|---|---|
| Admin login | PENDING | PENDING | PENDING | N/A | PENDING |
| Customer registration/session | PENDING | PENDING | PENDING | N/A | PENDING |
| Menu list/search/filter | PENDING | PENDING | PENDING | PENDING | PENDING |
| Menu create | PENDING | PENDING | PENDING | N/A | PENDING |
| Menu update | PENDING | PENDING | PENDING | N/A | PENDING |
| Menu delete | PENDING | PENDING | PENDING | N/A | PENDING |
| Customer list/search | PENDING | PENDING | PENDING | PENDING | PENDING |
| Customer create | PENDING | PENDING | PENDING | N/A | PENDING |
| Customer update | PENDING | PENDING | PENDING | N/A | PENDING |
| Customer delete | PENDING | PENDING | PENDING | N/A | PENDING |
| Customer cart | PENDING | PENDING | PENDING | PENDING | N/A |
| Pickup checkout | PENDING | PENDING | PENDING | N/A | N/A |
| Delivery checkout | PENDING | PENDING | PENDING | N/A | N/A |
| Order list | PENDING | PENDING | PENDING | PENDING | PENDING |
| Order update/status | PENDING | PENDING | PENDING | N/A | PENDING |
| Sales list/dashboard | PENDING | PENDING | PENDING | PENDING | PENDING |
| 404/nonexistent record | PENDING | PENDING | PENDING | PENDING | PENDING |
| Network-off/slow request | PENDING | PENDING | PENDING | N/A | N/A |

## Adversarial scenarios from the lab
1. Huge numeric values.
2. Emoji and unusual text.
3. Empty fields.
4. HTML/script-like text.
5. Double-click submit.
6. Back button or refresh during a pending request.
7. Direct URL for a nonexistent record.
8. Action on a record immediately after deletion.
9. Offline or slow network.

## QA evidence
For every FAIL, create a bug entry with:
- Title
- Reproduction steps
- Expected result
- Actual result
- Severity: P0 / P1 / P2

Do not mark a cell PASS until the team has actually exercised it in the running application.
