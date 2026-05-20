from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models, schemas
from kubernetes import client, config
import random
import string
import asyncio
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/servers", tags=["servers"])

def get_k8s_client():
    try:
        config.load_incluster_config()
    except:
        config.load_kube_config()
    return client.CoreV1Api()

def generate_pod_name(game: str):
    suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return f"pmsa-{game}-{suffix}"

def create_game_pod(game: str, pod_name: str):
    k8s = get_k8s_client()
    pod = client.V1Pod(
        metadata=client.V1ObjectMeta(
            name=pod_name,
            namespace="default",
            labels={"app": "pmsa-game-server", "game": game}
        ),
        spec=client.V1PodSpec(
            node_selector={"role": "database"},
            restart_policy="Never",
            containers=[
                client.V1Container(
                    name="game-server",
                    image="alpine:latest",
                    command=["sh", "-c", "echo 'PMSA Game Server Running' && sleep 3600"],
                    resources=client.V1ResourceRequirements(
                        requests={"memory": "64Mi", "cpu": "50m"},
                        limits={"memory": "128Mi", "cpu": "100m"}
                    )
                )
            ]
        )
    )
    k8s.create_namespaced_pod(namespace="default", body=pod)
    return pod_name

def get_pod_node(pod_name: str):
    try:
        k8s = get_k8s_client()
        pod = k8s.read_namespaced_pod(name=pod_name, namespace="default")
        return pod.spec.node_name or "unknown"
    except:
        return "unknown"

async def cleanup_empty_servers():
    while True:
        await asyncio.sleep(60)
        try:
            from database import SessionLocal
            db = SessionLocal()
            cutoff = datetime.utcnow() - timedelta(minutes=5)

            empty_servers = db.query(models.GameServer).filter(
                models.GameServer.status == "online",
                models.GameServer.current_players == 0,
                models.GameServer.created_at < cutoff
            ).all()

            for server in empty_servers:
                server.status = "offline"
                if server.pod_name and not server.pod_name.endswith("simulated"):
                    try:
                        k8s = get_k8s_client()
                        k8s.delete_namespaced_pod(
                            name=server.pod_name,
                            namespace="default"
                        )
                        print(f"[CLEANUP] Pod {server.pod_name} deletado")
                    except Exception as e:
                        print(f"[CLEANUP] Erro ao deletar pod {server.pod_name}: {e}")

                print(f"[CLEANUP] Servidor {server.name} encerrado por inatividade")

            db.commit()
            db.close()
        except Exception as e:
            print(f"[CLEANUP] Erro geral: {e}")

@router.get("/my-connection", response_model=schemas.ServerConnectionResponse)
def get_my_connection(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    connection = db.query(models.ServerConnection).filter(
        models.ServerConnection.user_id == current_user.id,
        models.ServerConnection.disconnected_at == None
    ).first()

    if not connection:
        raise HTTPException(status_code=404, detail="Nenhuma conexão ativa")

    return connection

@router.post("/matchmaking/{game_name}", response_model=schemas.ServerConnectionResponse)
def matchmaking(
    game_name: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    existing = db.query(models.ServerConnection).filter(
        models.ServerConnection.user_id == current_user.id,
        models.ServerConnection.disconnected_at == None
    ).first()

    if existing:
        return existing

    available_server = db.query(models.GameServer).filter(
        models.GameServer.game == game_name,
        models.GameServer.status == "online",
        models.GameServer.current_players < models.GameServer.max_players
    ).first()

    if not available_server:
        pod_name = generate_pod_name(game_name)
        try:
            create_game_pod(game_name, pod_name)
            node_name = get_pod_node(pod_name)
        except Exception as e:
            pod_name = f"pmsa-{game_name}-simulated"
            node_name = "worker-node"

        server_number = db.query(models.GameServer).filter(
            models.GameServer.game == game_name
        ).count() + 1

        available_server = models.GameServer(
            name=f"PMSA {game_name.upper()} Server #{server_number}",
            game=game_name,
            status="online",
            current_players=0,
            max_players=10,
            region="us-east-1",
            pod_name=pod_name,
            node_name=node_name
        )
        db.add(available_server)
        db.commit()
        db.refresh(available_server)

    available_server.current_players += 1
    db.commit()

    connection = models.ServerConnection(
        user_id=current_user.id,
        server_id=available_server.id
    )
    db.add(connection)
    db.commit()
    db.refresh(connection)
    return connection

@router.get("/game/{game_name}", response_model=list[schemas.GameServerResponse])
def get_game_servers(
    game_name: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    servers = db.query(models.GameServer).filter(
        models.GameServer.game == game_name,
        models.GameServer.status == "online"
    ).all()
    
    now = datetime.utcnow()
    for server in servers:
        diff = now - server.created_at.replace(tzinfo=None)
        total_seconds = int(diff.total_seconds())
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        if hours > 0:
            server.uptime = f"{hours}h {minutes}m {seconds}s"
        elif minutes > 0:
            server.uptime = f"{minutes}m {seconds}s"
        else:
            server.uptime = f"{seconds}s"
    
    return servers

@router.delete("/disconnect")
def disconnect(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    connection = db.query(models.ServerConnection).filter(
        models.ServerConnection.user_id == current_user.id,
        models.ServerConnection.disconnected_at == None
    ).first()

    if not connection:
        raise HTTPException(status_code=404, detail="Nenhuma conexão ativa")

    connection.disconnected_at = datetime.utcnow()

    server = db.query(models.GameServer).filter(
        models.GameServer.id == connection.server_id
    ).first()

    if server and server.current_players > 0:
        server.current_players -= 1

    db.commit()
    return {"message": "Desconectado com sucesso"}

@router.get("/cluster/info", response_model=schemas.ClusterInfo)
def get_cluster_info(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        k8s = get_k8s_client()
        pods = k8s.list_namespaced_pod(namespace="default")
        nodes = k8s.list_node()

        total_pods = len(pods.items)
        running_pods = sum(1 for p in pods.items if p.status.phase == "Running")
        total_nodes = len(nodes.items)

        apps_v1 = client.AppsV1Api()
        deployments = apps_v1.list_namespaced_deployment(namespace="default")
        total_deployments = len(deployments.items)

    except:
        total_pods = 0
        running_pods = 0
        total_nodes = 3
        total_deployments = 0

    total_players = db.query(models.ServerConnection).filter(
        models.ServerConnection.disconnected_at == None
    ).count()

    return schemas.ClusterInfo(
        total_pods=total_pods,
        running_pods=running_pods,
        total_nodes=total_nodes,
        total_players=total_players,
        deployments=total_deployments
    )