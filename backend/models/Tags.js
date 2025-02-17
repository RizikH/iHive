const supabase = require("../config/db");

const getTagsByIdea = async (idea_id) => {
    const { data, error } = await supabase
        .rpc('get_tags_for_idea', { idea_id }); // Ensure 'idea_id' matches the function parameter

    if (error) {
        console.error('Error fetching data:', error);
        return null;
    }
    console.log("Data = ", data);
    return data;
};

module.exports = {
    getTagsByIdea
};