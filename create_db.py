import psycopg
from psycopg import sql

try:
    # Connect to default 'postgres' database
    conn = psycopg.connect(
        host="localhost",
        user="postgres",
        password="password",
        dbname="postgres",
        autocommit=True
    )

    cursor = conn.cursor()

    # Check if database exists
    cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'vleague'")
    exists = cursor.fetchone()

    if not exists:
        print("Creating database vleague...")
        cursor.execute("CREATE DATABASE vleague")
        print("Database vleague created.")
    else:
        print("Database vleague already exists.")

    conn.close()
except Exception as e:
    print(f"Error: {e}")
