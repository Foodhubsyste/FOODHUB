# Week 6 AI Prompt Log — FOODHUB

AI mode: ON — required for Week 6.
Project: FOODHUB — Maramag Home Food Pre-Order Manager.

The Week 6 lecture requires a prompt log and asks the team to identify which code is AI-generated, AI-modified, or hand-written. The lab likewise requires the key prompts to be recorded in this file.

## Key prompts used

| Prompt | Result | Attribution |
|---|---|---|
| "Using the existing FOODHUB vanilla JavaScript interface, design a small reusable component helper for loading, empty, error, status badge, table, and dashboard stat states. Keep it accessible and framework-free." | public/components.js scaffold | AI-generated, then reviewed/modified |
| "Review the FOODHUB Week 6 views for semantic HTML and make the reusable table component use scope=col." | Semantic table header improvement | AI-modified, then reviewed |
| "Add explicit loading and error states to the existing admin and customer data-loading functions without changing the API contract." | loadAdmin() and loadCustomer() state handling | AI-generated, then reviewed/modified |
| "Create a Week 6 component map for FOODHUB showing each screen and reusable UI pieces." | docs/components.md | AI-generated, then reviewed |
| "Create a Week 6 prompt log that clearly labels AI-generated, AI-modified, and hand-written work." | This file | AI-generated, then reviewed |

## Attribution summary

### AI-generated / AI-assisted
- public/components.js reusable view helpers.
- Initial component-map documentation.
- Initial Week 6 deliverable documentation.
- Loading/error state scaffolding in public/app.js.
- Week 6 regression tests.

### AI-modified
- Existing FOODHUB frontend integration.
- Semantic table markup.
- Existing state rendering and CSS hooks.

### Hand-written / existing project code
- Existing FOODHUB API behavior and Week 5 logic layer.
- Existing product/menu/order business rules.
- Existing UI content and previously implemented workflow that was retained during Week 6.

## Review responsibility

AI output was reviewed against the Week 6 lecture/lab requirements. The team remains responsible for explaining each component and state in the submitted code, as the instructor notes emphasize that AI-on still requires students to understand and defend the generated markup.
