// minimax.js

export function getBestAIMove(squares, aiMoves, playerMoves) {
    for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
            let tempSquares = [...squares];
            tempSquares[i] = 'O';
            if (checkWin(tempSquares) === 'O') return i;
        }
    }

    for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
            let tempSquares = [...squares];
            tempSquares[i] = 'X';
            if (checkWin(tempSquares) === 'X') return i;
        }
    }

    let bestScore = -Infinity;
    let move = null;

    let availableMoves = [];
    for(let i=0; i<9; i++) if(!squares[i]) availableMoves.push(i);
    availableMoves.sort(() => Math.random() - 0.5);

    for (let i of availableMoves) {
        let nextSquares = [...squares];
        let nextAiMoves = [...aiMoves];

        if (nextAiMoves.length >= 3) {
            let removeIndex = nextAiMoves.shift();
            nextSquares[removeIndex] = null;
        }
        
        nextAiMoves.push(i);
        nextSquares[i] = 'O';

        let score = minimax(nextSquares, nextAiMoves, playerMoves, 3, false);
        
        if (score > bestScore) {
            bestScore = score;
            move = i;
        }
    }

    if (move === null && !squares[4]) return 4;
    
    return move;
}

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

    //  Center Control (+5)
    if (squares[4] === 'O') score += 5;
    if (squares[4] === 'X') score -= 5;

    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        const cells = [squares[a], squares[b], squares[c]];
        
        const aiCount = cells.filter(x => x === 'O').length;
        const emptyCount = cells.filter(x => x === null).length;

        if (aiCount === 2 && emptyCount === 1) score += 10;
    }

    return score;
}