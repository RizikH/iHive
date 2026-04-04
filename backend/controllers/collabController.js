const Collab = require('../models/Collab');
const User = require('../models/User');

const getCollabs = async (req, res) => {
  try {
    const collabs = await Collab.getByIdeaId(req.params.ideaId);
    res.json(collabs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addCollab = async (req, res) => {
  try {
    const { ideaId, email, permissions } = req.body;

    const user = await User.getUserByEmail(email);
    if (!user) return res.status(404).json({ error: `No user found with email ${email}` });

    const collab = await Collab.add(ideaId, user.id, permissions);
    res.status(201).json(collab);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeCollab = async (req, res) => {
  try {
    const { ideaId, userId } = req.params;
    const removed = await Collab.remove(ideaId, userId);
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCollab = async (req, res) => {
  try {
    const { ideaId, userId } = req.params;
    const { permissions } = req.body;
    const updated = await Collab.update(ideaId, userId, permissions);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCollabs, addCollab, removeCollab, updateCollab };
