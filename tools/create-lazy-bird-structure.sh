#!/bin/bash

# Lazy Bird Project Structure Generator
# Usage: ./create-lazy-bird-structure.sh <domain-name> <project-name> [secondary-services-count]

# Check if required parameters are provided
if [ $# -lt 2 ]; then
    echo "Error: Please provide domain name and project name"
    echo "Usage: $0 <domain-name> <project-name> [secondary-services-count]"
    echo "Example: $0 database 01-employee-directory"
    echo "Example: $0 caching 01-content-delivery 1"
    echo ""
    echo "domain-name: Domain category (database, caching, apis, etc.)"
    echo "project-name: Specific broken system name (01-employee-directory, etc.)"
    echo "secondary-services-count: Number of secondary services (default: 0)"
    echo "  - 0: No secondary services (3-tier: frontend + backend + database)"
    echo "  - 1: One secondary service (4-tier: standard microservices pattern)"
    echo "  - 2+: Multiple secondary services (complex microservices)"
    exit 1
fi

DOMAIN_NAME="$1"
PROJECT_NAME="$2"
SECONDARY_SERVICES_COUNT="${3:-0}"  # Default to 0 if not provided

# Validate domain name (basic check)
if [[ ! "$DOMAIN_NAME" =~ ^[a-z0-9-]+$ ]]; then
    echo "Error: Domain name should only contain lowercase letters, numbers, and hyphens"
    echo "Example: database, caching, apis"
    exit 1
fi

# Validate project name (basic check)
if [[ ! "$PROJECT_NAME" =~ ^[a-z0-9-]+$ ]]; then
    echo "Error: Project name should only contain lowercase letters, numbers, and hyphens"
    echo "Example: 01-employee-directory, 01-content-delivery"
    exit 1
fi

# Validate secondary services count
if ! [[ "$SECONDARY_SERVICES_COUNT" =~ ^[0-9]+$ ]] || [ "$SECONDARY_SERVICES_COUNT" -lt 0 ]; then
    echo "Error: Secondary services count must be a non-negative integer"
    echo "Examples: 0 (no secondary services), 1 (one service), 2 (two services)"
    exit 1
fi

echo "Creating Lazy Bird project structure for: $DOMAIN_NAME/$PROJECT_NAME"
if [ "$SECONDARY_SERVICES_COUNT" -eq 0 ]; then
    echo "Architecture: 3-tier (frontend + backend + database)"
elif [ "$SECONDARY_SERVICES_COUNT" -eq 1 ]; then
    echo "Architecture: 4-tier (frontend + backend + 1 secondary service + database)"
else
    echo "Architecture: Complex microservices (frontend + backend + $SECONDARY_SERVICES_COUNT secondary services + database)"
fi

# Navigate to broken-systems directory (script runs from tools/)
cd ../broken-systems

# Create domain directory if it doesn't exist
mkdir -p "$DOMAIN_NAME"
echo "Domain directory: broken-systems/$DOMAIN_NAME/"

# Create and navigate to project directory
mkdir -p "$DOMAIN_NAME/$PROJECT_NAME"
cd "$DOMAIN_NAME/$PROJECT_NAME"
echo "Project directory: broken-systems/$DOMAIN_NAME/$PROJECT_NAME/"

# Create directory structure
echo "Creating directories..."

# Frontend structure
mkdir -p frontend/src
mkdir -p frontend/public

# Backend structure  
mkdir -p backend/app

# Secondary services structure (if any)
if [ "$SECONDARY_SERVICES_COUNT" -gt 0 ]; then
    for i in $(seq 1 $SECONDARY_SERVICES_COUNT); do
        if [ "$SECONDARY_SERVICES_COUNT" -eq 1 ]; then
            # Single secondary service - use simple name
            SERVICE_DIR="secondary-service"
        else
            # Multiple secondary services - use numbered names
            SERVICE_DIR="secondary-service-$i"
        fi
        mkdir -p "$SERVICE_DIR/app"
        echo "Created: $SERVICE_DIR/"
    done
fi

# Database structure
mkdir -p database/init

echo "Creating empty files..."

# Frontend files
touch frontend/src/.gitkeep
touch frontend/public/.gitkeep
touch frontend/package.json
touch frontend/tsconfig.json
touch frontend/Dockerfile

# Backend files
touch backend/app/main.py
touch backend/requirements.txt
touch backend/Dockerfile

# Secondary service files (if any)
if [ "$SECONDARY_SERVICES_COUNT" -gt 0 ]; then
    for i in $(seq 1 $SECONDARY_SERVICES_COUNT); do
        if [ "$SECONDARY_SERVICES_COUNT" -eq 1 ]; then
            SERVICE_DIR="secondary-service"
        else
            SERVICE_DIR="secondary-service-$i"
        fi
        touch "$SERVICE_DIR/app/main.py"
        touch "$SERVICE_DIR/requirements.txt"
        touch "$SERVICE_DIR/Dockerfile"
    done
fi

# Database files
touch database/init/.gitkeep

# Root files
touch docker-compose.yml
touch .env
touch .env.development
touch .gitignore
touch README.md

echo ""
echo "✅ Project structure created successfully!"
echo ""
echo "📁 Domain: $DOMAIN_NAME"
echo "📂 Project: $PROJECT_NAME"
echo "🏗️  Full path: broken-systems/$DOMAIN_NAME/$PROJECT_NAME/"
echo ""
echo "📂 Structure:"
tree "." 2>/dev/null || find . -type d -exec echo "📂 {}" \; -o -type f -exec echo "📄 {}" \;

echo ""
echo "🚀 Next steps:"
echo "1. cd broken-systems/$DOMAIN_NAME/$PROJECT_NAME"
echo "2. Start implementing Step 1.1: Individual Service Scaffolding + Dockerfiles"
echo "3. Follow the Lazy Bird Infrastructure Framework"

echo ""
echo "📝 Files created (all empty and ready for editing):"
echo "   - Frontend: package.json, tsconfig.json, Dockerfile"
echo "   - Backend: main.py, requirements.txt, Dockerfile"
if [ "$SECONDARY_SERVICES_COUNT" -gt 0 ]; then
    if [ "$SECONDARY_SERVICES_COUNT" -eq 1 ]; then
        echo "   - Secondary Service: main.py, requirements.txt, Dockerfile"
    else
        echo "   - Secondary Services ($SECONDARY_SERVICES_COUNT): main.py, requirements.txt, Dockerfile (each)"
    fi
fi
echo "   - Root: docker-compose.yml, .env, .env.development, .gitignore, README.md"
