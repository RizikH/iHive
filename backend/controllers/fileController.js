// controllers/fileController.js

const File = require('../models/File');
const { supabase } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const getFiles = async (req, res) => {
  try {
    const files = await File.getAll(req.query.idea_id);
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFileById = async (req, res) => {
  try {
    const file = await File.getById(req.params.id);
    res.json(file);
  } catch (err) {
    res.status(404).json({ error: 'File not found' });
  }
};

const createFile = async (req, res) => {
  try {
    const { name, type, idea_id, parent_id, user_id, content } = req.body;
    if (!name || !type || !idea_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const file = await File.create({ name, type, idea_id, parent_id, user_id, content });
    res.status(201).json(file);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateFile = async (req, res) => {
  try {
    const file = await File.update(req.params.id, req.body);
    res.json(file);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const result = await File.remove(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    const file = req.files?.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const fileName = `${uuidv4()}_${file.name}`;
    const { data, error } = await supabase.storage.from('uploads').upload(fileName, file.data);

    if (error) throw error;

    const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;

    const saved = await File.create({
      name: file.name,
      path: fileUrl,
      type: 'upload',
      idea_id: req.body.idea_id,
      parent_id: req.body.parent_id || null,
      user_id: req.body.user_id || null,
      mime_type: file.mimetype,
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getFiles,
  getFileById,
  createFile,
  updateFile,
  deleteFile,
  uploadFile
};