require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http'); // Required for WebSocket
const { Server } = require('socket.io'); // Import Socket.io

// Import Routes
const userRoutes = require('./backend/routes/userRoutes');
const ideaRoutes = require('./backend/routes/ideaRoutes');
const tagRoutes = require('./backend/routes/tagRoutes');

const app = express();
const server = http.createServer(app); // Create HTTP server for WebSockets

// CORS Configuration (Restrict in Production)
const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json()); // Handles JSON requests
app.use(express.urlencoded({ extended: true })); // Handles URL-encoded data

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/tags', tagRoutes);

app.get("/", (req, res) => {
    res.send("Hello and welcome to iHive.");
});

// WebSocket Chat Feature
const io = new Server(server, {
    cors: corsOptions
});

io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Handle chat messages
    socket.on("chatMessage", (messageData) => {
        if (process.env.NODE_ENV !== "production") {
            console.log("📩 Message received:", messageData);
        }
        io.emit("chatMessage", messageData);
    });

    // Handle WebSocket errors
    socket.on("error", (err) => {
        console.error(`⚠️ WebSocket error: ${err.message}`);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

// Global Error Handler
const errorHandler = require('./backend/middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5432; // Keeping the port as 5432
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
