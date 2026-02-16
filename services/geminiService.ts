
import { GoogleGenAI, Type } from "@google/genai";
import { Genre, StoryNode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const NODE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    narrative: {
      type: Type.STRING,
      description: "A short, atmospheric paragraph (2-4 sentences) continuing the story.",
    },
    choices: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "Action choice text (3-7 words)." },
          id: { type: Type.STRING, description: "A unique identifier for this choice." }
        },
        required: ["text", "id"]
      },
      description: "2 to 4 distinct, impactful choices for the player.",
    },
    isEnding: {
      type: Type.BOOLEAN,
      description: "True if this node concludes the story arc.",
    }
  },
  required: ["narrative", "choices", "isEnding"],
};

export async function generateInitialNode(genre: Genre): Promise<StoryNode> {
  const prompt = `Write the opening scene for a ${genre} story.
  Focus on minimalism and mood. Establish the setting and immediate stakes.
  The prose should be evocative and tight.
  Provide 3 compelling starting choices.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: NODE_SCHEMA,
    },
  });

  const data = JSON.parse(response.text);
  return {
    ...data,
    id: 'root',
    depth: 0,
    isEnding: false // Initial node is never the ending
  };
}

export async function generateNextNode(
  genre: Genre,
  history: StoryNode[],
  lastChoice: string,
  depth: number,
  maxDepth: number = 5
): Promise<StoryNode> {
  const storyHistory = history.map(n => n.narrative).join("\n\n");
  const isFinalStep = depth >= maxDepth;

  const prompt = `
  Genre: ${genre}
  Story History:
  ${storyHistory}

  Player just chose: "${lastChoice}"

  Current Step: ${depth} of ${maxDepth}.
  ${isFinalStep ? "THIS IS THE FINAL CHAPTER. Write a satisfying, definitive conclusion based on the player's path. Provide zero choices or an empty array." : "Write the next narrative segment. Maintain continuity and tension. Provide 2-4 distinct choices."}

  Guidelines:
  - Minimalistic prose.
  - No clichés.
  - High stakes.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: NODE_SCHEMA,
    },
  });

  const data = JSON.parse(response.text);
  return {
    ...data,
    id: `node-${depth}-${Date.now()}`,
    depth,
    isEnding: isFinalStep || data.isEnding || data.choices.length === 0
  };
}
