from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_admin = Column(Boolean, default=False)

    connections = relationship("ServerConnection", back_populates="user")


class GameServer(Base):
    __tablename__ = "game_servers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    game = Column(String, nullable=False)
    status = Column(String, default="online")
    current_players = Column(Integer, default=0)
    max_players = Column(Integer, default=10)
    region = Column(String, default="us-east-1")
    pod_name = Column(String, nullable=True)
    node_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    connections = relationship("ServerConnection", back_populates="server")


class ServerConnection(Base):
    __tablename__ = "server_connections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    server_id = Column(Integer, ForeignKey("game_servers.id"))
    connected_at = Column(DateTime(timezone=True), server_default=func.now())
    disconnected_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="connections")
    server = relationship("GameServer", back_populates="connections")