import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: '*', // Adjust for production
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Dynamic Room Joining
    socket.on('join_vendor', (vendorId: string) => {
      socket.join(`vendor_${vendorId}`);
      console.log(`${socket.id} joined vendor_${vendorId}`);
    });

    socket.on('join_order', (orderId: string) => {
      socket.join(`order_${orderId}`);
      console.log(`${socket.id} joined order_${orderId}`);
    });

    socket.on('join_rider', (riderId: string) => {
      socket.join(`rider_${riderId}`);
      console.log(`${socket.id} joined rider_${riderId}`);
    });

    socket.on('join_admin', () => {
        socket.join('admin');
        console.log(`${socket.id} joined admin`);
    })

    // Rider Location Broadcaster
    socket.on('rider_location_update', ({ orderId, lat, lng }: { orderId: string, lat: number, lng: number }) => {
      // Broadcast to the specific order room so the customer can track
      io.to(`order_${orderId}`).emit('rider_location_update', { lat, lng });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
