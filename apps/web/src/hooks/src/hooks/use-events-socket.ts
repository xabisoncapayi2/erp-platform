'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/auth-context';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000/events';

export const useEventsSocket = () => {
  const { token, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('error', (err: { message: string }) => {
      console.error('WS Authentication or server error:', err.message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, isAuthenticated]);

  const subscribeToEvent = <T>(eventName: string, callback: (data: T) => void) => {
    if (!socketRef.current) return;
    socketRef.current.on(eventName, callback);

    return () => {
      socketRef.current?.off(eventName, callback);
    };
  };

  return {
    socket: socketRef.current,
    isConnected,
    subscribeToEvent,
  };
};