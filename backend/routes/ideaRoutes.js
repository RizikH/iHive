const express = require("express");
const router = express.Router();
const ideaController = require("../controllers/ideaController");
const authenticate = require("../middleware/authMiddleware"); 

// 🔓 Public Routes
router.get("/", ideaController.getAllIdeas);
router.get("/search/title/:title", ideaController.searchIdeasByTitle);
router.get("/search/id/:id", ideaController.getIdeaById);
router.post("/search/tags", ideaController.advancedSearchTags);

// 🔐 Protected Routes
router.post("/", authenticate, ideaController.createIdea);
router.put("/:id", authenticate, ideaController.updateIdea);
router.delete("/:id", authenticate, ideaController.deleteIdea);
router.get("/user/:id", authenticate, ideaController.getAllByUserId);

module.exports = router;