# Lazy Bird Broken Systems Playbook

A comprehensive guide for creating educational performance optimization systems.

---

## PART I: FOUNDATIONS

### Overview

Each broken system is a self-contained educational environment demonstrating a specific performance issue and teaching optimization techniques. Systems can use any technology stack but must follow the structural and quality standards defined in this playbook.

### Core Principles

1. **Single Issue Focus** - Each system demonstrates one specific performance problem
2. **Measurable Impact** - The issue must be observable and quantifiable with metrics
3. **Realistic Scenario** - Problems mirror real-world situations
4. **Educational Value** - Focus on transferable skills, not domain-specific knowledge
5. **Self-Contained** - Each system runs independently with no external dependencies
6. **Docker-First** - Everything runs in Docker for consistency and portability

### What Makes a Good Broken System

**The Issue Should Be:**
- Significant enough to cause measurable problems
- Similar to real-world scenarios
- Teachable with transferable concepts
- Focused on one problem, not multiple issues

**Good Examples:**
- Missing database index causing sequential scans
- Sequential API calls that should be concurrent
- No caching causing repeated expensive operations
- Inefficient algorithm using O(n²) instead of O(n log n)

**Bad Examples:**
- Simple typo - too trivial
- Multiple unrelated issues - confusing
- Requires extensive setup - too complex
- Highly domain-specific - not transferable

### Measurable Metrics

Not all broken systems require metrics, but when applicable, systems must show before/after metrics:
- Response times (seconds/milliseconds)
- Query execution times
- Throughput (requests per second)
- Resource usage (CPU, memory)
- Percentiles (p50, p95, p99)

### Standard Architecture Pattern

The framework is technology-agnostic and supports any tech stack. A typical pattern uses a 4-service microservices architecture:
- **Frontend** - User interface (React, Vue, Angular, etc.)
- **Main Backend** - API Gateway/Primary service (Java/Spring Boot, Python/FastAPI, Node.js/Express, Go, etc.)
- **Secondary Service** - Specialized service for database access, external APIs, etc. (any backend technology)
- **Database** - Data persistence (PostgreSQL, MySQL, MongoDB, etc.)

This pattern can be adapted based on learning objectives and technology preferences:
- Remove secondary service for simple 3-tier systems
- Add additional services for complex distributed system demonstrations
- Use any combination of frontend and backend technologies
- Choose appropriate database technology for the learning objective

---

## PART II: STANDARDS

### Directory Structure

```
broken-systems/{category}/{##-system-name}/
├── README.md
├── DETONADO.md
├── Makefile
├── .env.development
├── .gitignore
├── docker/
│   ├── compose.yml
│   └── compose.test.yml
├── frontend/
│   ├── Dockerfile
│   ├── src/ (or appropriate source directory)
│   └── [framework-specific files]
├── backend/
│   ├── Dockerfile
│   ├── src/ (or app/)
│   ├── tests/
│   └── [dependency files - pom.xml, requirements.txt, package.json, etc.]
├── secondary-service/ (optional)
│   ├── Dockerfile
│   ├── src/ (or app/)
│   └── [dependency files]
└── database/ (if needed)
    ├── init-dev/
    └── init-test/
```

### Naming Conventions

**Categories** (by issue type):
- `database-performance/`
- `asynchronous-patterns/`
- `response-time-optimization/`
- `network-optimization/`
- `memory-management/`
- `algorithm-efficiency/`
- etc.

**System Names:** `{##-descriptive-name}`
- 2-digit prefix (01, 02, etc.)
- Lowercase with hyphens
- Examples: `01-employee-directory`, `02-product-catalog`

**Container Names:** `{system_name}_{service}` (underscores)
- Examples: `employee_directory_backend`, `product_catalog_db`

**Test Services:** Prefix all test services with `test-`
- Examples: `test-backend`, `test-runner`, `test-db`

### Required Files

**Makefile**

Must provide these commands:
- `make help` - List available commands
- `make run` - Start development environment
- `make build` - Build and start with fresh images
- `make stop` - Stop all services
- `make clean` - Remove all containers and volumes
- `make logs` - Show application logs
- `make test` - Run integration tests
- `make test-build` - Rebuild and run tests

There is a template within the docs/templates/ directory.

**Environment Variables**

- Create `.env.development` file with all configuration (committed)
- `.env` is NOT committed (in .gitignore)
- Users copy `.env.development` to `.env` during setup: `cp .env.development .env`
- Include warning header: "DEVELOPMENT ONLY - DO NOT USE IN PRODUCTION"
- Define all ports, credentials, service URLs
- Use `NODE_ENV=development` and `PYTHON_ENV=development` (or equivalent)

**Docker Compose Files**

`docker/compose.yml` (Development):
- All services for running the system
- Healthchecks for all services
- Volume mounts for hot-reload during development
- Environment variables from `.env`
- Proper `depends_on` with `condition: service_healthy`

`docker/compose.test.yml` (Testing):
- Separate test environment
- Three-tier architecture: `test-db` → `test-backend` → `test-runner`
- All test services prefixed with `test-`
- `API_URL` environment variable in test-runner
- Test database uses `tmpfs` (no persistence)
- No port exposure except for debugging

**Documentation**

`README.md` (use template at `docs/templates/README.md`):
- Problem description
- Learning objectives
- System architecture diagram (ASCII art)
- Setup and usage instructions
- Performance metrics explanation
- Further reading links
- Any mention or hint to the fix

`DETONADO.md` (use template at `docs/templates/DETONADO.md`):
- Step-by-step problem diagnosis
- Core concept explanation
- Link to external resources for in depth knowledge
- Root cause analysis
- Solution implementation steps
- Verification and expected results
- Production considerations

**.gitignore**

Create a .gitignore appropriate for your tech stack. Include at minimum:

```gitignore
# Environment variables (always required)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Docker (always required)
.docker/
docker-compose.override.yml

# Frontend - add patterns specific to your framework
# Examples:
# - Node.js: node_modules/, build/, dist/, .next/, .nuxt/
# - Other: framework-specific build artifacts and dependencies

# Backend - add patterns specific to your language
# Examples:
# - Python: __pycache__/, *.py[cod], venv/, .pytest_cache/
# - Java: target/, *.class, *.jar (if not needed), .gradle/
# - Node.js: node_modules/, dist/
# - Go: bin/, *.exe

# Database
database/data/
*.sql.bak
*.dump

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
*.log
logs/

# Temporary files
*.tmp
*.temp
.cache/
```

### Frontend Standards

**Requirements (technology-agnostic):**
- System must be responsive (mobile-friendly)
- Hot reload enabled for development
- Consistent UI pattern: Title → Description → Content → Metrics/Results
- Use shared components when available for your tech stack

**For React frontends:**
- Copy shared components from `shared/frontend/src/` to your frontend
- Use `SystemLayout` component for consistent UX
- Import shared styles before system-specific styles
- Use `MetricsFooter` for displaying performance metrics (when applicable)
- See `shared/frontend/README.md` for detailed instructions

**For other tech stacks:**
- Implement equivalent UI patterns and components
- Maintain consistent look and feel across broken systems
- Create reusable components within your chosen framework

### Backend Standards

**Requirements** (technology-agnostic):
- Must expose `/health` endpoint for healthchecks
- Must listen on port 8000 (internal)
- Must support CORS for frontend communication
- Must use environment variables for configuration
- Should include structured logging
- Should follow clean architecture (separate concerns)
- Hot reload enabled

**Testing Requirements:**
- At least one E2E integration test
- Tests run in Docker (not locally)
- Tests make real HTTP requests (not mocked)
- Tests validate the broken behavior (e.g., slow performance)
- Tests include clear success messages
- Use appropriate testing framework for your tech stack (JUnit, pytest, Jest, etc.)

---

## PART III: STEP-BY-STEP GUIDE

### Phase 0: Planning

1. Identify the issue to demonstrate
2. Choose appropriate technology stack
3. Define measurable success criteria
4. Sketch system architecture

### Phase 1: Infrastructure Setup

**Step 0: Create Directory Structure**

Navigate to tools directory and create standard structure:

```bash
cd tools/
./create-lazy-bird-structure.sh <domain-name> <project-name> [secondary-services-count]

# Examples:
./create-lazy-bird-structure.sh database 01-employee-directory 0
./create-lazy-bird-structure.sh caching 01-content-delivery 1
./create-lazy-bird-structure.sh apis 01-parallel-calls 2
```

**Script Parameters:**
- `domain-name`: Domain category (database, caching, apis, etc.)
- `project-name`: Specific broken system name (01-employee-directory, etc.)
- `secondary-services-count`: Number of secondary services (default: 0)
  - 0: No secondary services (3-tier: frontend + backend + database)
  - 1: One secondary service (4-tier: standard microservices pattern)
  - 2+: Multiple secondary services (numbered: secondary-service-1, secondary-service-2, etc.)

**Note:** The `frontend/` directory is created empty to avoid conflicts with frontend frameworks. Populate it in Step 1.2.

**Step 1.1: Repository Setup**

After infrastructure setup, create project repository as git submodule:

```bash
# Initialize git repository for this broken system
git init

# Add all infrastructure files
git add .

# Initial commit
git commit -m "Initial infrastructure setup"

# Create GitHub repository for this specific broken system
gh repo create br-lazy-bird/domain-XX-system-name --public --source=. --remote=origin --push

# Set SSH remote origin URL
git remote set-url origin git@github.com:br-lazy-bird/domain-XX-system-name.git
```

Add as submodule to main Lazy Bird repository:

```bash
# Navigate to main lazy-bird repository
cd /path/to/lazy-bird

# Remove local directory to add as submodule
rm -r broken-systems/domain/XX-system-name

# Add as submodule
git submodule add https://github.com/br-lazy-bird/domain-XX-system-name.git broken-systems/domain/XX-system-name

# Commit submodule addition
git add .gitmodules
git commit -m "Add domain-XX-system-name broken system"
git push origin main
```

Submodule development workflow:

```bash
# Working on the broken system
cd domain-XX-system-name

# Make changes, commit, and push
git add .
git commit -m "Implement feature"
git push origin main

# Update main repository to point to latest submodule commit
cd ..
git add path_to_domain-XX-system-name
git commit -m "Update domain-XX-system-name submodule"
git push origin main
```

**Step 1.2: Frontend Setup**

Navigate to empty `frontend/` directory and initialize your chosen frontend framework:

**Examples:**
- React: `npx create-react-app . --template typescript`
- Vue: `npm create vue@latest .`
- Angular: `ng new . --directory ./`
- Next.js: `npx create-next-app@latest .`

Create `frontend/Dockerfile` manually after setup completes, appropriate for your framework.

**Step 1.3: Docker Compose Integration**

Service Orchestration:
- Define all services with proper dependencies in `docker/compose.yml`
- Create custom network for internal communication
- Configure port mappings for external access
- Set service dependencies with startup order (database → services → frontend)

Environment Configuration:
- Create `.env.development` file
- Define database credentials and service endpoints
- Configure debug modes and hot reload settings

Volume Management:
- Mount source code for hot reload during development
- Create data volume for persistence
- Configure centralized logging setup (optional)

**Step 1.4: End-to-End Validation**

Startup Verification:
- `make run` works cleanly
- All services report healthy status
- Internal network connectivity verified
- All exposed ports accessible from host

Development Workflow:
- Code changes reflect immediately with hot reload
- Service logs easily accessible
- `make stop` stops all services cleanly
- Image rebuilding works for dependency changes

### Phase 2: Implementation

1. **Frontend**: Copy shared components (if available for your tech stack), create UI
2. **Backend**: Implement API with intentional issue using your chosen technology
3. **Database**: Create schema and seed data (if needed)
4. **Docker**: Configure compose files for dev and test

### Phase 3: Testing

1. Create E2E tests that demonstrate the issue
2. Ensure tests run in Docker
3. Verify tests show measurable performance problems

### Phase 4: Documentation

1. Fill in README.md with problem description
2. Create DETONADO.md with solution steps
3. Add architecture diagrams
4. Document expected metrics

### Phase 5: Verification

1. Follow own README to setup system
2. Follow own DETONADO to fix issue
3. Verify if the problem is fixed
4. Revert changes to restore broken state
5. Run through quality checklist

---

## PART IV: REFERENCE

### Quality Checklist

**Functionality**
- System starts with `make run`
- All services become healthy
- Frontend accessible at http://localhost:3000
- Issue is observable and measurable
- System stops cleanly with `make stop`
- Volumes cleaned with `make clean`

**Testing**
- Tests run with `make test` and `make test-build`
- Tests pass and demonstrate the issue
- Tests use real HTTP requests (not mocked)
- Test environment isolated with `test-` prefixes

**Documentation**
- README.md complete (following template)
- DETONADO.md complete (following template)
- Architecture diagram included
- All commands tested
- External links verified

**Docker Standards**
- All services have healthchecks
- Proper dependency ordering with `condition: service_healthy`
- Environment variables in `.env`
- Volume mounts for hot-reload
- Test compose uses `tmpfs` for databases

**Frontend Standards**
- Uses shared components when available for tech stack
- Follows consistent UI patterns across systems
- Displays metrics appropriately (when applicable)
- Responsive design

**Backend Standards**
- `/health` endpoint exists
- CORS configured
- Logging configured
- Environment variables used

**Code Quality**
- `.env.development` committed (with educational credentials)
- `.env` in `.gitignore` (not committed)
- `.gitignore` configured correctly
- Code follows clean architecture
- Error handling implemented
- Comments explain the broken behavior

**Educational Value**
- Single, clear focus
- Before/after difference measurable
- Issue is realistic
- Fix is documented and tested
- Teaches transferable skills

### Getting Help

- **Templates**: Use `docs/templates/README.md` and `docs/templates/DETONADO.md`
- **Shared Components**: See `shared/frontend/README.md`
- **Blog**: Visit https://dbrevesf.github.io/categories/lazy-bird-project/ for additional guidance
