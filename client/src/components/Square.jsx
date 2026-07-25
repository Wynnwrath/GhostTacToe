import { FaTimes, FaRegCircle } from 'react-icons/fa';

export default function Square({ value, onClick, isFading, isPlayerPiece, isWinning }) {
    return (
        <button 
            className={`
                w-24 h-24 md:w-32 md:h-32 
                
                flex items-center justify-center rounded-xl border-4
                transition-all duration-300 shadow-lg text-5xl md:text-6xl
                
                ${!value ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-900 border-gray-900'}

                ${isWinning ? 'animate-win bg-gray-800' : ''}

                ${isFading && !isWinning && isPlayerPiece ? 'animate-player-fade' : ''}
                ${isFading && !isWinning && !isPlayerPiece ? 'animate-ai-fade' : ''}

                ${value === 'X' && !isFading && !isWinning ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : ''}
                ${value === 'O' && !isFading && !isWinning ? 'text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]' : ''}
            `}
            onClick={onClick}
            disabled={isWinning} 
        >
            {value === 'X' && <FaTimes />}
            {value === 'O' && <FaRegCircle className="text-4xl md:text-5xl" />}
        </button>
    );
}