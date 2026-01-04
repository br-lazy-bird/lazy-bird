# Sales Reports - PRD (Product Requirements Document)

## Document Information

| Field | Value |
|-------|-------|
| **Project** | Lazy Bird - Broken System #4 |
| **Domain** | Database → Query Optimization |
| **System Name** | Sales Reports |
| **Difficulty** | 🟡 Medium |
| **Version** | 1.2 |
| **Date** | January 2026 |

---

## 1. Overview

### 1.1 Purpose

Create an intentionally broken sales reporting system that demonstrates the N+1 query problem. Users will experience painfully slow report generation caused by lazy loading of related data, then learn to diagnose and fix the issue using ORM eager loading strategies.

### 1.2 Background

The N+1 query problem is one of the most common performance anti-patterns in applications using ORMs. It occurs when code fetches a list of records, then iterates over them accessing related data — triggering a separate database query for each record. This system makes that invisible problem visible and tangible.

---

## 2. Problem Statement

### 2.1 The Specific Problem

**Issue:** Sales report endpoint uses lazy loading, causing N+1 queries when fetching orders with customer names and item counts.

**Root Cause:** SQLAlchemy relationships default to lazy loading. Accessing `order.customer` and `order.items` inside a loop triggers individual queries for each order.

**Manifestation:**
- 500 orders → 1,001 database queries
- Report load time: ~1.5-2 seconds
- Database connection pressure under load

### 2.2 The Solution

**Fix:** Implement eager loading using `joinedload` and/or `subqueryload` to fetch all related data in 2-3 queries instead of 1,001.

**Expected Outcome:**
- Query count: 1,001 → 3
- Load time: ~1,800ms → ~50ms
- 30-40x performance improvement

---

## 3. Learning Objectives

After completing this broken system, users will be able to:

1. **Identify** N+1 query problems by analyzing query counts and patterns
2. **Understand** the difference between lazy and eager loading in ORMs
3. **Apply** `joinedload` and `subqueryload` strategies appropriately
4. **Verify** optimizations by comparing before/after query counts and execution times

---

## 4. System Requirements

### 4.1 Functional Requirements

#### FR-1: Sales Report Display
- Display a table of orders showing: Order ID, Customer Name, Item Count, Total, Status
- Show all orders (no pagination in initial version)
- Calculate totals from order items

#### FR-2: Performance Metrics Display
- Show query execution time in milliseconds
- Show total number of database queries executed

#### FR-3: Report Loading
- Single button to load/refresh the report
- Loading state while fetching data

### 4.2 Non-Functional Requirements

#### NFR-1: Broken State Performance
- Must execute 1,000+ queries for 500 orders
- Must take >1 second to load report
- Performance must be noticeably poor

#### NFR-2: Fixed State Performance
- Must execute ≤5 queries regardless of order count
- Must load report in <200ms
- Performance improvement must be dramatic and obvious

#### NFR-3: Educational Clarity
- Query count must be visible to users
- The cause-effect relationship must be clear
- No distracting features or complexity

---

## 5. Data Model

### 5.1 Entities

#### Customers
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | Yes | Primary key |
| name | String(100) | Yes | Customer full name |
| email | String(255) | Yes | Unique email address |
| company | String(100) | No | Company name |
| created_at | Timestamp | Yes | Account creation date |

#### Orders
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | Yes | Primary key |
| customer_id | Integer | Yes | Foreign key to customers |
| order_date | Timestamp | Yes | When order was placed |
| status | String(20) | Yes | Order status |
| notes | Text | No | Optional notes |

**Status values:** pending, processing, shipped, delivered, cancelled

#### Order Items
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | Yes | Primary key |
| order_id | Integer | Yes | Foreign key to orders |
| product_name | String(200) | Yes | Product description |
| quantity | Integer | Yes | Units ordered |
| unit_price | Decimal(10,2) | Yes | Price per unit |

### 5.2 Relationships

```
customers (1) ←→ (N) orders (1) ←→ (N) order_items
```

### 5.3 Sample Data Volume

| Entity | Count | Rationale |
|--------|-------|-----------|
| Customers | 200 | Variety, some with multiple orders |
| Orders | 500 | Large enough to feel slow |
| Order Items | 1,500-2,500 | Average 3-5 items per order |

---

## 6. API Specification

### 6.1 Endpoints

#### GET /api/reports/sales

**Description:** Retrieve sales report with all orders

**Response:**
```json
{
  "report": [
    {
      "order_id": "integer",
      "customer_name": "string",
      "item_count": "integer",
      "total": "decimal",
      "order_date": "ISO8601 string",
      "status": "string"
    }
  ],
  "metadata": {
    "total_orders": "integer",
    "execution_time_ms": "decimal",
    "query_count": "integer"
  }
}
```

#### GET /health

**Description:** Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

---

## 7. User Interface

### 7.1 Components

#### Performance Metrics Panel
- Query execution time (milliseconds)
- Query count

#### Report Table
- Columns: Order ID, Customer Name, Items, Total, Status
- Simple table without sorting/filtering (keep focus on performance)

#### Load Button
- Triggers report fetch
- Shows loading state during request

### 7.2 User Flow

1. User opens application
2. User clicks "Load Report" button
3. Loading indicator appears
4. User waits ~1.8 seconds (broken state)
5. Report displays with performance metrics
6. User sees 1,001 query count and slow execution time
7. User investigates and applies fix
8. User reloads report
9. Report loads in ~50ms with 3 queries

---

## 8. Technology Stack

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Frontend | React | ^19.0.0 | Type safety, component model |
| Frontend Runtime | Node.js | 18 | LTS stability |
| Backend | FastAPI | Latest | Async support, SQLAlchemy integration |
| Backend Runtime | Python | 3.11 | Modern Python features |
| ORM | SQLAlchemy | Latest | Industry standard, clear eager loading APIs |
| Database | PostgreSQL | 15 | Robust, good tooling |
| Infrastructure | Docker Compose V2 | Latest | One-command setup, modern compose spec |

---

## 9. Success Criteria

### 9.1 Broken State Validation
- [ ] Report endpoint executes >1,000 queries for 500 orders
- [ ] Load time exceeds 1 second
- [ ] Metrics panel displays query count and execution time

### 9.2 Fixed State Validation
- [ ] Report endpoint executes ≤5 queries
- [ ] Load time under 200ms
- [ ] All data still displays correctly

### 9.3 Educational Validation
- [ ] Query count is clearly visible
- [ ] Performance difference is dramatic (>30x improvement)
- [ ] DETONADO guide enables self-directed learning
- [ ] Validation tests can be run by users to verify their fix

---

## 10. Out of Scope

The following are explicitly **not** included in this broken system:

- Pagination (separate learning objective)
- Sorting and filtering
- Authentication/authorization
- Multiple report types
- Data export functionality
- Real-time updates
- Caching layer
- Performance indicators/labels (users interpret raw metrics themselves)

---

## 11. Dependencies

### 11.1 Prerequisites
- Docker and Docker Compose V2 installed
- Basic understanding of SQL and ORMs
- Familiarity with Python (for applying the fix)

### 11.2 Related Systems
- `01-employee-directory`: Missing database indexes (simpler, prerequisite concept)

---

## 12. Deliverables

1. **Docker Compose V2 setup** — One-command environment startup (`docker compose up`)
2. **Database with seed data** — 200 customers, 500 orders, ~2,000 items
3. **Broken backend** — FastAPI with lazy-loading N+1 problem
4. **Frontend** — React app displaying report with performance metrics
5. **Makefile** — Commands for running and testing the system
6. **Containerized tests** — Docker-based validation tests runnable by users
7. **README.md** — Setup instructions and problem description
8. **DETONADO.md** — Step-by-step optimization guide

---

**End of PRD v1.2**
