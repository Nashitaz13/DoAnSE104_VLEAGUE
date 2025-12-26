from app.core.db import engine
from sqlmodel import Session, select, func
from app.models import CauThu, CauLacBo, LichThiDau

def check_counts():
    with Session(engine) as session:
        player_count = session.exec(select(func.count(CauThu.macauthu))).one()
        team_count = session.exec(select(func.count(CauLacBo.maclb))).one()
        match_count = session.exec(select(func.count(LichThiDau.matran))).one()
        print(f"Players: {player_count}")
        print(f"Teams: {team_count}")
        print(f"Matches: {match_count}")

if __name__ == "__main__":
    check_counts()
