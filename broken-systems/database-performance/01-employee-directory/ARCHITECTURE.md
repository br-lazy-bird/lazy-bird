# Employee Directory - Architecture & Tech Stack

## Project Overview

The Employee Directory is an educational project designed to teach database performance optimization through hands-on practice. The system manages 1,000,000+ employee records and deliberately exhibits performance issues that learners must diagnose and resolve.

## Architecture

The application follows a **three-tier architecture** with complete containerization via Docker Compose:

```
┌─────────────────┐
│  React Frontend │ :3000
│   (TypeScript)  │
└────────┬────────┘
         │ HTTP/REST
┌────────▼────────┐
│  FastAPI Backend│ :8000
│    (Python)     │
└────────┬────────┘
         │ SQLAlchemy ORM
┌────────▼────────┐
│  PostgreSQL 15  │ :5432
│  (1M+ records)  │
└─────────────────┘
```

### Layer Responsibilities

**Frontend Layer**
- User interface for performance testing
- Real-time progress tracking for query execution
- Performance metrics visualization (P50, P95, P99)
- Hot-reload enabled for development

**Backend Layer**
- RESTful API endpoints
- Business logic and query orchestration
- Database connection management via SQLAlchemy ORM
- Performance test orchestration

**Database Layer**
- PostgreSQL 15 with 1,000,000 employee records
- Schema initialization on first run
- Automatic data seeding
- Constrained resources (0.5 CPU cores, 512MB RAM) to simulate production constraints

## Technology Stack

### Frontend
- **Framework**: React 18.2.0
- **Language**: TypeScript 4.9.5
- **Build Tool**: react-scripts 5.0.1
- **Development**: Hot-reload enabled, proxied to backend

### Backend
- **Framework**: FastAPI 0.118.2
- **Server**: Uvicorn 0.37.0 (ASGI)
- **ORM**: SQLAlchemy 2.0.43
- **Database Driver**: psycopg 3.2.10 (PostgreSQL adapter)
- **Language**: Python 3.x
- **Environment**: python-dotenv 1.0.0

### Database
- **RDBMS**: PostgreSQL 15
- **Data Volume**: 1,000,000+ employee records
- **Schema**: Single `employees` table with fields:
  - `id` (SERIAL PRIMARY KEY)
  - `first_name` (VARCHAR(50))
  - `last_name` (VARCHAR(50))
  - `department` (VARCHAR(100))
  - `email` (VARCHAR(150) UNIQUE)
  - `created_at` (TIMESTAMP WITH TIME ZONE)

### Infrastructure
- **Container Orchestration**: Docker Compose
- **Network**: Isolated Docker network
- **Volumes**: Persistent PostgreSQL data volume
- **Health Checks**: Automated health monitoring for all services

### Testing
- **Framework**: pytest 8.4.2
- **HTTP Client**: httpx 0.28.1
- **Test Environment**: Isolated test database on port 5433 with 10,000 records
- **Integration**: End-to-end API testing with Docker Compose automation

## Data Flow

### Performance Test Flow

1. User clicks "Run Performance Test" in the React frontend
2. Frontend sends HTTP request to `/api/performance/test` endpoint
3. Backend orchestrates 100 sequential database queries
4. Each query searches for employees named "John Smith"
5. SQLAlchemy translates ORM queries to SQL
6. PostgreSQL executes queries and returns results
7. Backend calculates performance metrics (P50, P95, P99)
8. Results stream back to frontend for real-time display

### Query Pattern

The repository pattern is used for database operations:

```python
EmployeeRepository.get_john_smith_count()
  → filters by first_name = "John"
  → filters by last_name = "Smith"
  → returns count
```

## Development Environment

### Port Allocation
- **3000**: React frontend
- **8000**: FastAPI backend
- **5432**: PostgreSQL (development)
- **5433**: PostgreSQL (testing)

### Hot Reload
- Frontend: Source files in `frontend/src` mounted as volume
- Backend: Application code in `backend/app` mounted as volume
- Changes reflect immediately without container restart

### Resource Constraints
The database is intentionally resource-constrained to create realistic performance challenges:
- CPU: Limited to 0.5 cores
- Memory: 512MB limit
- This simulates production environments where optimization is critical

## Security Notes

Development credentials are stored in `.env.development` and are safe for local use only. The project includes proper gitignore rules to prevent credential leakage. Production deployments should use proper secret management.

## API Structure

**Health Endpoints**
- `GET /` - API root message
- `GET /health` - Backend health check

**Performance Endpoints**
- `POST /api/performance/test` - Execute 100-query performance test
- Returns: Total time, P50/P95/P99 percentiles, individual query times

## Learning Objectives

This architecture deliberately exposes common database performance anti-patterns:
- Unoptimized query execution
- Missing database indexes
- Inefficient query patterns
- Resource constraints

Students learn to diagnose performance issues using:
- Query timing analysis
- Database query plans (EXPLAIN ANALYZE)
- Index optimization
- Performance monitoring
