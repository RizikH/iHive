// routes/fileRoutes.js

const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// GET /api/files?idea_id=123
router.get('/', fileController.getFiles);

// GET /api/files/:id
router.get('/:id', fileController.getFileById);

// POST /api/files
router.post('/', fileController.createFile);

// PUT /api/files/:id
router.put('/:id', fileController.updateFile);

// DELETE /api/files/:id
router.delete('/:id', fileController.deleteFile);

// POST /api/files/upload
router.post('/upload', fileController.uploadFile);

module.exports = router;