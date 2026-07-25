import { Server } from "socket.io";
import { getUserIdFromToken } from "../middleware/auth.js";
import { applyMove, checkWin } from "../game/board.js";
import { roomManager } from "./roomManager.js";

export function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));

    const userId = getUserIdFromToken(token);
    if (!userId) return next(new Error("Invalid token"));

    socket.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    socket.on("create_room", () => {
      const room = roomManager.createRoom(socket.id);
      socket.join(room.roomCode);
      socket.emit("room_created", { room_code: room.roomCode, symbol: "X" });
    });

    socket.on("join_room", (data) => {
      const roomCode = String(data.room_code || "").toUpperCase();
      const room = roomManager.joinRoom(roomCode, socket.id);

      if (!room) {
        socket.emit("room_error", { message: "Room not found or full" });
        return;
      }

      socket.join(room.roomCode);
      socket.emit("room_joined", { room_code: room.roomCode, symbol: "O" });
      io.to(room.roomCode).emit("game_start", room.toState());
    });

    socket.on("make_move", (data) => {
      const room = roomManager.getRoomForSid(socket.id);
      if (!room) return;

      const index = data.index;
      if (index == null || index < 0 || index > 8) return;

      const symbol = socket.id === room.hostSid ? "X" : "O";
      if (symbol !== room.turn || room.winner) return;
      if (room.squares[index] !== null) return;

      const moves = symbol === "X" ? room.xMoves : room.oMoves;
      const result = applyMove(room.squares, moves, index, symbol);

      if (symbol === "X") room.xMoves = result.moves;
      else room.oMoves = result.moves;
      room.squares = result.squares;
      room.turn = symbol === "X" ? "O" : "X";

      const win = checkWin(room.squares);
      if (win.winner) {
        room.winner = win.winner;
        room.winningLine = win.line;
      }

      const state = room.toState();
      state.last_removed = result.removed;
      io.to(room.roomCode).emit("move_made", state);

      if (room.winner) {
        io.to(room.roomCode).emit("game_over", {
          winner: room.winner,
          winning_line: room.winningLine,
        });
      }
    });

    socket.on("play_again", () => {
      const room = roomManager.getRoomForSid(socket.id);
      if (!room) return;
      room.reset();
      io.to(room.roomCode).emit("game_reset", room.toState());
    });

    socket.on("disconnect", () => {
      const room = roomManager.handleDisconnect(socket.id);
      if (room) {
        const otherSid = socket.id === room.hostSid ? room.guestSid : room.hostSid;
        if (otherSid) {
          io.to(otherSid).emit("opponent_disconnected");
        }
        setTimeout(() => roomManager.removeRoom(room.roomCode), 30000);
      }
    });
  });

  return io;
}
