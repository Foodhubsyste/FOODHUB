# FOODHUB Oral Defense Practice — Week 12

IMPORTANT: The official Week 12 handout requires the oral defense to be individual and unassisted. This document is preparation material only. During the actual defense, each student explains their own code without AI assistance.

## Questions to rehearse

### What problem does FOODHUB solve?
Explain the ordering and management problem and connect it to the system features.

### What are the main features?
Be able to explain Admin and Customer workflows, menu/customer/order management, inventory behavior, checkout scheduling, and sales.

### Why use asynchronous Fetch requests?
Explain that the page does not need to reload and the UI can show loading, success, and error states while waiting for the controller response.

### Where does validation happen?
Explain the server-side validation middleware and why client-side validation is only a user-experience convenience.

### What happens with invalid input?
Explain the 422 response, field/message metadata, and inline UI feedback.

### What happens when a record does not exist?
Explain the 404 response and the visible not-found state.

### What happens when the server or network fails?
Explain the human-readable general message and Retry behavior.

### Why are submit controls disabled while pending?
Explain that this prevents accidental double-submits.

### How does an order affect stock and sales?
Trace order creation, stock deduction, cancellation restoration, and completed-order sales synchronization.

### Why use controllers and a service layer?
Explain separation of concerns: routes wire requests, validation checks input, controllers coordinate, services handle business/data logic, and response helpers standardize output.

### What would you improve?
Give one honest improvement, such as a persistent production database or deeper browser end-to-end automation.

## Individual ownership
Before defense, each member should know the files they personally changed, their main functions, one edge case, one failure path, and one improvement.

Do not memorize wording. Explain the code in your own understanding.
