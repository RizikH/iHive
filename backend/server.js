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
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "https://ihive.vercel.app",
  "https://ihive-git-dev-main-rizik-haddads-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/files", fileRoutes);
app.use('/api/chat', chatRoutes);



// Health Check
app.get("/", (req, res) => {
  res.send("Welcome to iHive API");
});

// WebSocket (optional, restrict in prod if needed)
initializeSocket(server, { origin: allowedOrigins[0], credentials: true });

// Global Error Handler
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
