# Week 11 AI Prompt Log — FOODHUB

Week 11 is AI ON. AI may scaffold fixes and deployment/configuration work, but release changes must be reviewed especially carefully.

## Key prompts

| Prompt | Result | Attribution |
|---|---|---|
| "Review FOODHUB production configuration and prevent demo admin credentials from being silently used in production." | config.js + production guard | AI-assisted, then reviewed |
| "Make the FOODHUB JSON data file location configurable through an environment variable." | configurable DATA_FILE | AI-assisted, then reviewed |
| "Create a Week 11 deployment checklist and smoke-test plan for the current Node/Express JSON datastore." | deployment.md + release checklist | AI-generated, then reviewed |
| "Create critical-path regression tests for the new production configuration behavior." | week11.test.js | AI-assisted, then reviewed |
| "Create a repeatable production smoke-test script using Node Fetch for health, auth, menu CRUD, 422, and 404 checks." | scripts/smoke-test.js | AI-assisted, then reviewed |
| "Create a P1 bug record for the failing browser-context regression tests and document the fix path." | docs/bug-list.md + Issue #32 | AI-assisted, then reviewed |

## Attribution

### AI-assisted
- Production configuration cleanup.
- Environment example.
- Deployment/release documentation.
- Regression test scaffolding.
- Production smoke-test scaffolding.
- CI test-harness bug documentation.

### Existing project code
- FOODHUB CRUD implementation.
- Week 5–10 controllers, validation, frontend, QA artifacts, and business rules.

## Review responsibility

The release must be reviewed for correctness and security before deployment. Manual live smoke testing must be performed by the team; AI-generated documentation does not count as runtime evidence.
