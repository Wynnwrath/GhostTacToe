import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { useSocketStore } from "../stores/socket.store";
import CreateRoom from "../features/lobby/CreateRoom";
import JoinRoom from "../features/lobby/JoinRoom";
import BlurText from "../animation/BlurText";

export default function LobbyPage() {
  const [tab, setTab] = useState("create");
  const isConnected = useSocketStore((s) => s.isConnected);
  const { connect } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/auth", { state: { from: "/lobby" } });
      return;
    }
    connect();
  }, []);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-8 p-4">
      <div className="w-full max-w-3xl">
        <BlurText
          text="PLAY ONLINE"
          className="text-4xl md:text-7xl font-black text-center tracking-tighter uppercase italic text-cyan-400 drop-shadow-lg"
        />
      </div>

      {!isConnected ? (
        <p className="text-gray-400 animate-pulse">Connecting to server...</p>
      ) : (
        <>
          <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setTab("create")}
              className={`px-6 py-2 rounded-md font-bold text-sm transition ${
                tab === "create" ? "bg-cyan-400 text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Create Room
            </button>
            <button
              onClick={() => setTab("join")}
              className={`px-6 py-2 rounded-md font-bold text-sm transition ${
                tab === "join" ? "bg-pink-500 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Join Room
            </button>
          </div>

          <div className="animate-fade-in-up">
            {tab === "create" ? <CreateRoom /> : <JoinRoom />}
          </div>
        </>
      )}

      <button
        onClick={() => navigate("/")}
        className="mt-4 text-gray-500 hover:text-white text-sm transition flex items-center gap-1"
      >
        &larr; Back to Menu
      </button>
    </div>
  );
}
