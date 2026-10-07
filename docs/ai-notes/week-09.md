# Week 9 AI Prompt Log — FOODHUB

Week 9 keeps AI ON, but this week the AI-generated output is the thing being reviewed.

## Key prompts

| Prompt | Result | Attribution |
|---|---|---|
| "Add a small, low-risk improvement to FOODHUB that can be peer-reviewed against correctness, readability, consistency, security, and tests." | Week 9 contribution | AI-assisted, reviewed |
| "Create a peer-review checklist for FOODHUB." | docs/review-checklist.md | AI-generated, then reviewed |
| "Generate intentionally flawed examples involving missing validation, incorrect status codes, unhandled 404/500 failures, hallucinated methods, and missing edge cases." | docs/find-the-flaw.md | AI-generated, then reviewed |
| "Create regression tests for the Week 9 review artifacts and security patterns." | week9.test.js | AI-assisted, then reviewed |

## Attribution

### AI-assisted
- Review checklist and flaw-analysis examples.
- Week 9 regression test.
- Small contribution included in the PR.

### Existing / hand-written project code
- FOODHUB Week 5–8 backend and frontend behavior.
- Existing controllers, validation middleware, API response helpers, and UI components.

## Review principle

AI output should be treated as reviewable code, not as automatically correct code. The Week 9 workflow is: generate → inspect → comment → fix → approve → merge.
