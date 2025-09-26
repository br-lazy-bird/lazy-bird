"""
Endopoints related to the search
"""

import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.core.database import get_db
from app.services.employee_search import EmployeeSearchService

# Configure logging
logger = logging.getLogger(__name__)

# Create router for employee endpoints
router = APIRouter(prefix="/search", tags=["Employee Search"])


@router.get("/john-smith")
async def search_john_smith(db: Session = Depends(get_db)) -> dict:
    """
    Search for employees named John Smith.

    Returns:
        dict: Search results with performance metrics
            {
                "results_count": int,
                "execution_time_ms": float
            }

    Raises:
        HTTPException: 500 if database error occurs
    """
    try:
        employee_service = EmployeeSearchService(db)
        results = employee_service.search_john_smith()
        return results
    except SQLAlchemyError as e:
        logger.error("Database error in search_john_smith endpoint: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail="Database error occurred while searching for employees",
        ) from e
    except Exception as e:
        logger.error("Unexpected error in search_john_smith endpoint: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while processing your request",
        ) from e
