export interface ProductInfo {
  name: string;
  brand: string;
  category: string;
  estimatedPrice: string;
  description: string;
}

export interface AuthenticityResult {
  score: number; // 0-100
  verdict: 'Likely Genuine' | 'Suspicious' | 'High Risk';
  flags: string[];
  reasoning: string;
}

export interface ReviewAnalysis {
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  pros: string[];
  cons: string[];
  fakeReviewCount: number;
  summary: string;
}

export interface PriceDeal {
  retailer: string;
  price: string;
  url: string;
  title: string;
}

export interface DashboardData {
  product: ProductInfo | null;
  authenticity: AuthenticityResult | null;
  reviews: ReviewAnalysis | null;
  deals: PriceDeal[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppView {
  LANDING = 'LANDING',
  SCANNING = 'SCANNING',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  SAVED = 'SAVED',
}
