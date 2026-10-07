# Deliverable 4 — QA, Deployment & Final Presentation

**Weight:** 30%  
**Due:** End of Week 12  
**Phase:** 4

## Purpose

Package the final evidence for a tested, bug-resistant FOODHUB application, live deployment, professional presentation, retrospective, and individual unassisted code defense.

This deliverable spans Weeks 9–12.

## Team artifact

### 1. Deployed application

The final submission must provide a live public URL where CRUD works end to end and failures are handled gracefully. The repository now also includes a repeatable production smoke test in `scripts/smoke-test.js` and a Dockerfile for deployment preparation.

**Live URL:** ______________________________

**Host/provider:** __________________________

**Release commit:** _________________________

### 2. Quality evidence

Required evidence includes:

- Week 10 feature × scenario test matrix.
- Expanded automated tests.
- Worked-down P0/P1 bug list.
- Week 11 deployment notes.
- Live happy-path and failure-path smoke tests.

Current repository files include:

- `docs/test-matrix.md`
- `docs/feedback-tests.md`
- `docs/deployment.md`
- `docs/RELEASE_CHECKLIST.md`

Do not mark runtime results PASS unless the team actually executed them.

### 3. Professional presentation

The presentation should follow the required story:

**Problem → Solution → Architecture → Demo → Lessons**

Preparation files:

- `docs/presentation-outline.md`
- `docs/final-demo-script.md`

The live demo should use the deployed URL, not localhost. Prepare screenshots or a short recording as a backup.

### 4. Retrospective

The team retrospective is documented in:

`docs/retrospective.md`

It focuses on concrete lessons, systems, and decisions rather than individual blame.

## Individual artifact

The individual half requires verifiable contribution across the term:

- Bug-fix commits.
- Meaningful test coverage.
- Week 9 AI-code review participation.
- Board ownership.
- Commit history.
- Individual unassisted oral defense.

Use `docs/individual-contribution.md` to record the evidence for each student.

## Oral defense

The actual oral defense is **individual and unassisted**. Each member must be able to explain and justify their own code, including what happens on invalid input and missing records and where validation lives.

Preparation material is in `docs/defense-guide.md`, but AI should not be used during the actual defense.

## AI disclosure

Prompt logs are maintained throughout the phase:

- `docs/ai-notes/week-09.md`
- `docs/ai-notes/week-10.md`
- `docs/ai-notes/week-11.md`

Week 12 preparation also records the AI-off defense rule.

## Definition of Done checklist

- [ ] App deployed and working at a live public URL.
- [ ] CRUD complete in production.
- [ ] Edge cases/failures handled gracefully.
- [ ] Test matrix complete with real PASS/FAIL results.
- [ ] Automated suite passes.
- [ ] P0/P1 bugs resolved and verified.
- [ ] Professional presentation prepared.
- [ ] Live demo rehearsed.
- [ ] Backup demo evidence prepared.
- [ ] Retrospective completed.
- [ ] Every member completed the unassisted oral defense.
- [ ] Board ownership and commit history corroborate contributions.
- [ ] No secrets committed and production configuration is secure.

## Common final-submission risks

- Demonstrating localhost instead of the deployed application.
- Showing only the happy path.
- Leaving P0/P1 bugs unresolved.
- Failing to provide backup demo evidence.
- Committing secrets or leaving production debug settings enabled.
- A member being unable to explain their own code.

## Honest-evidence rule

This file is a submission package and checklist. It does not invent a public URL, live deployment result, bug-fix completion, peer approval, board ownership, rehearsal completion, or oral-defense completion. Those items must be filled from actual team evidence.
