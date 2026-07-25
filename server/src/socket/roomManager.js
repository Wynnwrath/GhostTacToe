import crypto from "crypto";

function generateCode() {
  return crypto.randomBytes(2).toString("hex").toUpperCase().slice(0, 4);
}

class Room {
  constructor(hostSid) {
    this.roomCode = generateCode();
    this.hostSid = hostSid;
    this.guestSid = null;
    this.squares = Array(9).fill(null);
    this.xMoves = [];
    this.oMoves = [];
    this.turn = "X";
    this.winner = null;
    this.winningLine = [];
    this.createdAt = Date.now();
  }

  toState() {
    return {
      squares: this.squares,
      x_moves: this.xMoves,
      o_moves: this.oMoves,
      turn: this.turn,
      winner: this.winner,
      winningLine: this.winningLine,
      lastRemoved: null,
    };
  }

  reset() {
    this.squares = Array(9).fill(null);
    this.xMoves = [];
    this.oMoves = [];
    this.turn = "X";
    this.winner = null;
    this.winningLine = [];
  }
}

class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.sidToRoom = new Map();
  }

  createRoom(hostSid) {
    const room = new Room(hostSid);
    this.rooms.set(room.roomCode, room);
    this.sidToRoom.set(hostSid, room.roomCode);
    return room;
  }

  joinRoom(roomCode, guestSid) {
    const room = this.rooms.get(roomCode.toUpperCase());
    if (!room || room.guestSid || room.hostSid === guestSid) return null;
    room.guestSid = guestSid;
    this.sidToRoom.set(guestSid, roomCode);
    return room;
  }

  getRoomForSid(sid) {
    const code = this.sidToRoom.get(sid);
    return code ? this.rooms.get(code) : null;
  }

  removeRoom(roomCode) {
    const room = this.rooms.get(roomCode);
    if (room) {
      this.sidToRoom.delete(room.hostSid);
      if (room.guestSid) this.sidToRoom.delete(room.guestSid);
      this.rooms.delete(roomCode);
    }
  }

  handleDisconnect(sid) {
    return this.getRoomForSid(sid);
  }
}

export const roomManager = new RoomManager();
