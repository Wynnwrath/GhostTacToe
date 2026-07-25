import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { GAME_MODES } from "../lib/constants";

export const useGameStore = create(
  persist(
    immer((set) => ({
      squares: Array(9).fill(null),
      playerMoves: [],
      aiMoves: [],
      isPlayerTurn: true,
      winner: null,
      winningLine: [],
      gameMode: GAME_MODES.PVP_LOCAL,
      difficulty: "Normal",
      score: { player: 0, ai: 0 },
      history: [],

      playerSymbol: "X",
      roomCode: null,
      opponentConnected: false,

      setSquares: (squares) =>
        set((s) => {
          s.squares = squares;
        }),
      setPlayerMoves: (moves) =>
        set((s) => {
          s.playerMoves = moves;
        }),
      setAiMoves: (moves) =>
        set((s) => {
          s.aiMoves = moves;
        }),
      setIsPlayerTurn: (turn) =>
        set((s) => {
          s.isPlayerTurn = turn;
        }),
      setWinner: (winner) =>
        set((s) => {
          s.winner = winner;
        }),
      setWinningLine: (line) =>
        set((s) => {
          s.winningLine = line;
        }),
      setGameMode: (mode) =>
        set((s) => {
          s.gameMode = mode;
        }),
      setDifficulty: (diff) =>
        set((s) => {
          s.difficulty = diff;
        }),
      incrementScore: (playerWon) =>
        set((s) => {
          if (playerWon) {
            s.score.player += 1;
          } else {
            s.score.ai += 1;
          }
        }),
      addToHistory: (entry) =>
        set((s) => {
          s.history = [...s.history.slice(-9), entry];
        }),
      clearHistory: () =>
        set((s) => {
          s.history = [];
          s.score = { player: 0, ai: 0 };
        }),

      setPlayerSymbol: (sym) =>
        set((s) => {
          s.playerSymbol = sym;
        }),
      setRoomCode: (code) =>
        set((s) => {
          s.roomCode = code;
        }),
      setOpponentConnected: (connected) =>
        set((s) => {
          s.opponentConnected = connected;
        }),

      applyServerState: (state) =>
        set((s) => {
          s.squares = state.squares;
          s.playerMoves =
            s.playerSymbol === "X" ? state.x_moves : state.o_moves;
          s.aiMoves = s.playerSymbol === "X" ? state.o_moves : state.x_moves;
          s.isPlayerTurn = state.turn === s.playerSymbol;
          s.winner = state.winner;
          s.winningLine = state.winning_line || [];
        }),

      resetGame: () =>
        set((s) => {
          s.squares = Array(9).fill(null);
          s.playerMoves = [];
          s.aiMoves = [];
          s.winner = null;
          s.winningLine = [];
          s.isPlayerTurn = true;
        }),

      resetAll: () =>
        set((s) => {
          s.squares = Array(9).fill(null);
          s.playerMoves = [];
          s.aiMoves = [];
          s.isPlayerTurn = true;
          s.winner = null;
          s.winningLine = [];
          s.gameMode = GAME_MODES.PVP_LOCAL;
          s.difficulty = "Normal";
          s.playerSymbol = "X";
          s.roomCode = null;
          s.opponentConnected = false;
        }),
    })),
    { name: "ghosttactoe-game", partialize: (state) => ({ score: state.score, history: state.history }) }
  )
);
