
import { GoogleGenAI, Type } from "@google/genai";
import { AuthenticityResult, ProductInfo, ReviewAnalysis, PriceDeal } from "../types";

// Declare process to satisfy TypeScript in the browser environment
declare var process: {
  env: {
    API_KEY: string;
  };
};

// --- 1. Product Scanner (Image) ---
export const scanProductImage = async (base64Image: string): Promise<ProductInfo> => {
  // Create a new instance right before the call to use the latest API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Identify this product. Return a JSON object with: name, brand, category, estimatedPrice (in Indian Rupees ₹), and a short description." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            brand: { type: Type.STRING },
            category: { type: Type.STRING },
            estimatedPrice: { type: Type.STRING },
            description: { type: Type.STRING },
            imageUrl: { type: Type.STRING, description: "Leave empty for image uploads" },
          },
          required: ["name", "brand", "category", "estimatedPrice", "description"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as ProductInfo;
  } catch (error) {
    console.error("Scan Error:", error);
    throw new Error("Failed to scan product.");
  }
};

// --- 1.5 Product Scanner (URL) ---
export const scanProductUrl = async (url: string): Promise<ProductInfo> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Identify the product from this URL or search query: "${url}". 
      Return a JSON object with: name, brand, category, estimatedPrice (in Indian Rupees ₹), a short description, and a representative valid image URL for this product if possible (otherwise leave empty).
      If the URL is generic, infer the most likely product intended.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            brand: { type: Type.STRING },
            category: { type: Type.STRING },
            estimatedPrice: { type: Type.STRING },
            description: { type: Type.STRING },
            imageUrl: { type: Type.STRING },
          },
          required: ["name", "brand", "category", "estimatedPrice", "description"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as ProductInfo;
  } catch (error) {
    console.error("URL Scan Error:", error);
    throw new Error("Failed to analyze URL.");
  }
};

// --- 2. Authenticity Detection ---
export const checkAuthenticity = async (product: ProductInfo): Promise<AuthenticityResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = `Analyze the authenticity risk for a product sold online based on general market data for this item in India: ${product.brand} ${product.name}. 
    Assume the listing has average photos but a slightly lower than average price.
    Return JSON with: score (0-100, where 100 is perfectly safe), verdict ('Likely Genuine' | 'Suspicious' | 'High Risk'), flags (array of strings warning about potential fake indicators for this specific type of item), and reasoning.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            verdict: { type: Type.STRING, enum: ['Likely Genuine', 'Suspicious', 'High Risk'] },
            flags: { type: Type.ARRAY, items: { type: Type.STRING } },
            reasoning: { type: Type.STRING },
          },
          required: ["score", "verdict", "flags", "reasoning"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as AuthenticityResult;
  } catch (error) {
    console.error("Auth Check Error:", error);
    return { score: 50, verdict: 'Suspicious', flags: ["Analysis Failed"], reasoning: "Could not verify." };
  }
};

// --- 3. Review Intelligence ---
export const analyzeReviews = async (productName: string): Promise<ReviewAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = `Simulate an analysis of 500 recent reviews for the ${productName} (Indian market context). 
    Provide a sentiment breakdown, top pros, top cons, a count of suspected fake reviews (out of 500), and a concise summary.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.OBJECT,
              properties: {
                positive: { type: Type.NUMBER },
                neutral: { type: Type.NUMBER },
                negative: { type: Type.NUMBER },
              },
              required: ["positive", "neutral", "negative"]
            },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            fakeReviewCount: { type: Type.NUMBER },
            summary: { type: Type.STRING },
          },
          required: ["sentiment", "pros", "cons", "fakeReviewCount", "summary"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as ReviewAnalysis;
  } catch (error) {
    console.error("Review Analysis Error:", error);
    throw error;
  }
};

// --- 4. Price Comparison (Grounding) ---
export const findBetterPrices = async (productName: string): Promise<PriceDeal[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find current prices for "${productName}" in Indian Rupees (INR ₹) from 3 different major reputable online retailers available in India (e.g., Amazon.in, Flipkart, Croma, Reliance Digital).`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const deals: PriceDeal[] = [];

    if (chunks) {
      chunks.forEach((chunk) => {
        if (chunk.web) {
            const title = chunk.web.title || "";
            const priceMatch = title.match(/₹[\d,]+(\.\d{2})?/);
            const extractedPrice = priceMatch ? priceMatch[0] : "Check Price";

            deals.push({
                retailer: chunk.web.title?.split(' - ')[0].split(':')[0] || "Online Retailer",
                price: extractedPrice, 
                url: chunk.web.uri || "#",
                title: chunk.web.title || "Product Link"
            });
        }
      });
    }
    
    return deals.slice(0, 4);
  } catch (error) {
    console.error("Price Search Error:", error);
    return [];
  }
};

// --- 5. Chat Assistant ---
export const createChatSession = () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: "You are VeriBuy, an AI shopping assistant focused on the Indian market. Be concise, helpful, and focus on value and safety. Always use Indian Rupees (₹) for currency."
        }
    });
}
