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

    def get_john_smith_count(self) -> int:
        """
        Get the count of employees with first_name = John and last_name = Smith

        Returns:
            employee_count: count of employees called John Smith
        """

        employee_count = (
            self.db.query(Employee)
            .filter(Employee.first_name == "John")
            .filter(Employee.last_name == "Smith")
            .count()
        )

        return employee_count
