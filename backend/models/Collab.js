const supabase = require("../config/db");
const User = require("./User");

const getCollabs = async (ideaId) => {
    if (!ideaId) {
        throw new Error("Missing required parameter: ideaId");
    }

    try {
        const { data, error } = await supabase
            .from('collaborations')
            .select(`
                user_id,
                permissions,
                users (
                username,
                email
                )
            `)
            .eq('idea_id', ideaId);

        return data;

    } catch (err) {
        console.error("Error in getCollabs function:", err); // Debugging line
        throw err;
    }
};

const addcollabs = async (ideaId, email, permissions) => {
    if (!ideaId || !email || !permissions) {
        throw new Error("Missing required parameters: ideaId, email, or permissions");
    }

    const user = await User.getUserByEmail(email);
    if (!user) {
        throw new Error(`User with email ${email} not found`);
    }

    try {
        const { data, error } = await supabase
            .from('collaborations') // Updated table name
            .insert([
                {
                    idea_id: ideaId,
                    user_id: user.id,
                    permissions: permissions,
                },
            ])
            .select('*, users(username, email)');

        if (error) {
            throw new Error(`Error in addcollabs: ${error.message}`);
        }

        return data[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const removeCollabs = async (ideaId, userId) => {
    if (!ideaId || !userId) {
        throw new Error("Missing required parameters: ideaId or userId");
    }

    try {
        const { data, error } = await supabase
            .from('collaborations') // Updated table name
            .delete()
            .eq('idea_id', ideaId)
            .eq('user_id', userId)
            .select('*');

        if (error) {
            throw new Error(`Error in removeCollabs: ${error.message}`);
        }

        return data[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const updateCollabs = async (ideaId, userId, permissions) => {
    if (!ideaId || !userId || !permissions) {
        throw new Error("Missing required parameters: ideaId, userId, or permissions");
    }

    try {
        const { data, error } = await supabase
            .from('collaborations') // Updated table name
            .update({ permissions })
            .eq('idea_id', ideaId)
            .eq('user_id', userId)
            .select('*');

        if (error) {
            throw new Error(`Error in updateCollabs: ${error.message}`);
        }

        return data[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports = {
    getCollabs,
    addcollabs,
    removeCollabs,
    updateCollabs,
};