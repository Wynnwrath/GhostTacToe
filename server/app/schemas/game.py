from pydantic import BaseModel


class MovePayload(BaseModel):
    room_code: str
    index: int


class RoomCreated(BaseModel):
    room_code: str
    symbol: str


class GameState(BaseModel):
    squares: list[str | None]
    x_moves: list[int]
    o_moves: list[int]
    turn: str
    winner: str | None
    winning_line: list[int]
    last_removed: int | None
