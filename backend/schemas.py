from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Auth schemas
class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Server schemas
class GameServerResponse(BaseModel):
    id: int
    name: str
    game: str
    status: str
    current_players: int
    max_players: int
    region: str
    pod_name: Optional[str] = None
    node_name: Optional[str] = None
    created_at: datetime
    uptime: Optional[str] = None

    class Config:
        from_attributes = True

class ServerConnectionResponse(BaseModel):
    id: int
    server: GameServerResponse
    connected_at: datetime

    class Config:
        from_attributes = True

# Game schemas
class GameInfo(BaseModel):
    name: str
    display_name: str
    banner_url: str
    servers_online: int
    players_online: int

# Dashboard schemas
class ClusterInfo(BaseModel):
    total_pods: int
    running_pods: int
    total_nodes: int
    total_players: int
    deployments: int