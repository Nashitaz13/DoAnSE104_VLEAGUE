FROM python:3.10-alpine

WORKDIR /code

# Install build dependencies for asyncpg (PostgreSQL support)
RUN apk update && apk add --no-cache \
    postgresql-dev \
    postgresql-libs \
    libffi-dev \
    gcc \
    musl-dev

# Upgrade pip
RUN pip install --upgrade pip

# Copy requirements.txt and install dependencies
COPY requirements.txt /code/

RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . /code

ENV PORT=8000
EXPOSE 8000

# Run with uvicorn (simplified for student project)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

