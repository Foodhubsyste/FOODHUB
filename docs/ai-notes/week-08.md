# Week 8 AI Prompt Log — FOODHUB

**AI mode:** ON — required.

Week 8 requires AI-assisted scaffolding, review, and prompt logging.

## Key prompts

| Prompt | Result | Attribution |
|---|---|---|
| "Create a shared feedback helper for FOODHUB loading, empty, not-found, and error states." | `public/components.js` feedback helpers | AI-generated, then reviewed |
| "Make API failures preserve HTTP status and convert 404/network failures into helpful user-facing messages." | `friendlyError()` and retry handling | AI-generated, then reviewed |
| "Add Retry behavior to failed list loads without leaving a blank screen." | Retry toasts and error states | AI-generated, then reviewed |
| "Make destructive delete actions confirm first and prevent duplicate requests." | Delete feedback | AI-generated, then reviewed |
| "Create a Week 8 feedback matrix covering create/read/update/delete/load." | `docs/feedback-matrix.md` | AI-generated, then reviewed |
| "Create Week 8 failure-path regression tests and documentation." | `week8.test.js` and `docs/feedback-tests.md` | AI-generated, then reviewed |

## Attribution

### AI-generated / AI-assisted
- Shared Week 8 feedback helpers.
- Friendly error mapping and Retry behavior.
- Delete pending/confirmation behavior.
- Week 8 regression tests and documentation.

### Existing / hand-written project code
- FOODHUB backend controllers, validation, services, and API response shape.
- Existing Week 6 component structure.
- Existing Week 7 asynchronous form bindings and business rules.

## Review responsibility

The team remains responsible for reviewing and explaining why 422, 404, 500, and network failures use different UI responses, and why pending controls are disabled.
