const { v4: uuidv4 } = require('uuid');
const Collab = require('../models/Collab');
const Idea = require('../models/Idea');

const getCollabs = async (req, res) => {
    try {
        const ideaId = req.params.ideaId;
        const collabs = await Collab.getCollabs(ideaId);
        res.status(200).json(collabs);
    } catch (error) {
        console.error("❌ Error while fetching collaborations:", error);
        res.status(500).json({ error: error.message });
    }
}

const addCollab = async (req, res) => {
    try {
        const { ideaId, email, permission } = req.body;
        const newCollab = await Collab.addcollabs(ideaId, email, permission);
        res.status(201).json(newCollab);
    } catch (error) {
        console.error("❌ Error while adding collaboration:", error);
        res.status(500).json({ error: error.message });
    }
}

const removeCollab = async (req, res) => {
    try {
        const { ideaId, userId } = req.body;
        const removedCollab = await Collab.removeCollabs(ideaId, userId);
        res.status(200).json(removedCollab);
    } catch (error) {
        console.error("❌ Error while removing collaboration:", error);
        res.status(500).json({ error: error.message });
    }
}

const updateCollab = async (req, res) => {
    try {
        const { ideaId, userId, permissions } = req.body;
        const updatedCollab = await Collab.updateCollabs(ideaId, userId, permissions);
        res.status(200).json(updatedCollab);
    } catch (error) {
        console.error("❌ Error while updating collaboration:", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getCollabs,
    addCollab,
    removeCollab,
    updateCollab,
};