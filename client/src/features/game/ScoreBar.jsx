import { useGameStore } from "../../stores/game.store";
import { GAME_MODES } from "../../lib/constants";

export default function ScoreBar() {
  const score = useGameStore((s) => s.score);
  const isPlayerTurn = useGameStore((s) => s.isPlayerTurn);
  const gameMode = useGameStore((s) => s.gameMode);
  const difficulty = useGameStore((s) => s.difficulty);

  const p1Label = gameMode === GAME_MODES.PVP_ONLINE ? "YOU" : gameMode === GAME_MODES.PVP_LOCAL ? "PLAYER 1" : "YOU";
  const p2Label = gameMode === GAME_MODES.PVP_ONLINE
    ? "OPPONENT"
    : gameMode === GAME_MODES.PVP_LOCAL
      ? "PLAYER 2"
      : `AI (${difficulty})`;

  return (
    <div className="flex gap-12 text-xl font-bold tracking-wider select-none">
      <div className={`flex flex-col items-center transition-opacity ${!isPlayerTurn ? "opacity-50" : "opacity-100"}`}>
        <span className="text-gray-400 text-xs tracking-widest">{p1Label}</span>
        <span className="text-cyan-400 text-2xl">{score.player}</span>
      </div>
      <div className={`flex flex-col items-center transition-opacity ${isPlayerTurn ? "opacity-50" : "opacity-100"}`}>
        <span className="text-gray-400 text-xs tracking-widest">{p2Label}</span>
        <span className="text-pink-500 text-2xl">{score.ai}</span>
      </div>
    </div>
  );
}
