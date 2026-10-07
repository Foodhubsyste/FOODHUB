# Deliverable 3 — Interface & View Binding

**Weight:** 30%  
**Due:** End of Week 8  
**Phase:** 3 — AI ON

## Purpose

Deliver a fully interactive local FOODHUB application where CRUD operates end to end, views are built from reusable components, forms are bound to the Phase 2 controllers, and loading/success/failure states are handled consistently.

This deliverable spans Weeks 6–8.

## Team Artifact

### 1. Views and states

FOODHUB includes:

- Admin dashboard
- Admin menu list and create/edit forms
- Admin customer list and create/edit forms
- Admin order list and update form
- Admin sales view
- Customer menu view
- Customer cart
- Customer checkout
- Customer order history
- Empty states
- Loading states
- Error states
- Not-found state

Reusable view primitives are documented in `docs/components.md` and implemented in `public/components.js`.

### 2. Forms bound to the backend

Create and Update actions use asynchronous Fetch requests:

| Form | Create | Update |
|---|---|---|
| Menu | POST `/api/menu` | PUT `/api/menu/:id` |
| Customers | POST `/api/customers` | PUT `/api/customers/:id` |
| Orders | POST `/api/orders` from customer checkout | PUT `/api/orders/:id` for admin updates |

The UI does not perform a full-page reload after these operations. Successful requests refresh the affected data.

### 3. Complete feedback handling

The application handles:

- **Loading:** shared loading states and disabled controls while pending.
- **Success:** data refresh plus human-readable confirmation toast.
- **422 validation:** visible field/message feedback using server response metadata.
- **404 not found:** explicit not-found state.
- **500/general failure:** human-readable error.
- **Network failure:** connection message plus Retry where appropriate.

### 4. Helpful and consistent messages

The interface avoids exposing raw technical responses such as stack traces. Validation errors identify the problem field and action. Global failures tell the user what happened and what to do next.

## Individual Artifact

The grading rubric requires verifiable commits connecting each student's assigned screens/components and bindings.

Use `docs/individual-contribution.md` to record:

- Student name
- GitHub account
- Assigned screen/component
- Assigned form binding
- Commit SHA(s)
- Pull request
- Reviewer
- Approval
- Test evidence

The repository history must be used as evidence; do not invent ownership or approval.

## AI Artifact

AI is required in this phase. Prompt logs are maintained under:

- `docs/ai-notes/week-06.md`
- `docs/ai-notes/week-07.md`
- `docs/ai-notes/week-08.md`

The logs distinguish AI-generated, AI-modified, and existing/hand-written work.

## Required supporting documents

- `docs/components.md`
- `docs/feedback-matrix.md`
- `docs/binding-tests.md`
- `docs/feedback-tests.md`
- `docs/ai-notes/week-06.md`
- `docs/ai-notes/week-07.md`
- `docs/ai-notes/week-08.md`

## Definition of Done

- [x] Create, read, update, and delete workflows are implemented in the application.
- [x] Required screens and states are represented in the UI.
- [x] Create/Update forms use asynchronous controller requests.
- [x] Loading feedback is present for asynchronous data operations.
- [x] Pending controls are disabled to reduce duplicate submissions.
- [x] 422, 404, 500/general, and network failures have visible handling.
- [x] Messages are human-readable and consistent.
- [x] AI prompt logs are present and attributed.
- [x] Supporting Week 6–8 documentation is present.

## Evidence still required from the team

The specification includes individual ownership, board evidence, reviewed PRs, manual end-to-end testing, and merge controls. This document does not falsely claim those human/board checks were completed by the assistant.

Before final submission, attach the real:

1. Student-owned commits.
2. Board/ticket ownership.
3. Peer review comments and approval.
4. Manual create/update/delete test results.
5. Final green test result.
6. Branch protection/review evidence when required by the instructor.

## Grading alignment

The team portion is primarily supported by the running CRUD application, complete states, async binding, failure handling, and consistent feedback.

The individual portion requires evidence from actual Git commits, prompt logs, assigned work, and contribution ownership. A student without verifiable contribution evidence can lose the individual points even when the team application works.
