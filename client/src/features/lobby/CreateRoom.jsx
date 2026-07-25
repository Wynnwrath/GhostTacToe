import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocketStore } from "../../stores/socket.store";
import { useGameStore } from "../../stores/game.store";
import { GAME_MODES } from "../../lib/constants";

export default function CreateRoom() {
  const [roomCode, setRoomCode] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();
  const socket = useSocketStore((s) => s.socket);

  const handleCreate = () => {
    if (!socket) return;
    setWaiting(true);

    socket.emit("create_room");

    socket.once("room_created", (data) => {
      setRoomCode(data.room_code);
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

  const copyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {!roomCode ? (
        <button
          onClick={handleCreate}
          className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-black text-white text-xl shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-110 hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all"
        >
          Create Room
        </button>
      ) : (
        <>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Share this code</p>
          <div className="flex gap-3">
            {roomCode.split("").map((char, i) => (
              <div
                key={i}
                className="w-16 h-20 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center text-4xl font-black text-cyan-400 shadow-lg"
              >
                {char}
              </div>
            ))}
          </div>
          <button
            onClick={copyCode}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-bold text-sm transition border border-gray-700"
          >
            Copy Code
          </button>

          {waiting && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-gray-400">Waiting for opponent</span>
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "200ms" }} />
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "400ms" }} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
