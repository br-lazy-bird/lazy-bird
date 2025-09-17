from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncpg
import os

app = FastAPI(title="Employee Directory API", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Employee Directory API is running!"}

@app.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {"status": "healthy", "service": "backend"}

@app.get("/db-health")
async def database_health():
    """Check database connectivity"""
    try:
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            return {"status": "error", "message": "DATABASE_URL not configured"}
        
        # Test database connection
        conn = await asyncpg.connect(database_url)
        result = await conn.fetchval("SELECT 1")
        await conn.close()
        
        if result == 1:
            return {"status": "healthy", "database": "connected"}
        else:
            return {"status": "error", "database": "connection failed"}
    except Exception as e:
        return {"status": "error", "database": f"connection failed: {str(e)}"}