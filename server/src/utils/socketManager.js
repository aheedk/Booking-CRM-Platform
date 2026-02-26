const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

function initSocket(httpServer) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://127.0.0.1:5173'];

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
    },
  });

  // JWT authentication on socket handshake
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id, email, role }
      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const { id, role } = socket.user;

    // Each client joins their personal room
    socket.join(`user:${id}`);

    // Admins additionally join the shared admin broadcast room
    if (role === 'admin') {
      socket.join('admins');
    }

    socket.on('disconnect', () => {
      // socket.io handles room cleanup automatically
    });
  });

  return io;
}

function getIo() {
  if (!io) throw new Error('Socket.io not initialized — call initSocket first');
  return io;
}

function emitToUser(userId, event, data) {
  getIo().to(`user:${userId}`).emit(event, data);
}

function emitToAdmins(event, data) {
  getIo().to('admins').emit(event, data);
}

module.exports = { initSocket, getIo, emitToUser, emitToAdmins };
