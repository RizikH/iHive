require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { initializeSocket } = require("./services/socketService");

const userRoutes = require("./routes/userRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const tagRoutes = require("./routes/tagRoutes");

const app = express();
const server = http.createServer(app);

/**
 * 🔹 CORS Configuration
 * Defines allowed origins and HTTP methods for cross-origin requests.
 */
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"]
};
app.use(cors(corsOptions));

/**
 * 🔹 Middleware
 * Parses incoming JSON and URL-encoded data.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 🔹 API Routes
 * Routes are organized under `/api` for structured access.
 */
app.use("/api/users", userRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/tags", tagRoutes);

/**
 * 🔹 Root Endpoint
 * Basic server health check.
 */
app.get("/", (req, res) => {
  res.send("Welcome to iHive API");
});

/**
 * 🔹 Initialize WebSockets
 * Manages real-time communication.
 */
initializeSocket(server, corsOptions);

/**
 * 🔹 Global Error Handling Middleware
 * Centralized error handling for API requests.
 */
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

/**
 * 🔹 Start Server
 * Listens for incoming HTTP requests and WebSocket connections.
 */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
