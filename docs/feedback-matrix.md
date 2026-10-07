# Week 8 — FOODHUB Feedback Matrix

Week 8 requires every action to have loading, success, and error feedback.

| Action | Loading | Success | Error |
|---|---|---|---|
| Load admin data | Shared loading states | Dashboard/list renders | Error state + Retry |
| Load customer menu/orders | Shared loading states | Menu/order history renders | Error state or Not Found + Retry |
| Create menu | Disabled button + Creating... | List refresh + success toast | Inline 422 + helpful toast |
| Update menu | Disabled button + Updating... | List refresh + success toast | Inline 422 / not-found / general error |
| Delete menu | Disabled control while request runs | List refresh + success toast | Helpful error + Retry |
| Create customer | Disabled button + Creating... | List refresh + success toast | Inline 422 + helpful toast |
| Update customer | Disabled button + Updating... | List refresh + success toast | Inline 422 / not-found / general error |
| Delete customer | Confirmation + disabled control | List refresh + success toast | Helpful error + Retry |
| Update order | Disabled button + Updating... | List refresh + success toast | Inline 422 / not-found / general error |
| Place customer order | Disabled button + Placing order... | Cart clears + refresh + toast | Inline validation/general error |

## Error categories

- 422: show the server field/message in the form.
- 404: show a clear not-found state instead of a blank area.
- 500: show a human-readable failure message.
- Network: show a connection message and offer Retry.

## Consistency rule

The shared `public/components.js` helper provides reusable loading, empty, not-found, error, table, badge, and stat views. Global outcomes use the shared toast pattern.
