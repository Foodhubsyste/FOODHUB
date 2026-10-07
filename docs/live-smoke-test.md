# Week 11/Deliverable 4 — Live Smoke Test

The repository includes `scripts/smoke-test.js` for a repeatable production smoke test. It uses Node 20's built-in Fetch API.

## Run

Set a real deployed URL and production admin credentials in your shell:

```
BASE_URL=https://YOUR-FOODHUB-HOST.example.com SMOKE_ADMIN_USERNAME=your-admin SMOKE_ADMIN_PASSWORD=your-password npm run smoke
```

On Windows PowerShell:

```
$env:BASE_URL="https://YOUR-FOODHUB-HOST.example.com"
$env:SMOKE_ADMIN_USERNAME="your-admin"
$env:SMOKE_ADMIN_PASSWORD="your-password"
npm run smoke
```

## Checks performed

- Health endpoint
- Admin login
- Anonymous protection
- Menu read
- Invalid menu submission → 422
- Menu create
- Menu detail/read
- Menu update
- Menu delete
- Deleted item → 404

The script creates one temporary menu item and removes it after the update test.

## Evidence

Record the command output and real URL in `docs/deployment.md` and `docs/final-evidence.md`.

This script is an automated smoke test. It does not replace the Week 10 manual QA session or the Week 12 individual unassisted defense.
