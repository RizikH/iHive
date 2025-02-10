import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {"role": "user", "content": "write a haiku"}, // This is where you can change the prompt from write a haiku to get the tags.
  ],
});

completion.then((result) => console.log(result.choices[0].message));
