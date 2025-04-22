const ChatModel = require('../models/Chat');
const RoomModel = require('../models/ChatRoom');

// Fetches messages for a given chat room
async function getMessages(req, res) {
    try {
        const roomId = req.params.roomId;
        const messages = await ChatModel.getMessages(roomId);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Saves a new message to the database
async function sendMessage(req, res) {
    try {
        const { roomId, senderId, content } = req.body;
        const saved = await ChatModel.saveMessage({ roomId, senderId, content });
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Gets or creates a direct message room
const getOrCreateDMRoom = async (req, res) => {
    try {
        const { user1, user2 } = req.body;
        const room = await RoomModel.getOrCreateDmRoom(user1, user2);
        res.json(room);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getReceiverInfo = async (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.query;

    if (!roomId || !userId) {
        return res.status(400).json({ error: 'Missing roomId or userId' });
    }

    try {
        const receiver = await ChatModel.getReceiverInfoByRoomId(roomId, userId);
        return res.json(receiver);
    } catch (err) {
        console.error('Receiver fetch failed:', err.message);
        return res.status(500).json({ error: err.message });
    }
};

const getContacts = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    try {
        const users = await ChatModel.getContacts(userId);
        return res.json(users);
    } catch (err) {
        console.error('Contacts fetch failed:', err.message);
        return res.status(500).json({ error: err.message });
    }
};
  

module.exports = {
    getMessages,
    sendMessage,
    getOrCreateDMRoom,
    getReceiverInfo,
    getContacts,
};

