const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const controller = require('../controllers/fileController');
const authenticate = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

router.use(rateLimiter);
router.use(fileUpload());

// Specific routes before parameterized routes
router.get('/public', controller.getPublicFiles);
router.get('/', authenticate, controller.getFiles);
router.post('/', authenticate, controller.createFile);
router.post('/upload', authenticate, controller.uploadFile);
router.post('/move/:id', authenticate, controller.moveFile);
router.get('/:id/stream', authenticate, controller.streamFile);
router.get('/:id', authenticate, controller.getFileById);
router.put('/:id', authenticate, controller.updateFile);
router.delete('/:id', authenticate, controller.deleteFile);

module.exports = router;
