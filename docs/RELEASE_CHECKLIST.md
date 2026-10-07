# Week 11 — Release Checklist

## Fix
- [ ] P0 bugs fixed and reviewed
- [ ] P1 bugs fixed and reviewed
- [ ] Regression tests added for every fixed bug
- [ ] Technical-debt item completed without introducing a new feature

## Configuration
- [ ] Production credentials configured through environment variables
- [ ] No secrets committed
- [ ] Debug mode disabled for production
- [ ] Writable data path confirmed

## Deploy
- [ ] Hosting environment provisioned
- [ ] Production variables configured
- [ ] Application deployed
- [ ] Required database migration/schema step completed or documented as not applicable for the current JSON datastore

## Smoke test
- [ ] Public health endpoint works
- [ ] Admin login works
- [ ] Create works
- [ ] View works
- [ ] Update works
- [ ] Delete works
- [ ] 422 failure is visible
- [ ] Public URL recorded

## Evidence
- [ ] Deployment notes committed
- [ ] Review PRs linked
- [ ] Final test run is green
- [ ] Week 11 prompt log is current
