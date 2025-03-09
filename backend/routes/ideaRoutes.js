const express = require("express");
const router = express.Router();
const ideaController = require("../controllers/ideaController");

// Get all ideas
router.get("/", ideaController.getAllIdeas);

// Create a new idea
router.post("/", ideaController.createIdea);

// Update an idea by ID
router.put("/:id", ideaController.updateIdea);

// Delete an idea by ID
router.delete("/:id", ideaController.deleteIdea);

// Search for ideas with similar titles or exact match by ID
router.get("/search/title/:title", ideaController.searchIdeasByTitle);
router.get("/search/id/:id", ideaController.getIdeaById);

module.exports = router;
