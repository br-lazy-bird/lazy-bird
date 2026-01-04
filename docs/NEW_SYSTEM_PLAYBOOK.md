# Lazy Bird: New Broken System Playbook

A concise guide for creating new broken systems that follow the established patterns of the Lazy Bird educational project.

---

## Overview

Each broken system is a **self-contained, educational environment** that demonstrates a specific performance issue and teaches optimization techniques. Systems can be built with any technology stack, but must follow the structural and quality standards outlined below.

---

## Core Principles

1. **Single Issue Focus** - Each system demonstrates ONE specific performance problem
2. **Measurable Impact** - The issue must be observable and quantifiable (with metrics)
3. **Realistic Scenario** - Problems should mirror real-world situations
4. **Educational Value** - Focus on transferable skills, not specific domain knowledge
5. **Self-Contained** - Each system runs independently with no external dependencies
6. **Docker-First** - Everything runs in Docker for consistency and portability

---

## Directory Structure

### Standard Layout
```
broken-systems/{category}/{##-system-name}/
├── README.md                    # Problem description and setup
├── DETONADO.md                  # Solution guide
├── Makefile                     # Standard commands (run, test, clean, etc.)
├── .env.development             # Environment variables template (committed)
├── .gitignore                   # Standard exclusions (includes .env)
├── docker/
│   ├── compose.yaml            # Development environment
│   └── compose.test.yaml       # Testing environment
├── frontend/                    # UI layer
│   ├── Dockerfile
│   ├── src/
│   │   ├── shared-components/  # Copied from shared/frontend
│   │   ├── shared-styles/      # Copied from shared/frontend
│   │   └── components/         # System-specific components
│   └── [package management files]
├── backend/ (or services/)      # API/business logic layer
│   ├── Dockerfile
│   ├── app/                    # Application code
│   ├── tests/                  # E2E integration tests
│   └── [dependency files]
└── database/ (if needed)        # Database layer
    ├── init-dev/               # Development seed data
    └── init-test/              # Test seed data
```

### Naming Conventions

**Categories** (by issue type):
- `database-performance/`
- `asynchronous-patterns/`
- `response-time-optimization/`
- `network-optimization/`
- `memory-management/`
- `algorithm-efficiency/`

**System Names**: `{##-descriptive-name}`
- 2-digit prefix (01, 02, etc.)
- Lowercase with hyphens
- Examples: `01-employee-directory`, `02-product-catalog`

**Container Names**: `{system_name}_{service}` (underscores)
- Examples: `employee_directory_backend`, `product_catalog_db`

**Test Services**: Prefix all test services with `test-`
- Examples: `test-backend`, `test-runner`, `test-db`

---

## Port Conventions

| Service Type | Port |
|-------------|------|
| Frontend | 3000 |
| Backend/Main API | 8000 |
| Additional Services | 8001, 8002, 8003... |
| Database (internal) | Default for tech (e.g., 5432 for PostgreSQL) |

---

## Required Files and Standards

### 1. Makefile

Must provide these commands:
- `make help` - List available commands
- `make run` - Start development environment
- `make build` - Build and start with fresh images
- `make stop` - Stop all services
- `make clean` - Remove all containers and volumes
- `make logs` - Show application logs
- `make test` - Run integration tests
- `make test-build` - Rebuild and run tests

### 2. Environment Variables

- Create `.env.development` file with all configuration (this IS committed)
- `.env` is NOT committed (in .gitignore)
- Users copy `.env.development` to `.env` during setup: `cp .env.development .env`
- Include warning header: "DEVELOPMENT ONLY - DO NOT USE IN PRODUCTION"
- Define all ports, credentials, service URLs
- Use `NODE_ENV=development` and `PYTHON_ENV=development` (or equivalent)

### 3. Docker Compose Files

**compose.yaml (Development)**:
- All services for running the system
- Healthchecks for all services
- Volume mounts for hot-reload during development
- Environment variables from `.env`
- Proper `depends_on` with `condition: service_healthy`

**compose.test.yaml (Testing)**:
- Separate test environment
- Three-tier architecture: `test-db` → `test-backend` → `test-runner`
- All test services prefixed with `test-`
- `API_URL` environment variable in test-runner
- Test database uses `tmpfs` (no persistence)
- No port exposure except for debugging

### 4. Documentation

**README.md** (use template at `docs/README_TEMPLATE.md`):
- Problem description
- Learning objectives
- System architecture diagram (ASCII art)
- Setup and usage instructions
- Performance metrics explanation
- Further reading links

**DETONADO.md** (use template at `docs/DETONADO_TEMPLATE.md`):
- Step-by-step problem diagnosis
- Core concept explanation
- Root cause analysis
- Solution implementation steps
- Verification and expected results
- Production considerations

### 5. Frontend

**Requirements**:
- Copy shared components from `shared/frontend/src/` to your frontend
- Use `SystemLayout` component for consistent UX
- Import shared styles before system-specific styles
- Use `MetricsFooter` for displaying performance metrics
- System must be responsive (mobile-friendly)

**Pattern**:
```
Title → Description → Content → Metrics
```

**Reference**: See `shared/frontend/README.md` for detailed instructions

### 6. Backend

**Requirements** (technology-agnostic):
- Must expose `/health` endpoint for healthchecks
- Must listen on port 8000 (internal)
- Must support CORS for frontend communication
- Must use environment variables for configuration
- Should include structured logging
- Should follow clean architecture (separate concerns)

**Testing Requirements**:
- At least one E2E integration test
- Tests run in Docker (not locally)
- Tests make real HTTP requests (not mocked)
- Tests validate the broken behavior (e.g., slow performance)
- Tests include clear success messages
- Test configuration in `conftest.py` (or equivalent)

---

## The "Broken" State

### What Makes a Good Broken System?

**The Issue Should Be**:
- Significant enough to cause measurable problems
- Fixable within 30-60 minutes
- Similar to real-world scenarios
- Teachable (demonstrates transferable concepts)
- Focused on ONE problem (not multiple issues)

**Good Examples**:
- Missing database index → sequential scans
- Sequential API calls → should be concurrent
- No caching → repeated expensive operations
- Inefficient algorithm → O(n²) instead of O(n log n)

**Bad Examples**:
- Simple typo (too trivial)
- Multiple unrelated issues (confusing)
- Requires extensive setup (too complex)
- Highly domain-specific (not transferable)

### Measurable Metrics

Every system must show **before/after metrics**:
- Response times (seconds/milliseconds)
- Query execution times
- Throughput (requests per second)
- Resource usage (CPU, memory)
- Percentiles (p50, p95, p99)

---

## Quality Checklist

Before submitting, verify:

### ✅ Functionality
- [ ] System starts with `make run`
- [ ] All services become healthy
- [ ] Frontend accessible at http://localhost:3000
- [ ] Performance issue is observable and measurable
- [ ] System stops cleanly with `make stop`
- [ ] Volumes cleaned with `make clean`

### ✅ Testing
- [ ] Tests run with `make test` and `make test-build`
- [ ] Tests pass and demonstrate the issue
- [ ] Tests use real HTTP requests (not mocked)
- [ ] Test environment isolated with `test-` prefixes

### ✅ Documentation
- [ ] README.md complete (following template)
- [ ] DETONADO.md complete (following template)
- [ ] Architecture diagram included
- [ ] All commands tested
- [ ] External links verified

### ✅ Docker Standards
- [ ] All services have healthchecks
- [ ] Proper dependency ordering with `condition: service_healthy`
- [ ] Environment variables in `.env`
- [ ] Volume mounts for hot-reload
- [ ] Test compose uses `tmpfs` for databases

### ✅ Frontend Standards
- [ ] Uses `SystemLayout` component
- [ ] Imports shared styles first
- [ ] Uses `MetricsFooter` for metrics
- [ ] Responsive design

### ✅ Backend Standards
- [ ] `/health` endpoint exists
- [ ] CORS configured
- [ ] Logging configured
- [ ] Environment variables used

### ✅ Code Quality
- [ ] `.env.development` committed (with educational credentials)
- [ ] `.env` in `.gitignore` (not committed)
- [ ] `.gitignore` configured correctly
- [ ] Code follows clean architecture
- [ ] Error handling implemented
- [ ] Comments explain the broken behavior

### ✅ Educational Value
- [ ] Single, clear focus
- [ ] Before/after difference measurable
- [ ] Issue is realistic
- [ ] Fix is documented and tested
- [ ] Teaches transferable skills

---

## Step-by-Step Process

### Phase 1: Planning
1. Identify the performance issue to demonstrate
2. Choose appropriate technology stack
3. Define measurable success criteria
4. Sketch system architecture

### Phase 2: Setup
1. Create directory structure
2. Copy documentation templates
3. Create Makefile with standard commands
4. Setup `.env.development` and `.gitignore` (ensure `.env` is ignored)

### Phase 3: Implementation
1. **Frontend**: Copy shared components, create UI
2. **Backend**: Implement API with intentional issue
3. **Database**: Create schema and seed data (if needed)
4. **Docker**: Configure compose files for dev and test

### Phase 4: Testing
1. Create E2E tests that demonstrate the issue
2. Ensure tests run in Docker
3. Verify tests show measurable performance problems

### Phase 5: Documentation
1. Fill in README.md with problem description
2. Create DETONADO.md with solution steps
3. Add architecture diagrams
4. Document expected metrics

### Phase 6: Verification
1. Follow own README to setup system
2. Follow own DETONADO to fix issue
3. Verify metrics improve significantly
4. Revert changes to restore broken state
5. Run through quality checklist

---

## Reference Implementations

Study these three systems as examples:

1. **database-performance/01-employee-directory**
   - Issue: Missing database indexes
   - Teaches: Query optimization, EXPLAIN plans, B-tree indexes

2. **asynchronous-patterns/01-product-catalog**
   - Issue: Sequential API calls
   - Teaches: Async/await, concurrency, parallelization

3. **response-time-optimization/01-content-delivery**
   - Issue: No caching layer
   - Teaches: Cache strategies, TTL, cache invalidation

---

## Tips for Success

### Choosing the Right Issue
- Start with problems you've encountered in real projects
- Focus on common, widespread issues
- Ensure the fix has clear before/after metrics
- Pick issues that teach principles, not just syntax

### Creating Realistic Data
- Use enough data to show the problem (1000+ records)
- Generate realistic, diverse data
- Keep seed time under 30 seconds
- Consider data distribution (not just uniform data)

### Balancing Difficulty
- Too easy: Users don't learn much
- Too hard: Users get frustrated
- Sweet spot: Requires reading docs and applying concepts
- Goal: 30-60 minutes to diagnose and fix

### Writing Documentation
- Be concise - respect users' time
- Show, don't just tell (use examples)
- Include expected output
- Link to authoritative external resources
- Use consistent formatting

---

## Getting Help

- **Templates**: Use `docs/README_TEMPLATE.md` and `docs/DETONADO_TEMPLATE.md`
- **Shared Components**: See `shared/frontend/README.md`
- **Reference Systems**: Study the three existing implementations
- **Patterns**: Refer to this playbook

---

## Appendix: System Categories

### Database Performance
Issues: Missing indexes, N+1 queries, inefficient JOINs, missing connection pooling, sequential scans

### Asynchronous Patterns
Issues: Blocking I/O, sequential operations that should be parallel, missing async/await, no concurrency control

### Response Time Optimization
Issues: No caching, missing compression, large payloads, repeated expensive operations, no CDN

### Network Optimization
Issues: Too many HTTP requests, large assets, missing compression, no HTTP/2, inefficient protocols

### Memory Management
Issues: Memory leaks, inefficient data structures, loading excessive data, missing pagination, retention issues

### Algorithm Efficiency
Issues: Inefficient algorithms, O(n²) when O(n log n) possible, redundant computations, missing memoization

---

**You're ready to create a new broken system!** Focus on teaching one concept well, follow the established patterns, and create a valuable learning experience.
