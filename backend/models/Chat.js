const supabase = require("../config/db"); // Supabase client configured with URL and KEY
const User = require('./User'); // User model for fetching user details

const TABLE_NAME = 'chat_messages'; // Name of the table in Supabase

async function saveMessage({ roomId, senderId, content }) {
    const { data, error } = await supabase
        .from("chat_messages")
        .insert([{ room_id: roomId, sender_id: senderId, content }])
        .select(); // 🔥 Add this to return inserted rows

    if (error) throw error;

    if (!data || !data.length) {
        throw new Error("Message insert succeeded but no data returned.");
    }

    return data[0];
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

const getOrCreateDMRoom = async (user1, user2) => {
    const { data, error } = await supabase
        .rpc('get_or_create_dm_room', { user1, user2 });

    if (error) throw error;

    return data[0]; // { id: 'room-uuid' }
};

const getReceiverInfoByRoomId = async (roomId, currentUserId) => {
    const { data, error } = await supabase
        .from('chat_participants')
        .select('user_id')
        .eq('room_id', roomId);

    if (error) throw new Error(error.message);

    const other = data.find(p => p.user_id !== currentUserId);
    if (!other) throw new Error('Other participant not found');

    const otherInfo = await User.getUserById(other.user_id);
    return otherInfo;
};

const getContacts = async (userId) => {
    // Step 1: Get all room IDs the current user participates in
    const { data: userRooms, error: userRoomsError } = await supabase
      .from('chat_participants')
      .select('room_id')
      .eq('user_id', userId);
  
    if (userRoomsError) throw new Error(userRoomsError.message);
    if (!userRooms || userRooms.length === 0) return [];
  
    const roomIds = userRooms.map((row) => row.room_id);
  
    // Step 2: Get all participants in those rooms
    const { data: allParticipants, error: participantsError } = await supabase
      .from('chat_participants')
      .select('user_id')
      .in('room_id', roomIds);
  
    if (participantsError) throw new Error(participantsError.message);
  
    // Step 3: Filter out current user's ID and deduplicate
    const contacts = [
      ...new Set(
        allParticipants
          .filter((p) => p.user_id !== userId)
          .map((p) => p.user_id)
      ),
    ];

    // Step 4: Fetch user details for each contact
    const { data: userDetails, error: userDetailsError } = await supabase
      .from('users')
      .select('*')
      .in('id', contacts);
    if (userDetailsError) throw new Error(userDetailsError.message);

    return userDetails;
};

module.exports = {
    saveMessage,
    getMessages,
    getOrCreateDMRoom,
    getReceiverInfoByRoomId,
    getContacts,
};
