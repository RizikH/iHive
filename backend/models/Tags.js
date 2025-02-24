const supabase = require("../config/db");
const Idea = require("./Idea.js");

const OpenAI = require("../services/chatgptService.js");

const createTagsForIdea = async (ideaID) => {
    const idea = await Idea.getIdeaById(ideaID);
    const tags = await generateTags(idea.title, idea.description)

    const { data, error } = await supabase
        .from("tags")
        .insert([tags])
        .select("*")
}
module.exports = {
};