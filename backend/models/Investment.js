const supabase = require('../config/db');

const getByIdeaId = async (ideaId) => {
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .eq('idea_id', ideaId);

  if (error) throw new Error(error.message);
  return data;
};

const create = async ({ idea_id, user_id, amount }) => {
  const { data, error } = await supabase
    .from('investments')
    .insert([{ idea_id, user_id, amount }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create investment');
  return data;
};

const getByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('investments')
    .select('*, ideas(*)')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return data;
};

const getForEntrepreneur = async (entrepreneurId) => {
  const { data, error } = await supabase
    .from('ideas')
    .select('*, investments(*, users!user_id(username))')
    .eq('user_id', entrepreneurId);

  if (error) throw new Error(error.message);
  return data;
};

const updateStatus = async (investmentId, status) => {
  const { data, error } = await supabase
    .from('investments')
    .update({ status })
    .eq('id', investmentId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Investment not found');
  return data;
};

module.exports = { getByIdeaId, create, getByUserId, getForEntrepreneur, updateStatus };
