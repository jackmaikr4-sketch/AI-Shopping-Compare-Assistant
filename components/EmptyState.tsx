import { SearchX } from "lucide-react";

export function EmptyState() {
  return <div className="rounded-[24px] border border-line bg-white p-10 text-center shadow-card"><SearchX className="mx-auto h-8 w-8 text-muted" /><h3 className="mt-4 text-lg font-semibold text-ink">没有符合条件的商品</h3><p className="mt-2 text-sm text-muted">可以放宽平台、价格区间或退货筛选条件再试一次。</p></div>;
}
