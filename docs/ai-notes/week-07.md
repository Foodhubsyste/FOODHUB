# Week 7 AI Prompt Log — FOODHUB

**AI mode:** ON — required this week.

Week 7 requires AI to scaffold the Fetch/async binding, followed by review and prompt logging.

## Key prompts

| Prompt | Result | Attribution |
|---|---|---|
| "Review the existing FOODHUB vanilla JS forms and bind Create and Update submissions asynchronously to the existing POST and PUT controller endpoints." | Form submission wiring | AI-generated, then reviewed |
| "Preserve standardized API error metadata so a 422 response can show its field and message in the form." | Enhanced api() error handling | AI-generated, then reviewed |
| "Disable the submit button while an async form request is pending and restore it in finally." | Pending-state behavior | AI-generated, then reviewed |
| "After successful Create or Update, refresh the relevant list and show a confirmation." | Success lifecycle | AI-generated, then reviewed |
| "Add visible handling for 422 and general/network errors without changing the backend contract." | Form error areas and toast handling | AI-generated, then reviewed |
| "Create Week 7 regression tests for Create/Update Fetch bindings and async lifecycle requirements." | week7.test.js | AI-generated, then reviewed |

## Attribution

### AI-generated / AI-assisted
- Week 7 async form-binding scaffolding.
- API error metadata handling.
- Pending/success/error UI wiring.
- Week 7 regression tests.
- Week 7 documentation.

### Existing / hand-written project code
- FOODHUB backend controllers and validation from Week 5.
- Existing Week 6 views and component library.
- Existing menu, customer, order, and checkout business rules.

## Review responsibility

The team must review the generated code and be able to explain the request/response lifecycle, pending state, success state, and 422/general error handling during demonstration.
