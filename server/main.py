import os
import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base
from app.api.router import api_router
from app.socket.handlers import sio


async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(title="GhostTacToe API", lifespan=lifespan)

origins = [settings.CLIENT_URL] if settings.CLIENT_URL != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=settings.CLIENT_URL != "*",
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

# Serve client build in production
server_dir = os.path.dirname(os.path.abspath(__file__))
client_dist = os.path.join(server_dir, "..", "client", "dist")
if os.path.exists(client_dist):
    app.mount("/", StaticFiles(directory=client_dist, html=True), name="client")

socket_app = socketio.ASGIApp(sio, app)
