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

**Domains** (by issue type):
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

We can create the Makefile as soon as the project grows. The idea is to populating it with new commands whenever it's available. For example, as soon as we have the database, we can create the `make db-shell` to open the database shell tool, as soon as we setup a web framework we can create the `make run` and so on.

There is a template within the docs/templates/ directory. Most of these commands will be present in all broken systems but there are some others that will be specific. 

You should follow the template regarding using of variables and how the commands is executed.

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
- The attribute `version` is obsolete, it will be ignored, so don't add it.

`docker/compose.test.yml` (Testing):
- Separate test environment
- Three-tier architecture: `test-db` → `test-backend` → `test-runner`
- All test services prefixed with `test-`
- `API_URL` environment variable in test-runner
- Test database uses `tmpfs` (no persistence)
- No port exposure except for debugging
- The attribute `version` is obsolete, it will be ignored, so don't add it.

**Documentation**

`README.md` (use template at `docs/templates/README.md`):
- Problem description
- Learning objectives
- System architecture diagram (ASCII art)
- Setup and usage instructions
- Performance metrics explanation
- Further reading links
- No mention or hint of the fix
- Do not use any icon, just raw text.

`DETONADO.md` (use template at `docs/templates/DETONADO.md`):
- Step-by-step problem diagnosis
- Core concept explanation
- Links to external resources for in-depth knowledge
- Root cause analysis
- Solution implementation steps
- Verification and expected results
- Production considerations
- Do not use any icon, just raw text.

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
- Should follow SOLID Principles
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
5. Plan using STC - Small Testable Chunks because it's important to test everything before committing. Also, we need to be able to continue the work even after running out of tokens.
6. You don't need to provide code for the planning. We want a detailed plan, with STC, but we don't want to pollute the document with a lot of code.
7. You should bring up any possible mistakes or architecture failures in the plan.
8. You should prioritize a clean architecture, with separation of concerns.
9. You must avoid duplications but we must be able to consider trade-offs. So, whenever a need for duplication arises, we need to discuss it.

### Phase 1: Infrastructure Setup

**Step 1.0: Directory Creation**

First you need to create the directory where you develop the broken system. All the broken systems are located within the directory `lazy-bird/broken-systems` and each broken system is located within its proper domain. For example, `data-integrity/01-flash-sales`. So, you just have to create the directory according to its domain and name convention [described above](#naming-conventions).

**Step 1.1: Repository Setup for Version Control**

After directory setup, create a project repository and add it as a git submodule. We must have two branchs `main` (the default) and `develop`. Everything that we develop will be in `develop` branch. When every piece of work is done, I will personally review it and merge it accordingly. 

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

Add as a submodule to the main Lazy Bird repository:

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

**Step 1.2: .gitignore**

Create a `.gitignore` file appropriate for your tech stack and update it accordingly.

**Branch Strategy**
- We will always work on the `develop` branch during development. If the branch doesn't exist, you should create it. But the `main` branch will still exist and it will be the main branch.


### Phase 2: Implementation
   
1. **Database**: Create schema and seed data (if needed)
2. **Backend**: Implement API with intentional issue using your chosen technology
3. **Frontend**: Copy shared components (if available for your tech stack) and create UI. You can use any frontend technology as long as you follow the styles defined in the shared components directory: `lazy-bird/shared/frontend`.

**Service Orchestration**
- Define all services with proper dependencies in `docker/compose.yml`
- Create custom network for internal communication
- Configure port mappings for external access
- Set service dependencies with startup order (database → services (backend) → frontend)

**Environment Configuration**
- Create `.env.development` file
- Define database credentials and service endpoints
- Configure debug modes and hot reload settings

### Phase 3: Testing

1. Create E2E tests that demonstrate that the broken system is running as expected. This means the root cause of the issue is present but the system is running properly.
2. Ensure tests run in Docker
3. Verify tests show measurable performance problems

### Phase 4: Documentation

1. Create README.md with problem description
2. Create DETONADO.md with solution steps

### Phase 5: Verification

# Testing Broken Systems

When asked to test broken systems (e.g., "test the systems", "test the broken systems", "run QA on the projects") or a single broken system (e.g., "test the flash-sales system", "test database-performance/01-employee-directory"), follow this protocol:

## Setup
- **For all systems:** Create a fresh clone in `Projects/temp/` directory (create if needed). Follow cloning instructions in the project's README.
- **For a single system:** Use the existing repository or the specific submodule directory

## For Each Broken System (or the specified system)

**1. Documentation Review**
- Read `README.md` - check for typos, grammar, English mistakes, unclear instructions
- Read `DETONADO.md` - check for typos, grammar, English mistakes, unclear instructions

**2. Build & Test**
- Follow the README instructions to run tests and start the system
- If instructions are unclear or incomplete, flag this as an issue

**3. Verify Broken State**
- Confirm the system exhibits the documented problem
- Note the state before fix (error behavior, performance, data issues, etc.)

**4. Apply Fix**
- Follow ONLY the DETONADO instructions to fix the issue
- Do not use external knowledge - the DETONADO must be self-sufficient
- If instructions fail to fix the issue, flag this as a critical problem

**5. Verify Fixed State**
- Confirm the fix resolves the problem
- Note the state after fix

**6. Cleanup**
- Do NOT commit any changes
- Revert all changes and clean up with `make clean`

## Feedback

Create a `feedback.txt` file in each broken-system directory with:
- STATUS: `READY TO PUBLISH` or `NEEDS FIX`
- README.md assessment
- DETONADO.md assessment
- Build & Run results
- Testing results (state before and after fix)
- ISSUES FOUND: List any problems or "None"

**Important:** Focus only on publication readiness (code, build, docs). Do not suggest improvements to code style, architecture, or features.


# Quality Checklist

After testing the broken system, you should run through the quality checklist:

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
