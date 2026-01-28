import Square from "./Square.jsx";

export default function GameContainer() {

    const [aiMoves, setAiMoves] = useState([]);
    const [playerMoves, setPlayerMoves] = useState([]);
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        if (isPlayerTurn || winner) return;

        const aiMove = getBestAIMove(squares, aiMoves, playerMoves);

        if (aiMove !== null) {
            let newSquares = [...squares];
            let newAiMoves = [...aiMoves];

            if (newAiMoves.length >= 4) {
                const moveToRemove = newAiMoves.shift(); 
                newSquares[moveToRemove] = null;        
            }

            newAiMoves.push(aiMove);
            newSquares[aiMove] = 'O';
            
            setSquares(newSquares);
            setAiMoves(newAiMoves);
            setIsPlayerTurn(true); 
            
            checkWin(newSquares);
        }
    }, [isPlayerTurn, winner]);
    
    const checkWin = (currentBoard) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]           
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (currentBoard[a] && 
                currentBoard[a] === currentBoard[b] && 
                currentBoard[a] === currentBoard[c]) {
                setWinner(currentBoard[a]); 
                return;
            }
        }
    };

    const handleClick = (index) => {
        if (squares[index] || winner || !isPlayerTurn) return;

        let newSquares = [...squares];
        let newPlayerMoves = [...playerMoves];

        if (newPlayerMoves.length >= 4) {
            const moveToRemove = newPlayerMoves.shift();
            newSquares[moveToRemove] = null;            
        }

        newPlayerMoves.push(index);
        newSquares[index] = 'X';

        setSquares(newSquares);
        setPlayerMoves(newPlayerMoves);
        setIsPlayerTurn(false); 

        checkWin(newSquares);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">
                {winner ? `Winner: ${winner}` : (isPlayerTurn ? "Your Turn" : "AI Thinking...")}
            </h1>
            
            <div className="grid grid-cols-3 gap-2">
                {squares.map((value, index) => {
                    const isFading = 
                        (value === 'X' && playerMoves[0] === index && playerMoves.length === 4) ||
                        (value === 'O' && aiMoves[0] === index && aiMoves.length === 4);

                    return (
                        <Square 
                            key={index} 
                            value={value} 
                            isFading={isFading}
                            onClick={() => handleClick(index)} 
                        />
                    );
                })}
            </div>
            {winner && (
                <button 
                    className="p-2 bg-blue-500 text-white rounded"
                    onClick={() => window.location.reload()}
                >
                    Restart
                </button>
            )}
        </div>
    );
}