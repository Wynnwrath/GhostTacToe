import { FaRedo, FaHistory, FaHome } from "react-icons/fa";
import { Modal } from "../../components/ui/Modal";
import { useGameStore } from "../../stores/game.store";

export default function SettingsModal({ isOpen, onClose, onGoHome }) {
  const resetGame = useGameStore((s) => s.resetGame);
  const clearHistory = useGameStore((s) => s.clearHistory);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Paused">
      <div className="flex flex-col gap-3">
        <button
          onClick={() => {
            resetGame();
            onClose();
          }}
          className="flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-bold transition"
        >
          <FaRedo /> Restart Game
        </button>
        <button
          onClick={() => {
            clearHistory();
            onClose();
          }}
          className="flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded-lg font-bold transition"
        >
          <FaHistory /> Clear History
        </button>
        <button
          onClick={onGoHome}
          className="flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-bold transition"
        >
          <FaHome /> Main Menu
        </button>
      </div>
    </Modal>
  );
}
