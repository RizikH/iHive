const supabase = require("../config/db");
const openAI = require("../services/chatgptService");

const getAllIdeas = async () => {
    const { data, error } = await supabase
        .from("ideas")
        .select("*, idea_tags(*, tags(*))")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching ideas:", error);
        return null;
    }
    return data;
};

const createIdea = async (ideaData) => {
    const { data, error } = await supabase
        .from("ideas")
        .insert([ideaData])
        .select()
        .single();

    if (error) throw error;

    // Generate tags using OpenAI
    const generatedTags = await openAI.generateTags(data.title, data.description);

    // Insert tags into the `tags` table and link them
    const insertedTags = [];
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
                .insert({ idea_id: data.id, tag_id: existingTag.id });
            insertedTags.push(existingTag);
        }
    }

    return data;
};

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

const deleteIdea = async (id) => {
    await supabase.from("idea_tags").delete().eq("idea_id", id);
    const { data, error } = await supabase
        .from("ideas")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

const getIdeaById = async (id) => {
    const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
};

const getIdeasByTitle = async (title) => {
    const { data, error } = await supabase
        .from("ideas")
        .select(`
            *,
            idea_tags (
                *,
                tags (*)
            )
        `)
        .ilike("title", `%${title}%`)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};

const advancedSearchTags = async (tags) => {
    const tagIds = tags.map((tag) => tag.id);
    const { data: ideaTags, error: tagError } = await supabase
        .from("idea_tags")
        .select("idea_id")
        .in("tag_id", tagIds);
    if (tagError) throw tagError;
    const ideaIds = ideaTags.map((ideaTag) => ideaTag.idea_id);
    const { data: ideas, error: ideaError } = await supabase
        .from("ideas")
        .select("*")
        .in("id", ideaIds)
        .order("created_at", { ascending: false });
    if (ideaError) throw ideaError;
    return ideas;
};

module.exports = {
    getAllIdeas,
    createIdea,
    updateIdea,
    deleteIdea,
    getIdeaById,
    getIdeasByTitle,
    advancedSearchTags,
};
