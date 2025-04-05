const { createClient } = require('@supabase/supabase-js');
const supabase = require("../config/db");

const TABLE_NAME = 'chat_messages';

async function saveMessage({ roomId, senderId, content }) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([{ room_id: roomId, sender_id: senderId, content }]);
    if (error) throw error;
    return data[0];
}

async function getMessages(roomId) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
}

module.exports = { saveMessage, getMessages };
