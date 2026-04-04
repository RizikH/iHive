const supabase = require('../config/db');

const saveMessage = async ({ roomId, senderId, content }) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{ room_id: roomId, sender_id: senderId, content }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const getMessages = async (roomId) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

// Returns the other participant's user record using a JOIN — no User model needed
const getReceiverByRoomId = async (roomId, currentUserId) => {
  const { data, error } = await supabase
    .from('chat_participants')
    .select('users(*)')
    .eq('room_id', roomId)
    .neq('user_id', currentUserId)
    .single();

  if (error) throw error;
  return data.users;
};

// Returns full user records for all DM contacts of a given user
const getContacts = async (userId) => {
  const { data: rooms, error: roomsError } = await supabase
    .from('chat_participants')
    .select('room_id')
    .eq('user_id', userId);

  if (roomsError) throw roomsError;
  if (!rooms.length) return [];

  const roomIds = rooms.map(r => r.room_id);

  const { data, error } = await supabase
    .from('chat_participants')
    .select('users(id, username, email, avatar)')
    .in('room_id', roomIds)
    .neq('user_id', userId);

  if (error) throw error;

  // Deduplicate by user id
  const seen = new Set();
  return data
    .map(r => r.users)
    .filter(u => u && !seen.has(u.id) && seen.add(u.id));
};

module.exports = { saveMessage, getMessages, getReceiverByRoomId, getContacts };
