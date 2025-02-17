import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI(apiKey);

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {"role": "user", "content": "write a haiku"}, // This is where you can change the prompt from write a haiku to get the tags.
  ],
});

completion.then((result) => console.log(result.choices[0].message));