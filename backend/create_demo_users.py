import logging
from sqlmodel import Session, select
from app.core.db import engine
from app.models import TaiKhoan, NhomNguoiDung
from app.core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_demo_users() -> None:
    users_to_create = [
        {"username": "hanoi", "password": "hanoi123", "role": "CLB", "fullname": "Hanoi FC Manager", "email": "hanoi@vleague.vn"},
        {"username": "binhdinh", "password": "binhdinh123", "role": "CLB", "fullname": "Binh Dinh FC Manager", "email": "binhdinh@vleague.vn"},
        {"username": "SLNA", "password": "SLNA123", "role": "CLB", "fullname": "SLNA Manager", "email": "slna@vleague.vn"},
        {"username": "trongtai1", "password": "trongtai123", "role": "TrongTai", "fullname": "Trong Tai 1", "email": "ref1@vleague.vn"},
        {"username": "trongtai2", "password": "trongtai123", "role": "TrongTai", "fullname": "Trong Tai 2", "email": "ref2@vleague.vn"},
        # Ensure default roles exist or fallback
    ]

    with Session(engine) as session:
        for user_data in users_to_create:
            username = user_data["username"]
            
            # Check if user exists
            statement = select(TaiKhoan).where(TaiKhoan.tendangnhap == username)
            existing_user = session.exec(statement).first()
            
            if existing_user:
                logger.info(f"User {username} already exists. Skipping.")
                # Optional: Update password if needed
                # existing_user.matkhau = get_password_hash(user_data["password"])
                # session.add(existing_user)
                continue

            # Get Role ID
            role_name = user_data["role"]
            role_stmt = select(NhomNguoiDung).where(NhomNguoiDung.tennhom == role_name)
            role = session.exec(role_stmt).first()
            
            if not role:
                logger.warning(f"Role {role_name} not found for user {username}. Creating role.")
                role = NhomNguoiDung(tennhom=role_name, mota=f"Role {role_name}")
                session.add(role)
                session.commit()
                session.refresh(role)
            
            # Create User
            new_user = TaiKhoan(
                tendangnhap=username,
                matkhau=get_password_hash(user_data["password"]),
                hoten=user_data["fullname"],
                email=user_data["email"],
                manhom=role.manhom,
                isactive=True
            )
            session.add(new_user)
            logger.info(f"Created user {username} with role {role_name}")
        
        session.commit()
    logger.info("Demo users creation completed.")

if __name__ == "__main__":
    create_demo_users()
