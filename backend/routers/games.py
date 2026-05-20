from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
import models, schemas

router = APIRouter(prefix="/api/games", tags=["games"])

GAMES = {
    "minecraft": {
        "name": "minecraft",
        "display_name": "Minecraft"
    },
    "cs": {
        "name": "cs",
        "display_name": "Counter-Strike"
    },
    "fortnite": {
        "name": "fortnite",
        "display_name": "Fortnite"
    },
    "rocketleague": {
        "name": "rocketleague",
        "display_name": "Rocket League"
    }
}


@router.get("/", response_model=list[schemas.GameInfo])
def get_games(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    games_list = []

    for game_key, game_data in GAMES.items():

        servers = db.query(models.GameServer).filter(
            models.GameServer.game == game_key,
            models.GameServer.status == "online"
        ).all()

        servers_online = len(servers)
        players_online = sum(server.current_players for server in servers)

        games_list.append(
            schemas.GameInfo(
                name=game_data["name"],
                display_name=game_data["display_name"],
                servers_online=servers_online,
                players_online=players_online
            )
        )

    return games_list


@router.get("/{game_name}", response_model=schemas.GameInfo)
def get_game(
    game_name: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if game_name not in GAMES:
        raise HTTPException(status_code=404, detail="Jogo não encontrado")

    game_data = GAMES[game_name]

    servers = db.query(models.GameServer).filter(
        models.GameServer.game == game_name,
        models.GameServer.status == "online"
    ).all()

    servers_online = len(servers)
    players_online = sum(server.current_players for server in servers)

    return schemas.GameInfo(
        name=game_data["name"],
        display_name=game_data["display_name"],
        servers_online=servers_online,
        players_online=players_online
    )