# Week 9 — Peer Review Checklist

Use this checklist when reviewing a teammate's AI-assisted PR.

## Correctness
- [ ] Happy path works
- [ ] Edge cases handled
- [ ] 422/404/500/network paths handled where applicable
- [ ] Status codes are correct

## Readability
- [ ] Names are descriptive
- [ ] Structure is understandable
- [ ] Duplicated logic is avoided

## Consistency
- [ ] Standard response envelope is followed
- [ ] Shared UI feedback patterns are reused
- [ ] Existing validation approach is followed

## Security
- [ ] Server-side validation is present
- [ ] User-controlled HTML is escaped
- [ ] No secrets are committed
- [ ] Destructive actions use confirmation where needed

## Tests
- [ ] Meaningful assertions exist
- [ ] Failure and edge paths are covered
- [ ] Tests verify behavior

## Review result
Reviewer:
PR:
Date:
Blocking findings:
Nit findings:
What the code did well:
Approval decision:
