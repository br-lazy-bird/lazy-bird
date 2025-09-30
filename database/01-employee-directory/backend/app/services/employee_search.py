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
    """

    def __init__(self, db: Session):
        self.db = db
        self.employee_repo = EmployeeRepository(db)

    def get_john_smith_count(self) -> int:
        """
        Get the count of employees with first_name = John and last_name = Smith

        Returns:
            dict: Search results with timing information
                {
                    'results_count': Number of employees found,
                    'execution_time_ms': Query execution time in milliseconds,
                }
        """

        return self.employee_repo.get_john_smith_count()
