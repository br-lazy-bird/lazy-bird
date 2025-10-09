"""
Employee table model.
"""

from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class Employee(Base):
    """
    Employees table.
    """

    __tablename__ = "employees"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(String, nullable=False)
    last_name: Mapped[str] = mapped_column(String, nullable=False)
    department: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now, nullable=False
    )

    def __repr__(self) -> str:
        return f"<Employee(id={self.id}, name='{self.first_name} {self.last_name}', dept='{self.department}')>"
