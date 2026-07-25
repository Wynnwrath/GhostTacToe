import { useEffect } from "react";
import { useGameStore } from "../stores/game.store";
import { useSocketStore } from "../stores/socket.store";
import { GAME_MODES } from "../lib/constants";
import { checkWin } from "../lib/checkWin";
import { getBestAIMove } from "../lib/minimax";

export function useGameLogic() {
  const gameMode = useGameStore((s) => s.gameMode);
  const difficulty = useGameStore((s) => s.difficulty);
  const isPlayerTurn = useGameStore((s) => s.isPlayerTurn);
  const winner = useGameStore((s) => s.winner);
  const squares = useGameStore((s) => s.squares);
  const playerMoves = useGameStore((s) => s.playerMoves);
  const aiMoves = useGameStore((s) => s.aiMoves);
  const socket = useSocketStore((s) => s.socket);

  const makeMove = useGameStore((s) => s.makeMove);
  const setSquares = useGameStore((s) => s.setSquares);
  const setPlayerMoves = useGameStore((s) => s.setPlayerMoves);
  const setAiMoves = useGameStore((s) => s.setAiMoves);
  const setIsPlayerTurn = useGameStore((s) => s.setIsPlayerTurn);
  const setWinner = useGameStore((s) => s.setWinner);
  const setWinningLine = useGameStore((s) => s.setWinningLine);
  const incrementScore = useGameStore((s) => s.incrementScore);
  const addToHistory = useGameStore((s) => s.addToHistory);

  useEffect(() => {
    if (gameMode === GAME_MODES.PVP_ONLINE || gameMode === GAME_MODES.PVP_LOCAL) return;
    if (isPlayerTurn || winner) return;

    const timer = setTimeout(() => {
      const aiMoveIndex = getBestAIMove(squares, aiMoves, playerMoves, difficulty);
      if (aiMoveIndex !== null) {
        handleMoveLocal(aiMoveIndex, false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isPlayerTurn, winner, gameMode, difficulty]);

  useEffect(() => {
    if (gameMode !== GAME_MODES.PVP_ONLINE || !socket) return;

    const onMoveMade = (state) => {
      useGameStore.getState().applyServerState(state);
    };

    const onGameOver = (data) => {
      useGameStore.getState().setWinner(data.winner);
      useGameStore.getState().setWinningLine(data.winning_line);

      const gs = useGameStore.getState();
      const playerWon = data.winner === gs.playerSymbol;
      gs.incrementScore(playerWon);

      let winnerName;
      if (data.winner === gs.playerSymbol) {
        winnerName = "YOU";
      } else {
        winnerName = "OPPONENT";
      }

      gs.addToHistory({
        id: Date.now(),
        winner: winnerName,
        difficulty: "Online",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    };

    const onGameReset = (state) => {
      useGameStore.getState().applyServerState(state);
    };

    const onOpponentDisconnected = () => {
      const gs = useGameStore.getState();
      gs.setOpponentConnected(false);
    };

    socket.on("move_made", onMoveMade);
    socket.on("game_over", onGameOver);
    socket.on("game_reset", onGameReset);
    socket.on("opponent_disconnected", onOpponentDisconnected);

    return () => {
      socket.off("move_made", onMoveMade);
      socket.off("game_over", onGameOver);
      socket.off("game_reset", onGameReset);
      socket.off("opponent_disconnected", onOpponentDisconnected);
    };
  }, [gameMode, socket]);

  function handleMoveLocal(index, isPlayer) {
    const newSquares = [...useGameStore.getState().squares];
    const currentMoves = isPlayer
      ? [...useGameStore.getState().playerMoves]
      : [...useGameStore.getState().aiMoves];

    if (currentMoves.length >= 3) {
      const removed = currentMoves.shift();
      newSquares[removed] = null;
    }

    currentMoves.push(index);
    newSquares[index] = isPlayer ? "X" : "O";

    if (isPlayer) {
      useGameStore.getState().setPlayerMoves(currentMoves);
      useGameStore.getState().setIsPlayerTurn(false);
    } else {
      useGameStore.getState().setAiMoves(currentMoves);
      useGameStore.getState().setIsPlayerTurn(true);
    }
    useGameStore.getState().setSquares(newSquares);

    const { winner: w, line } = checkWin(newSquares);
    if (w) {
      useGameStore.getState().setWinner(w);
      useGameStore.getState().setWinningLine(line);

      const gs = useGameStore.getState();
      gs.incrementScore(w === "X");

      let winnerName;
      if (gs.gameMode === GAME_MODES.PVP_LOCAL) {
        winnerName = w === "X" ? "P1" : "P2";
      } else {
        winnerName = w === "X" ? "YOU" : "AI";
      }

      gs.addToHistory({
        id: Date.now(),
        winner: winnerName,
        difficulty: gs.difficulty,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }
  }

  function handlePlayerClick(index) {
    const gs = useGameStore.getState();
    if (gs.squares[index] || gs.winner) return;

    if (gameMode === GAME_MODES.PVP_ONLINE) {
      if (!gs.isPlayerTurn) return;
      const sock = useSocketStore.getState().socket;
      if (sock) {
        sock.emit("make_move", { room_code: gs.roomCode, index });
      }
      return;
    }

    if (gameMode === GAME_MODES.PVP_LOCAL) {
      handleMoveLocal(index, gs.isPlayerTurn);
      return;
    }

    if (gameMode === GAME_MODES.VS_AI) {
      if (gs.isPlayerTurn) {
        handleMoveLocal(index, true);
      }
    }
  }

  return { handlePlayerClick };
}
