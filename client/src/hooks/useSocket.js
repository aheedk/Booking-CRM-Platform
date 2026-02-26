import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io('http://localhost:5000', {
      auth: { token },
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return socketRef;
}
