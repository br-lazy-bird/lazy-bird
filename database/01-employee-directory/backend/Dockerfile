# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
gcc \
libpq-dev \
&& rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ .

# Expose port
EXPOSE 8000

# Command will be overridden by docker-compose for development
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]