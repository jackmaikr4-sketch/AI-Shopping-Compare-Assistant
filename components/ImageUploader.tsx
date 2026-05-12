"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import clsx from "clsx";

export function ImageUploader({ previewUrl, onImageSelected, onClear, disabled }: { previewUrl: string | null; onImageSelected: (file: File, previewUrl: string) => void; onClear: () => void; disabled?: boolean }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const pick = (file?: File) => { if (file?.type.startsWith("image/")) onImageSelected(file, URL.createObjectURL(file)); };
  const change = (event: ChangeEvent<HTMLInputElement>) => { pick(event.target.files?.[0]); event.target.value = ""; };
  const drop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); setDragging(false); pick(event.dataTransfer.files?.[0]); };

  return <section onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={drop} className={clsx("rounded-[28px] border border-dashed bg-white/90 p-5 shadow-soft", dragging ? "border-indigo-500 ring-4 ring-indigo-100" : "border-indigo-200")}>
    <input ref={inputRef} className="hidden" type="file" accept="image/*" onChange={change} />
    {previewUrl ? <div className="grid gap-5 md:grid-cols-[260px_1fr] md:items-center"><div className="relative overflow-hidden rounded-3xl bg-surface"><img src={previewUrl} alt="上传商品预览" className="h-72 w-full object-cover" /><button onClick={onClear} className="focus-ring absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white shadow-card" aria-label="清除图片"><X className="h-4 w-4" /></button></div><div><p className="text-sm font-semibold text-indigo-700">图片已上传</p><h2 className="mt-2 text-2xl font-semibold text-ink">开始模拟 AI 识别与商品匹配</h2><p className="mt-3 text-sm leading-6 text-muted">系统会调用本地模拟接口，返回商品特征、相似商品、评论摘要和综合推荐分。</p><button disabled={disabled} onClick={() => inputRef.current?.click()} className="focus-ring mt-5 rounded-2xl border border-line px-5 py-3 text-sm font-semibold">换一张图片</button></div></div> : <button disabled={disabled} onClick={() => inputRef.current?.click()} className="focus-ring flex min-h-[320px] w-full flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-6 text-center"><UploadCloud className="mb-5 h-12 w-12 text-indigo-600" /><span className="text-2xl font-semibold text-ink">上传商品图片</span><span className="mt-3 max-w-xl text-sm leading-6 text-muted">支持拖拽或点击上传。第一版使用模拟识图和 mock 商品数据。</span><span className="mt-6 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white">选择图片开始分析</span></button>}
  </section>;
}
