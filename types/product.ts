export type Platform = "淘宝" | "京东" | "拼多多" | "抖音商城" | "1688" | "小红书商城";

export type Product = {
  id: string;
  title: string;
  platform: Platform;
  image: string;
  price: number;
  originalPrice: number;
  sales: number;
  rating: number;
  reviewCount: number;
  shopName: string;
  shipping: string;
  returnPolicy: string;
  similarityScore: number;
  positiveTags: string[];
  negativeTags: string[];
  reviewSummary: { positives: string; negatives: string; advice: string };
  productUrl: string;
};

export type ScoredProduct = Product & {
  recommendationScore: number;
  scoreBreakdown: { similarity: number; price: number; rating: number; sales: number; reviews: number; afterSale: number };
};

export type AnalysisResult = { category: string; keywords: string[]; color: string; style: string[]; usage: string[]; confidence: number };
export type SortKey = "recommendation" | "price" | "similarity" | "rating" | "sales";
