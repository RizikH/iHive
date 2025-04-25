const s3 = require('../config/s3');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/File');
const path = require('path');
const Idea = require('../models/Idea');
const { getLevel } = require('../utils/getLevel');
const { canAccess } = require('../utils/permissions');


const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
if (!BUCKET_NAME) {
  throw new Error("Environment variable AWS_BUCKET_NAME is not defined.");
}

// Upload a file
const uploadFile = async (req, res) => {
  try {
    const file = req.files?.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const ideaId = req.body.idea_id;
    if (!ideaId) return res.status(400).json({ error: 'Invalid or missing idea_id' });

    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ error: "Unauthorized: User information is missing." });

    const idea = await Idea.getIdeaById(ideaId);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });

    const isOwner = idea.user_id === userId;
    let userLevel = null;
    if (!isOwner) {
      try {
        userLevel = await getLevel(userId, ideaId);
      } catch {
        return res.status(403).json({ error: 'Insufficient permissions to upload' });
      }
    }

    // allow collaborators to upload at any level (public = 0, protected = 1, private = 2)
    if (!isOwner && userLevel == null) {
      return res.status(403).json({ error: 'Only collaborators or owner can upload files' });
    }

    const uniqueName = `${uuidv4()}_${file.name}`;
    const params = {
      Bucket: BUCKET_NAME,
      Key: uniqueName,
      Body: file.data,
      ContentType: file.mimetype,
    };

    const result = await s3.upload(params).promise();

    const saved = await File.create({
      name: file.name,
      type: 'upload',
      idea_id: ideaId,
      parent_id: req.body.parent_id || null,
      user_id: userId,
      path: result.Location,
      mime_type: file.mimetype,
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};


// Delete a file
const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.getById(fileId);

    if (!file) {
      console.warn(`⚠️ File ${fileId} not found in DB.`);
      return res.status(404).json({ error: 'File not found in database.' });
    }

    if (file.type === 'upload' && file.path) {
      const key = path.basename(file.path);
      try {
        await s3.deleteObject({ Bucket: BUCKET_NAME, Key: key }).promise();
      } catch (err) {
        console.warn(`⚠️ File not found in S3 or already deleted: ${key}`);
      }
    }

    try {
      await File.remove(fileId);
    } catch (err) {
      console.warn(`⚠️ Couldn't delete from DB: ${err.message}`);
      return res.status(500).json({ error: 'Failed to delete from database.' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: 'Unexpected server error during deletion.' });
  }
};

const getFiles = async (req, res) => {
  try {
    const ideaId = req.query.idea_id;
    const userId = req.user?.sub;

    const idea = await Idea.getIdeaById(ideaId);
    if (!idea) {
      return res.status(404).json({ error: "Idea not found" });
    }

    const isOwner = idea.user_id === userId;
    const files = await File.getAll(ideaId);

    // Determine the user's permission level (if not owner)
    let userLevel = null;
    if (!isOwner) {
      try {
        userLevel = await getLevel(userId, ideaId); // '0' | '1' | '2'
      } catch {
        userLevel = null;
      }
    }

    const filteredFiles = files.map((file) => {
      const fileLevel = file.is_public === "public"
        ? 0
        : file.is_public === "protected"
        ? 1
        : 2;

      const canView = isOwner || (userLevel !== null && canAccess(fileLevel, userLevel));

      if (canView) {
        return { ...file, is_locked: false };
      } else {
        const {
          id, name, type, idea_id, parent_id, user_id,
          mime_type, created_at, updated_at, is_public
        } = file;

        return {
          id,
          name,
          type,
          idea_id,
          parent_id,
          user_id,
          mime_type,
          created_at,
          updated_at,
          is_public,
          is_locked: true
        };
      }
    });

    res.json(filteredFiles);
  } catch (err) {
    console.error("❌ Error in getFiles:", err);
    res.status(500).json({ error: err.message });
  }
};


const getFileById = async (req, res) => {
  try {
    const file = await File.getById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    const userId = req.user?.sub;
    const isOwner = file.user_id === userId;

    let userLevel = null;
    if (!isOwner) {
      try {
        userLevel = await getLevel(userId, file.idea_id);
      } catch {
        userLevel = null;
      }
    }

    const fileLevel = file.is_public === "public" ? 0
                    : file.is_public === "protected" ? 1
                    : 2;

    const canView = isOwner || (userLevel !== null && canAccess(fileLevel, userLevel));

    if (!canView) {
      return res.status(403).json({ error: "You do not have access to this file." });
    }

    // Lock file content if not owner and it's a text file
    if (!isOwner && file.type === 'text') {
      delete file.content;
    }

    // For uploads, provide a signed URL only if access is granted
    if (file.type === "upload" && file.path) {
      const key = path.basename(file.path);
      const signedUrl = s3.getSignedUrl("getObject", {
        Bucket: BUCKET_NAME,
        Key: key,
        Expires: 60 * 5,
      });
      file.path = signedUrl;
    }

    res.json(file);
  } catch (err) {
    console.error("❌ Error in getFileById:", err);
    res.status(404).json({ error: "File not found" });
  }
};


// Create a new file
const createFile = async (req, res) => {
  try {
    const { name, type, idea_id, parent_id, content } = req.body;
    const user_id = req.user?.sub;
    if (!name || !type || !idea_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const idea = await Idea.getIdeaById(idea_id);
    if (!idea) return res.status(404).json({ error: "Idea not found" });

    const isOwner = idea.user_id === user_id;
    let userLevel = null;
    if (!isOwner) {
      try {
        userLevel = await getLevel(user_id, idea_id);
      } catch {
        return res.status(403).json({ error: 'Insufficient permissions to create files' });
      }
    }

    const file = await File.create({
      name,
      type,
      idea_id,
      parent_id,
      user_id,
      content,
      is_public: isOwner ? 'private' : (userLevel === 0 ? 'public' : userLevel === 1 ? 'protected' : 'private')
    });

    res.status(201).json(file);
  } catch (err) {
    console.error("❌ Error in createFile:", err);
    res.status(400).json({ error: err.message });
  }
};

// Update file metadata
const updateFile = async (req, res) => {
  try {
    const file = await File.getById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    const userId = req.user?.sub;
    if (file.user_id !== userId) {
      return res.status(403).json({ error: "Not authorized to update this file." });
    }

    const { name, content, parent_id, type, idea_id, is_public } = req.body;

    const updatedFields = {
      name,
      content,
      parent_id,
      type,
      idea_id,
      is_public
    };

    const updatedFile = await File.update(req.params.id, updatedFields);
    res.json(updatedFile);
  } catch (err) {
    console.error("❌ Error in updateFile:", err);
    res.status(400).json({ error: err.message });
  }
};

const streamFile = async (req, res) => {
  try {
    const file = await File.getById(req.params.id);
    const userId = req.user?.sub;

    if (!file || file.type !== "upload") {
      return res.status(404).json({ error: "File not found or not an upload" });
    }

    const isOwner = file.user_id === userId;

    let userLevel = null;
    if (!isOwner) {
      try {
        userLevel = await getLevel(userId, file.idea_id);
      } catch {
        userLevel = null;
      }
    }

    const fileLevel = file.is_public === "public" ? 0
                    : file.is_public === "protected" ? 1
                    : 2;

    const canStream = isOwner || (userLevel !== null && canAccess(fileLevel, userLevel));

    if (!canStream) {
      return res.status(403).json({ error: "You do not have access to stream this file." });
    }

    const key = path.basename(file.path);
    const s3Stream = s3.getObject({
      Bucket: BUCKET_NAME,
      Key: key,
    }).createReadStream();

    res.setHeader("Content-Type", file.mime_type || "application/octet-stream");
    res.setHeader("Content-Disposition", `inline; filename="${file.name}"`);
    s3Stream.pipe(res);
  } catch (err) {
    console.error("❌ Error streaming file:", err);
    res.status(500).json({ error: "Failed to stream file." });
  }
};


// Move file to a different parent folder
const moveFile = async (req, res) => {
  try {
    const { parent_id } = req.body;
    const fileId = req.params.id;
    const userId = req.user?.sub;

    const file = await File.getById(fileId);

    if (!file || file.user_id !== userId) {
      return res.status(403).json({ error: "Not authorized to move this file." });
    }

    const updatedFile = await File.update(fileId, { parent_id });
    res.json(updatedFile);
  } catch (err) {
    console.error("❌ Error in moveFile:", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  getFiles,
  getFileById,
  createFile,
  updateFile,
  streamFile,
  moveFile,
};
