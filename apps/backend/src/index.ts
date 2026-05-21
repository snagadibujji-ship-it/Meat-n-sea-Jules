import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import routes from './routes';
import { startRedisCleanupListener } from './workers/dispatchCleanup';
import { createServer } from 'http';
import { initSocket } from './socket';

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API Routes
app.use('/api', routes);

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/meat-n-sea';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    // Start listening for Redis TTL expirations to clean up dispatch offers
    startRedisCleanupListener();
    // Setup Daily Subscription Cron (Simulated via setInterval for demo: runs every minute)
    setInterval(processSubscriptions, 60000);
    // Setup SLA Breach Monitor (runs every minute)
    setInterval(checkSlaBreaches, 60000);

    // Initialize Socket.io
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
