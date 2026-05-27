import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')
  || process.env.EXPO_PUBLIC_API_URL?.replace('/api', '')
  || 'http://localhost:5000';

type RoomType = 'vendor' | 'order' | 'rider' | 'admin';

export const useSocket = (roomType: RoomType, roomId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket Connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      // Join specific room
      if (roomId === 'global') {
          newSocket.emit(`join_${roomType}`);
      } else {
          newSocket.emit(`join_${roomType}`, roomId);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomType, roomId]);

  return socket;
};
