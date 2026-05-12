"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertCircle, Bot, Github, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { AnalysisResult } from "@/components/AnalysisResult";
import { EmptyState } from "@/components/EmptyState";
import { FilterBar } from "@/components/FilterBar";
import { ImageUploader } from "@/components/ImageUploader";
import { ProductCard } from "@/components/ProductCard";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import { supportsReturn } from "@/lib/scoring";
import type { AnalysisResult as AnalysisResultType, Platform, ScoredProduct, SortKey } from "@/types/product";

const loadingSteps = ["AI正在识别商品特征...", "正在匹配相似商品...", "正在分析评论和价格..."];

export default function Home() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResultType | null>(null);
  const [products, setProducts] = useState<ScoredProduct[]>([]);
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("recommendation");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "全部">("全部");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [returnOnly, setReturnOnly] = useState(false);

  const platforms = useMemo(() => Array.from(new Set(products.map((item) => item.platform))), [products]);
  const filteredProducts = useMemo(() => {
    const min = Number(minPrice);
    const max = Number(maxPrice);
    return products.filter((item) => selectedPlatform === "全部" || item.platform === selectedPlatform).filter((item) => !minPrice || item.price >= min).filter((item) => !maxPrice || item.price <= max).filter((item) => !returnOnly || supportsReturn(item)).sort((a, b) => {
      if (sortKey === "price") return a.price - b.price;
      if (sortKey === "similarity") return b.similarityScore - a.similarityScore;
      if (sortKey === "rating") return b.rating - a.rating;
      if (sortKey === "sales") return b.sales - a.sales;
      return b.recommendationScore - a.recommendationScore;
    });
  }, [maxPrice, minPrice, products, returnOnly, selectedPlatform, sortKey]);

  const handleImageSelected = async (_file: File, nextPreviewUrl: string) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(nextPreviewUrl);
    setAnalysis(null);
    setProducts([]);
    setError(null);
    setSortKey("recommendation");
    setSelectedPlatform("全部");
    setMinPrice("");
    setMaxPrice("");
    setReturnOnly(false);
    let timer: number | undefined;
    try {
      setLoadingStep(loadingSteps[0]);
      timer = window.setInterval(() => setLoadingStep((current) => loadingSteps[Math.min(loadingSteps.indexOf(current ?? loadingSteps[0]) + 1, loadingSteps.length - 1)]), 650);
      const analysisResponse = await fetch("/api/analyze-image", { method: "POST" });
      if (!analysisResponse.ok) throw new Error("图片识别接口请求失败");
      setAnalysis(((await analysisResponse.json()) as { data: AnalysisResultType }).data);
      setLoadingStep(loadingSteps[2]);
      const productsResponse = await fetch("/api/products");
      if (!productsResponse.ok) throw new Error("商品匹配接口请求失败");
      setProducts(((await productsResponse.json()) as { data: ScoredProduct[] }).data);
      setLoadingStep(null);
    } catch (err) {
      setLoadingStep(null);
      setError(err instanceof Error ? err.message : "分析失败，请稍后重试");
    } finally {
      if (timer) window.clearInterval(timer);
    }
  };

  const clear = () => { if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(null); setAnalysis(null); setProducts([]); setLoadingStep(null); setError(null); };

  return <main className="min-h-screen"><section className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10"><header className="mb-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end"><div><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm"><Bot className="h-4 w-4" />AI Shopping Compare Assistant</div><h1 className="max-w-4xl text-4xl font-bold leading-tight text-ink md:text-6xl">AI购物比价避坑助手</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-muted">上传一张图，AI帮你全网找相似款、比价格、看评论、避踩坑。</p></div><div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1"><Feature icon={<Sparkles className="h-4 w-4" />} title="模拟识图" text="商品类别、关键词、风格自动生成" /><Feature icon={<TrendingUp className="h-4 w-4" />} title="评分排序" text="相似度、价格、口碑、售后综合评估" /><Feature icon={<ShieldCheck className="h-4 w-4" />} title="避坑摘要" text="优缺点标签和购买建议一屏看懂" /></div></header><ImageUploader previewUrl={previewUrl} onImageSelected={handleImageSelected} onClear={clear} disabled={Boolean(loadingStep)} />{error ? <div className="mt-5 flex items-center gap-3 rounded-[24px] border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700"><AlertCircle className="h-5 w-5" />{error}</div> : null}<div className="mt-6 space-y-6"><AnalysisResult analysis={analysis} loadingStep={loadingStep} />{products.length ? <><RecommendationPanel products={products} /><FilterBar sortKey={sortKey} onSortChange={setSortKey} selectedPlatform={selectedPlatform} onPlatformChange={setSelectedPlatform} platforms={platforms} minPrice={minPrice} maxPrice={maxPrice} onMinPriceChange={setMinPrice} onMaxPriceChange={setMaxPrice} returnOnly={returnOnly} onReturnOnlyChange={setReturnOnly} resultCount={filteredProducts.length} /><section className="space-y-4">{filteredProducts.length ? filteredProducts.map((product) => <ProductCard key={product.id} product={product} />) : <EmptyState />}</section></> : null}</div><footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line py-6 text-sm text-muted"><p>本 Demo 仅使用模拟数据，不调用真实电商 API，不执行爬虫。</p><p className="inline-flex items-center gap-2"><Github className="h-4 w-4" />Ready for Vercel</p></footer></section></main>;
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <div className="rounded-[20px] border border-line bg-white/85 p-4 shadow-card"><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink"><span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600">{icon}</span>{title}</div><p className="text-xs leading-5 text-muted">{text}</p></div>;
}
