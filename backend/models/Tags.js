const supabase = require("../config/db");

const getAllIdeas = async () => {
    const { data, error } = await supabase
        .from('ideas')
        .select('*, idea_tags(*, tags(*))');
        
    if (error) {
        console.error('Error fetching data:', error);
        return null;
    }
    return data;
};

const getTagsByIdea = async () => {
    const { data, error } = await supabase
        .from('tags')
        .select('*, ')

};

module.exports = { getAllIdeas };