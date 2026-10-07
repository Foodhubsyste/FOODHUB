# Week 7 — Form Binding Test Results

## Scope

Week 7 connects FOODHUB forms to backend controllers using asynchronous requests. The lab requires Create persistence, Update persistence, visible 422 errors, and visible general/network errors.

## Automated binding checks

| Check | Result |
|---|---|
| Create forms use POST for new records | PASS — verified by Week 7 regression test |
| Update forms use PUT with record ID | PASS — verified by Week 7 regression test |
| Forms call preventDefault() | PASS — verified by Week 7 regression test |
| Submit buttons are disabled while pending | PASS — verified by Week 7 regression test |
| Loading labels are shown while submitting | PASS — verified by Week 7 regression test |
| 422 errors can display the returned field | PASS — API error metadata is preserved |
| General/network errors remain visible | PASS — form error area + toast |
| Successful create refreshes the list | PASS — loadAdmin/loadCustomer is called after success |
| Successful update refreshes the list | PASS — loadAdmin is called after success |

## Required browser end-to-end checks

The lab asks the team to create a record through the UI, edit it, and submit invalid data. These are manual checks to perform in the running application:

1. Open FOODHUB and sign in as Admin.
2. Open Menu and create a valid menu item.
3. Confirm the new item appears in the list.
4. Edit that item and change its price/stock.
5. Confirm the updated value appears after saving.
6. Submit invalid menu data, such as an empty name or zero/negative price.
7. Confirm the validation message is visible in the form.
8. Open Customers and repeat Create/Update.
9. Open Orders and update an order.
10. Confirm the order list refreshes after success.

## Expected async lifecycle

**Pending:** submit button becomes disabled and its label changes to a loading action.

**Success:** the modal closes, the relevant data is reloaded, and a confirmation toast appears.

**422:** the form remains open and displays the server validation error, including its field when provided.

**500/network:** the form remains usable and displays a general error instead of silently failing.

## Important

Client-side validation is only a user-experience convenience. The server-side controller/validation layer remains the real validation gate.
