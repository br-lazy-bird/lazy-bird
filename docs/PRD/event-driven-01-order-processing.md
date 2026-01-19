---
title: "Order Processing DLQ - Product Requirements Document"
date: 2026-01-18
version: "1.0"
status: "Draft"
---

# Order Processing DLQ - PRD v1.0

## 1. Purpose

A deliberately broken order processing application teaching engineers how to identify and fix dead letter queue handling issues. Users place orders that are processed asynchronously, but failed orders silently disappear — they must diagnose and implement a DLQ consumer.

See `design-docs/event-driven-01-order-processing.md` for technical architecture details.

## 2. Target Users

- Software engineers preparing for technical interviews
- Developers learning event-driven architecture patterns
- Hiring managers evaluating candidates

## 3. Functional Requirements

### 3.1 Order Placement

| ID | Requirement |
|----|-------------|
| FR-01 | "Place 5 Orders" button creates 5 orders with random products |
| FR-02 | Products are randomly selected from: Widget, Gadget, Tool |
| FR-03 | Quantities are randomly assigned (1-5) |
| FR-04 | Orders are created in database with status `pending` |
| FR-05 | Messages are published to RabbitMQ for async processing |

### 3.2 Order Processing

| ID | Requirement |
|----|-------------|
| FR-06 | Worker consumes messages from main queue |
| FR-07 | Worker calls simulated fulfillment service (~50% failure rate) |
| FR-08 | On success: order status updated to `completed` |
| FR-09 | On failure: message routed to DLQ (no consumer in broken state) |

### 3.3 Orders Display

| ID | Requirement |
|----|-------------|
| FR-10 | List all orders with ID, product, quantity, and status |
| FR-11 | Status indicators: Pending, Completed, Failed |
| FR-12 | Orders list auto-refreshes or has manual refresh |

### 3.4 Broken vs Fixed Behavior

| ID | Requirement |
|----|-------------|
| FR-13 | Broken state: ~50% of orders stuck in `pending` forever |
| FR-14 | Fixed state: all orders reach final state (`completed` or `failed`) |

### 3.5 Reset

| ID | Requirement |
|----|-------------|
| FR-15 | "Reset" button deletes all orders |
| FR-16 | "Reset" purges all messages from queues |
| FR-17 | No confirmation dialog required |

## 4. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | Everything runs in Docker |
| NFR-02 | DLQ accumulation must be observable (messages pile up) |
| NFR-03 | Fix implementable by adding a DLQ consumer (no queue config changes) |
| NFR-04 | Failure rate should produce ~2-3 stuck orders per batch of 5 |

## 5. UI Constraints

| ID | Requirement |
|----|-------------|
| UI-01 | Single page application |
| UI-02 | No hints about DLQ or message queues |
| UI-03 | No success/failure banners |
| UI-04 | Display raw data only (orders list with status) |

## 6. Data Model

**Orders**: id (UUID), product (string), quantity (int), status (enum: pending/completed/failed), failure_reason (string, nullable), created_at, updated_at

## 7. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders/batch | Create 5 random orders |
| GET | /api/orders | List all orders |
| POST | /api/reset | Reset system state |
| GET | /health | Health check |

## 8. Message Queue

| Queue | Purpose |
|-------|---------|
| orders.queue | Main processing queue |
| orders.dlq | Dead letter queue (failed messages) |

## 9. Documentation Deliverables

| Document | Content |
|----------|---------|
| README.md | Setup instructions, problem statement, no hints about DLQ |
| DETONADO.md | Diagnosis and fix guide with DLQ consumer implementation |

## 10. Out of Scope

- User authentication
- Real payment processing
- Order details/line items
- Inventory management
- Performance metrics in UI
- Hints or explanations in UI
- Multiple queue consumers (keep it simple)

## 11. Dependencies

Docker 20.10+, Docker Compose 2.0+, Node.js 18+, Python 3.11+, PostgreSQL 15+, RabbitMQ 3.12+
