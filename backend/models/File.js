const db = require('../config/db'); // Supabase client

const File = {
  // Create a new file record
  async create(file) {
    const { name, type, idea_id, parent_id, user_id, path, content, mime_type } = file;

    const { data, error } = await db
      .from('files')
      .insert([{
        name,
        type,
        idea_id,
        parent_id,
        user_id,
        path,
        content,
        mime_type
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all files under an idea (used to build file tree)
  async getAll(idea_id) {
    const { data, error } = await db
      .from('files')
      .select('*')
      .eq('idea_id', idea_id);

    if (error) throw error;
    return data;
  },

  // Get single file by ID
  async getById(id) {
    const { data, error } = await db
      .from('files')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update file by ID
  async update(id, updates) {
    const { data, error } = await db
      .from('files')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete file by ID
  async remove(id) {
    const { error } = await db
      .from('files')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
};

module.exports = File;
