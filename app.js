require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http'); // Required for WebSocket
const { Server } = require('socket.io'); // Import Socket.io

// Import Routes
const userRoutes = require('./backend/routes/userRoutes');
const ideaRoutes = require('./backend/routes/ideaRoutes');
const tagRoutes = require('./backend/routes/tagRoutes');

const app = express();
const server = http.createServer(app); // Create HTTP server for WebSockets
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (Change this in production)
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/tags', tagRoutes);

app.get("/", (req, res) => {
    res.send("Hello and welcome to iHive.");
});

// WebSocket Chat Feature
io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Listening for chat messages
    socket.on("chatMessage", (messageData) => {
        console.log("📩 Message received:", messageData);
        io.emit("chatMessage", messageData); // Broadcast message to all connected clients
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

// Global Error Handler
const errorHandler = require('./backend/middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5432;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
