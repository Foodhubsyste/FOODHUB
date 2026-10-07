# Week 11 Deliverable — Fix, Clean Up & Ship

## Goal

Use the Week 10 triaged bug list to fix serious defects, pay down a small amount of technical debt, harden production configuration, and prepare FOODHUB for a live deployment.

## Completed in this release branch

- [x] Centralized production configuration
- [x] Production requires explicit admin credentials
- [x] Configurable JSON data-file path
- [x] Tracked `.env.example` while keeping real env files ignored
- [x] Generic web process entrypoint
- [x] Deployment notes
- [x] Release checklist
- [x] Week 11 AI prompt log
- [x] Week 11 regression test scaffold
- [x] Repeatable production smoke-test script
- [x] Docker deployment image
- [x] P1 CI test-harness bug tracked as GitHub Issue #32
- [x] P1 dependency-audit finding tracked as GitHub Issue #33

## Deliberately not falsely claimed

The Week 11 lab also requires:
- actual P0/P1 bugs from the Week 10 triage to be reproduced and fixed on dedicated reviewed branches,
- a real deployment to a public host,
- live migration/schema work where applicable,
- live smoke tests,
- green release evidence.

Those runtime/team actions are not claimed completed by this repository change.

## Current datastore

FOODHUB currently uses a JSON file instead of a relational migration-based database. The deployment documentation records this as not applicable for migrations and warns that a host's filesystem may not be durable.

## Release evidence

Fill in the provider, URL, release commit, deployment date, smoke-test results, and reviewed PR links in `docs/deployment.md` after the actual release.

## Release security follow-up

The CI audit reported 22 dependency vulnerabilities (19 moderate, 3 high). GitHub Issue #33 tracks the required advisory review and safe dependency update process.

## Next step

Take the P0/P1 issues found during the Week 10 manual QA session, fix each on a small branch, add a regression test, obtain review, and merge only with a green suite.
