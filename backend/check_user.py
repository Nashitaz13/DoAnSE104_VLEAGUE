from sqlmodel import Session, select
from app.core.db import engine
from app.models import TaiKhoan
from app.core.security import verify_password, get_password_hash

def check_user():
    username = "hanoi"
    password = "hanoi123"
    
    with Session(engine) as session:
        statement = select(TaiKhoan).where(TaiKhoan.tendangnhap == username)
        user = session.exec(statement).first()
        
        if not user:
            print(f"User {username} NOT FOUND in database.")
            return
            
        print(f"User found: {user.tendangnhap}")
        print(f"Role ID: {user.manhom}")
        print(f"Is Active: {user.isactive}")
        print(f"Stored Hash: {user.matkhau}")
        
        is_valid = verify_password(password, user.matkhau)
        print(f"Password verification: {is_valid}")
        
        if not is_valid:
            print("Trying to hash the password and compare manually...")
            new_hash = get_password_hash(password)
            print(f"New Hash: {new_hash}")
            print(f"Verify New Hash: {verify_password(password, new_hash)}")

if __name__ == "__main__":
    check_user()
