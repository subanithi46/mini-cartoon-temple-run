
import { GoogleGenAI, Type } from "@google/genai";

export async function generateGDD() {
  // Always initialize GoogleGenAI inside functions to ensure process.env.API_KEY is current.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a Senior Game Designer. Create a detailed Game Design Document (GDD) for a modern spiritual successor to Temple Run titled 'Ancient Escape'.
    Outline: 
    1. The Core Loop
    2. 5 Unique Power-ups (Magnet, Shield, etc.) with upgrade paths
    3. 3 Biomes (Jungle, Cavern, Temple)
    4. Fair Monetization strategies.
    Format as structured JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          coreLoop: { type: Type.STRING },
          powerUps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                upgrades: { type: Type.STRING }
              }
            }
          },
          biomes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                hazards: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          monetization: { type: Type.STRING }
        }
      }
    }
  });

  try {
    // Correct usage of response.text property getter and trim() for clean JSON parsing.
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse GDD response", e);
    return null;
  }
}
