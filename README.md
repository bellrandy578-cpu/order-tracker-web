# Angular Orders App – Frontend

A modern **Angular 20+ standalone** application that displays a list of orders with full detail views, including order status and status change history.  
Built with **reactive patterns**, **error handling**, **sequential API calls**, and **clean, responsive UI**.

---

## Features

- **Orders List Page** – Shows all orders in a card layout with:
  - Order ID
  - Product name
  - Current status
  - Order date
  - Amount
- **Order Detail Page** – Shows:
  - Full order info (same as list)
  - Complete **status change history**
  - Loading states
  - Per-API-call **error handling** with **Retry** buttons
- **Sequential API Calls** – As required:
  1. `GET /orders/{id}`
  2. `GET /orders/{id}/history`
- **Type-safe models** and **reactive streams** using `async` pipe
- **Standalone components** (no `NgModule`)
- **Modern Angular patterns**: `inject()`, `switchMap`, `BehaviorSubject`

---

## Tech Stack

| Layer | Technology |
|------|------------|
| Framework | Angular 20+ (standalone) |
| Language | TypeScript |
| HTTP | `HttpClient` with `provideHttpClient()` |
| Routing | Angular Router |
| Styling | CSS (scoped per component + global) |
| Backend | .NET Web API (assumed running locally) |

---

## Project Structure
