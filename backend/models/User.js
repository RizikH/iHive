const supabase = require("../config/db");

// ✅ Get all users
const getAllUsers = async () => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};

// ✅ Get a user by ID
const getUserById = async (id) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
};

// ✅ Create a new user
const createUser = async (username, email, password, bio) => {
    const { data, error } = await supabase
        .from("users")
        .insert([
            { username, email, password, bio }
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ✅ Update a user
const updateUser = async (id, username, email, bio) => {
    const { data, error } = await supabase
        .from("users")
        .update({ username, email, bio })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ✅ Delete a user
const deleteUser = async (id) => {
    const { data, error } = await supabase
        .from("users")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
