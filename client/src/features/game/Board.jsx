import { useGameStore } from "../../stores/game.store";
import Square from "../../components/Square";
import { GAME_MODES } from "../../lib/constants";

export default function Board({ onCellClick }) {
  const squares = useGameStore((s) => s.squares);
  const playerMoves = useGameStore((s) => s.playerMoves);
  const aiMoves = useGameStore((s) => s.aiMoves);
  const winningLine = useGameStore((s) => s.winningLine);
  const gameMode = useGameStore((s) => s.gameMode);
  const playerSymbol = useGameStore((s) => s.playerSymbol);
  const isPlayerTurn = useGameStore((s) => s.isPlayerTurn);

  return (
    <div className="grid grid-cols-3 gap-3 w-fit mx-auto bg-gray-800/80 backdrop-blur-sm p-3 rounded-2xl shadow-2xl border border-gray-700 relative">
      {squares.map((value, index) => {
        let isFading = false;
        if (gameMode === GAME_MODES.PVP_ONLINE) {
          const isPlayerX = playerSymbol === "X";
          const pMoves = isPlayerX ? playerMoves : aiMoves;
          const oMoves = isPlayerX ? aiMoves : playerMoves;
          if (value === "X" && pMoves[0] === index && pMoves.length === 3) isFading = true;
          if (value === "O" && oMoves[0] === index && oMoves.length === 3) isFading = true;
        } else {
          if (value === "X" && playerMoves[0] === index && playerMoves.length === 3) isFading = true;
          if (value === "O" && aiMoves[0] === index && aiMoves.length === 3) isFading = true;
        }

        return (
          <Square
            key={index}
            value={value}
            isFading={isFading}
            isWinning={winningLine.includes(index)}
            isPlayerPiece={value === "X"}
            onClick={() => onCellClick(index)}
          />
        );
      })}
    </div>
  );
}
