# Docker compose configuration
DOCKER_DIR = docker
COMPOSE_FILE = $(DOCKER_DIR)/compose.yaml
COMPOSE_TEST_FILE = $(DOCKER_DIR)/compose.test.yaml
ENV_FILE = .env

.PHONY: help run build stop clean test test-build test-db-up test-db-down test-shell logs db-shell

# Default target
help:
	@echo "Available commands:"
	@echo "  make run          - Start the application (frontend + backend + database)"
	@echo "  make build        - Build and start the application"
	@echo "  make stop         - Stop the application"
	@echo "  make clean        - Stop and remove all containers and volumes"
	@echo "  make logs         - Show application logs"
	@echo "  make db-shell     - Open PostgreSQL shell for development database"
	@echo "  make test         - Run integration tests (uses existing images)"
	@echo "  make test-build   - Rebuild test images and run tests"
	@echo "  make test-db-up   - Start test database only"
	@echo "  make test-db-down - Stop test database"
	@echo "  make test-shell   - Open shell in test runner container"

# Application commands
run:
	@echo "Starting application..."
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up -d

build:
	@echo "Building and starting application..."
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up --build -d

stop:
	@echo "Stopping application..."
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) down

clean:
	@echo "Cleaning up all containers, volumes, and images..."
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) down -v --rmi all --remove-orphans
	docker compose -f $(COMPOSE_TEST_FILE) --env-file $(ENV_FILE) down -v --rmi all --remove-orphans

logs:
	@echo "Showing application logs..."
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) logs -f

db-shell:
	@echo "Opening PostgreSQL shell..."
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) exec db psql -U lazybird_dev -d flash_sale

# Test commands
test:
	@echo "Running integration tests..."
	@docker compose -f $(COMPOSE_TEST_FILE) --env-file $(ENV_FILE) up --abort-on-container-exit --exit-code-from test-runner 2>&1 | grep -E "test-runner|PASSED|FAILED|ERROR|SUCCESS|AssertionError|assert |===|---"
	@echo "Cleaning up test containers..."
	@docker compose -f $(COMPOSE_TEST_FILE) --env-file $(ENV_FILE) down > /dev/null 2>&1

test-build:
	@echo "Building test images and running tests..."
	@docker compose -f $(COMPOSE_TEST_FILE) --env-file $(ENV_FILE) up --build --abort-on-container-exit --exit-code-from test-runner 2>&1 | grep -E "test-runner|PASSED|FAILED|ERROR|SUCCESS|AssertionError|assert |===|---"
	@echo "Cleaning up test containers..."
	@docker compose -f $(COMPOSE_TEST_FILE) --env-file $(ENV_FILE) down > /dev/null 2>&1

test-db-up:
	@echo "Starting test database..."
	docker compose -f $(COMPOSE_TEST_FILE) --env-file $(ENV_FILE) up -d test-db

test-db-down:
	@echo "Stopping test database..."
	docker compose -f $(COMPOSE_TEST_FILE) --env-file $(ENV_FILE) down

test-shell:
	@echo "Opening shell in test runner container..."
	docker compose -f $(COMPOSE_TEST_FILE) --env-file $(ENV_FILE) run --rm test-runner /bin/bash