const supabase = require('../config/db');

const getByIdeaId = async (ideaId) => {
  const { data, error } = await supabase
    .from('collaborations')
    .select(`user_id, permissions, users(username, email)`)
    .eq('idea_id', ideaId);

  if (error) throw new Error(error.message);
  return data;
};

const add = async (ideaId, userId, permissions) => {
  const { data, error } = await supabase
    .from('collaborations')
    .insert([{ idea_id: ideaId, user_id: userId, permissions }])
    .select('*, users(username, email)')
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to add collaborator');
  return data;
};

const remove = async (ideaId, userId) => {
  const { data, error } = await supabase
    .from('collaborations')
    .delete()
    .eq('idea_id', ideaId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Collaboration not found');
  return data;
};

const update = async (ideaId, userId, permissions) => {
  const { data, error } = await supabase
    .from('collaborations')
    .update({ permissions })
    .eq('idea_id', ideaId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Collaboration not found');
  return data;
};

module.exports = { getByIdeaId, add, remove, update };
