# Week 6 Deliverable — Building Your Views

## Goal

Translate the FOODHUB wireframes into working HTML/CSS views using reusable components, semantic HTML, dynamic values, and reachable empty/loading/error states.

Week 6 is AI ON and required. The instructor notes require prompt logs, and the lab expects working HTML/CSS views for every screen plus the three data states.

## Completed implementation

- [x] Reusable component helper in public/components.js
- [x] Component-to-screen map in docs/components.md
- [x] Semantic table headers and reusable table rendering
- [x] Dashboard stat component
- [x] Loading state
- [x] Empty state
- [x] Error state
- [x] Admin views: Dashboard, Menu, Customers, Orders, Sales
- [x] Customer views: Menu, Cart, Checkout, Order History
- [x] Create/edit forms through existing modal views
- [x] Pickup/delivery conditional checkout UI
- [x] Responsive HTML/CSS views
- [x] Automated Week 6 view regression tests
- [x] Mandatory AI prompt log in docs/ai-notes/week-06.md

## State rules

- Loading: shown before a data request resolves.
- Empty: shown when a list has zero records.
- Error: shown when a data request fails.
- Success/data: rendered when data is available.

The lab explicitly says these states are part of the wireframe contract, not optional polish.

## Component structure

public/components.js owns reusable view primitives while public/app.js supplies FOODHUB data and event behavior. This keeps rendering concerns separate from API calls and user actions without introducing a framework.

## AI disclosure

AI was used because Week 6 explicitly requires it. The key prompts and attribution labels are recorded in docs/ai-notes/week-06.md.

## Review checklist

- [x] Every required FOODHUB screen has a rendered view.
- [x] Reusable pieces are identified and reused.
- [x] Semantic HTML is used for forms, buttons, and tables.
- [x] Empty/loading/error states are reachable.
- [x] AI prompt log is committed.
- [x] Changes are submitted through a pull request.

## Note

This document records implementation work; it does not claim an instructor observation or grading checkpoint that was not explicitly confirmed.
