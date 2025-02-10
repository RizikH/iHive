const supabase = require("../config/db");

const getAllIdeas = async () => {
    const { data, error } = await supabase
        .rpc('get_ideas_with_tags')
    if (error) throw error;
    return data;
};

module.exports = { getAllIdeas };