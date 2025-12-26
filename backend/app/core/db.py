from pathlib import Path
from sqlmodel import Session, create_engine, text
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Create database engine
engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# Note: Tables should be created with Alembic migrations
# For initial setup, you can create tables manually or use Alembic
# SQLModel.metadata.create_all(engine) - use this if you don't want migrations


def init_db(session: Session) -> None:
    """Placeholder initializer used by `initial_data.py`.

    The project expects an `init_db` function to populate initial records.
    For now this is a no-op so the prestart script can run without error.
    """
    # Define base_dir at the beginning
    base_dir = Path(__file__).resolve().parent.parent.parent.parent

    # Locate schema.sql
    schema_sql_path = base_dir / "database" / "schema.sql"
    if schema_sql_path.exists():
        try:
            # Check if core tables exist (e.g. MuaGiai)
            session.exec(text("SELECT 1 FROM MuaGiai LIMIT 1"))
        except Exception:
            logger.info(f"Core tables missing. Executing {schema_sql_path}")
            try:
                sql_content = schema_sql_path.read_text(encoding="utf-8")
                if sql_content.startswith(u'\ufeff'):
                    sql_content = sql_content[1:]
                session.exec(text(sql_content))
                session.commit()
                logger.info("Schema created successfully.")
            except Exception as e:
                logger.error(f"Error executing schema SQL: {e}")
                session.rollback()

    # Locate auth_setup.sql
    auth_sql_path = base_dir / "database" / "auth_setup.sql"
    if auth_sql_path.exists():
        try:
            # Check if auth data exists
            result = session.exec(text("SELECT count(*) FROM NhomNguoiDung"))
            count = result.one()[0]
            if count == 0:
                logger.info(f"Auth data missing. Executing {auth_sql_path}")
                sql_content = auth_sql_path.read_text(encoding="utf-8")
                if sql_content.startswith(u'\ufeff'):
                    sql_content = sql_content[1:]
                session.exec(text(sql_content))
                session.commit()
                logger.info("Auth setup completed successfully.")
        except Exception as e:
             logger.warning(f"Could not check/run auth setup: {e}")
             session.rollback()

    # Locate create_missing_tables.sql
    # backend/app/core/db.py -> ../../../create_missing_tables.sql
    missing_tables_sql_path = base_dir / "create_missing_tables.sql"
    
    if missing_tables_sql_path.exists():
        logger.info(f"Executing {missing_tables_sql_path}")
        try:
            sql_content = missing_tables_sql_path.read_text(encoding="utf-8")
            if sql_content.startswith(u'\ufeff'):
                sql_content = sql_content[1:]
            session.exec(text(sql_content))
            session.commit()
            logger.info("Missing tables created successfully.")
        except Exception as e:
            logger.error(f"Error executing missing tables SQL: {e}")
            session.rollback()
    else:
        logger.warning(f"create_missing_tables.sql not found at {missing_tables_sql_path}")

    try:
        # Check if data exists to avoid duplicate key errors
        # Using text() for raw SQL since tables might not be mapped yet or we want a simple check
        # Check CauLacBo table to see if V-League data is already imported
        result = session.exec(text("SELECT count(*) FROM CauLacBo"))
        count = result.one()[0]
        if count > 0:
            logger.info("Data already exists in CauLacBo. Skipping data.sql import.")
            return
    except Exception as e:
        logger.warning(f"Could not check CauLacBo count: {e}. Assuming empty.")

    # Locate data.sql
    # backend/app/core/db.py -> ../../../database/data.sql
    data_sql_path = base_dir / "database" / "data.sql"
    
    if not data_sql_path.exists():
        logger.warning(f"data.sql not found at {data_sql_path}")
        return

    logger.info(f"Importing data from {data_sql_path}")
    
    try:
        sql_content = data_sql_path.read_text(encoding="utf-8")
        if sql_content.startswith(u'\ufeff'):
            sql_content = sql_content[1:]
            
        session.exec(text(sql_content))
        session.commit()
        logger.info("Data imported successfully.")
        
        # Fix passwords if necessary (since data.sql has plain text)
        # Check if vleague_hash_password function exists first?
        # Or just run an update using pgcrypto if available.
        # Assuming pgcrypto is installed.
        try:
             # Update plain text passwords to hashed ones if they don't look like bcrypt hashes
             # Bcrypt usually starts with $2
             # This is a heuristic.
             session.exec(text("UPDATE TaiKhoan SET MatKhau = crypt(MatKhau, gen_salt('bf', 8)) WHERE MatKhau NOT LIKE '$2%';"))
             session.commit()
             logger.info("Passwords hashed successfully.")
        except Exception as e:
             logger.warning(f"Could not hash passwords: {e}")
             
    except Exception as e:
        logger.error(f"Error importing data: {e}")
        session.rollback()
