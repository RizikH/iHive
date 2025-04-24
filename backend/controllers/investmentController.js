const investmentModel = require('../models/Investment');

// GET /api/investments/:idea_id
const getInvestments = async (req, res) => {
  const { idea_id } = req.params;

  try {
    const investments = await investmentModel.getInvestmentsByIdeaId(idea_id);
    res.status(200).json(investments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/investments
const createInvestment = async (req, res) => {
  const { idea_id, user_id, amount } = req.body;

  if (!idea_id || !user_id || !amount) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const invested_at = new Date().toISOString();

  try {
    const newInvestment = await investmentModel.addInvestment({
      idea_id,
      user_id,
      amount,
      invested_at,
    });
    res.status(201).json(newInvestment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInvestmentsByUser = async (req, res) => {
    const { user_id } = req.params;
  
    try {
      const investments = await investmentModel.getInvestmentsByUserId(user_id);
      res.status(200).json(investments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const getEntrepreneurInvestments = async (req, res) => {
    const { user_id } = req.params;
  
    try {
      const investments = await investmentModel.getInvestmentsForEntrepreneur(user_id);
      res.status(200).json(investments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };  

module.exports = {
  getInvestments,
  createInvestment,
  getInvestmentsByUser,
  getEntrepreneurInvestments,
};
