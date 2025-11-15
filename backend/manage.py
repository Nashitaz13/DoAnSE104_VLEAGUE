from __future__ import annotations

import secrets
import subprocess

import typer
import uvicorn
from tortoise import Tortoise

from app.db.config import TORTOISE_ORM

cli = typer.Typer()


@cli.command("migrate-db")
def migrate_db():
    """Apply database migrations"""
    subprocess.run(("aerich", "upgrade"))


@cli.command("run-server")
def run_server():
    """Run the API development server(uvicorn)."""
    migrate_db()
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=True,
    )


@cli.command("secret-key")
def secret_key():
    """Generate a secret key for your application"""
    typer.secho(f"{secrets.token_urlsafe(64)}", fg=typer.colors.GREEN)


if __name__ == "__main__":
    cli()
