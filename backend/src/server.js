import app from './app.js';
import { connectDB } from './config/db.config.js';
import { env } from './config/env.config.js';
import { Server } from 'socket.io';

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const startServer = async () => {
  try {
    // Database connection
    await connectDB();

    // Start Express server
    const server = app.listen(env.PORT, () => {
      console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });

    // Initialize Socket.io
    const io = new Server(server, {
      cors: {
        origin: env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    io.on("connection", (socket) => {
      console.log("Client connected via Socket.io:", socket.id);

      socket.on("join_room", (complaintId) => {
        socket.join(complaintId);
        console.log(`User mapped to case room: ${complaintId}`);
      });

      socket.on("send_message", (message) => {
        // The frontend emits the full message document, which includes complaintId
        if (message && message.complaintId) {
          socket.to(message.complaintId).emit("receive_message", message);
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! Shutting down...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
