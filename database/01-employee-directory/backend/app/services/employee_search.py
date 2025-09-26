"""
Services for employee search APIs.
"""

from sqlalchemy.orm import Session

from app.repositories.employee import EmployeeRepository
from app.core.logging_config import get_logger

logger = get_logger(__name__)


class EmployeeSearchService:
    """
    Service layer for employee search operations.
    Handles business logic and coordinates between repository and API layers.
    """

    def __init__(self, db: Session):
        self.db = db
        self.employee_repo = EmployeeRepository(db)

    def search_john_smith(self) -> dict:
        """
        Execute the predetermined John Smith search.

        Returns:
            dict: Search results with timing information
                {
                    'results_count': Number of employees found,
                    'execution_time_ms': Query execution time in milliseconds,
                }
        """

        employee_count, execution_time_seconds = self.employee_repo.search_john_smith()
        execution_time_ms = round(execution_time_seconds * 1000, 2)

        logger.info(
            "John Smith search completed: %d results in %.2fms",
            employee_count,
            execution_time_ms,
        )

        return {"results_count": employee_count, "execution_time_ms": execution_time_ms}
