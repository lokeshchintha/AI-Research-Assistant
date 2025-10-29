// Load env vars FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';

import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import paperRoutes from './routes/paperRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.io setup for real-time collaboration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/', limiter);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'AI Research Partner API',
    version: '1.0.0',
  });
});

app.use('/auth', authRoutes);
app.use('/papers', paperRoutes);

// Error handler
app.use(errorHandler);

// Socket.io for real-time collaboration
const activeRooms = new Map();

io.on('connection', (socket) => {
  // Join paper room
  socket.on('join-paper', (paperId) => {
    socket.join(paperId);
    
    if (!activeRooms.has(paperId)) {
      activeRooms.set(paperId, new Set());
    }
    activeRooms.get(paperId).add(socket.id);

    // Notify others
    socket.to(paperId).emit('user-joined', {
      socketId: socket.id,
      userCount: activeRooms.get(paperId).size,
    });
  });

  // Leave paper room
  socket.on('leave-paper', (paperId) => {
    socket.leave(paperId);
    
    if (activeRooms.has(paperId)) {
      activeRooms.get(paperId).delete(socket.id);
      
      if (activeRooms.get(paperId).size === 0) {
        activeRooms.delete(paperId);
      } else {
        socket.to(paperId).emit('user-left', {
          socketId: socket.id,
          userCount: activeRooms.get(paperId).size,
        });
      }
    }

    console.log(`User ${socket.id} left paper ${paperId}`);
  });

  // Send note
  socket.on('send-note', ({ paperId, note }) => {
    socket.to(paperId).emit('receive-note', note);
  });

  // Typing indicator
  socket.on('typing', ({ paperId, userName }) => {
    socket.to(paperId).emit('user-typing', { userName });
  });

  socket.on('stop-typing', ({ paperId }) => {
    socket.to(paperId).emit('user-stop-typing');
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove from all rooms
    activeRooms.forEach((users, paperId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        
        if (users.size === 0) {
          activeRooms.delete(paperId);
        } else {
          io.to(paperId).emit('user-left', {
            socketId: socket.id,
            userCount: users.size,
          });
        }
      }
    });
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io ready for real-time collaboration`);
});

export default app;
