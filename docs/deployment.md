# Week 11 — FOODHUB Deployment Notes

## Release goal

Week 11 moves FOODHUB from the local QA stage toward a live public deployment. The lab requires P0/P1 fixes, environment configuration, deployment, migrations, live smoke testing, and recorded deployment notes.

## Current application configuration

FOODHUB uses:
- Node.js + Express
- JSON file storage at `data/db.json` by default
- `PORT` for the host-provided listening port
- `ADMIN_USERNAME` and `ADMIN_PASSWORD` for admin credentials
- Optional `DATA_FILE` to choose a writable data-file location

Production startup now refuses to use the demo admin credentials when `NODE_ENV=production` and explicit admin credentials are missing.

## Environment variables

Set these on the hosting provider:

```
NODE_ENV=production
PORT=<host provided or automatically injected>
ADMIN_USERNAME=<production admin username>
ADMIN_PASSWORD=<strong production password>
DATA_FILE=<optional writable path>
```

Do not commit real passwords or other secrets. `.env.example` documents the configuration without storing real credentials.

## Generic deployment steps

1. Push the reviewed release branch.
2. Provision a Node.js-capable host.
3. Configure the production environment variables in the host dashboard.
4. Build/install dependencies with `npm install`.
5. Start the service with `npm start` or the repository `Procfile`.
6. Confirm the host supplies the listening port through `PORT`.
7. Open the public URL and verify `/api/health`.
8. Run the live smoke-test checklist below.
9. Record the real public URL after deployment.

## Database/migration note

The current FOODHUB implementation uses a JSON file store rather than a relational database migration system. Therefore, there is no migration command to run for the existing schema. The deployment must instead ensure that the configured `DATA_FILE` location is writable and appropriate for the host.

Important: many free/container hosts use ephemeral filesystems. A production deployment that needs durable order/customer history should move the data layer to a managed persistent database before treating the public instance as a permanent system of record.

## Live smoke test

The repository also provides `npm run smoke` using `scripts/smoke-test.js`. Set `BASE_URL`, `SMOKE_ADMIN_USERNAME`, and `SMOKE_ADMIN_PASSWORD` to real production values. The script checks health, authentication, protection, menu read/create/update/delete, 422 validation, and deleted-record 404.

For the final evidence, run the automated smoke test at the **public URL**, then complete the manual browser smoke checks below.

- Admin login succeeds with production credentials.
- Menu can be viewed.
- Create a test menu item.
- Edit the test menu item.
- Delete the test menu item.
- Submit invalid data and verify the 422 feedback is visible.
- Customer can create/session and place a test order.
- Order appears in the admin view.
- Update order status.
- Verify the success feedback is visible.
- Verify `/api/health` returns success.

## Deployment record

**Provider:**  
**Public URL:**  
**Release commit:**  
**Deployment date/time:**  
**Environment variables configured:** Yes / No  
**Health check:** PASS / FAIL  
**Happy-path smoke test:** PASS / FAIL  
**422 failure-path smoke test:** PASS / FAIL  
**Automated smoke test output:**
**Manual browser smoke evidence:**
**Notes:**

Do not mark the runtime checks PASS until they have actually been performed.
