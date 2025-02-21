const supabase = require("../config/db");
const openAI = require("../services/chatgptService");

// ✅ Get all ideas
const getAllIdeas = async () => {
    const { data, error } = await supabase
        .from('ideas')
        .select('*, idea_tags(*, tags(*))')
        .order("created_at", { ascending: false });

    if (error) {
        console.error('Error fetching data:', error);
        return null;
    }
    return data;
};

// ✅ Get an idea by ID
const getIdeaById = async (id) => {
    const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
};

// ✅ Create a new idea
const createIdea = async (ideaData) => {
    const { data, error } = await supabase
        .from("ideas")
        .insert([ideaData])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ✅ Update an idea
const updateIdea = async (id, ideaData) => {
    const { data, error } = await supabase
        .from("ideas")
        .update(ideaData)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ✅ Delete an idea
const deleteIdea = async (id) => {
    const { data, error } = await supabase
        .from("ideas")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

const searchName = async (name) => {
    const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .ilike("title", `%${name}%`)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};

module.exports = {
    getAllIdeas,
    getIdeaById,
    createIdea,
    updateIdea,
    deleteIdea,
    searchName,
};