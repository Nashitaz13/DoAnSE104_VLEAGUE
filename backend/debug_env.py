"""
Debug script to check if .env file is being loaded correctly
"""
import os
from pathlib import Path

# Check .env file location
env_path = Path(__file__).parent.parent / ".env"
print(f"Looking for .env at: {env_path}")
print(f".env exists: {env_path.exists()}")

if env_path.exists():
    print(f".env size: {env_path.stat().st_size} bytes")
    # Don't print content for security, just check if vars are defined
    content = env_path.read_text()
    print(f"\n.env contains POSTGRESQL_HOST: {'POSTGRESQL_HOST' in content}")
    print(f".env contains POSTGRESQL_USER: {'POSTGRESQL_USER' in content}")
    print(f".env contains POSTGRESQL_DB: {'POSTGRESQL_DB' in content}")
else:
    print("\nERROR: .env file not found!")
    print("Please create .env file at project root with required variables")

# Check environment variables
print("\n--- Environment Variables ---")
print(f"POSTGRESQL_HOST from env: {os.getenv('POSTGRESQL_HOST', 'NOT SET')}")
print(f"POSTGRESQL_USER from env: {os.getenv('POSTGRESQL_USER', 'NOT SET')}")
print(f"POSTGRESQL_DB from env: {os.getenv('POSTGRESQL_DB', 'NOT SET')}")

# Try loading with pydantic-settings
print("\n--- Testing Pydantic Settings ---")
try:
    from app.core.config import settings
    print(f"✓ Settings loaded successfully!")
    print(f"  POSTGRESQL_HOST: {settings.POSTGRESQL_HOST}")
    print(f"  POSTGRESQL_DB: {settings.POSTGRESQL_DB}")
except Exception as e:
    print(f"✗ Failed to load settings:")
    print(f"  Error: {e}")
