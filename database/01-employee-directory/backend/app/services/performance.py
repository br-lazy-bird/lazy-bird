"""
Service for performance APIs.
"""

import asyncio
import json
import time
import logging
from typing import AsyncGenerator
from sqlalchemy.orm import Session

from app.services.employee_search import EmployeeSearchService

logger = logging.getLogger(__name__)


class PerformanceService:
    """
    Database performance services.
    """

    def __init__(self, db: Session):
        self.db = db
        self.employee_service = EmployeeSearchService(db)

    async def run_performance_test(
        self, total_queries: int = 100
    ) -> AsyncGenerator[str, None]:
        """
        Execute multiple search queries and yield progress updates

        Args:
            total_queries: Number of queries to execute (default: 100)

        Yields:
            str: Server-Sent Event formatted progress updates
        """
        total_time = 0
        results_count = 0

        i = 0

        for i in range(total_queries):

            start_time = time.time()
            query_result = self.employee_service.search_john_smith()
            results_count = query_result.get("results_count", 0)
            end_time = time.time()
            query_time = (end_time - start_time) * 1000  # Convert to ms
            total_time += query_time

            progress_data = self._create_progress_data(
                i + 1, total_queries, query_time, total_time, results_count
            )

            yield f"data: {json.dumps(progress_data)}\n\n"

            # Small delay to prevent overwhelming
            await asyncio.sleep(0.05)

        # Final summary
        final_result = self._create_final_result(
            total_time, total_queries, results_count
        )
        yield f"data: {json.dumps(final_result)}\n\n"

    def _create_progress_data(
        self,
        current: int,
        total: int,
        query_time: float,
        total_time: float,
        results_count: int,
    ) -> dict:
        """
        Create progress data structure

        Args:
            current: Current query number
            total: Total queries to execute
            query_time: Time for current query in ms
            total_time: Cumulative time in ms
            results_count: Number of results found

        Returns:
            dict: Progress data structure
        """
        return {
            "progress": current,
            "total": total,
            "percentage": round((current / total) * 100, 1),
            "current_query_time": round(query_time, 2),
            "average_time": round(total_time / current, 2),
            "total_time": round(total_time, 2),
            "results_count": results_count,
            "status": "running" if current < total else "completed",
        }

    def _create_final_result(
        self, total_time: float, total_queries: int, results_count: int
    ) -> dict:
        """
        Create final result data structure

        Args:
            total_time: Total execution time in ms
            total_queries: Number of queries executed
            results_count: Number of results found

        Returns:
            dict: Final result data structure
        """
        return {
            "status": "completed",
            "total_execution_time_ms": round(total_time, 2),
            "average_time_ms": round(total_time / total_queries, 2),
            "queries_executed": total_queries,
            "results_count": results_count,
        }
