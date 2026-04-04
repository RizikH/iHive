const Chat = require('../models/Chat');
const ChatRoom = require('../models/ChatRoom');

const getMessages = async (req, res) => {
  try {
    const messages = await Chat.getMessages(req.params.roomId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { roomId, content } = req.body;
    const senderId = req.user.sub;
    const saved = await Chat.saveMessage({ roomId, senderId, content });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrCreateDMRoom = async (req, res) => {
  try {
    const { user2 } = req.body;
    const user1 = req.user.sub;
    const room = await ChatRoom.getOrCreateDmRoom(user1, user2);
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReceiverInfo = async (req, res) => {
  try {
    const receiver = await Chat.getReceiverByRoomId(req.params.roomId, req.user.sub);
    res.json(receiver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Chat.getContacts(req.user.sub);
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getMessages, sendMessage, getOrCreateDMRoom, getReceiverInfo, getContacts };
