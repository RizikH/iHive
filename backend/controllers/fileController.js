const s3 = require('../config/s3');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/File');
const path = require('path');

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;


// Upload a file to S3
const uploadFile = async (req, res) => {
  try {
    const file = req.files?.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const uniqueName = `${uuidv4()}_${file.name}`;
    const params = {
      Bucket: BUCKET_NAME,
      Key: uniqueName,
      Body: file.data,
      ContentType: file.mimetype
    };

    const result = await s3.upload(params).promise();
    console.log('📤 Uploaded to S3:', result.Location);

    const saved = await File.create({
      name: file.name,
      type: 'upload',
      idea_id: req.body.idea_id,
      parent_id: req.body.parent_id || null,
      user_id: req.body.user_id || null,
      path: result.Location,
      mime_type: file.mimetype,
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a file from S3 and Supabase
const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.getById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });

    if (file.type === 'upload' && file.path) {
      const key = path.basename(file.path);
      await s3.deleteObject({ Bucket: BUCKET_NAME, Key: key }).promise();
    }
    
    await File.remove(fileId);

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all files for a given idea
const getFiles = async (req, res) => {
  try {
    const ideaId = req.query.idea_id;
    const files = await File.getAll(ideaId);
    res.json(files);
  } catch (err) {
    console.error("❌ Error in getFiles:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get single file
const getFileById = async (req, res) => {
  try {
    const file = await File.getById(req.params.id);
    res.json(file);
  } catch (err) {
    console.error("❌ Error in getFileById:", err);
    res.status(404).json({ error: 'File not found' });
  }
};

// Create a folder or text file
const createFile = async (req, res) => {
  try {
    const { name, type, idea_id, parent_id, user_id, content } = req.body;
    if (!name || !type || !idea_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const file = await File.create({ name, type, idea_id, parent_id, user_id, content });
    res.status(201).json(file);
  } catch (err) {
    console.error("❌ Error in createFile:", err);
    res.status(400).json({ error: err.message });
  }
};

// Update file (e.g. rename or edit text)
const updateFile = async (req, res) => {
  try {
    const file = await File.update(req.params.id, req.body);
    res.json(file);
  } catch (err) {
    console.error("❌ Error in updateFile:", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  getFiles,
  getFileById,
  createFile,
  updateFile
};
