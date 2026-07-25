import socketio

from app.auth.dependencies import get_user_id_from_token
from app.game.board import apply_move, check_win
from app.socket.room_manager import room_manager

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
)


@sio.event
async def connect(sid, environ, auth):
    token = None
    if auth and isinstance(auth, dict):
        token = auth.get("token")
    if not token:
        raise ConnectionRefusedError("Authentication required")

    user_id = get_user_id_from_token(token)
    if not user_id:
        raise ConnectionRefusedError("Invalid token")

    async with sio.session(sid) as session:
        session["user_id"] = user_id


@sio.event
async def disconnect(sid):
    room = room_manager.handle_disconnect(sid)
    if room:
        other_sid = room.guest_sid if sid == room.host_sid else room.host_sid
        if other_sid:
            await sio.emit("opponent_disconnected", to=other_sid)
        room_manager.remove_room(room.room_code)


@sio.event
async def create_room(sid):
    async with sio.session(sid) as session:
        if not session.get("user_id"):
            return
    room = room_manager.create_room(sid)
    await sio.enter_room(sid, room.room_code)
    await sio.emit("room_created", {"room_code": room.room_code, "symbol": "X"}, to=sid)


@sio.event
async def join_room(sid, data):
    room_code = str(data.get("room_code", "")).upper()
    async with sio.session(sid) as session:
        if not session.get("user_id"):
            await sio.emit("room_error", {"message": "Authentication required"}, to=sid)
            return

    room = room_manager.join_room(room_code, sid)
    if not room:
        await sio.emit("room_error", {"message": "Room not found or full"}, to=sid)
        return

    await sio.enter_room(sid, room.room_code)
    await sio.emit("room_joined", {"room_code": room.room_code, "symbol": "O"}, to=sid)
    await sio.emit("game_start", room.to_state(), to=room.room_code)


@sio.event
async def make_move(sid, data):
    room = room_manager.get_room_for_sid(sid)
    if not room:
        await sio.emit("room_error", {"message": "Not in a room"}, to=sid)
        return

    index = data.get("index")
    if index is None or not isinstance(index, int) or index < 0 or index > 8:
        return

    symbol = "X" if sid == room.host_sid else "O"
    if symbol != room.turn or room.winner:
        return

    if room.squares[index] is not None:
        return

    moves = room.x_moves if symbol == "X" else room.o_moves
    new_squares, new_moves, removed = apply_move(room.squares, moves, index, symbol)

    if symbol == "X":
        room.x_moves = new_moves
    else:
        room.o_moves = new_moves

    room.squares = new_squares
    room.turn = "O" if symbol == "X" else "X"

    winner_symbol, winning_line = check_win(room.squares)
    if winner_symbol:
        room.winner = winner_symbol
        room.winning_line = winning_line

    state = room.to_state()
    state["last_removed"] = removed
    await sio.emit("move_made", state, to=room.room_code)

    if room.winner:
        await sio.emit(
            "game_over",
            {"winner": room.winner, "winning_line": room.winning_line},
            to=room.room_code,
        )


@sio.event
async def play_again(sid, data):
    room = room_manager.get_room_for_sid(sid)
    if not room:
        return

    room.reset()
    await sio.emit("game_reset", room.to_state(), to=room.room_code)
