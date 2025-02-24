const Idea = require("../models/Idea");
const supabase = require("../config/db");

// ✅ GET /api/ideas/all
const getAllIdeas = async (req, res) => {
    try {
        const ideas = await Idea.getAllIdeas();
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ GET /api/ideas/get/:id
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

// ✅ POST /api/ideas/ (Create Idea)
const createIdea = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const userId = req.user?.id; // Ensure user is authenticated

        if (!title || !description || !category) {
            return res.status(400).json({ error: "All fields (title, description, category) are required." });
        }

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: Missing user ID." });
        }

        const newIdea = await Idea.createIdea({ user_id: userId, title, description, category });
        res.status(201).json({ message: "Idea created successfully!", idea: newIdea });
    } catch (error) {
        console.error("Create Idea Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// ✅ PUT /api/ideas/update/:id
const updateIdea = async (req, res) => {
    try {
        const { title, description, category, status } = req.body;
        const ideaId = req.params.id;

        const updatedIdea = await Idea.updateIdea(ideaId, { title, description, category, status });
        if (!updatedIdea) {
            return res.status(404).json({ message: "Idea not found or update failed" });
        }

        res.json({ message: "Idea updated successfully!", updatedIdea });
    } catch (error) {
        console.error("Update Idea Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// ✅ DELETE /api/ideas/delete/:id
const deleteIdea = async (req, res) => {
    try {
        const ideaId = req.params.id;
        const deletedIdea = await Idea.deleteIdea(ideaId);

        if (!deletedIdea) {
            return res.status(404).json({ message: "Idea not found" });
        }

        res.json({ message: "Idea deleted successfully", deletedIdea });
    } catch (error) {
        console.error("Delete Idea Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// ✅ GET /api/ideas/search?title=...
const searchIdeasByTitle = async (req, res) => {
    try {
        const { title } = req.params;
        if (!title) {
            return res.status(400).json({ error: "Title parameter is required for search." });
        }

        const ideas = await Idea.getIdeasByTitle(title);
        res.json(ideas);
    } catch (error) {
        console.error("Search Ideas Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllIdeas,
    getIdeaById,
    createIdea,
    updateIdea,
    deleteIdea,
    searchIdeasByTitle
};
