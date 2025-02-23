<<<<<<< HEAD
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
=======
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

console.log("Loaded API Key:", process.env.OPENAI_API_KEY ? "✅ Loaded" : "❌ Missing");

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({apiKey: apiKey});

export async function generateTags(title, description) {
  try {
    const prompt = `Generate 5 relevant one word tags for the following idea:\nTitle: ${title}\nDescription: ${description}\nTags:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content.trim().split(",").map(tag => tag.trim());
  } catch (error) {
    console.error("Error generating tags:", error);
    return [];
  }
}

export default generateTags;
>>>>>>> ad799857b41ed223965f1f08d12ef6e74912981f
