import { useState, useEffect } from 'react';
import Square from './Square'; 
import { getBestAIMove } from './minimax';

export default function GameContainer() {
    // --- STATE ---

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

    useEffect(() => {
        localStorage.setItem('tic-tac-score', JSON.stringify(score));
    }, [score]);
    //Ai
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
        setSquares(Array(9).fill(null));
        setPlayerMoves([]);
        setAiMoves([]);
        setWinner(null);
        setIsPlayerTurn(true); 
    };

    return (
        <div className="flex flex-col items-center gap-6 p-10 font-sans">
            <div className="flex gap-10 text-xl font-bold">
                <div className="text-blue-600">You: {score.player}
                </div>
                <div className="text-red-600">AI: {score.ai}</div>
            </div>

            <h1 className="text-3xl font-black h-10">
                {winner ? (winner === 'X' ? "PLAYER WINS!" : "AI WINS!") : ""}
            </h1>

            <div className="grid grid-cols-3 gap-2 bg-gray-800 p-2 rounded-lg">
                {squares.map((value, index) => {
                    const isFading = 
                        (value === 'X' && playerMoves[0] === index && playerMoves.length === 3) ||
                        (value === 'O' && aiMoves[0] === index && aiMoves.length === 3);

                    return (
                        <Square 
                            key={index} 
                            value={value} 
                            isFading={isFading}
                            onClick={() => handlePlayerClick(index)} 
                        />
                    );
                })}
            </div>

            {winner && (
                <button 
                    onClick={resetGame}
                    className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                >
                    Play Again
                </button>
            )}
            
             <button 
                onClick={() => {
                    localStorage.removeItem('tic-tac-score');
                    setScore({player: 0, ai: 0});
                }}
                className="text-xs text-gray-400 mt-4 underline"
            >
                Reset Score
            </button>
        </div>
    );
}