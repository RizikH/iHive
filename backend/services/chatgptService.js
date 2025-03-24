const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

console.log("Loaded API Key:", process.env.OPENAI_API_KEY ? "✅ Loaded" : "❌ Missing");

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey });

async function generateTags(title, description) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      response_format: { type: "text" },
      messages: [
        {
          role: "system",
          content: `You are an AI that strictly returns JSON. Your task is to generate exactly 5 relevant one-word tags for a given idea. 
          Respond ONLY with a valid JSON object in this format: {"tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]}. 
          No additional text, explanations, or formatting.`,
        },
        {
          role: "user",
          content: `Title: "${title}"\nDescription: "${description}"`,
        },
      ],
    });

    const tags = JSON.parse(response.choices[0].message.content)?.tags || [];

    return tags.map(tag => tag.toLowerCase().trim()); // Normalize tags
  } catch (error) {
    console.error("❌ Error generating tags:", error?.message || error);
    return [];
  }
}

async function generateCategory(title, description) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      response_format: { type: "text" },
      messages: [
        {
          role: "system",
          content: `You are an AI that strictly returns JSON. Your task is to generate exactly 1 relevant one-word category for a given idea. 
          Respond ONLY with a valid JSON object in this format: {"category": "category"}. 
          No additional text, explanations, or formatting.`,
        },
        {
          role: "user",
          content: `Title: "${title}"\nDescription: "${description}"`,
        },
      ],
    });

    const category = JSON.parse(response.choices[0].message.content)?.category || "";

    return category.toLowerCase().trim(); // Normalize category
  } catch (error) {
    console.error("❌ Error generating category:", error?.message || error);
    return [];
  }
}

module.exports = { 
  generateTags,
  generateCategory
};
