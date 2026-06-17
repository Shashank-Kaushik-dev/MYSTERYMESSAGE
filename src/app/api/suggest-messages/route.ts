import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export const runtime = "edge";

export async function POST() {
  try {
    const prompt = `
Generate exactly 3 anonymous social messaging questions.

Return ONLY valid JSON.

Format:
{
  "messages": [
    "question 1",
    "question 2",
    "question 3"
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