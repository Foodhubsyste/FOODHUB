# Week 10 Deliverable — Manual QA & Bug Hunting

## Goal

Freeze features, systematically test the application, expand critical automated coverage, and produce a clean, triaged bug list for the next week's fixes.

## Included
- [x] Feature-by-scenario manual QA matrix in docs/test-matrix.md
- [x] QA execution run sheet
- [x] Bug report template with P0/P1/P2 severity
- [x] Critical-path automated QA tests
- [x] Week 10 AI prompt log
- [x] README update

## Manual QA requirement
The lab requires the team to run the matrix cell by cell, test adversarial cases, mark pass/fail, and log every observed failure. Those are runtime actions and are therefore not falsely marked completed by this commit.

## Feature-freeze rule
Week 10 is for finding and triaging defects. Defects should be fixed in the following work rather than silently patched during the frozen QA pass.

## Adversarial coverage
Test huge values, unusual text, empty data, script-like input, double-submit, navigation/refresh during a request, nonexistent records, actions on deleted records, and offline/slow network behavior.

## Merge and test evidence
Automated tests should remain green. Manual failures must be documented with reproduction steps and P0/P1/P2 severity.

## Next week
Use the triaged bug list to fix P0/P1 first, pay down technical debt, and prepare deployment.
