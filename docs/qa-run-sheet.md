# Week 10 — Manual QA Run Sheet

Feature freeze is in effect for this lab. The purpose of this sheet is to execute the test matrix, record evidence, and triage defects rather than immediately fixing them.

## Before testing
- Start the local application.
- Use a clean test database or a restorable backup.
- Record browser and environment.
- Confirm the automated test suite is green before the manual pass.

## Pass sequence
1. Authentication and permissions.
2. Menu CRUD.
3. Customer CRUD.
4. Customer cart and checkout.
5. Order management.
6. Sales/dashboard.
7. Empty and nonexistent-record states.
8. Adversarial inputs and network-off/slow tests.

## For every failure
Capture the screen/action, exact reproduction steps, expected result, actual result, and severity P0/P1/P2. File the bug in the tracker and link the issue from the test notes.

## Feature-freeze rule
Do not use the Week 10 QA pass to silently fix defects. The handoff is a clean, triaged bug list for the next week's work.
