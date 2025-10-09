.PHONY: help run stop clean test test-db-up test-db-down test-shell logs db-shell

# Default target
help:
	@echo "Available commands:"
	@echo "  make run          - Start the application (frontend + backend + database)"
	@echo "  make stop         - Stop the application"
	@echo "  make clean        - Stop and remove all containers and volumes"
	@echo "  make logs         - Show application logs"
	@echo "  make db-shell     - Open PostgreSQL shell for development database"
	@echo "  make test         - Run integration tests (fully containerized)"
	@echo "  make test-db-up   - Start test database only"
	@echo "  make test-db-down - Stop test database"
	@echo "  make test-shell   - Open shell in test runner container"

# Application commands
run:
	@echo "Starting application..."
	docker compose up --build

stop:
	@echo "Stopping application..."
	docker compose down

clean:
	@echo "Cleaning up all containers and volumes..."
	docker compose down -v
	docker compose -f compose.test.yaml down -v

logs:
	@echo "Showing application logs..."
	docker compose logs -f

db-shell:
	@echo "Opening PostgreSQL shell..."
	docker compose exec db psql -U lazybird_dev -d employee_directory

# Test commands
test:
	@echo "Running integration tests..."
	@docker compose -f compose.test.yaml up --build --abort-on-container-exit --exit-code-from test-runner 2>&1 | grep -E "test-runner|PASSED|FAILED|ERROR|SUCCESS|===|---"
	@echo "Cleaning up test containers..."
	@docker compose -f compose.test.yaml down > /dev/null 2>&1

test-db-up:
	@echo "Starting test database..."
	docker compose -f compose.test.yaml up -d test-db

test-db-down:
	@echo "Stopping test database..."
	docker compose -f compose.test.yaml down

test-shell:
	@echo "Opening shell in test runner container..."
	docker compose -f compose.test.yaml run --rm test-runner /bin/bash