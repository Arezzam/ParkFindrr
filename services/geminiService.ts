import { GoogleGenAI } from "@google/genai";
import { Park } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchParks = async (location: string): Promise<Park[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find 5-7 popular playgrounds or parks in or near ${location}. 
      
      For each park, critically analyze the reviews and details available to determine:
      1. Is it shaded? (hasShade)
      2. Are there benches for parents? (hasBenches)
      3. Is there a dog park attached or nearby? (hasDogPark)
      4. Are there public restrooms? (hasRestrooms)
      5. Is there a parking lot? (hasParking)
      6. specific play equipment (e.g., swings, slides, spider web, climbing wall).
      7. A unique, specific 'quickTip' for parents based on reviews (e.g. "Bring sand toys", "Very muddy after rain", "Great splash pad", "Best for toddlers").
      
      Return a STRICT JSON array of objects. Do not wrap in markdown or code blocks.
      Each object must exactly match this structure:
      {
        "name": string,
        "address": string,
        "description": string,
        "amenities": string[],
        "equipment": string[],
        "quickTip": string,
        "hasShade": boolean,
        "hasBenches": boolean,
        "hasDogPark": boolean,
        "hasRestrooms": boolean,
        "hasParking": boolean,
        "rating": number,
        "lat": number, 
        "lng": number
      }`,
      config: {
        tools: [{ googleMaps: {} }],
        // responseMimeType and responseSchema are NOT supported with googleMaps tool
        systemInstruction: "You are a helpful parenting assistant that finds great playgrounds. You must return valid, parseable JSON text only."
      },
    });

    let text = response.text;
    if (!text) return [];

    // Sanitize input: remove markdown code blocks if the model adds them
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```/, '').replace(/```$/, '');
    }
    
    const rawData = JSON.parse(text);
    
    // Transform to our app's Park type with unique IDs
    return rawData.map((item: any, index: number) => ({
      id: `park-${index}-${Date.now()}`,
      name: item.name,
      address: item.address,
      description: item.description || "A lovely place to play.",
      amenities: item.amenities || [],
      equipment: item.equipment || [],
      quickTip: item.quickTip || "Bring water and sunscreen!",
      hasShade: !!item.hasShade,
      hasBenches: !!item.hasBenches,
      hasDogPark: !!item.hasDogPark,
      hasRestrooms: !!item.hasRestrooms,
      hasParking: !!item.hasParking,
      rating: item.rating || 0,
      coordinates: (item.lat && item.lng) ? { lat: item.lat, lng: item.lng } : undefined
    }));

  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw new Error("Failed to find parks. Please try again.");
  }
};