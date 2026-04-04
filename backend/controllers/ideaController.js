const Idea = require('../models/Idea');
const Tags = require('../models/Tags');
const { generateIdeaMetadata } = require('../services/aiService');
const { getLevel } = require('../utils/getLevel');

const getAllIdeas = async (req, res) => {
  try {
    const ideas = await Idea.getAll();
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.getById(req.params.id);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });

    const userId = req.user.sub;
    if (idea.user_id !== userId) {
      await getLevel(userId, idea.id); // throws if not a collaborator
    }

    res.json(idea);
  } catch (err) {
    res.status(403).json({ error: 'You do not have access to this idea.' });
  }
};

const getPublicIdeaById = async (req, res) => {
  try {
    const idea = await Idea.getById(req.query.id);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });
    res.json(idea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createIdea = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.sub;

    if (!title || !description) {
      return res.status(400).json({ error: 'title and description are required.' });
    }

    const idea = await Idea.create({ user_id: userId, title, description });

    // Generate tags + category in one AI call, then persist — non-blocking to the response
    generateIdeaMetadata(title, description).then(async ({ tags, category }) => {
      if (category) await Idea.update(idea.id, { category });
      for (const tag of tags) {
        await Tags.upsertAndLink(idea.id, tag).catch(() => {}); // skip individual tag failures
      }
    }).catch(() => {});

    res.status(201).json(idea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateIdea = async (req, res) => {
  try {
    const { title, description, category, status } = req.body;
    const updated = await Idea.update(req.params.id, { title, description, category, status });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteIdea = async (req, res) => {
  try {
    const deleted = await Idea.remove(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchIdeasByTitle = async (req, res) => {
  try {
    const ideas = await Idea.searchByTitle(req.params.title);
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchByTags = async (req, res) => {
  try {
    const tagIds = req.body.tags.map(t => t.id);
    const ideas = await Idea.searchByTagIds(tagIds);
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllByUserId = async (req, res) => {
  try {
    const ideas = await Idea.getAllByUserId(req.params.id);
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllIdeas,
  getIdeaById,
  getPublicIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
  searchIdeasByTitle,
  searchByTags,
  getAllByUserId,
};
