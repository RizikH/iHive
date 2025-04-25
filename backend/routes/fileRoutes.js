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

// Enable file upload middleware
router.use(fileUpload());

router.get('/public', fileController.getPublicFiles);

// Apply rate limiter to all routes
router.use(authRateLimiter);

router.get('/', authenticate, fileController.getFiles);

// protected route for streaming files
router.get('/:id/view', authenticate, fileController.streamFile);

// Gets a file by ID
router.get('/:id', authenticate, fileController.getFileById);

router.get('/public', fileController.getPublicFiles);

// 🔐 Protected Routes
router.post('/', authenticate, fileController.createFile);
router.put('/:id', authenticate, fileController.updateFile);
router.delete('/:id', authenticate, fileController.deleteFile);

router.post('/upload', authenticate, fileController.uploadFile);

router.post('/move/:id', authenticate, fileController.moveFile);

module.exports = router;
