const path = require('path');
const { v4: uuidv4 } = require('uuid');
const s3 = require('../config/s3');
const File = require('../models/File');
const Idea = require('../models/Idea');
const { getLevel } = require('../utils/getLevel');
const { canAccess } = require('../utils/permissions');

const BUCKET = process.env.AWS_BUCKET_NAME;

// Maps permission_level string to numeric level
const toLevel = (permission_level) =>
  permission_level === 'public' ? 0 : permission_level === 'protected' ? 1 : 2;

// Resolves whether a user can access an idea's files.
// Returns { isOwner, userLevel } — userLevel is null for non-collaborators.
const resolveAccess = async (userId, idea) => {
  if (idea.user_id === userId) return { isOwner: true, userLevel: null };

  try {
    const userLevel = await getLevel(userId, idea.id);
    return { isOwner: false, userLevel };
  } catch {
    return { isOwner: false, userLevel: null };
  }
};

const canViewFile = (file, { isOwner, userLevel }) => {
  if (isOwner) return true;
  const fileLevel = toLevel(file.permission_level);
  return userLevel === null ? fileLevel === 0 : canAccess(fileLevel, userLevel);
};

const lockedView = (file) => ({
  id: file.id,
  name: file.name,
  type: file.type,
  idea_id: file.idea_id,
  parent_id: file.parent_id,
  user_id: file.user_id,
  mime_type: file.mime_type,
  created_at: file.created_at,
  is_locked: true,
});


const getFiles = async (req, res) => {
  try {
    const ideaId = req.query.idea_id;
    const userId = req.user.sub;

    const idea = await Idea.getById(ideaId);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });

    const access = await resolveAccess(userId, idea);
    const files = await File.getAll(ideaId);

    const result = files.map(file =>
      canViewFile(file, access)
        ? { ...file, is_locked: false }
        : lockedView(file)
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPublicFiles = async (req, res) => {
  try {
    const ideaId = req.query.idea_id;

    const idea = await Idea.getById(ideaId);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });

    const files = await File.getAll(ideaId);

    const result = files.map(file =>
      file.permission_level === 'public'
        ? { ...file, is_locked: false }
        : { ...lockedView(file), path: null }
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFileById = async (req, res) => {
  try {
    const file = await File.getById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    const idea = await Idea.getById(file.idea_id);
    const access = await resolveAccess(req.user.sub, idea);

    if (!canViewFile(file, access)) {
      return res.status(403).json({ error: 'You do not have access to this file.' });
    }

    if (file.type === 'upload' && file.path) {
      file.path = s3.getSignedUrl('getObject', {
        Bucket: BUCKET,
        Key: path.basename(file.path),
        Expires: 300,
      });
    }

    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createFile = async (req, res) => {
  try {
    const { name, type, idea_id, parent_id, content } = req.body;
    const user_id = req.user.sub;

    if (!name || !type || !idea_id) {
      return res.status(400).json({ error: 'name, type, and idea_id are required.' });
    }

    const idea = await Idea.getById(idea_id);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });

    const { isOwner, userLevel } = await resolveAccess(user_id, idea);
    if (!isOwner && userLevel === null) {
      return res.status(403).json({ error: 'Only collaborators or the owner can create files.' });
    }

    const file = await File.create({ name, type, idea_id, parent_id, user_id, content });
    res.status(201).json(file);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateFile = async (req, res) => {
  try {
    const file = await File.getById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    if (file.user_id !== req.user.sub) {
      return res.status(403).json({ error: 'Not authorized to update this file.' });
    }

    const updated = await File.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await File.getById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    if (file.type === 'upload' && file.path) {
      await s3.deleteObject({ Bucket: BUCKET, Key: path.basename(file.path) }).promise()
        .catch(() => {}); // S3 delete failure is non-fatal
    }

    await File.remove(req.params.id);
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    const file = req.files?.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const { idea_id, parent_id } = req.body;
    if (!idea_id) return res.status(400).json({ error: 'idea_id is required' });

    const idea = await Idea.getById(idea_id);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });

    const { isOwner, userLevel } = await resolveAccess(req.user.sub, idea);
    if (!isOwner && userLevel === null) {
      return res.status(403).json({ error: 'Only collaborators or the owner can upload files.' });
    }

    const key = `${uuidv4()}_${file.name}`;
    const result = await s3.upload({
      Bucket: BUCKET,
      Key: key,
      Body: file.data,
      ContentType: file.mimetype,
    }).promise();

    const saved = await File.create({
      name: file.name,
      type: 'upload',
      idea_id,
      parent_id: parent_id || null,
      user_id: req.user.sub,
      path: result.Location,
      mime_type: file.mimetype,
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const streamFile = async (req, res) => {
  try {
    const file = await File.getById(req.params.id);
    if (!file || file.type !== 'upload') {
      return res.status(404).json({ error: 'File not found or not an upload' });
    }

    const idea = await Idea.getById(file.idea_id);
    const access = await resolveAccess(req.user.sub, idea);

    if (!canViewFile(file, access)) {
      return res.status(403).json({ error: 'You do not have access to this file.' });
    }

    res.setHeader('Content-Type', file.mime_type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${file.name}"`);

    s3.getObject({ Bucket: BUCKET, Key: path.basename(file.path) })
      .createReadStream()
      .pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const moveFile = async (req, res) => {
  try {
    const file = await File.getById(req.params.id);
    if (!file || file.user_id !== req.user.sub) {
      return res.status(403).json({ error: 'Not authorized to move this file.' });
    }

    const updated = await File.update(req.params.id, { parent_id: req.body.parent_id });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getFiles,
  getPublicFiles,
  getFileById,
  createFile,
  updateFile,
  deleteFile,
  uploadFile,
  streamFile,
  moveFile,
};
