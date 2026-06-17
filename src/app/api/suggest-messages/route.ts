import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export const runtime = "edge";

export async function POST() {
  try {
    const prompt  = `
Generate exactly 3 anonymous feedback prompts.

The prompts should encourage honest opinions, constructive feedback, compliments, observations, or things people might genuinely want to tell someone anonymously.

Examples:
- What's one thing I could improve?
- What's your honest first impression of me?
- What's something you appreciate about me?
- What's something you've always wanted to tell me?
- What do you think is my biggest strength?

Requirements:
- Friendly and respectful
- Encourage meaningful feedback
- Suitable for an anonymous messaging platform
- Maximum 15 words per prompt
- No romantic, sexual, political, offensive, or sensitive topics
- Make each prompt unique
- Return ONLY valid JSON

Format:
{
  "messages": [
    "prompt 1",
    "prompt 2",
    "prompt 3"
  ]
}
`;

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
      temperature: 0.8,
    });

    const parsed = JSON.parse(text);

    return Response.json(parsed);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to generate questions",
      },
      { status: 500 }
    );
  }
}