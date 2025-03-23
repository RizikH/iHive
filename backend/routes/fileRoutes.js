const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const fileUpload = require('express-fileupload');
const authenticate = require('../middleware/authMiddleware');

// Enable file upload middleware
router.use(fileUpload());

// 🔓 Public Routes
router.get('/', fileController.getFiles);
router.get('/:id', fileController.getFileById);

// 🔐 Protected Routes
router.post('/', authenticate, fileController.createFile);
router.put('/:id', authenticate, fileController.updateFile);
router.delete('/:id', authenticate, fileController.deleteFile);
router.post('/upload', authenticate, fileController.uploadFile);

module.exports = router;
