const supabase = require('../config/db');

const getAll = async () => {
  const { data, error } = await supabase
    .from('ideas')
    .select(`*, users!user_id(*), idea_tags(*, tags(*))`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const getById = async (id) => {
  const { data, error } = await supabase
    .from('ideas')
    .select('*, users!user_id(*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Idea not found');
  return data;
};

const getAllByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('ideas')
    .select(`*, idea_tags(*, tags(*))`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const create = async ({ user_id, title, description }) => {
  const { data, error } = await supabase
    .from('ideas')
    .insert([{ user_id, title, description }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const update = async (id, fields) => {
  const { data, error } = await supabase
    .from('ideas')
    .update(fields)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Idea not found');
  return data;
};

const remove = async (id) => {
  await supabase.from('idea_tags').delete().eq('idea_id', id);

  const { data, error } = await supabase
    .from('ideas')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Idea not found');
  return data;
};

const searchByTitle = async (title) => {
  const { data, error } = await supabase
    .from('ideas')
    .select(`*, idea_tags(*, tags(*))`)
    .ilike('title', `%${title}%`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const searchByTagIds = async (tagIds) => {
  const { data: ideaTags, error: tagError } = await supabase
    .from('idea_tags')
    .select('idea_id')
    .in('tag_id', tagIds);

  if (tagError) throw new Error(tagError.message);
  if (!ideaTags.length) return [];

  const ideaIds = ideaTags.map(r => r.idea_id);

  const { data, error } = await supabase
    .from('ideas')
    .select(`*, idea_tags(*, tags(*))`)
    .in('id', ideaIds)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

module.exports = { getAll, getById, getAllByUserId, create, update, remove, searchByTitle, searchByTagIds };
