# Lazy Bird: [PROJECT NAME]

An educational project for learning [PERFORMANCE TOPIC] through hands-on practice.

---

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- [MINIMUM RAM REQUIREMENT - e.g., 2GB+ available RAM]
- Ports [LIST REQUIRED PORTS - e.g., 3000, 8000, and 5432] available

### Setup

This project includes a `.env.development` file with development configuration. Copy this file to `.env` before running the system:

```bash
cp .env.development .env
```

These settings are for **local development only** and contain no sensitive data. In production applications, always use proper secret management and never commit credentials to version control.

```bash
# Start the system
make run
```

The system will:
- [LIST WHAT STARTS - e.g., Start PostgreSQL database]
- [LIST SETUP STEPS - e.g., Seed 1,000,000 employee records]
- [LIST SERVICES - e.g., Launch FastAPI backend]
- [LIST SERVICES - e.g., Start React frontend]

**Access the application:**
- Frontend: http://localhost:[PORT]
- [LIST OTHER ENDPOINTS - e.g., Backend API: http://localhost:8000]
- [IF APPLICABLE - Database: localhost:5432]

---

## System Architecture

```
[INSERT ASCII DIAGRAM SHOWING REQUEST FLOW]
Example format:
┌─────────────────────────────────────────────────────────────────┐
│                         [Frontend Name]                         │
│                      (http://localhost:XXXX)                    │
│                   [Brief description of UI]                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Request
                             │ [Show example request]
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      [Service Name]                             │
│                      (http://localhost:XXXX)                    │
│                   [Brief description]                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ [Connection type]
                             │ [Show example query/call]
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      [Final Service/Database]                   │
│                      (localhost:XXXX)                           │
│                   [Brief description + note about problem]      │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:** [FRONTEND STACK - e.g., React 18 with TypeScript, Vue.js, Angular, etc.]

**Backend:** [BACKEND STACK - e.g., FastAPI (Python), Express (Node.js), Spring Boot (Java), etc.]

**[IF APPLICABLE] Database:** [DATABASE DETAILS - e.g., PostgreSQL 15, MySQL 8, MongoDB, etc.]

**[IF APPLICABLE] Microservices:**
- [SERVICE NAME] - [Description]
- [SERVICE NAME] - [Description]

**Infrastructure:**
- Docker Compose for easy setup
- Hot-reload enabled for development
- Isolated network environment

---

## The Problem

[DESCRIBE OBSERVABLE PROBLEM - What the user will notice when they run the application]

**Your Mission:**
1. Investigate why [DESCRIBE ISSUE]
2. Diagnose the root cause using appropriate diagnostic tools
3. Implement the optimization
4. Verify that the problem is resolved

**[IF APPLICABLE] Important:** Do NOT remove or reduce [INTENTIONAL CONSTRAINTS]. The [CONSTRAINT] is intentional to simulate real-world [SCENARIO]. The optimization should work WITH the [CONSTRAINT], not around it.

---

## Success Criteria

You'll know you've successfully optimized the system when:

- [SUCCESS METRIC 1 - Describe measurable improvement]
- [SUCCESS METRIC 2 - Describe observable change]
- [SUCCESS METRIC 3 - Describe consistency of improvement]

[IF APPLICABLE - Add explanation of metrics like percentiles, timings, cache hit rates, etc.]

Compare these metrics before and after your optimization to measure the improvement.

---

## How to Use the System

### Frontend Interface

**[Feature Name]:**
1. Open http://localhost:[PORT]
2. [STEP-BY-STEP INSTRUCTIONS]
3. [CONTINUE WITH STEPS]
4. [OBSERVE RESULTS]

### [IF APPLICABLE] API Endpoints

**[Service Name]:**
- `[METHOD] /endpoint` - Description
- `[METHOD] /endpoint/{id}` - Description
- `GET /health` - Health check

**[IF MULTIPLE SERVICES] [Service Name]:**
- `[METHOD] /endpoint` - Description (port XXXX)

### [IF APPLICABLE] Database Access

**Using [DATABASE CLIENT - e.g., psql, mysql, mongosh]:**
```bash
make db-shell
```

**Connection Details:**
- Host: localhost
- Port: [PORT]
- Database: [DATABASE_NAME]
- Username: [USERNAME]
- Password: [PASSWORD]

---

## Running Tests

The project includes automated integration tests [DESCRIBE WHAT TESTS VERIFY].

**Run tests (fast - uses cached images):**
```bash
make test
```

**Rebuild and test (after code changes):**
```bash
make test-build
```

[ADD PROJECT-SPECIFIC TEST DETAILS - e.g., "Tests automatically manage an isolated test database on port 5433 with 10,000 employee records"]

[OPTIONAL - Add "Tests verify:" bullet list for microservices projects]

---

## Documentation

For detailed diagnostic guidance and step-by-step optimization instructions, see the [DETONADO Guide](./DETONADO.md).

---

Ready to start? Run `make run` and dive in!
