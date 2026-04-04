const supabase = require('../config/db');

const File = {
  async create(file) {
    const { name, type, idea_id, parent_id, user_id, path, content, mime_type, permission_level } = file;

    const record = { name, type, idea_id, user_id };
    if (parent_id !== undefined) record.parent_id = parent_id;
    if (path !== undefined) record.path = path;
    if (content !== undefined) record.content = content;
    if (mime_type !== undefined) record.mime_type = mime_type;
    if (permission_level !== undefined) record.permission_level = permission_level;

    const { data, error } = await supabase
      .from('files')
      .insert([record])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getAll(idea_id) {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('idea_id', idea_id);

    if (error) throw new Error(error.message);
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('File not found');
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('files')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('File not found');
    return data;
  },

  async remove(id) {
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { success: true };
  },
};

module.exports = File;
