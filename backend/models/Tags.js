const supabase = require('../config/db');

const getAll = async () => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

const getById = async (id) => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Tag not found');
  return data;
};

const search = async (name) => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .ilike('name', `%${name}%`);

  if (error) throw new Error(error.message);
  return data;
};

const remove = async (id) => {
  const { data, error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Tag not found');
  return data;
};

const upsertAndLink = async (ideaId, tagName) => {
  let { data: tag, error: fetchError } = await supabase
    .from('tags')
    .select('*')
    .eq('name', tagName)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') throw new Error(fetchError.message);

  if (!tag) {
    const { data: newTag, error: insertError } = await supabase
      .from('tags')
      .insert({ name: tagName })
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);
    tag = newTag;
  }

  const { error: linkError } = await supabase
    .from('idea_tags')
    .insert({ idea_id: ideaId, tag_id: tag.id });

  if (linkError && linkError.code !== '23505') throw new Error(linkError.message);

  return tag;
};

module.exports = { getAll, getById, search, remove, upsertAndLink };
