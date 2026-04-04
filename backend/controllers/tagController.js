const Tags = require('../models/Tags');

const getAllTags = async (req, res) => {
  try {
    const tags = await Tags.getAll();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchByName = async (req, res) => {
  try {
    const tags = await Tags.search(req.query.name || '');
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    const deleted = await Tags.remove(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllTags, searchByName, deleteTag };
