# Lazy Bird Infrastructure Framework

## Overview

This document provides a standardized infrastructure setup framework for creating Lazy Bird broken systems. It establishes the foundation for educational systems that demonstrate performance optimization concepts through hands-on practice.

## Standard Architecture Pattern

The framework supports a **4-service microservices pattern**:
- **Frontend** (React + TypeScript) - User interface
- **Main Backend** (FastAPI) - API Gateway/Primary service 
- **Secondary Service** (FastAPI) - Specialized service (database access, external APIs, etc.)
- **Database** (PostgreSQL) - Data persistence

This pattern can be adapted based on the specific learning objective:
- Remove secondary service for simple 3-tier systems
- Add additional services for complex distributed system demonstrations
- Replace PostgreSQL with other databases when needed

## Infrastructure Setup Steps

### Step 0: Create Directory Structure

First, create the standard directory structure for the broken system:

```
project-name/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── backend/
│   ├── app/
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── secondary-service/
│   ├── app/
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── database/
│   └── init/
│       └── (initialization scripts - added in later steps)
├── docker-compose.yml
├── .env
├── .env.development
├── .gitignore
└── README.md
```

Create this structure before proceeding to individual service setup.

### Step 1.1: Individual Service Scaffolding + Dockerfiles

#### Frontend Service
- **Technology**: Create React App with TypeScript
- **Structure**: Basic component scaffolding
- **Dockerfile**: Node.js-based container with hot reload
- **Dependencies**: package.json with essential packages
- **Validation**: `docker build` succeeds, basic app starts

#### Main Backend Service  
- **Technology**: FastAPI with Python 3.11+
- **Structure**: Minimal app with health check endpoint
- **Dockerfile**: Python container with development setup
- **Dependencies**: requirements.txt with FastAPI, uvicorn
- **Validation**: `docker build` succeeds, health endpoint responds

#### Secondary Service
- **Technology**: FastAPI with Python 3.11+
- **Purpose**: Specialized functionality (adapt to learning objective)
- **Structure**: Minimal app with health check endpoint
- **Dockerfile**: Python container with specific dependencies
- **Dependencies**: requirements.txt tailored to service purpose
- **Validation**: `docker build` succeeds, health endpoint responds

#### Database Service
- **Technology**: PostgreSQL 15+ (or adapt as needed)
- **Setup**: Standard PostgreSQL container or custom Dockerfile
- **Configuration**: Environment variables for credentials
- **Structure**: Database initialization directory structure
- **Validation**: Database starts and accepts connections

### Step 1.2: Docker Compose Integration

#### Service Orchestration
- **docker-compose.yml**: Define all services with proper dependencies
- **Custom network**: Internal communication between services
- **Port mappings**: External access configuration (3000, 8000, 8001, 5432)
- **Service dependencies**: Startup order (database → services → frontend)

#### Environment Configuration
- **.env files**: Sensitive configuration and service URLs
- **Environment variables**: Database credentials, service endpoints
- **Development settings**: Debug modes, hot reload configuration

#### Volume Management
- **Development volumes**: Source code mounting for hot reload
- **Database persistence**: PostgreSQL data volume
- **Log aggregation**: Centralized logging setup (optional)

### Step 1.3: End-to-End Validation

#### Startup Verification
- **One-command startup**: `docker-compose up` works cleanly
- **Health checks**: All services report healthy status
- **Service communication**: Internal network connectivity verified
- **External access**: All exposed ports accessible from host

#### Development Workflow
- **Hot reload**: Code changes reflect immediately
- **Log visibility**: Easy access to service logs
- **Clean shutdown**: `docker-compose down` stops all services
- **Rebuild capability**: Easy image rebuilding for dependency changes

## Standard Port Assignments

| Service | Port | Purpose |
|---------|------|---------|
| Frontend | 3000 | React development server |
| Main Backend | 8000 | Primary API endpoints |
| Secondary Service | 8001 | Specialized service endpoints |
| Database | 5432 | PostgreSQL connection |





## Success Criteria Checklist

### Individual Services
- [ ] Each Dockerfile builds successfully
- [ ] Each service starts independently
- [ ] Health endpoints respond correctly
- [ ] Dependencies install without errors

### Integration
- [ ] `docker-compose up` starts all services
- [ ] Services can communicate internally
- [ ] External ports accessible from host
- [ ] Environment variables loaded correctly

### Development Workflow
- [ ] Hot reload works for frontend and backend
- [ ] Code changes reflect immediately
- [ ] Logs are visible and helpful
- [ ] Services restart cleanly after crashes

### Performance Ready
- [ ] Infrastructure supports performance measurement
- [ ] Services configured for optimization testing
- [ ] Baseline performance can be established
- [ ] System ready for "broken state" implementation

## Next Steps: Repository Setup

After completing infrastructure setup, this is the ideal point to create the project repository and prepare for development.

## Next Steps: Repository Setup

After completing infrastructure setup, this is the ideal point to create the project repository as a git submodule in the main Lazy Bird project.

### Create Individual Broken System Repository

```bash
# Initialize git repository for this broken system
git init

# Add all infrastructure files
git add .

# Initial commit
git commit -m "Initial infrastructure setup"

# Create GitHub repository for this specific broken system
gh repo create br-lazy-bird/domain-XX-system-name --public --source=. --remote=origin --push

# Or manually create repository on GitHub and add remote
git remote add origin https://github.com/br-lazy-bird/domain-XX-system-name.git
git branch -M main
git push -u origin main
```

### Add as Submodule to Main Lazy Bird Repository

```bash
# Navigate to main lazy-bird repository
cd /path/to/lazy-bird

# Add this broken system as a submodule
git submodule add https://github.com/br-lazy-bird/domain-XX-system-name.git domain-XX-system-name

# Commit the submodule addition
git add .gitmodules domain-XX-system-name
git commit -m "Add domain-XX-system-name broken system"
git push origin main
```

### Submodule Development Workflow

```bash
# Working on the broken system
cd domain-XX-system-name

# Make changes, commit, and push
git add .
git commit -m "Implement feature"
git push origin main

# Update main repository to point to latest submodule commit
cd ..
git add domain-XX-system-name
git commit -m "Update domain-XX-system-name submodule"
git push origin main
```

### Create .gitignore

Add a comprehensive .gitignore file for the multi-service project:

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Docker
.docker/
docker-compose.override.yml

# Frontend (Node.js)
frontend/node_modules/
frontend/npm-debug.log*
frontend/yarn-debug.log*
frontend/yarn-error.log*
frontend/build/
frontend/.DS_Store

# Backend (Python)
backend/__pycache__/
backend/*.py[cod]
backend/*$py.class
backend/*.so
backend/.coverage
backend/htmlcov/
backend/.pytest_cache/
backend/.mypy_cache/
backend/venv/
backend/env/

# Secondary Service (Python)
secondary-service/__pycache__/
secondary-service/*.py[cod]
secondary-service/*$py.class
secondary-service/venv/
secondary-service/env/

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

### Repository Structure Validation

Ensure your repository is properly structured:

```bash
# Verify structure
tree -I 'node_modules|__pycache__|.git'

# Test Docker setup
docker-compose build --no-cache
docker-compose up -d
docker-compose ps
docker-compose down
```

Continue with database schema design and service implementation.

---

**Note**: This framework prioritizes consistency across Lazy Bird systems while maintaining flexibility for different optimization concepts. Adapt the pattern to match your specific learning objectives while preserving the core infrastructure approach.
