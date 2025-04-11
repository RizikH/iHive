const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const fileUpload = require('express-fileupload');
const authenticate = require('../middleware/authMiddleware');

// Enable file upload middleware
router.use(fileUpload());

router.get('/', authenticate, fileController.getFiles);

// protected route for streaming files
router.get('/:id/view', authenticate, fileController.streamFile);


// Gets a file by ID
router.get('/:id',authenticate, fileController.getFileById);

// 🔐 Protected Routes
router.post('/', authenticate, fileController.createFile);
router.put('/:id', authenticate, fileController.updateFile);
router.delete('/:id', authenticate, fileController.deleteFile);

router.post('/upload', authenticate, fileController.uploadFile);

router.post('/move/:id', authenticate, fileController.moveFile);

module.exports = router;
