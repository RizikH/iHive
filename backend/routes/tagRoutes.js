const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

router.get("/all", tagController.getAllTags);

// Get tags for a specific idea
router.get("/idea/:id", tagController.getTagsByIdea);

// Generate & attach tags to an idea
router.post("/idea/:id", tagController.createTagsForIdea);

// Delete a tag
router.delete("/:id", tagController.deleteTag);

// Link an existing tag to an idea
router.post("/link", tagController.linkTagToIdea);

router.get("/search/name", tagController.searchName);

module.exports = router;
