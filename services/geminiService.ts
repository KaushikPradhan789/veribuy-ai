import { AuthenticityResult, ProductInfo, ReviewAnalysis, PriceDeal } from "../types";

// Mock implementations for local development and CI. Replace with real Gemini client calls for production.

export const scanProductImage = async (base64Image: string): Promise<ProductInfo> => {
  // lightweight mock: return a plausible product
  await new Promise((r) => setTimeout(r, 200));
  return {
    name: "Sample Product",
    brand: "SampleBrand",
    category: "Electronics",
    description: "Mocked product from image",
    estimatedPrice: "$99",
  };
};

export const scanProductUrl = async (url: string): Promise<ProductInfo> => {
  await new Promise((r) => setTimeout(r, 200));
  return {
    name: "Sample Product from URL",
    brand: "SampleBrand",
    category: "Electronics",
    description: `Detected product from ${url}`,
    estimatedPrice: "$89",
  };
};

export const checkAuthenticity = async (product: ProductInfo): Promise<AuthenticityResult> => {
  await new Promise((r) => setTimeout(r, 150));
  return { score: 78, verdict: 'Likely Genuine', flags: [], reasoning: 'Mock analysis based on price and seller reputation.' };
};

export const analyzeReviews = async (productName: string): Promise<ReviewAnalysis> => {
  await new Promise((r) => setTimeout(r, 150));
  return {
    sentiment: { positive: 320, neutral: 120, negative: 60 },
    pros: ['Good build quality', 'Accurate description'],
    cons: ['Battery life could be better'],
    fakeReviewCount: 5,
    summary: 'Mostly positive reviews; a few potential fake reviews detected.',
  };
};

export const findBetterPrices = async (productName: string): Promise<PriceDeal[]> => {
  await new Promise((r) => setTimeout(r, 200));
  return [
    { retailer: 'Store A', price: '$95', url: '#', title: `${productName} - Store A` },
    { retailer: 'Store B', price: '$89', url: '#', title: `${productName} - Store B` },
  ];
};

export const createChatSession = () => {
  return {
    sendMessage: async ({ message }: { message: string }) => {
      await new Promise((r) => setTimeout(r, 200));
      return { text: `Echo: ${message}` };
    },
  };
};

export default {
  scanProductImage,
  scanProductUrl,
  checkAuthenticity,
  analyzeReviews,
  findBetterPrices,
  createChatSession,
};