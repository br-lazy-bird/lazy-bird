"""
Endpoints to check performance.
"""

import logging
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.core.database import get_db
from app.services.performance import PerformanceService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/performance", tags=["Performance"])


@router.get("/search")
async def check_search_performance(db: Session = Depends(get_db)) -> StreamingResponse:
    """
    Executes 100 search queries and stream progress updates

    Returns:
      Server-Set Events (SSE) stream with real-time progress

    Raises:
        HTTPException: 500 if database error occurs
    """

    try:
        performance_service = PerformanceService(db)
        progress_generator = performance_service.run_performance_test()

        return StreamingResponse(
            progress_generator,
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
        )

    except SQLAlchemyError as e:
        logger.error("Database error in performance_test endpoint: %s}", str(e))
        raise HTTPException(
            status_code=500,
            detail="Database error occurred during performance test",
        ) from e
    except Exception as e:
        logger.error("Unexpected error in performance_test endpoint: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during performance test",
        ) from e
