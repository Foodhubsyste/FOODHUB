# Week 11/Deliverable 4 — Release Checklist

## Fix
- [ ] P0 bugs fixed and reviewed
- [ ] P1 bugs fixed and reviewed
- [x] CI test-harness P1 fixed in release branch
- [ ] Regression tests added for every manual bug fix
- [x] One technical-debt item paid down: environment configuration cleanup

## Security/configuration
- [ ] Production credentials configured through environment variables
- [ ] No secrets committed
- [ ] Debug disabled in production
- [ ] Writable data path confirmed
- [ ] Dependency audit reviewed and high-severity findings resolved or explicitly accepted
- [ ] GitHub Issue #33 updated with audit result

## Deploy
- [x] Deployment documentation prepared
- [x] Dockerfile prepared
- [x] Repeatable smoke-test script prepared
- [ ] Hosting environment provisioned
- [ ] Production variables configured
- [ ] Application deployed
- [ ] Required schema/migration step completed or documented as not applicable for the current JSON datastore

## Live smoke test
- [ ] Public health endpoint works
- [ ] Admin login works
- [ ] Create works
- [ ] View works
- [ ] Update works
- [ ] Delete works
- [ ] 422 failure is visible
- [ ] Deleted record returns 404
- [ ] Public URL recorded

## Evidence
- [ ] Deployment notes updated with real values
- [ ] Review PRs linked
- [ ] Final test run is green
- [ ] Week 11 prompt log is current
