const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');


router.get("/idea/:id", tagController.getTagsByIdea);


module.exports = router;