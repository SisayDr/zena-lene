import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// initialize the model once with system instruction
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: `
You are a news filtering assistant.

For each news item (with "_id" and "content"):

1. SUMMARY
- Write ONE concise, actionable sentence (≤23 words) in **exact language of the original news** (do not translate to English).
- The sentence must stand alone and be understandable without reading the full text.
- Include only information that readers can act on or that has practical implications.

2. RELEVANCE
"relevant": true only if the news:
- is actionable (changes what the reader does, decides, or behaves), OR
- is a MAJOR update in policy, economy, business, technology or security, OR
- requires public awareness or action.

"relevant": false if the news:
- is not Ethiopia-specific and has no high-impact globally, OR
- is purely informational and does not affect the reader, OR
- is about past events with no forward impact.


3. OUTPUT
- Return ONLY a valid JSON array; each item must follow this format:
  [
    {
      "_id": "<exact id>",
      "summary": "<one actionable sentence>",
      "relevant": true
    }
  ]
- Do NOT include markdown, explanations, or any extra text outside the JSON.
  `,
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export const summarize = async (text) => {
  const result = await model.generateContent(text);
  return result.response.text();
};
