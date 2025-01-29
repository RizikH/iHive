// Import required modules
require('dotenv').config(); // Load .env file
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5432;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// Supabase Client Setup
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);


// Import Routers
const ideasRouter = require('./backend/routes/ideaRoutes');


// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the iHive server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
