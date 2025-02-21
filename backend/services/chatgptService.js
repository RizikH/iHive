import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({apiKey: apiKey});

export async function generateTags(title, description) {
  try {
    const prompt = `Generate 5 relevant tags for the following idea:\nTitle: ${title}\nDescription: ${description}\nTags:`;

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
