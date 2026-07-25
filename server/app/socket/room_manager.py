import time
import random
import string

from app.game.board import check_win


def _room_code() -> str:
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=4))


class Room:
    def __init__(self, host_sid: str):
        self.room_code = _room_code()
        self.host_sid = host_sid
        self.guest_sid: str | None = None
        self.squares: list[str | None] = [None] * 9
        self.x_moves: list[int] = []
        self.o_moves: list[int] = []
        self.turn = "X"
        self.winner: str | None = None
        self.winning_line: list[int] = []
        self.created_at = time.time()

    def to_state(self):
        return {
            "squares": self.squares,
            "x_moves": self.x_moves,
            "o_moves": self.o_moves,
            "turn": self.turn,
            "winner": self.winner,
            "winning_line": self.winning_line,
            "last_removed": None,
        }

    def reset(self):
        self.squares = [None] * 9
        self.x_moves = []
        self.o_moves = []
        self.turn = "X"
        self.winner = None
        self.winning_line = []


class RoomManager:
    def __init__(self):
        self.rooms: dict[str, Room] = {}
        self.sid_to_room: dict[str, str] = {}

    def create_room(self, host_sid: str) -> Room:
        room = Room(host_sid)
        self.rooms[room.room_code] = room
        self.sid_to_room[host_sid] = room.room_code
        return room

    def join_room(self, room_code: str, guest_sid: str) -> Room | None:
        room = self.rooms.get(room_code.upper())
        if not room or room.guest_sid is not None:
            return None
        if room.host_sid == guest_sid:
            return None
        room.guest_sid = guest_sid
        self.sid_to_room[guest_sid] = room_code
        return room

    def get_room_for_sid(self, sid: str) -> Room | None:
        code = self.sid_to_room.get(sid)
        if not code:
            return None
        return self.rooms.get(code)

    def remove_room(self, room_code: str):
        room = self.rooms.pop(room_code, None)
        if room:
            self.sid_to_room.pop(room.host_sid, None)
            if room.guest_sid:
                self.sid_to_room.pop(room.guest_sid, None)

    def handle_disconnect(self, sid: str) -> Room | None:
        room = self.get_room_for_sid(sid)
        if not room:
            return None
        # Schedule cleanup after 30s — if not reconnected
        return room


room_manager = RoomManager()
