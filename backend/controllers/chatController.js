const ChatModel = require('../models/Chat');

// Fetches messages for a given chat room
async function getMessages(req, res) {
    try {
        const roomId = req.params.roomId; // Room ID passed as URL param
        const messages = await ChatModel.getMessages(roomId); // Retrieve messages from Supabase
        res.json(messages); // Return messages as JSON
    } catch (error) {
        res.status(500).json({ error: error.message }); // Return 500 if error occurs
    }
}

// Saves a new message to the database
async function sendMessage(req, res) {
    try {
        const { roomId, senderId, content } = req.body; // Message data from request body
        const saved = await ChatModel.saveMessage({ roomId, senderId, content }); // Save via model
        res.status(201).json(saved); // Return the saved message
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
}

module.exports = { getMessages, sendMessage }; // Export both functions

