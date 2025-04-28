const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const fileUpload = require('express-fileupload');
const authenticate = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// ✅ NEW: Get current user info from token
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

router.use(fileUpload());

// ❗ fixed routes FIRST
router.get('/public', fileController.getPublicFiles);
router.post('/upload', authenticate, fileController.uploadFile);
router.post('/move/:id', authenticate, fileController.moveFile);

// protected route for streaming files
router.get('/:id/view', authenticate, fileController.streamFile);

// now dynamic ID routes
router.get('/', authenticate, fileController.getFiles);
router.get('/:id', authenticate, fileController.getFileById);
router.post('/', authenticate, fileController.createFile);
router.put('/:id', authenticate, fileController.updateFile);
router.delete('/:id', authenticate, fileController.deleteFile);


module.exports = router;
