import { useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { useSocketStore } from "../stores/socket.store";
import { SOCKET_URL } from "../lib/constants";

export function useSocket() {
  const setSocket = useSocketStore((s) => s.setSocket);
  const setConnected = useSocketStore((s) => s.setConnected);
  const disconnect = useSocketStore((s) => s.disconnect);

  const connect = useCallback(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setConnected(false);
    });

    setSocket(socket);
    return socket;
  }, [setSocket, setConnected]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { connect, disconnect };
}
