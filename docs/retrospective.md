# FOODHUB Team Retrospective — Week 12

## What went well

- The project evolved from a basic scaffold into a CRUD web application with Admin and Customer workflows.
- The team established a route → validation → controller → service/data → response structure.
- The interface gained reusable loading, empty, not-found, error, and success feedback.
- Async form binding connects the interface to backend controllers without full-page reloads.
- Automated tests and pull requests provided a repeatable safety net.
- QA planning created a structured way to test happy, boundary, invalid, empty, permissions, and adversarial scenarios.

## What did not go well

- Some early code paths were duplicated or stubbed and required architectural cleanup.
- Browser/manual QA cannot be replaced by automated tests alone.
- Deployment readiness required careful environment configuration and awareness of datastore persistence limits.
- Evidence across branches, commits, board ownership, and reviews needs discipline.

## What we would change next time

- Establish the final architecture earlier.
- Define ownership and branch naming at the start of each week.
- Add critical-path tests alongside each feature.
- Perform manual QA earlier and keep the bug tracker current.
- Choose a production-persistent datastore earlier for a long-term public system.

## Concrete lessons

1. A working happy path is not enough; failure paths need visible behavior.
2. Server validation remains essential even when the client provides friendly checks.
3. Reusable components make consistency easier to maintain.
4. AI can speed up scaffolding, but generated code still needs review.
5. Release readiness includes configuration, testing, deployment, and evidence.

## Blameless rule

Focus on systems, decisions, and lessons rather than individual blame.
