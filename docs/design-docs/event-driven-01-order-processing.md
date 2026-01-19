---
title: "Lazy Bird - Broken System: Order Processing"
date: 2026-01-18
categories: ["Lazy Bird Project"]
tags: ["event-driven", "dead-letter-queue", "rabbitmq", "message-queue"]
---

# Event-Driven: Order Processing - Design Document v1.0

## Overview

Asynchronous order processing system demonstrating dead letter queue (DLQ) handling issues. Orders are processed via RabbitMQ workers, but when the fulfillment service fails, messages go to the DLQ and are never processed — orders silently disappear. This is the first event-driven broken system in the Lazy Bird Project.

## The Problem

- **Issue**: No consumer for the Dead Letter Queue
- **Solution**: Implement a DLQ consumer with retry logic and exponential backoff
- **Expected Outcome**: All orders reach a final state (completed or failed)

## System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  RabbitMQ   │────▶│   Worker    │
│   (React)   │     │  (FastAPI)  │     │             │     │  (Python)   │
└─────────────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
                           │                   │                   │
                           ▼                   │                   ▼
                    ┌─────────────┐            │            ┌─────────────┐
                    │ PostgreSQL  │            │            │ Fulfillment │
                    │             │◀───────────┼────────────│  Service    │
                    └─────────────┘            │            │ (simulated) │
                                               │            └─────────────┘
                                               ▼
                                        ┌─────────────┐
                                        │    DLQ      │
                                        │ (orders.dlq)│
                                        └─────────────┘
                                               │
                                         ❌ NO CONSUMER
```

The silent failure occurs through realistic infrastructure:

- **Backend**: Creates order in DB (status: pending), publishes to RabbitMQ
- **Worker**: Consumes messages, calls fulfillment service
- **Fulfillment Service**: Simulated external service (~50% failure rate)
- **RabbitMQ DLQ**: Failed messages auto-routed here, but never consumed

### Message Flow (Broken State)

1. User clicks "Place 5 Orders"
2. Backend creates 5 orders (status: `pending`), publishes 5 messages
3. Worker processes messages, calls fulfillment service
4. ~50% succeed → order status becomes `completed`
5. ~50% fail → message routed to DLQ
6. DLQ has no consumer → orders stay `pending` forever
7. Result: Some orders complete, others stuck indefinitely

## The Broken Worker Logic

```python
def process_message(message):
    order_id = message['order_id']

    try:
        # Call external fulfillment service
        fulfillment_service.process(order_id)

        # Update order status
        update_order_status(order_id, 'completed')
        channel.basic_ack(delivery_tag)

    except FulfillmentError:
        # Reject message → goes to DLQ
        channel.basic_nack(delivery_tag, requeue=False)
        # ⚠️ BUG: No one consumes the DLQ!
```

The worker correctly routes failed messages to the DLQ, but there's no consumer to process them.

## Solution: DLQ Consumer

Create a separate consumer that:
1. Reads from the DLQ
2. Retries with exponential backoff
3. After max retries, marks order as `failed` with reason

```python
def handle_dlq_message(message):
    order_id = message['order_id']
    retry_count = get_retry_count(message)

    if retry_count < MAX_RETRIES:
        delay = calculate_backoff(retry_count)  # 1s, 2s, 4s, 8s...
        republish_with_delay(message, retry_count + 1, delay)
    else:
        update_order_status(order_id, 'failed',
                          reason='Max retries exceeded')
```

**Why other approaches fail**:

| Approach | Problem |
|----------|---------|
| Infinite retries | Resource exhaustion, no resolution |
| Immediate retries | Retry storm, no time for service recovery |
| Ignore DLQ | Orders lost forever, bad UX |
| Manual intervention only | Not scalable, requires human monitoring |

## User Interface

Single page with "Place 5 Orders" button, order list with status, and reset button. No hints about the bug - users observe raw data only.

```
┌─────────────────────────────────────────────┐
│        Order Processing System              │
├─────────────────────────────────────────────┤
│                                             │
│  [Place 5 Orders]              [Reset]      │
│                                             │
│  Creates 5 random orders to demonstrate     │
│  the processing system.                     │
│                                             │
├─────────────────────────────────────────────┤
│  Orders                                     │
│  ─────────────────────────────────────────  │
│  ID        Product     Qty    Status        │
│  ─────────────────────────────────────────  │
│  a1b2c3    Widget      2      ✅ Completed  │
│  d4e5f6    Gadget      1      ⏳ Pending    │
│  g7h8i9    Tool        3      ✅ Completed  │
│  j1k2l3    Widget      1      ⏳ Pending    │
│  m4n5o6    Gadget      2      ✅ Completed  │
└─────────────────────────────────────────────┘
```

**After bug**: Some orders `Completed`, others stuck `Pending` forever.

**After fix**: All orders reach final state (`Completed` or `Failed`).

**Reset**: Clears orders, purges queues. No confirmation required.

## Technology Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Frontend | React + TypeScript | Simple order form and list |
| Backend | FastAPI | REST API, RabbitMQ publisher |
| Worker | Python + pika | Main queue consumer |
| Queue | RabbitMQ | With DLQ configuration |
| Database | PostgreSQL | Order persistence |

## RabbitMQ Configuration

```python
# Main queue with DLQ routing
channel.queue_declare(
    queue='orders.queue',
    arguments={
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': 'orders.dlq'
    }
)

# Dead letter queue
channel.queue_declare(queue='orders.dlq')
```

## Project Structure

```
01-order-processing/
├── frontend/
├── backend/
├── worker/
│   ├── consumer.py      # Main queue consumer
│   └── dlq_consumer.py  # Missing! (the fix)
├── database/
│   └── init/
├── docker/
│   ├── compose.yaml
│   └── compose.test.yaml
└── README.md
```

## Learning Objectives

- Understanding Dead Letter Queues and their purpose
- Recognizing the "silent failure" anti-pattern
- Implementing DLQ consumers with retry logic
- Using exponential backoff for resilient retries
- Handling permanently failed messages gracefully
