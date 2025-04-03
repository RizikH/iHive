const Idea = require("../models/Idea");
const supabase = require("../config/db");

// ✅ GET /api/ideas
const getAllIdeas = async (req, res) => {
    try {
        const ideas = await Idea.getAllIdeas();
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ GET /api/ideas/:id
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

const createIdea = async (req, res) => {
  try {
    console.log("📥 Incoming request body:", req.body);

    const { title, description } = req.body;

    // 🔍 Extract user info from decoded token set by middleware
    const userTokenPayload = req.user;

    const userId = userTokenPayload?.sub;

    // 🔒 Validate inputs
    if (!title || !description) {
      console.warn("⚠️ Missing fields:", { title, description});
      return res.status(400).json({ error: "Fields (title, description) are required." });
    }

    if (!userId) {
      console.warn("❌ No userId found in token payload");
      return res.status(401).json({ error: "Unauthorized: Missing or invalid user token." });
    }

    // 💾 Create the idea in DB
    const newIdea = await Idea.createIdea({
      user_id: userId,
      title,
      description,
    });

    return res.status(201).json({ message: "Idea created successfully!", idea: newIdea });

  } catch (error) {
    console.error("❌ Error while creating idea:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
};


// ✅ PUT /api/ideas/:id
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

// ✅ DELETE /api/ideas/:id
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
        const { title } = req.query;
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

// ✅ POST /api/ideas/search/tags
const advancedSearchTags = async (req, res) => {
    try {
        const { tags } = req.body;
        if (!tags || !tags.length) {
            return res.status(400).json({ error: "Tags array is required for search." });
        }

        const ideas = await Idea.advancedSearchTags(tags);
        res.json(ideas);
    } catch (error) {
        console.error("Search Ideas Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const getAllByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        const ideas = await Idea.getAllByUserId(userId);
        res.json(ideas);
    } catch (error) {
        console.error("Get Ideas by User Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllIdeas,
    getIdeaById,
    getAllByUserId,
    createIdea,
    updateIdea,
    deleteIdea,
    searchIdeasByTitle,
    advancedSearchTags
};