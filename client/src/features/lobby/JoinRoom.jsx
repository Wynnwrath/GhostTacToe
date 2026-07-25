import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocketStore } from "../../stores/socket.store";
import { useGameStore } from "../../stores/game.store";
import { GAME_MODES, ROOM_CODE_LENGTH } from "../../lib/constants";

export default function JoinRoom() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const socket = useSocketStore((s) => s.socket);

  const handleJoin = () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== ROOM_CODE_LENGTH) {
      setError("Room code must be 4 characters");
      return;
    }

    if (!socket) return;
    setError("");

    socket.emit("join_room", { room_code: trimmed });

    socket.once("room_error", (data) => {
      setError(data.message || "Failed to join room");
    });

    socket.once("room_joined", (data) => {
      useGameStore.getState().setRoomCode(data.room_code);
      useGameStore.getState().setPlayerSymbol(data.symbol);
      useGameStore.getState().setGameMode(GAME_MODES.PVP_ONLINE);
    });

    socket.once("game_start", () => {
      useGameStore.getState().resetGame();
      useGameStore.getState().setOpponentConnected(true);
      navigate("/game", { state: { mode: GAME_MODES.PVP_ONLINE } });
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Enter room code</p>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, ROOM_CODE_LENGTH))}
        onKeyDown={(e) => e.key === "Enter" && handleJoin()}
        placeholder="A3F2"
        maxLength={ROOM_CODE_LENGTH}
        className={`w-48 text-center text-4xl font-black tracking-[0.5em] bg-gray-800 border ${
          error ? "border-red-500" : "border-gray-700"
        } rounded-xl py-4 text-cyan-400 placeholder-gray-700 focus:outline-none focus:border-cyan-400 transition-colors`}
        autoFocus
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleJoin}
        className="px-10 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl font-black text-white text-xl hover:scale-110 transition-all shadow-lg"
      >
        Join Game
      </button>
    </div>
  );
}
