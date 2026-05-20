import { io, Socket } from 'socket.io-client';

const socketURL = import.meta.env?.VITE_SOCKET_URL || 'http://localhost:5000';

type Namespace = '/customer' | '/vendor' | '/partner' | '/admin';

const sockets: Record<string, Socket> = {};

export const getSocket = (namespace: Namespace): Socket => {
  if (!sockets[namespace]) {
    sockets[namespace] = io(`${socketURL}${namespace}`, {
      autoConnect: false,
    });
  }
  return sockets[namespace];
};

export const connectSocket = (namespace: Namespace, token?: string): Socket => {
  const socket = getSocket(namespace);
  if (token) {
    socket.auth = { token };
  }
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = (namespace: Namespace) => {
  if (sockets[namespace]) {
    sockets[namespace].disconnect();
    delete sockets[namespace];
  }
};
