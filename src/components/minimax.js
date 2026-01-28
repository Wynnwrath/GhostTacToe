// minimax.js

// The main function your GameContainer calls
export function getBestAIMove(squares, aiMoves, playerMoves) {
    // 1. First, check if we can win RIGHT NOW (Optimization)
    for (let i = 0; i < 9; i++) {
        if (!squares[i]) { // If square is empty
            let tempSquares = [...squares];
            tempSquares[i] = 'O'; // Try placing AI piece
            if (checkWin(tempSquares) === 'O') return i;
        }
    }

    // 2. If no instant win, run Minimax
    // depth = 3 means it looks 3 turns ahead (Player -> AI -> Player)
    let bestScore = -Infinity;
    let move = null;
    
    // Loop through all empty spots
    for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
            // SIMULATE THE MOVE
            let nextSquares = [...squares];
            let nextAiMoves = [...aiMoves];

            // Apply 3-move rule (Queue Logic)
            if (nextAiMoves.length >= 3) {
                let removeIndex = nextAiMoves.shift();
                nextSquares[removeIndex] = null;
            }
            
            nextAiMoves.push(i);
            nextSquares[i] = 'O';

            // Call Minimax on this new imaginary board
            let score = minimax(nextSquares, nextAiMoves, playerMoves, 3, false);
            
            // Undo logic is not needed because we created copies (nextSquares)
            
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    
    return move;
}

// The Recursive Brain
function minimax(squares, aiMoves, playerMoves, depth, isMaximizing) {
    // A. Terminal States (Game Over or Depth Reached)
    let result = checkWin(squares);
    if (result === 'O') return 100; // AI wins
    if (result === 'X') return -100; // Player wins
    if (depth === 0) return evaluateBoard(squares); // Ran out of patience, guess the score

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!squares[i]) {
                // Simulate AI Move
                let nextSquares = [...squares];
                let nextAiMoves = [...aiMoves];
                
                if (nextAiMoves.length >= 3) {
                    let removeIndex = nextAiMoves.shift();
                    nextSquares[removeIndex] = null;
                }
                
                nextAiMoves.push(i);
                nextSquares[i] = 'O';

                let score = minimax(nextSquares, nextAiMoves, playerMoves, depth - 1, false);
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (!squares[i]) {
                // Simulate Player Move
                let nextSquares = [...squares];
                let nextPlayerMoves = [...playerMoves];

                if (nextPlayerMoves.length >= 3) {
                    let removeIndex = nextPlayerMoves.shift();
                    nextSquares[removeIndex] = null;
                }
                
                nextPlayerMoves.push(i);
                nextSquares[i] = 'X';

                let score = minimax(nextSquares, aiMoves, nextPlayerMoves, depth - 1, true);
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Helper: Checks if someone won
function checkWin(squares) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function evaluateBoard(squares) {
    return 0;
}