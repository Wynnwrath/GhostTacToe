export function getBestAIMove(squares, aiMoves, playerMoves, difficulty = 'Hard') {
    
    // --- DIFFICULTY SETTINGS ---
    let maxDepth;
    let randomness; // Chance (0-1) to make a random bad move

    switch (difficulty) {
        case 'Easy':
            maxDepth = 1;
            randomness = 0.5; // 50% chance to be random
            break;
        case 'Normal':
            maxDepth = 2;
            randomness = 0.1; // 10% chance to mess up
            break;
        case 'Hard':
        default:
            maxDepth = 4; // Looks deep into the "fading" future
            randomness = 0.0; // Perfect play
            break;
    }

    // 1. CHANCE TO BE DUMB (For Easy/Normal modes)
    if (Math.random() < randomness) {
        let availableMoves = [];
        for (let i = 0; i < 9; i++) if (!squares[i]) availableMoves.push(i);
        // Return a random move if available
        if (availableMoves.length > 0) {
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
    }

    // 2. Instant Win Check (Always take the win if seen, unless random check passed)
    for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
            let tempSquares = [...squares];
            tempSquares[i] = 'O';
            if (checkWin(tempSquares) === 'O') return i;
        }
    }

    // 3. Instant Block Check (Don't lose immediately)
    // Even 'Easy' AI should try to block immediate wins most of the time
    for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
            let tempSquares = [...squares];
            tempSquares[i] = 'X';
            if (checkWin(tempSquares) === 'X') return i;
        }
    }

    // 4. Minimax Search
    let bestScore = -Infinity;
    let move = null;
    
    let availableMoves = [];
    for(let i=0; i<9; i++) if(!squares[i]) availableMoves.push(i);
    availableMoves.sort(() => Math.random() - 0.5); // Shuffle for variety

    for (let i of availableMoves) {
        let nextSquares = [...squares];
        let nextAiMoves = [...aiMoves];

        if (nextAiMoves.length >= 3) {
            let removeIndex = nextAiMoves.shift();
            nextSquares[removeIndex] = null;
        }
        
        nextAiMoves.push(i);
        nextSquares[i] = 'O';

        // Pass the calculated maxDepth here
        let score = minimax(nextSquares, nextAiMoves, playerMoves, maxDepth, false);
        
        if (score > bestScore) {
            bestScore = score;
            move = i;
        }
    }
    
    if (move === null && !squares[4]) return 4;
    return move;
}

// ... (Keep minimax, checkWin, and evaluateBoard functions exactly the same as before) ...
// Just make sure evaluateBoard is defined at the bottom!
function minimax(squares, aiMoves, playerMoves, depth, isMaximizing) {
    let result = checkWin(squares);
    if (result === 'O') return 100;
    if (result === 'X') return -100;
    
    if (depth === 0) return evaluateBoard(squares, aiMoves, playerMoves);

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!squares[i]) {
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

function checkWin(squares) {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let line of lines) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
}

function evaluateBoard(squares, aiMoves, playerMoves) {
    let score = 0;
    if (squares[4] === 'O') score += 5;
    if (squares[4] === 'X') score -= 5;
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let line of lines) {
        const [a, b, c] = line;
        const cells = [squares[a], squares[b], squares[c]];
        const aiCount = cells.filter(x => x === 'O').length;
        const emptyCount = cells.filter(x => x === null).length;
        if (aiCount === 2 && emptyCount === 1) score += 10;
    }
    return score;
}