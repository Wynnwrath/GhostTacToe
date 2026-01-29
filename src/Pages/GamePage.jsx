import { useState, useEffect } from 'react';
import { FaCog, FaTimes, FaHome, FaRedo } from 'react-icons/fa';
import Square from '../components/Square'; 
import ClickSpark from '../animation/ClickSpark';
import { getBestAIMove } from '../components/minimax';

export default function GamePage({ difficulty, onGoHome }) {
    const [score, setScore] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('tic-tac-score');
            return saved ? JSON.parse(saved) : { player: 0, ai: 0 };
        }
        return { player: 0, ai: 0 };
    });
    const [aiMoves, setAiMoves] = useState([]);
    const [playerMoves, setPlayerMoves] = useState([]);
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [winner, setWinner] = useState(null);
    const [winningLine, setWinningLine] = useState([]); 
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // --- EFFECTS ---
    useEffect(() => {
        localStorage.setItem('tic-tac-score', JSON.stringify(score));
    }, [score]);

    useEffect(() => {
        if (isPlayerTurn || winner) return;

        const timer = setTimeout(() => {
            const aiMove = getBestAIMove(squares, aiMoves, playerMoves, difficulty);
            if (aiMove !== null) handleMove(aiMove, false); 
        }, 500);

        return () => clearTimeout(timer);
    }, [isPlayerTurn, winner]);

    // --- LOGIC ---
    const handleMove = (index, isPlayer) => {
        let newSquares = [...squares];
        let currentMoves = isPlayer ? [...playerMoves] : [...aiMoves];

        if (currentMoves.length >= 3) {
            const moveToRemove = currentMoves.shift();
            newSquares[moveToRemove] = null;          
        }

        currentMoves.push(index);
        newSquares[index] = isPlayer ? 'X' : 'O';

        setSquares(newSquares);
        if (isPlayer) {
            setPlayerMoves(currentMoves);
            setIsPlayerTurn(false);
        } else {
            setAiMoves(currentMoves);
            setIsPlayerTurn(true);
        }

        checkWin(newSquares);
    };

    const checkWin = (currentBoard) => {
        const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (let line of lines) {
            const [a, b, c] = line;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                const gameWinner = currentBoard[a];
                setWinner(gameWinner);
                setWinningLine(line); 
                setScore(prev => ({
                    ...prev,
                    [gameWinner === 'X' ? 'player' : 'ai']: prev[gameWinner === 'X' ? 'player' : 'ai'] + 1
                }));
                return;
            }
        }
    };

    const resetGame = () => {
        setSquares(Array(9).fill(null));
        setPlayerMoves([]);
        setAiMoves([]);
        setWinner(null);
        setWinningLine([]); 
        setIsPlayerTurn(winner === 'O'); 
    };

    // --- RENDER ---
    return (
        <div className="relative z-10 flex flex-col items-center justify-start pt-10 gap-6 animate-in fade-in zoom-in duration-500">
            
            {/* SETTINGS BUTTON */}
            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="absolute top-6 right-6 p-3 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:rotate-90 transition-all shadow-lg z-50"
            >
                <FaCog size={24} />
            </button>

            {/* SETTINGS MODAL */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700 shadow-2xl w-80 flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Paused</h2>
                            <button onClick={() => setIsSettingsOpen(false)} className="text-gray-500 hover:text-white"><FaTimes size={20}/></button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button onClick={() => { resetGame(); setIsSettingsOpen(false); }} className="flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-bold transition">
                                <FaRedo /> Restart Game
                            </button>
                            <button onClick={onGoHome} className="flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-bold transition">
                                <FaHome /> Main Menu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <h1 className="text-4xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg select-none">
                GHOST TAC TOE
            </h1>

            {/* SCORE */}
            <div className="flex gap-12 text-xl font-bold tracking-wider select-none">
                <div className="flex flex-col items-center">
                    <span className="text-gray-400 text-xs tracking-widest">YOU</span>
                    <span className="text-cyan-400 text-2xl">{score.player}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-gray-400 text-xs tracking-widest">AI ({difficulty})</span>
                    <span className="text-pink-500 text-2xl">{score.ai}</span>
                </div>
            </div>

            {/* STATUS */}
            <div className="h-8 flex items-center justify-center select-none">
                {winner ? (
                    <h2 className="text-3xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)] animate-bounce">
                        {winner === 'X' ? "VICTORY!" : "DEFEAT"}
                    </h2>
                ) : (
                    <p className="text-gray-400 animate-pulse font-mono text-sm bg-gray-900/60 px-4 py-1 rounded backdrop-blur-md">
                        {isPlayerTurn ? "[ YOUR TURN ]" : "[ AI COMPUTING... ]"}
                    </p>
                )}
            </div>

            {/* BOARD */}
            <ClickSpark sparkColor='#22d3ee' sparkSize={10} sparkRadius={20} sparkCount={8} duration={400}>
                <div className="grid grid-cols-3 gap-3 w-fit mx-auto bg-gray-800/80 backdrop-blur-sm p-3 rounded-2xl shadow-2xl border border-gray-700 relative">
                    {squares.map((value, index) => {
                        const isFading = 
                            (value === 'X' && playerMoves[0] === index && playerMoves.length === 3) ||
                            (value === 'O' && aiMoves[0] === index && aiMoves.length === 3);
                        
                        return (
                            <Square 
                                key={index} 
                                value={value} 
                                isFading={isFading}
                                isWinning={winningLine.includes(index)} 
                                isPlayerPiece={value === 'X'}
                                onClick={() => !squares[index] && !winner && isPlayerTurn && handleMove(index, true)} 
                            />
                        );
                    })}
                </div>
            </ClickSpark>

            {/* RESTART BUTTON */}
            <div className="h-14 flex flex-col items-center gap-2">
                {winner && (
                    <button 
                        onClick={resetGame}
                        className="animate-fade-in-up px-8 py-2 bg-white text-black font-bold text-lg rounded-full hover:bg-green-400 hover:scale-105 transition-all shadow-lg"
                    >
                        Play Again
                    </button>
                )}
            </div>
        </div>
    );
}