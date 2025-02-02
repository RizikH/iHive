require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import Routes
const userRoutes = require('./backend/routes/userRoutes');
const ideaRoutes = require('./backend/routes/ideaRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});