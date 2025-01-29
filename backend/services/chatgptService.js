const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function suggestTags(description) {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Suggest tags for: "${description}"`,
            max_tokens: 50,
        });
        return response.data.choices[0].text.split(",").map(tag => tag.trim());
    } catch (error) {
        console.error("Error suggesting tags:", error.message);
        throw new Error("Failed to generate tags.");
    }
}

module.exports = { suggestTags };
