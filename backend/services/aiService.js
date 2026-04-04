const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generates tags and a category for an idea in a single OpenAI call.
 * Returns { tags: string[], category: string }
 */
async function generateIdeaMetadata(title, description) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      response_format: { type: 'text' },
      messages: [
        {
          role: 'system',
          content: `You are an AI that strictly returns JSON.
Given an idea title and description, return exactly 5 one-word tags and 1 one-word category.
Respond ONLY with: {"tags": ["tag1","tag2","tag3","tag4","tag5"], "category": "category"}
No extra text, no markdown.`,
        },
        {
          role: 'user',
          content: `Title: "${title}"\nDescription: "${description}"`,
        },
      ],
    });

    const parsed = JSON.parse(response.choices[0].message.content);

    return {
      tags: (parsed.tags || []).map(t => t.toLowerCase().trim()),
      category: (parsed.category || '').toLowerCase().trim(),
    };
  } catch (err) {
    console.error('❌ aiService.generateIdeaMetadata failed:', err.message);
    return { tags: [], category: '' };
  }
}

module.exports = { generateIdeaMetadata };
