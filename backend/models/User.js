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

// ✅ Create a new user with Supabase Auth
const createUser = async (username, email, password, bio) => {
    // Step 1: Sign up user using Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError) throw new Error(authError.message);

    const userId = authData.user.id; // Get the Supabase Auth user ID

    // Step 2: Store additional user details in the database
    const { data, error } = await supabase
        .from("users")
        .insert([{ id: userId, username, email, bio }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

// ✅ Update a user (only profile details, not password)
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

// ✅ Delete a user (from both Supabase Auth & database)
const deleteUser = async (id) => {
    // Step 1: Remove from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) throw new Error(authError.message);

    // Step 2: Remove from `users` table
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
