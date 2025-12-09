from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise

from app.core.config import settings


TORTOISE_ORM = {
    "connections": {"default": settings.DATABASE_URI},
    "apps": {
        "models": {
            "models": [
                "aerich.models",
                "app.db.models.lookup",
                "app.db.models.user",
                "app.db.models.regulation",
                "app.db.models.season",
                "app.db.models.team",
                "app.db.models.player",
                "app.db.models.match",
                "app.db.models.standings",
            ],
            "default_connection": "default",
        },
    },
}


def register_db(app: FastAPI) -> None:
    register_tortoise(
        app,
        config=TORTOISE_ORM,
        generate_schemas=False,
        add_exception_handlers=True,
    )
