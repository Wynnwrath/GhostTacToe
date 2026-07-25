import { useRef, useEffect } from "react";
import { useGameStore } from "../../stores/game.store";

export default function MatchHistory() {
  const history = useGameStore((s) => s.history);
  const historyEndRef = useRef(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <div className="w-full max-w-xs mt-2 p-4 bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center">
        Match History
      </h3>

      <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
        {history.length === 0 ? (
          <p className="text-center text-gray-600 text-xs italic">No matches played yet.</p>
        ) : (
          history.map((match) => (
            <div
              key={match.id}
              className="flex justify-between items-center text-xs p-2 bg-gray-800/50 rounded hover:bg-gray-800 transition"
            >
              <span className="text-gray-500 font-mono">{match.timestamp}</span>
              <span
                className={`font-bold ${
                  match.winner === "YOU" || match.winner === "P1" ? "text-cyan-400" : "text-pink-500"
                }`}
              >
                {match.winner === "YOU"
                  ? "YOU WON"
                  : match.winner === "AI"
                    ? "AI WON"
                    : match.winner === "P1"
                      ? "P1 WON"
                      : match.winner === "P2"
                        ? "P2 WON"
                        : match.winner === "OPPONENT"
                          ? "OPPONENT WON"
                          : `${match.winner} WON`}
              </span>
              <span className="text-[10px] bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">
                {match.difficulty}
              </span>
            </div>
          ))
        )}
        <div ref={historyEndRef} />
      </div>
    </div>
  );
}
