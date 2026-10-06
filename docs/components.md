# Week 6 — FOODHUB Component Map

Week 6 turns the Week 2 wireframes into rendered views. The lecture describes a component as a self-contained, reusable chunk of UI such as a card, form, navigation bar, list row, or status badge. See the Week 6 lecture notes, Part B.

## Shared component library

'public/components.js' provides reusable vanilla-JavaScript view components:

| Component | Purpose | Used by |
|---|---|---|
| loadingState() | Loading state while data is being requested | Admin and Customer data views |
| emptyState() | Empty list/message state | Tables, cart, customer orders |
| errorState() | Error state when a view cannot load | Admin and Customer data views |
| badge() | Consistent status/fulfillment badges | Orders and sales |
| table() | Reusable semantic table wrapper | Menu, customers, orders, sales, order history |
| stat() | Dashboard metric card | Admin dashboard |

## Screen → component map

### Entry and authentication
- Welcome screen
- Role selection
- Admin login form
- Customer entry form
- Shared button/input/form styles

### Admin screens
- Dashboard: hero, stat cards, recent-order rows, stock-alert rows
- Menu list: search/filter toolbar, reusable table, create/edit form modal
- Customers list: search toolbar, reusable table, create/edit form modal
- Orders list: search/filter toolbar, reusable table, order detail/update modal
- Sales list: reusable summary cards and table

### Customer screens
- Menu: reusable food cards and search
- Cart: reusable cart row and quantity controls
- Checkout: reusable form controls and pickup/delivery conditional field
- Order history: reusable table and fulfillment badges

## State coverage

Every data-driven list has a defined empty state. Week 6 also adds explicit loading and error components so a failed or delayed request does not leave a blank screen. The lab requires empty, loading, and error states to be rendered and reachable.

## Structure-first rule

The views use semantic headings, forms, buttons, tables, thead/tbody, and table header scopes before visual polish, matching the Week 6 guidance to use semantic HTML and style lightly.

## Week 7 boundary

Week 6 uses the existing API through the app's current loading functions, but the deliverable remains focused on view structure, components, and UI states. Real create/update binding and richer Fetch/Axios interaction are the next-week focus described by the lab.
