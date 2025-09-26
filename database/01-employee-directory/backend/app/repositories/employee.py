"""
Repository to handle employees table.
"""

import time
from sqlalchemy.orm import Session

from app.models.employee import Employee


class EmployeeRepository:
    """
    Repository for Employee database operations.
    """

    def __init__(self, db: Session) -> None:
        self.db = db

    def search_john_smith(self) -> tuple[int, float]:
        """
        Search for employees with exact name match: John Smith.

        Returns:
            tuple: (list of Employee objects, execution_time_in_seconds)
        """
        start_time = time.perf_counter()
        employee_count = (
            self.db.query(Employee)
            .filter(Employee.first_name == "John")
            .filter(Employee.last_name == "Smith")
            .count()
        )
        end_time = time.perf_counter()
        execution_time = end_time - start_time

        return employee_count, execution_time
