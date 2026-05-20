from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import auth, games, servers
import asyncio
import time

def create_tables():
    retries = 10
    for i in range(retries):
        try:
            Base.metadata.create_all(bind=engine)
            print("[STARTUP] Tabelas criadas com sucesso!")
            return
        except Exception as e:
            print(f"[STARTUP] Aguardando banco de dados... tentativa {i+1}/{retries}")
            time.sleep(5)
    raise Exception("Não foi possível conectar ao banco de dados")

create_tables()

app = FastAPI(
    title="PMSA Multiplayer Server Platform",
    description="API para gerenciamento de servidores multiplayer simulados",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(games.router)
app.include_router(servers.router)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(servers.cleanup_empty_servers())
    print("[STARTUP] Cleanup automático iniciado")

@app.get("/")
def root():
    return {"message": "PMSA Multiplayer Server Platform API", "status": "online"}

@app.get("/health")
def health():
    return {"status": "healthy"}