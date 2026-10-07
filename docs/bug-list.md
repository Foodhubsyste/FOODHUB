# FOODHUB Bug List — Week 10/11

## P1 — CI browser-context test failure

**Title:** Week 6 and Week 8 component tests fail because browser globals are not available in the Jest Node context.

**Reproduction:**
1. Run `npm install`.
2. Run `npm test`.
3. Observe failures in `week6.test.js` and `week8.test.js`.

**Expected:** The test suite should execute all regression tests successfully.

**Actual:** The component tests attempted to execute browser-oriented code with `vm.runInThisContext`, producing `ReferenceError: window is not defined`.

**Severity:** P1 — the regression suite cannot be considered release-ready while required tests fail.

**Fix:** Run the component source inside an explicit VM context containing a `window` object.

**Verification:** The final release branch contains the corrected test harness. GitHub Actions must be rerun and show green before this issue is considered closed.

**Tracker:** GitHub Issue #32.

## Dependency audit finding

The CI `npm install` audit reported 22 vulnerabilities (19 moderate, 3 high). The exact transitive advisories need to be reviewed with the package manager before changing dependency versions. Track this as release security debt rather than applying an unverified blanket upgrade.

## Manual QA bugs

No additional P0/P1 manual QA bugs are recorded here because the Week 10 matrix requires actual team-run browser evidence. Add real defects discovered during that session rather than inventing them.
