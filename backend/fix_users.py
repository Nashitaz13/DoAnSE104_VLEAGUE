import logging
from sqlmodel import Session, select
from app.core.db import engine
from app.models import TaiKhoan
from app.core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fix_users():
    updates = [
        ("admin", "admin123"),
        ("hanoi", "hanoi123"),
        ("binhdinh", "binhdinh123"),
        ("SLNA", "SLNA123"),
        ("trongtai1", "trongtai123"),
    ]
    
    with Session(engine) as session:
        for username, password in updates:
            statement = select(TaiKhoan).where(TaiKhoan.tendangnhap == username)
            user = session.exec(statement).first()
            if user:
                hashed_pw = get_password_hash(password)
                user.matkhau = hashed_pw
                session.add(user)
                logger.info(f"Updated password for {username}")
            else:
                logger.warning(f"User {username} not found")
        
        session.commit()
    logger.info("Password updates completed.")

if __name__ == "__main__":
    fix_users()
