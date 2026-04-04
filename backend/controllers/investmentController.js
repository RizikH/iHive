const Investment = require('../models/Investment');

const getInvestmentsByIdea = async (req, res) => {
  try {
    const investments = await Investment.getByIdeaId(req.params.ideaId);
    res.json(investments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createInvestment = async (req, res) => {
  try {
    const { idea_id, amount } = req.body;
    const user_id = req.user.sub;

    if (!idea_id || !amount) {
      return res.status(400).json({ error: 'idea_id and amount are required.' });
    }

    const investment = await Investment.create({ idea_id, user_id, amount });
    res.status(201).json(investment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInvestmentsByUser = async (req, res) => {
  try {
    const investments = await Investment.getByUserId(req.params.userId);
    res.json(investments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEntrepreneurInvestments = async (req, res) => {
  try {
    const investments = await Investment.getForEntrepreneur(req.params.userId);
    res.json(investments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: 'status is required.' });

    const updated = await Investment.updateStatus(req.params.investmentId, status);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getInvestmentsByIdea,
  createInvestment,
  getInvestmentsByUser,
  getEntrepreneurInvestments,
  updateStatus,
};
