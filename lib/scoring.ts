import type { Product, ScoredProduct } from "@/types/product";

const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const logNormalize = (value: number, max: number) => max <= 0 ? 0 : clamp((Math.log10(value + 1) / Math.log10(max + 1)) * 100);

const afterSaleScore = (policy: string) => {
  let score = 35;
  if (policy.includes("七天无理由")) score += 35;
  if (policy.includes("运费险")) score += 20;
  if (policy.includes("价保")) score += 10;
  if (/支持退货|支持退换|可退换/.test(policy)) score += 15;
  if (/自理|门槛/.test(policy)) score -= 15;
  return clamp(score);
};

export function scoreProducts(products: Product[]): ScoredProduct[] {
  if (!products.length) return [];
  const prices = products.map((item) => item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  const maxSales = Math.max(...products.map((item) => item.sales));
  const maxReviews = Math.max(...products.map((item) => item.reviewCount));

  return products.map((product) => {
    const similarity = clamp(product.similarityScore);
    const price = clamp(((maxPrice - product.price) / priceRange) * 100);
    const rating = clamp((product.rating / 5) * 100);
    const sales = logNormalize(product.sales, maxSales);
    const reviews = logNormalize(product.reviewCount, maxReviews);
    const afterSale = afterSaleScore(product.returnPolicy);
    const recommendationScore = similarity * 0.3 + price * 0.25 + rating * 0.15 + sales * 0.1 + reviews * 0.1 + afterSale * 0.1;
    return { ...product, recommendationScore: Math.round(recommendationScore), scoreBreakdown: { similarity: Math.round(similarity), price: Math.round(price), rating: Math.round(rating), sales: Math.round(sales), reviews: Math.round(reviews), afterSale: Math.round(afterSale) } };
  }).sort((a, b) => b.recommendationScore - a.recommendationScore);
}

export function supportsReturn(product: Product) {
  return /七天无理由|支持退货|支持退换|可退换|运费险/.test(product.returnPolicy);
}
