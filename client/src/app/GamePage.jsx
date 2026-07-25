import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import { useGameStore } from "../stores/game.store";
import { useSocketStore } from "../stores/socket.store";
import { useGameLogic } from "../hooks/useGameLogic";
import Board from "../features/game/Board";
import ScoreBar from "../features/game/ScoreBar";
import WinnerBanner from "../features/game/WinnerBanner";
import MatchHistory from "../features/game/MatchHistory";
import SettingsModal from "../features/game/SettingsModal";
import ClickSpark from "../animation/ClickSpark";

export default function GamePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const mode = location.state?.mode || "pvp-local";
  const difficulty = location.state?.difficulty || "Normal";

  const gameMode = useGameStore((s) => s.gameMode);
  const setGameMode = useGameStore((s) => s.setGameMode);
  const setDifficulty = useGameStore((s) => s.setDifficulty);
  const isPlayerTurn = useGameStore((s) => s.isPlayerTurn);
  const resetGame = useGameStore((s) => s.resetGame);
  const resetAll = useGameStore((s) => s.resetAll);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { handlePlayerClick } = useGameLogic();

  useEffect(() => {
    setGameMode(mode);
    if (difficulty) setDifficulty(difficulty);
    resetGame();

    return () => {
      if (mode === "pvp-online") {
        useGameStore.getState().resetAll();
      }
    };
  }, []);

  const handleGoHome = () => {
    resetAll();
    navigate("/");
  };

  const handlePlayAgain = () => {
    if (gameMode === "pvp-online") {
      const socket = useSocketStore.getState().socket;
      if (socket) {
        socket.emit("play_again", { room_code: useGameStore.getState().roomCode });
        return;
      }
    }
    resetGame();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-start pt-8 pb-8 gap-4 h-screen overflow-y-auto custom-scrollbar">
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-6 right-6 p-3 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:rotate-90 transition-all shadow-lg z-50"
      >
        <FaCog size={24} />
      </button>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onGoHome={handleGoHome}
      />

      <h1 className="text-4xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg select-none">
        GHOST TAC TOE
      </h1>

      <ScoreBar />

      <WinnerBanner onPlayAgain={handlePlayAgain} />

      <ClickSpark
        sparkColor={isPlayerTurn ? "#22d3ee" : "#ec4899"}
        sparkSize={10}
        sparkRadius={20}
        sparkCount={8}
        duration={400}
      >
        <Board onCellClick={handlePlayerClick} />
      </ClickSpark>

      <MatchHistory />
    </div>
  );
}
