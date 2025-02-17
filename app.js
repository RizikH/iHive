require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

// Import Routes
const userRoutes = require('./backend/routes/userRoutes');
const ideaRoutes = require('./backend/routes/ideaRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase Setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Store messages in Supabase
async function saveMessage(userId, chatRoom, message) {
    const { data, error } = await supabase.from("messages").insert([
        { user_id: userId, chat_room: chatRoom, message }
    ]);
    if (error) console.error(error);
    return data;
}

// WebSocket Connection
io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on("sendMessage", async ({ userId, room, message }) => {
        const savedMessage = await saveMessage(userId, room, message);
        io.to(room).emit("receiveMessage", { userId, message, timestamp: new Date() });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/ideas', ideaRoutes);

app.get("/", (req, res) => {
    res.send("Hello and welcome to iHive.");
});

// Global Error Handler
const errorHandler = require('./backend/middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5432;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
