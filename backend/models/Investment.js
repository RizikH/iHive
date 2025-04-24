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
      .select('*')
      .eq('user_id', user_id);
  
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  };  

  const getInvestmentsForEntrepreneur = async (entrepreneur_id) => {
    const { data, error } = await supabase
      .from('investments')
      .select('id, amount, invested_at, status, message, idea!inner(user_id), user(username)')
      .eq('idea.user_id', entrepreneur_id);
  
    if (error) throw error;
    return data;
  };  

module.exports = {
  getInvestmentsByIdeaId,
  addInvestment,
  getInvestmentsByUserId,
  getInvestmentsForEntrepreneur,
};
