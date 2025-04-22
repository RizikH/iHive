const supabase = require("../config/db");

const findDmRoom = async (user1, user2) => {
  // Get all rooms user1 is in
  const { data: user1Rooms, error: err1 } = await supabase
    .from("chat_participants")
    .select("room_id")
    .eq("user_id", user1);

  if (err1) throw err1;

  const user1RoomIds = user1Rooms.map((r) => r.room_id);

  // Get all rooms user2 is in that also exist in user1's rooms
  const { data: commonRooms, error: err2 } = await supabase
    .from("chat_participants")
    .select("room_id")
    .eq("user_id", user2)
    .in("room_id", user1RoomIds);

  if (err2) throw err2;

  // If they share at least one room, return the first one
  if (commonRooms.length > 0) {
    return { id: commonRooms[0].room_id };
  }

  return null;
};

const createDmRoom = async (user1, user2) => {
  const { data: roomData, error: roomErr } = await supabase
    .from("chat_rooms")
    .insert({})
    .select()
    .single();

  if (roomErr) throw new Error(`Room creation failed: ${roomErr.message}`);

  const { error: partErr } = await supabase
    .from("chat_participants")
    .insert([
      { room_id: roomData.id, user_id: user1 },
      { room_id: roomData.id, user_id: user2 },
    ]);

  if (partErr) throw new Error(`Failed to insert participants: ${partErr.message}`);

  return roomData;
};

const getOrCreateDmRoom = async (user1, user2) => {
  const existingRoom = await findDmRoom(user1, user2);

  if (existingRoom) return existingRoom;

  return await createDmRoom(user1, user2);
};

module.exports = {
  findDmRoom,
  createDmRoom,
  getOrCreateDmRoom,
};
