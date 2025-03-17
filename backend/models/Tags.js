const supabase = require("../config/db");
const Idea = require("./Idea");
const openAI = require("../services/chatgptService");

const createTagsForIdea = async (ideaID) => {
    const idea = await Idea.getIdeaById(ideaID);
    if (!idea) throw new Error("Idea not found");

    const generatedTags = await openAI.generateTags(idea.title, idea.description);

    for (const tagName of generatedTags) {
        let { data: existingTag, error: tagError } = await supabase
            .from("tags")
            .select("*")
            .eq("name", tagName)
            .single();

        if (!existingTag) {
            ({ data: existingTag, error: tagError } = await supabase
                .from("tags")
                .insert({ name: tagName })
                .select()
                .single());
        }

        if (tagError) console.error("Error inserting tag:", tagError);

        if (existingTag) {
            await supabase
                .from("idea_tags")
                .insert({ idea_id: ideaID, tag_id: existingTag.id });
        }
    }
};

// Get all tags
const getAllTags = async () => {
    const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name", { ascending: true });

    if (error) throw error;
    return data;
};

// Get a single tag by ID
const getTagById = async (id) => {
    const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
};

// Delete a tag
const deleteTag = async (id) => {
    const { data, error } = await supabase
        .from("tags")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Link a tag to an idea
const linkTagToIdea = async (ideaID, tagID) => {
    const { data, error } = await supabase
        .from("idea_tags")
        .insert({ idea_id: ideaID, tag_id: tagID })
        .select()
        .single();

    if (error) throw error;
    return data;
};

const searchName = async (name) => {
    const { data, error } = await supabase
        .from("tags")
        .select("*")
        .ilike("name", `%${name}%`);

    if (error) throw error;
    return data;
};

module.exports = {
    createTagsForIdea,
    getAllTags,
    getTagById,
    deleteTag,
    linkTagToIdea,
    searchName
};
