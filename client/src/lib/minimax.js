export function getBestAIMove(squares, aiMoves, playerMoves, difficulty = 'Hard') {
    
    let maxDepth;
    let randomness; 
    let useHeuristics = true;

    switch (difficulty) {
        case 'Easy':
            maxDepth = 1;
            randomness = 0.5; // 50% chance to be random
            break;
        case 'Normal':
            maxDepth = 3;     
            randomness = 0.1; 
            break;
        case 'Hard':
            maxDepth = 6;     
            randomness = 0.05; // 5% chance of "human error" to mix it up
            break;
        case 'Impossible':
        default:
            maxDepth = 19;     // Sees past the "fade" horizon
            randomness = 0.0; // Perfect play
            useHeuristics = true;
            break;
    }

    // If board is mostly empty, pick a RANDOM valid opener instead of calculating the same "Center" move every time.
    const totalPieces = squares.filter(s => s !== null).length;
    if (totalPieces <= 1 && randomness < 0.2) {
        const center = 4;
        const corners = [0, 2, 6, 8];
        const emptyCorners = corners.filter(i => !squares[i]);
        
        // 40% chance to take Center, 60% chance to take a random Corner
        if (!squares[center] && Math.random() > 0.6) return center;
        if (emptyCorners.length > 0) return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    }

    // RANDOM ERROR 
    if (Math.random() < randomness) {
        let availableMoves = [];
        for (let i = 0; i < 9; i++) if (!squares[i]) availableMoves.push(i);
        if (availableMoves.length > 0) {
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
    }

    // Even 'Easy' mode should usually block an instant loss, otherwise it feels broken
    for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
            let tempSquares = [...squares];
            tempSquares[i] = 'O';
            if (checkWin(tempSquares) === 'O') return i; // Take Win
        }
    }
    // Block Loss (skip this 30% of time on Easy to let player win)
    if (difficulty !== 'Easy' || Math.random() > 0.3) {
        for (let i = 0; i < 9; i++) {
            if (!squares[i]) {
                let tempSquares = [...squares];
                tempSquares[i] = 'X';
                if (checkWin(tempSquares) === 'X') return i; // Block Loss
            }
        }
    }

    let bestScore = -Infinity;
    let bestMoves = []; // Store ALL best moves, not just the first one
    
    // Scan all available spots
    for(let i = 0; i < 9; i++) {
        if(!squares[i]) {
            let nextSquares = [...squares];
            let nextAiMoves = [...aiMoves];

            // Simulate the "Ghost" fade
            if (nextAiMoves.length >= 3) {
                let removeIndex = nextAiMoves.shift();
                nextSquares[removeIndex] = null;
            }
            
            nextAiMoves.push(i);
            nextSquares[i] = 'O';

            let score = minimax(nextSquares, nextAiMoves, playerMoves, maxDepth, false, -Infinity, Infinity);
            
            // Logic to collect ties
            if (score > bestScore) {
                bestScore = score;
                bestMoves = [i]; // Found a new best, reset list
            } else if (score === bestScore) {
                bestMoves.push(i); // Found a tie, add to list
            }
        }
    }
    
    // If we have moves, pick a random one from the "Best" list
    if (bestMoves.length > 0) {
        return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }
    
    // Fallback
    return squares.findIndex(x => x === null);
}

// --- CORE MINIMAX LOGIC ---
function minimax(squares, aiMoves, playerMoves, depth, isMaximizing, alpha, beta) {
    let result = checkWin(squares);
    if (result === 'O') return 100 + depth; 
    if (result === 'X') return -100 - depth; 
    
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

                let score = minimax(nextSquares, nextAiMoves, playerMoves, depth - 1, false, alpha, beta);
                bestScore = Math.max(score, bestScore);
                
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) break; 
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

                let score = minimax(nextSquares, aiMoves, nextPlayerMoves, depth - 1, true, alpha, beta);
                bestScore = Math.min(score, bestScore);

                beta = Math.min(beta, bestScore);
                if (beta <= alpha) break; 
            }
        }
        return bestScore;
    }
}

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

function evaluateBoard(squares, aiMoves, playerMoves) {
    let score = 0;

    // 1. Center Control (Reduced Weight to allow variety)
    if (squares[4] === 'O') score += 2;
    if (squares[4] === 'X') score -= 2;

    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        const cells = [squares[a], squares[b], squares[c]];
        
        const aiCount = cells.filter(x => x === 'O').length;
        const playerCount = cells.filter(x => x === 'X').length;
        const emptyCount = cells.filter(x => x === null).length;

        // 2. Aggressive Play (Reward 2-in-a-row)
        if (aiCount === 2 && emptyCount === 1) score += 10;
        
        // 3. Defensive Awareness 
        if (playerCount === 2 && emptyCount === 1) score -= 10;
        
        // 4. Subtle "Fork" Setup (Encourage creating multiple threats)
        if (aiCount === 1 && emptyCount === 2) score += 1;
    }

    return score;
}