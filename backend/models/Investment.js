const supabase = require("../config/db");

// Fetch all investments for a specific idea
const getInvestmentsByIdeaId = async (idea_id) => {
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .eq('idea_id', idea_id);

  if (error) throw error;
  return data;
};

// Create a new investment
const addInvestment = async ({ idea_id, user_id, amount, invested_at }) => {
  const { data, error } = await supabase
    .from('investments')
    .insert([{ idea_id, user_id, amount, invested_at }])
    .single();

  if (error) throw error;
  return data;
};

// Get all investments made by a specific user
const getInvestmentsByUserId = async (user_id) => {
  const { data, error } = await supabase
    .from('investments')
    .select('*, ideas(*)')
    .eq('user_id', user_id);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

const getInvestmentsForEntrepreneur = async (entrepreneur_id) => {
  const { data, error } = await supabase
    .from('ideas')
    .select('*, investments(*, users(username))') // Ensure investments is the correct relation
    .eq('user_id', entrepreneur_id); // Ensure user_id is the correct column

  if (error) {
    console.error('Error fetching investments:', error); // Log the error for debugging
    throw error; // Rethrow the error for further handling
  }
  return data; // Return the fetched data
};

const updateStatus = async (investment_id, status) => {
  const { data, error } = await supabase
    .from('investments')
    .update({ status }) // ✅ Make sure it's wrapped in an object
    .eq('id', investment_id)
    .single();

  if (error) {
    console.error('[Model] Supabase error:', error.message);
    throw error;
  }
  return data;
};

module.exports = {
  getInvestmentsByIdeaId,
  addInvestment,
  getInvestmentsByUserId,
  getInvestmentsForEntrepreneur,
  updateStatus
};
