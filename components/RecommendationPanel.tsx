import { BadgeCheck, CircleDollarSign, ScanSearch, ShieldCheck } from "lucide-react";
import type { ScoredProduct } from "@/types/product";

export function RecommendationPanel({ products }: { products: ScoredProduct[] }) {
  if (!products.length) return null;
  const best = [...products].sort((a, b) => b.recommendationScore - a.recommendationScore)[0];
  const cheap = [...products].sort((a, b) => a.price - b.price)[0];
  const similar = [...products].sort((a, b) => b.similarityScore - a.similarityScore)[0];
  const safe = [...products].sort((a, b) => b.scoreBreakdown.afterSale - a.scoreBreakdown.afterSale || b.rating - a.rating)[0];
  const items = [
    ["最推荐购买", best, <BadgeCheck key="i" className="h-5 w-5" />, "这款不是最低价，但相似度高、差评较少、售后更稳，因此综合推荐分最高。"],
    ["最便宜商品", cheap, <CircleDollarSign key="i" className="h-5 w-5" />, "当前价格最低，适合低预算尝鲜，建议重点确认做工和售后。"],
    ["最相似商品", similar, <ScanSearch key="i" className="h-5 w-5" />, "外观特征最接近上传图片，适合优先追求同款感的用户。"],
    ["售后最稳商品", safe, <ShieldCheck key="i" className="h-5 w-5" />, "退货、运费险或价保信息更完整，降低买错和退换成本。"]
  ] as const;
  return <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{items.map(([title, product, icon, reason]) => <article key={title} className="rounded-[24px] border border-line bg-white p-5 shadow-card"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">{icon}</span><span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">{product.platform}</span></div><h3 className="mt-4 font-semibold text-ink">{title}</h3><p className="mt-2 line-clamp-2 min-h-12 text-sm font-medium leading-6 text-ink">{product.title}</p><div className="mt-4 flex items-end justify-between"><div><p className="text-2xl font-bold text-rose-600">¥{product.price}</p><p className="text-xs text-muted">推荐分 {product.recommendationScore}</p></div><p className="text-sm font-semibold text-indigo-700">{product.similarityScore}% 相似</p></div><p className="mt-4 text-xs leading-5 text-muted">{reason}</p></article>)}</section>;
}
