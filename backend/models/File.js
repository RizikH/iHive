// models/File.js

const { supabase } = require('../config/db');

const getAll = async (ideaId) => {
  let query = supabase.from('files').select('*');
  if (ideaId) query = query.eq('idea_id', ideaId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

const getById = async (id) => {
  const { data, error } = await supabase.from('files').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

const create = async (file) => {
  const { data, error } = await supabase.from('files').insert(file).select().single();
  if (error) throw error;
  return data;
};

const update = async (id, updates) => {
  const { data, error } = await supabase.from('files').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

const remove = async (id) => {
  const { error } = await supabase.from('files').delete().eq('id', id);
  if (error) throw error;
  return { message: 'Deleted successfully' };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};