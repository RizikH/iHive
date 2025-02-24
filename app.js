require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const userRoutes = require("./backend/routes/userRoutes");
const ideaRoutes = require("./backend/routes/ideaRoutes");
const tagRoutes = require("./backend/routes/tagRoutes");

const app = express();
const server = http.createServer(app);

// 🟢 CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"] // Allow these for your routes
};
app.use(cors(corsOptions));

// 🟢 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🟢 Routes
app.use("/api/users", userRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/tags", tagRoutes);

app.get("/", (req, res) => {
  res.send("Hello and welcome to iHive.");
});

// 🟢 WebSocket Chat Feature
const io = new Server(server, { cors: corsOptions });

io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on("chatMessage", (messageData) => {
    console.log("📩 Message received:", messageData);
    io.emit("chatMessage", messageData);
  });

  socket.on("error", (err) => {
    console.error(`⚠️ WebSocket error: ${err.message}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// 🟢 Global Error Handler
const errorHandler = require("./backend/middleware/errorHandler");
app.use(errorHandler);

// 🟢 Listen
const PORT = process.env.PORT || 5000; // Instead of 5432
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
