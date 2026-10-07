# Week 8 Deliverable — Error Handling & User Feedback

## Goal

Make every FOODHUB action behave consistently when it loads, succeeds, or fails. Week 8 completes the Interface & View Binding milestone by making failures visible and actionable.

## Completed implementation

- [x] Feedback matrix in `docs/feedback-matrix.md`
- [x] Shared loading/empty/not-found/error helpers
- [x] Consistent toast feedback
- [x] 422 field-level errors remain visible
- [x] 404 not-found state
- [x] General/server failure message
- [x] Network failure message with Retry
- [x] Loading states for list requests
- [x] Disabled controls while async submissions are pending
- [x] Confirmation before destructive deletes
- [x] Delete retry behavior
- [x] Helpful user-facing messages without raw status codes or stack traces
- [x] Week 8 regression tests
- [x] Failure-path test checklist in `docs/feedback-tests.md`
- [x] AI prompt log in `docs/ai-notes/week-08.md`

## Required failure categories

**422 Validation:** display the field and message returned by the backend.

**404 Not Found:** display a clear not-found state.

**500 Server Error:** display a general, human-readable failure.

**Network Error:** display a connection message and provide Retry.

## UX consistency

The same feedback approach is used across the app:
- Inline field message for validation.
- Toast for global success/failure.
- Shared loading state or disabled control while pending.
- Not-found state for missing records.
- Confirmation before destructive actions.

## Manual verification

The lab requires deliberate failure testing. The exact checks are in `docs/feedback-tests.md`. They must be performed in the running local application before claiming the manual test requirement as completed.

## AI disclosure

Week 8 is AI ON. Prompts and attribution are recorded in `docs/ai-notes/week-08.md`.
