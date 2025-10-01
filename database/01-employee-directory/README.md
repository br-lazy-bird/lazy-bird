# Lazy Bird: Employee Directory

An educational project for learning database performance optimization through hands-on practice.

---

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Ports 3000, 8000, and 5432 available

### Setup

This project includes a `.env.development` file with development credentials. Copy this file to `.env` before running the system. These credentials are for **local development only** and contain no sensitive data. In production applications, always use proper secret management and never commit credentials to version control.

```bash
cp .env.development .env
```

and then:

```bash
# Start the system
docker compose up --build
```

The system will:
- Start PostgreSQL database
- Seed 1,000,000 employee records
- Launch FastAPI backend
- Start React frontend

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Database: localhost:5432

---

## System Architecture

### Technology Stack

**Frontend:** React 18 with TypeScript

**Backend:** FastAPI (Python) with SQLAlchemy ORM

**Database:** PostgreSQL 15 with 1,000,000+ employee records

**Infrastructure:**
- Docker Compose for easy setup
- Hot-reload enabled for development
- Isolated network environment

---

## The Problem

When you run the application and execute the **Performance Test**, you'll notice the system performs poorly. The test executes multiple search queries and measures the time taken.

**Your Mission:**
1. Investigate why the searches are slow
2. Diagnose the root cause using appropriate diagnostic tools
3. Implement the optimization
4. Verify that the problem is resolved

---

## Success Criteria

You'll know you've successfully optimized the system when:

- The Performance Test shows a dramatic improvement in execution time
- Individual query times are significantly reduced
- The improvement is immediately noticeable when running the test

The performance test displays metrics including:
- Total execution time
- P50 (median) query time - 50% of queries were faster than this
- P95 query time - 95% of queries were faster than this
- P99 query time - 99% of queries were faster than this

**Understanding Percentiles:** P50 shows typical performance, while P95 and P99 reveal worst-case scenarios that affect user experience. Consistent improvements across all percentiles indicate a robust optimization.

Compare these metrics before and after your optimization to measure the improvement.

---

## How to Use the System

### Frontend Interface

**Performance Test:**
1. Open http://localhost:3000
2. Click "Run Performance Test"
3. Watch real-time progress as 100 queries execute
4. Review the performance metrics

### Database Access

**Using psql:**
```bash
docker compose exec db psql -U lazybird_dev -d employee_directory
```

**Connection Details:**
- Host: localhost
- Port: 5432
- Database: employee_directory
- Username: lazybird_dev
- Password: lazybird_pass

---

## Documentation

For detailed diagnostic guidance and step-by-step optimization instructions, see the [DETONADO Guide](./DETONADO.md).

---

Ready to start? Run `docker compose up --build` and dive in!