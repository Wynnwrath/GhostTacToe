const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function checkWin(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

export function applyMove(squares, moves, index, symbol) {
  const newSquares = [...squares];
  const newMoves = [...moves];
  let removed = null;

  if (newMoves.length >= 3) {
    removed = newMoves.shift();
    newSquares[removed] = null;
  }

  newMoves.push(index);
  newSquares[index] = symbol;
  return { squares: newSquares, moves: newMoves, removed };
}
