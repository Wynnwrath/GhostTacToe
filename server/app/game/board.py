LINES = [
    (0, 1, 2), (3, 4, 5), (6, 7, 8),
    (0, 3, 6), (1, 4, 7), (2, 5, 8),
    (0, 4, 8), (2, 4, 6),
]


def check_win(squares: list) -> tuple[str | None, list[int]]:
    for a, b, c in LINES:
        if squares[a] and squares[a] == squares[b] == squares[c]:
            return squares[a], [a, b, c]
    return None, []


def apply_move(squares: list, moves: list[int], index: int, symbol: str) -> tuple[list, list, int | None]:
    new_squares = squares[:]
    new_moves = moves[:]
    removed = None

    if len(new_moves) >= 3:
        removed = new_moves.pop(0)
        new_squares[removed] = None

    new_moves.append(index)
    new_squares[index] = symbol
    return new_squares, new_moves, removed
