const Tags = require("../models/Tags");
const Idea = require("../models/Idea");


const getAllTags = async (req, res) => {
    try {
        const tags = await Tags.getAllTags();
        res.json(tags);
    } catch (error) {
        console.error("Error fetching tags:", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ GET /api/tags/idea/:id - Get tags for a specific idea
const getTagsByIdea = async (req, res) => {
    try {
        const tags = await Tags.getTagsByIdea(req.params.id);
        if (!tags || tags.length === 0) {
            return res.status(404).json({ message: "No tags found for this idea" });
        }
        res.json(tags);
    } catch (error) {
        console.error("Error fetching tags for idea:", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ POST /api/tags/idea/:id - Generate & attach tags to an idea
const createTagsForIdea = async (req, res) => {
    try {
        const ideaId = req.params.id;

        // Ensure the idea exists
        const idea = await Idea.getIdeaById(ideaId);
        if (!idea) {
            return res.status(404).json({ error: "Idea not found" });
        }

        // Generate tags using OpenAI
        const generatedTags = await Tags.generateTagsForIdea(ideaId);

        res.status(201).json({ message: "Tags generated and added!", tags: generatedTags });
    } catch (error) {
        console.error("Error creating tags for idea:", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ DELETE /api/tags/:id - Delete a tag by ID
const deleteTag = async (req, res) => {
    try {
        const deletedTag = await Tags.deleteTag(req.params.id);
        if (!deletedTag) {
            return res.status(404).json({ message: "Tag not found" });
        }
        res.json({ message: "Tag deleted successfully", deletedTag });
    } catch (error) {
        console.error("Error deleting tag:", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ POST /api/tags/link - Link an existing tag to an idea
const linkTagToIdea = async (req, res) => {
    try {
        const { idea_id, tag_id } = req.body;

        if (!idea_id || !tag_id) {
            return res.status(400).json({ error: "Idea ID and Tag ID are required." });
        }

        const linkedTag = await Tags.linkTagToIdea(idea_id, tag_id);
        res.status(201).json({ message: "Tag linked to idea!", linkedTag });
    } catch (error) {
        console.error("Error linking tag to idea:", error);
        res.status(500).json({ error: error.message });
    }
};

const searchName = (req, res) => {
    const name = req.query.name;

    try {
        const tags = Tags.searchName(name);
        res.json(tags);
    } catch (error) {
        console.error("Error searching tags by name:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllTags,
    getTagsByIdea,
    createTagsForIdea,
    deleteTag,
    linkTagToIdea,
    searchName
};
