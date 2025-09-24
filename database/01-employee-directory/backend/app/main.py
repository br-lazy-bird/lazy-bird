from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .logging_config import setup_logging

setup_logging()

from .dev_endpoints import router as dev_router
from .controllers import router as employee_router

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

app.include_router(dev_router)
app.include_router(employee_router)


@app.get("/")
async def root():
    return {"message": "Employee Directory API is running"}
