const ChatModel = require('../models/Chat');

async function getMessages(req, res) {
    try {
        const roomId = req.params.roomId;
        const messages = await ChatModel.getMessages(roomId);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getMessages };
