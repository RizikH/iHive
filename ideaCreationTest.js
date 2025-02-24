const supabase = require("./backend/config/db");
const openAI = require("./backend/services/chatgptService");

const generateAndLinkTagsForIdeas = async () => {
    try {
        console.log("🚀 Fetching all existing ideas...");
        const { data: ideas, error: fetchError } = await supabase.from("ideas").select("*");

        if (fetchError) {
            throw new Error(`Failed to fetch ideas: ${fetchError.message}`);
        }

        if (!ideas || ideas.length === 0) {
            console.log("⚠️ No ideas found in the database.");
            return;
        }

        console.log(`✅ Found ${ideas.length} ideas. Generating tags...`);

        for (const idea of ideas) {
            console.log(`🏷 Generating tags for "${idea.title}"...`);
            const generatedTags = await openAI.generateTags(idea.title, idea.description);

            if (!generatedTags || generatedTags.length === 0) {
                console.log(`⚠️ No tags generated for "${idea.title}".`);
                continue;
            }

            for (const tagName of generatedTags) {
                // Check if the tag already exists in the database
                let { data: existingTag, error: tagError } = await supabase
                    .from("tags")
                    .select("*")
                    .eq("name", tagName)
                    .single();

                if (!existingTag) {
                    // Insert the new tag if it does not exist
                    ({ data: existingTag, error: tagError } = await supabase
                        .from("tags")
                        .insert({ name: tagName })
                        .select()
                        .single());
                }

                if (tagError) {
                    console.error("❌ Error inserting tag:", tagError.message);
                    continue;
                }

                if (existingTag) {
                    // Link the tag to the idea in `idea_tags`
                    const { error: linkError } = await supabase
                        .from("idea_tags")
                        .insert({ idea_id: idea.id, tag_id: existingTag.id });

                    if (linkError) {
                        console.error(`❌ Failed to link tag "${tagName}" to "${idea.title}":`, linkError.message);
                    } else {
                        console.log(`✅ Tag "${tagName}" linked to "${idea.title}".`);
                    }
                }
            }
        }

        console.log("🎉 Tag generation and linking completed for all ideas!");
    } catch (error) {
        console.error("❌ Error generating and linking tags:", error.message);
    }
};

// Run the function
generateAndLinkTagsForIdeas();
