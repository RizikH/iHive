require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser");

const { initializeSocket } = require("./services/socketService");

// Route Modules
const userRoutes = require("./routes/userRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const tagRoutes = require("./routes/tagRoutes");
const fileRoutes = require("./routes/fileRoutes");

// Create app and server
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "ihive-git-dev-main-rizik-haddads-projects.vercel.app",
  "https://ihive.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed from this origin"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));


/**
 * 🔹 Middleware
 */
app.use(cookieParser()); // ✅ Parse cookies for authentication
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 🔹 API Routes
 */
app.use("/api/users", userRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/files", fileRoutes);

/**
 * 🔹 Health Check
 */
app.get("/", (req, res) => {
  res.send("Welcome to iHive API");
});

/**
 * 🔹 WebSocket Support
 */
initializeSocket(server, { origin: "http://localhost:3000", credentials: true });

/**
 * 🔹 Global Error Handling
 */
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

/**
 * 🔹 Start Server
 */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
