# Week 7 Deliverable — Form Submission & Asynchronous Operations

## Goal

Connect the Week 6 interface to the FOODHUB backend so Create and Update forms send data asynchronously, persist records, and visibly handle loading, success, and error states.

## Completed implementation

- [x] Create forms submit asynchronously with Fetch
- [x] Update forms submit asynchronously with Fetch
- [x] preventDefault() prevents full-page reloads
- [x] Submit buttons are disabled while requests are pending
- [x] Loading labels provide visible pending feedback
- [x] Successful Create/Update refreshes the affected UI
- [x] 422 responses display visible validation errors
- [x] General/network failures remain visible
- [x] Existing standardized API response shape is preserved
- [x] Week 7 regression tests added
- [x] /docs/binding-tests.md added
- [x] /docs/ai-notes/week-07.md added

## FOODHUB bindings

### Create
- Menu Create → POST /api/menu
- Customer Create → POST /api/customers
- Customer order checkout → POST /api/orders

### Update
- Menu Edit → PUT /api/menu/:id
- Customer Edit → PUT /api/customers/:id
- Order Update → PUT /api/orders/:id

## Async lifecycle

1. **Pending:** disable submit and show an action such as Creating..., Updating..., or Placing order....
2. **Success:** close/clear the form, reload data, and show confirmation.
3. **422:** keep the form open and show the server-provided validation message/field.
4. **General/network error:** keep the interface usable and show a visible error.

## Security/validation note

Client-side validation is UX only. The backend remains responsible for validation and business rules.

## Manual E2E requirement

The lab requires the team to actually create, edit, and submit invalid data through the running UI. docs/binding-tests.md records the exact manual checks; it does not falsely claim an observed manual run that was not performed in this environment.

## AI disclosure

Week 7 is AI ON. Prompts and attribution are recorded in docs/ai-notes/week-07.md.
