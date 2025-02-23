const Tags = require("../models/Tags");

// get /api/tags/idea/:id
const getTagsByIdea = async (req, res) => {
    try {
        const tags = await Tags.getTagsByIdea(req.params.id);
        if (tags) {
            res.json(tags);
        } else {
            res.status(404).json({ message: 'Tags not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// post /api/tags/idea

module.exports = {
    getTagsByIdea
}