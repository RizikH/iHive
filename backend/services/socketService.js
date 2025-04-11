const { Server } = require("socket.io");

let io; // Global WebSocket instance

/**
 * Initializes the WebSocket server and sets up event listeners.
 *
 * @param {Object} server - HTTP server instance.
 * @param {Object} corsOptions - CORS configuration for WebSockets.
 */
const initializeSocket = (server, corsOptions) => {
  io = new Server(server, { cors: corsOptions });

  io.on("connection", (socket) => {
    console.log(`🔌 New WebSocket connection established: ${socket.id}`);

    /**
     * Handle incoming messages from users.
     */
    socket.on("message", (message) => {
      console.log(`Received message: ${message}`);
      socket.emit("message", message);
  });

    /**
     * Handle user joining a discussion room based on idea ID.
     */
    socket.on("joinRoom", ({ ideaId, userId }) => {
    socket.join(ideaId);
    console.log(`🟢 User ${userId} joined idea room: ${ideaId}`);
    socket.emit("joinedRoom", { ideaId, userId }); // Emit acknowledgment
});

    /**
     * Direct messaging between users (investors & innovators).
     */
    socket.on("directMessage", ({ sender, receiver, message }) => {
      io.to(receiver).emit("directMessage", { sender, message });
    });

    /**
     * Broadcast an idea pitch in a discussion room.
     */
    socket.on("newPitch", ({ ideaId, pitch }) => {
      io.to(ideaId).emit("newPitch", pitch);
    });

    /**
     * Notify when an investor expresses interest in an idea.
     */
    socket.on("interest", ({ ideaId, investor }) => {
      io.to(ideaId).emit("investorInterest", { investor });
    });

    /**
     * Send real-time notifications to a specific user.
     */
    socket.on("sendNotification", ({ recipientId, message }) => {
      io.to(recipientId).emit("notification", message);
    });

    /**
     * Handle WebSocket disconnection.
     */
    socket.on("disconnect", () => {
      console.log(`❌ WebSocket disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Retrieves the existing WebSocket instance.
 *
 * @returns {Object} WebSocket server instance.
 * @throws {Error} If WebSocket is not initialized.
 */
const getIO = () => {
  if (!io) {
    throw new Error("WebSocket server has not been initialized.");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
