const supabase = require("../config/db");

const getAllUsers = async () => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};

const getUserById = async (id) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)

    if (error) throw error;
    return data;
};

const createUser = async (username, email, password, bio) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) throw new Error(authError.message);

    const userId = authData.user.id;

    const { data, error } = await supabase
        .from("users")
        .insert([{ id: userId, username, email, bio }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

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

const deleteUser = async (id) => {
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) throw new Error(authError.message);

    const { data, error } = await supabase
        .from("users")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

const getUsersByQuery = async (query, excludeId) => {
    const { data, error } = await supabase
        .from('users')
        .select('id, username')
        .ilike('username', `%${query}%`)
        .neq('id', excludeId);

    if (error) throw error;
    return data;
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUsersByQuery
};
