from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

app = FastAPI(
    title="Employee Directory API", description="Lazy Bird Project", version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Employee Directory API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "backend"}


@app.get("/db-test")
async def database_test():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise HTTPException(status_code=500, detail="DATABASE_URL not configured")

    try:
        engine = create_engine(database_url)
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {"status": "connected", "message": "Database connection successful"}

    except Exception as e:
        return {"status": "error", "message": f"Database connection failed: {str(e)}"}
