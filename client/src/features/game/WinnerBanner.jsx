import { useGameStore } from "../../stores/game.store";
import { GAME_MODES } from "../../lib/constants";

export default function WinnerBanner({ onPlayAgain }) {
  const winner = useGameStore((s) => s.winner);
  const gameMode = useGameStore((s) => s.gameMode);
  const isPlayerTurn = useGameStore((s) => s.isPlayerTurn);

  if (!winner) {
    return (
      <div className="h-8 flex items-center justify-center select-none">
        <p className="text-gray-400 animate-pulse font-mono text-sm bg-gray-900/60 px-4 py-1 rounded backdrop-blur-md">
          {gameMode === GAME_MODES.PVP_ONLINE
            ? isPlayerTurn ? "[ YOUR TURN ]" : "[ OPPONENT'S TURN ]"
            : gameMode === GAME_MODES.PVP_LOCAL
              ? isPlayerTurn ? "[ PLAYER 1 TURN ]" : "[ PLAYER 2 TURN ]"
              : isPlayerTurn ? "[ YOUR TURN ]" : "[ AI COMPUTING... ]"}
        </p>
      </div>
    );
  }

  const winText = (() => {
    if (winner === "X") {
      return gameMode === GAME_MODES.PVP_LOCAL
        ? "PLAYER 1 WINS!"
        : gameMode === GAME_MODES.PVP_ONLINE
          ? "YOU WIN!"
          : "VICTORY!";
    }
    return gameMode === GAME_MODES.PVP_LOCAL
      ? "PLAYER 2 WINS!"
      : gameMode === GAME_MODES.PVP_ONLINE
        ? "OPPONENT WINS!"
        : "DEFEAT";
  })();

  return (
    <>
      <div className="h-8 flex items-center justify-center select-none">
        <h2
          className={`text-3xl font-black animate-bounce ${
            winner === "X"
              ? "text-green-500 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]"
              : "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
          }`}
        >
          {winText}
        </h2>
      </div>

      <div className="h-10 flex flex-col items-center justify-center">
        <button
          onClick={onPlayAgain}
          className="animate-fade-in-up px-8 py-2 bg-white text-black font-bold text-lg rounded-full hover:bg-green-400 hover:scale-105 transition-all shadow-lg"
        >
          Play Again
        </button>
      </div>
    </>
  );
}
