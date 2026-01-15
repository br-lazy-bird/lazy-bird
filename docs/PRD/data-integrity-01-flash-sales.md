---
title: "Flash Sale Race Condition - Product Requirements Document"
date: 2025-01-15
version: "1.0"
status: "Draft"
---

# Flash Sale Race Condition - PRD v1.0

## 1. Purpose

A deliberately broken flash sale application teaching engineers how to identify and fix race conditions. Users click "Buy Now" once but see duplicate orders created - they must diagnose and fix the concurrency bug.

See `design-docs/data-integrity-01-flash-sales.md` for technical architecture details.

## 2. Target Users

- Software engineers preparing for technical interviews
- Developers learning database concurrency patterns
- Hiring managers evaluating candidates

## 3. Functional Requirements

### 3.1 Product Display

| ID | Requirement |
|----|-------------|
| FR-01 | Display "The State and Revolution" by V.I. Lenin (1917), $9.99 |
| FR-02 | Show current stock quantity (must display negative values when bug occurs) |

### 3.2 Purchase Flow

| ID | Requirement |
|----|-------------|
| FR-03 | "Buy Now" button triggers purchase with built-in retry mechanism |
| FR-04 | Broken state: single click creates 2 orders, inventory becomes -1 |
| FR-05 | Fixed state: single click creates 1 order, inventory becomes 0 |

### 3.3 Orders Display

| ID | Requirement |
|----|-------------|
| FR-06 | List all orders with ID, product name, and timestamp |
| FR-07 | Timestamps must show millisecond precision |

### 3.4 Reset

| ID | Requirement |
|----|-------------|
| FR-08 | "Reset" button deletes all orders and restores inventory to 1 |
| FR-09 | No confirmation dialog required |

## 4. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | Everything runs in Docker |
| NFR-02 | Race condition must reproduce reliably on every purchase |
| NFR-03 | Fix implementable via SQLAlchemy (no raw SQL required) |

## 5. UI Constraints

| ID | Requirement |
|----|-------------|
| UI-01 | Single page application |
| UI-02 | No hints about race conditions |
| UI-03 | No success/failure banners |
| UI-04 | Display raw data only (orders list, stock count) |
| UI-05 | No icons, emojis, just raw text |

## 6. Data Model

**Products**: id, title, author, year, price, quantity, created_at

**Orders**: id, product_id, created_at (millisecond precision)

## 7. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products/{id} | Product with current stock |
| POST | /api/orders | Create order (vulnerable endpoint) |
| GET | /api/orders | List all orders |
| POST | /api/reset | Reset system state |

## 8. Documentation Deliverables

| Document | Content |
|----------|---------|
| README.md | Setup instructions, problem statement, any mention or hints on race condition (docs/templates/README_TEMPLATE.md)|
| DETONADO.md | Diagnosis and fix guide (docs/templates/DETONADO_TEMPLATE.md) |

## 9. Out of Scope

- User authentication
- Multiple products
- Shopping cart
- Payment processing
- Performance metrics in UI
- Hints or explanations in UI

## 10. Dependencies

Docker 20.10+, Docker Compose 2.0+, Node.js 18+, Python 3.11+, PostgreSQL 15+, nginx 1.24+