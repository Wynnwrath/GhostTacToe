export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

export const GAME_MODES = {
  PVP_LOCAL: "pvp-local",
  PVP_ONLINE: "pvp-online",
  VS_AI: "vs-ai",
};

export const DIFFICULTIES = ["Easy", "Normal", "Hard", "Impossible"];

export const ROOM_CODE_LENGTH = 4;
