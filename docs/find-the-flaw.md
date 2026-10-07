# Week 9 — Find the Flaw

The Week 9 lab asks the team to review AI-assisted code for correctness, readability, consistency, security, and tests, then document planted flaws such as missing validation, wrong status codes, unhandled 404/500 cases, hallucinated methods, and missing edge cases.

## Review examples

### 1. Missing validation
Problem: a create endpoint trusts client data and writes it directly.

Why: client-side validation can be bypassed.

Fix: validate on the server before controller logic.

Severity: Blocking.

### 2. Wrong status code
Problem: successful creation returns 200 instead of 201.

Why: the API contract becomes ambiguous.

Fix: return 201 for successful creation and keep the standard response envelope.

Severity: Blocking.

### 3. Unhandled 404
Problem: a missing record leaves a blank UI.

Why: users cannot tell whether data is missing or the request failed.

Fix: render an explicit not-found state.

Severity: Blocking.

### 4. Unhandled 500/network failure
Problem: only the success branch is handled.

Why: failures become silent.

Fix: show a human-readable error and provide Retry where appropriate.

Severity: Blocking.

### 5. Missing edge-case coverage
Problem: tests cover only one happy path.

Why: invalid quantities, missing fields, and nonexistent IDs can still fail.

Fix: add validation, failure, and edge-case tests.

Severity: Blocking.

### 6. Technical error leakage
Problem: raw status codes, stack traces, or internal exception text reach the interface.

Why: confusing for users and may expose implementation details.

Fix: map failures to specific, actionable messages.

Severity: Blocking.

## Example review comments

**Blocking:** This path does not handle a 404 response. Please render the shared not-found state so the missing record is visible.

**Blocking:** The server accepts the payload without validation. Please route it through server-side validation before controller logic.

**Nit:** Consider a more descriptive helper name so the feedback responsibility is immediately clear.

## Positive feedback example

The existing FOODHUB implementation already has server-side validation middleware, standardized API responses, shared UI helpers, and regression coverage. Those patterns should be preserved when reviewing new changes.

## Important

These are review exercises/examples. This document does not claim that an instructor-provided planted bug or a teammate's PR was actually reviewed here.
