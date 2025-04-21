const { createClient } = require('@supabase/supabase-js');
const supabase = require("../config/db"); // Supabase client configured with URL and KEY

const TABLE_NAME = 'chat_messages'; // Name of the table in Supabase

// Save a new chat message to the database
async function saveMessage({ roomId, senderId, content }) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([{ room_id: roomId, sender_id: senderId, content }]); // Insert into Supabase
    if (error) throw error;
    return data[0]; // Return the first (and only) inserted row
}

// Retrieve all messages for a specific room ID
async function getMessages(roomId) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('room_id', roomId) // Filter by room ID
        .order('created_at', { ascending: true }); // Order by time ascending
    if (error) throw error;
    return data;
}

module.exports = { saveMessage, getMessages }; // Export model functions

