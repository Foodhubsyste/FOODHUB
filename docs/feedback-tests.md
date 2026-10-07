# Week 8 — Feedback & Failure Test Results

## Automated checks

| Failure/feedback requirement | Result |
|---|---|
| Shared loading component exists | PASS |
| Shared empty component exists | PASS |
| Shared not-found component exists | PASS |
| Shared error component exists | PASS |
| Async API preserves HTTP status and field | PASS |
| 422 errors remain visible in forms | PASS |
| 404 gets a not-found state | PASS |
| Network/general errors offer Retry | PASS |
| Delete actions require confirmation | PASS |
| Delete controls are disabled while pending | PASS |
| User-facing messages avoid raw status codes | PASS |
| Loading/success/error feedback is documented | PASS |

## Manual failure-path checks required by the lab

Perform these against the running FOODHUB application:

1. Submit invalid menu/customer/order data and verify an inline 422 message.
2. Request a record that does not exist and verify a not-found state.
3. Temporarily make the API unavailable and verify a general error plus Retry.
4. Click Delete and verify the confirmation prompt appears.
5. While a request is pending, verify the submit/delete control is disabled.
6. Restore the API and use Retry; verify the view recovers.

The manual checks above are documented as required verification. This file does not claim that an instructor-observed or browser execution occurred in this environment.
