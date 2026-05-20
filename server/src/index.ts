import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Socket.IO namespaces
const customerIo = io.of('/customer');
const vendorIo = io.of('/vendor');
const partnerIo = io.of('/partner');
const adminIo = io.of('/admin');

customerIo.on('connection', (socket) => {
  console.log('Customer connected:', socket.id);
  socket.on('disconnect', () => console.log('Customer disconnected:', socket.id));
});

vendorIo.on('connection', (socket) => {
  console.log('Vendor connected:', socket.id);
  socket.on('disconnect', () => console.log('Vendor disconnected:', socket.id));
});

partnerIo.on('connection', (socket) => {
  console.log('Partner connected:', socket.id);
  socket.on('disconnect', () => console.log('Partner disconnected:', socket.id));
});

adminIo.on('connection', (socket) => {
  console.log('Admin connected:', socket.id);
  socket.on('disconnect', () => console.log('Admin disconnected:', socket.id));
});

import authRoutes from './routes/auth';

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

// Centralized error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
