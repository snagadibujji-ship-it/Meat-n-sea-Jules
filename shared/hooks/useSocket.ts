import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')
  || process.env.EXPO_PUBLIC_API_URL?.replace('/api', '')
  || 'http://localhost:5000';

type RoomType = 'vendor' | 'order' | 'rider' | 'admin';

export const useSocket = (roomType: RoomType, roomId: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket Connection
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      console.log('Socket connected', socketRef.current?.id);

      // Join specific room
      if (roomId === 'global') {
          socketRef.current?.emit(`join_${roomType}`);
      } else {
          socketRef.current?.emit(`join_${roomType}`, roomId);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomType, roomId]);

  return socketRef.current;
};
