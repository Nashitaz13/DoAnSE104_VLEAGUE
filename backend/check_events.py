from sqlmodel import Session, select
from app.core.db import engine
from app.models import SuKienTranDau, CauThu, LichThiDau

with Session(engine) as session:
    # Check events
    events = session.exec(select(SuKienTranDau)).all()
    print(f"Total events in database: {len(events)}")
    
    if events:
        print("\nFirst 5 events:")
        for event in events[:5]:
            player = session.get(CauThu, event.macauthu)
            print(f"  - {event.loaisukien} by {player.tencauthu if player else event.macauthu} (Match: {event.matran})")
    
    # Check matches
    matches = session.exec(select(LichThiDau)).all()
    print(f"\nTotal matches: {len(matches)}")
    
    # Check players
    players = session.exec(select(CauThu)).all()
    print(f"Total players: {len(players)}")
    if players:
        print(f"Sample player: {players[0].macauthu} - {players[0].tencauthu}")
