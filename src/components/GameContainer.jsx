import { useState, useEffect } from 'react';
import Square from './Square'; 
import { getBestAIMove } from './minimax'; 
import ClickSpark from '../animation/ClickSpark';
import Dither from '../animation/Dither'; 

const WAVE_COLOR = [0.3, 0.3, 0.3]; 
const DITHER_CONFIG = {
    disableAnimation: false,
    enableMouseInteraction: true,
    mouseRadius: 0.3,
    colorNum: 4,
    waveAmplitude: 0.3,
    waveFrequency: 3,
    waveSpeed: 0.05
};

export default function GameContainer() {
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

    useEffect(() => {
        localStorage.setItem('tic-tac-score', JSON.stringify(score));
    }, [score]);

    useEffect(() => {
        if (isPlayerTurn || winner) return;

        const timer = setTimeout(() => {
            const aiMove = getBestAIMove(squares, aiMoves, playerMoves);
            if (aiMove !== null) {
                handleMove(aiMove, false); 
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [isPlayerTurn, winner]);

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
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]
        ];

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

    const handlePlayerClick = (index) => {
        if (squares[index] || winner || !isPlayerTurn) return;
        handleMove(index, true); 
    };

    const resetGame = () => {
        const nextStartIsPlayer = winner === 'O';

        setSquares(Array(9).fill(null));
        setPlayerMoves([]);
        setAiMoves([]);
        setWinner(null);
        setWinningLine([]); 
        
        setIsPlayerTurn(nextStartIsPlayer); 
    };

    return (
        <div className="relative min-h-screen bg-gray-900 font-sans overflow-hidden">            

            <div className="fixed inset-0 z-0 opacity-40 pointer-events-auto">
                <Dither
                    waveColor={WAVE_COLOR} 
                    {...DITHER_CONFIG}     
                />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-start pt-10 gap-6">
                
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg select-none">
                    Ghost Tac Toe
                </h1>

                <div className="flex gap-12 text-xl font-bold tracking-wider select-none">
                    <div className="flex flex-col items-center">
                        <span className="text-gray-400 text-xs tracking-widest">YOU</span>
                        <span className="text-cyan-400 text-2xl">{score.player}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-gray-400 text-xs tracking-widest">AI</span>
                        <span className="text-pink-500 text-2xl">{score.ai}</span>
                    </div>
                </div>

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

                <ClickSpark
                    sparkColor='#22d3ee' 
                    sparkSize={10}
                    sparkRadius={20}
                    sparkCount={8}
                    duration={400}
                >
                    <div className="grid grid-cols-3 gap-3 bg-gray-800/80 backdrop-blur-sm p-3 rounded-2xl shadow-2xl border border-gray-700 relative">
                        {squares.map((value, index) => {
                            const isFading = 
                                (value === 'X' && playerMoves[0] === index && playerMoves.length === 3) ||
                                (value === 'O' && aiMoves[0] === index && aiMoves.length === 3);
                            
                            const isPlayerPiece = value === 'X';
                            const isWinning = winningLine.includes(index);

                            return (
                                <Square 
                                    key={index} 
                                    value={value} 
                                    isFading={isFading}
                                    isWinning={isWinning} 
                                    isPlayerPiece={isPlayerPiece}
                                    onClick={() => handlePlayerClick(index)} 
                                />
                            );
                        })}
                    </div>
                </ClickSpark>

                <div className="h-14 flex flex-col items-center gap-2">
                    {winner && (
                        <button 
                            onClick={resetGame}
                            className="animate-fade-in-up px-8 py-2 bg-white text-black font-bold text-lg rounded-full 
                                       hover:bg-green-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            Play Again
                        </button>
                    )}
                    
                    <button 
                        onClick={() => {
                            localStorage.removeItem('tic-tac-score');
                            setScore({player: 0, ai: 0});
                        }}
                        className="text-[10px] text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                    >
                        Reset Stats
                    </button>
                </div>
            </div>
        </div>
    );
}