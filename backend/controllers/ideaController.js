const Idea = require('../models/Idea');
const Tag = require('../models/Tags');
const chatgptService = require("../services/chatgptService");

// GET /api/ideas
const getAllIdeas = async (req, res) => {
    try {
        const ideas = await Idea.getAllIdeas();
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/ideas/:id
const getIdeaById = async (req, res) => {
    try {
        const idea = await Idea.getIdeaById(req.params.id);
        if (!idea) {
            return res.status(404).json({ message: "Idea not found" });
        }
        res.json(idea);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /api/ideas
const createIdea = async (req, res) => {
    try {
        const { title, description } = req.body;

        // Create the idea
        const newIdea = await Idea.createIdea(title, description);

        // Generate tags using AI
        const tags = await chatgptService.generateTags(title, description);
        
        // Process each tag: check if it exists, otherwise create it
        const tagIds = await Promise.all(
            tags.map(async (tagName) => {
                let tag = await Tag.findByName(tagName);
                if (!tag) {
                    tag = await Tag.createTag(tagName);
                }
                return tag.id;
            })
        );

        // Associate tags with the idea
        await Idea.addTagsToIdea(newIdea.id, tagIds);

        res.status(201).json({ message: "Idea created successfully", idea: newIdea, tags });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/ideas/:id
const updateIdea = async (req, res) => {
    try {
        const { title, description } = req.body;
        const updatedIdea = await Idea.updateIdea(req.params.id, title, description);
        if (!updatedIdea) {
            return res.status(404).json({ message: "Idea not found" });
        }

        // Regenerate tags for the updated idea
        const tags = await chatgptService.generateTags(title, description);
        
        // Process each tag: check if it exists, otherwise create it
        const tagIds = await Promise.all(
            tags.map(async (tagName) => {
                let tag = await Tag.findByName(tagName);
                if (!tag) {
                    tag = await Tag.createTag(tagName);
                }
                return tag.id;
            })
        );

        // Update associated tags with the idea
        await Idea.updateTagsForIdea(updatedIdea.id, tagIds);

        res.json({ message: "Idea updated successfully", idea: updatedIdea, tags });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE /api/ideas/:id
const deleteIdea = async (req, res) => {
    try {
        const deleted = await Idea.deleteIdea(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Idea not found" });
        }
        res.json({ message: "Idea deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/ideas/search/:name
const getIdeasByTitle = async (req, res) => {
    try {
        const ideas = await Idea.getIdeasByTitle(req.params.title);
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    getAllIdeas, 
    getIdeaById, 
    createIdea, 
    updateIdea, 
    deleteIdea, 
    getIdeasByTitle 
};
