const Tags = require("../models/Tags");


const getAllIdeas = async (req, res) => {
    try {
        const ideas = await Tags.getAllIdeas();
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllIdeas
}