const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/auth');
const leaderboardRoutes = require('./src/routes/leaderboard');
const predictionsRoutes = require('./src/routes/predictions');
const fantasyRoutes = require('./src/routes/fantasy');
const playerRoutes = require('./src/routes/player');
const matchesRoutes = require('./src/routes/matches');
const tasksRoutes = require('./src/routes/tasks');
const badgesRoutes = require('./src/routes/badges');
const playingXIRoutes = require('./src/routes/playingXI');
const headToHeadRoutes = require('./src/routes/headToHead');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'CricVibe API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/fantasy', fantasyRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/badges', badgesRoutes);
app.use('/api/playing-xi', playingXIRoutes);
app.use('/api/head-to-head', headToHeadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room for top fans group chat
  socket.on('join-elite-chat', (userId) => {
    socket.join('elite-fans');
    console.log(`User ${userId} joined elite fans chat`);
  });

  // Send message in group chat
  socket.on('send-message', (data) => {
    const { room, message, userId, userName } = data;
    io.to(room).emit('receive-message', {
      message,
      userId,
      userName,
      timestamp: new Date(),
    });
  });

  // Player sends message to fans
  socket.on('player-message', (data) => {
    const { playerId, playerName, message } = data;
    io.to('elite-fans').emit('player-message', {
      playerId,
      playerName,
      message,
      timestamp: new Date(),
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║                                        ║
║       🏏 CricVibe API Server 🏏        ║
║                                        ║
║    Server running on port ${PORT}       ║
║    Environment: ${process.env.NODE_ENV}           ║
║                                        ║
╚════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});
