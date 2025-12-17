from sqlmodel import Session, create_engine

from app.core.config import settings

# Create database engine
engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# Note: Tables should be created with Alembic migrations
# For initial setup, you can create tables manually or use Alembic
# SQLModel.metadata.create_all(engine) - use this if you don't want migrations
