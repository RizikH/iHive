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
 * 🔹 Convert allowed origins into an array, fallback to localhost
 */
const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(',').map(url => url.trim())
  : ["http://localhost:3000"];

/**
 * 🔹 CORS Configuration
 * Defines allowed origins and HTTP methods for cross-origin requests.
 */
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow request
    } else {
      callback(new Error(`CORS policy does not allow access from: ${origin}`));
    }
  },
  credentials: true, // Required for WebSockets & cookies
  methods: ["GET", "POST", "PUT", "DELETE"]
};
app.use(cors(corsOptions));

/**
 * 🔹 Middleware
 * Parses incoming JSON and URL-encoded data.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup cookies for Auth sake
const cookieParser = require("cookie-parser");
app.use(cookieParser());

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
