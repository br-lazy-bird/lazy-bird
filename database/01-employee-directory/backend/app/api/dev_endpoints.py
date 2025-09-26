"""
Useful endpoints for development.
"""

import os
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from app.core.database import get_db
from app.models.employee import Employee

load_dotenv()

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Checks if the backend is running properly
    """
    return {"status": "healthy", "service": "backend"}


@router.get("/db-test")
async def database_test():
    """
    Checks if the database credentials are set and valid.
    """
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise HTTPException(status_code=500, detail="DATABASE_URL not configured")

    try:
        engine = create_engine(database_url)
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {"status": "connected", "message": "Database connection successful"}

    except SQLAlchemyError as e:
        return {"status": "error", "message": f"Database connection failed: {str(e)}"}


@router.get("/sqlalchemy-test")
async def sqlalchemy_test(db: Session = Depends(get_db)):
    """
    Checks if the ORM is working properly.
    """
    try:
        employee_count = db.query(Employee).count()
        sample_employee = db.query(Employee).first()
        return {
            "status": "connected",
            "message": "SQLAlchemy ORM connection successful",
            "total_employees": employee_count,
            "sample_employee": (
                {
                    "id": sample_employee.id,
                    "first_name": sample_employee.first_name,
                    "last_name": sample_employee.last_name,
                    "department": sample_employee.department,
                    "email": sample_employee.email,
                }
                if sample_employee
                else None
            ),
        }
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500, detail=f"SQLAlchemy connection failed: {str(e)}"
        ) from e
