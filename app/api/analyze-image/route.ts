import { NextResponse } from "next/server";
import type { AnalysisResult } from "@/types/product";

const mockAnalysis: AnalysisResult = {
  category: "墨镜",
  keywords: ["黑色方框墨镜", "复古风", "大框", "学生党", "通勤", "显脸小"],
  color: "黑色",
  style: ["简约", "复古", "时尚", "街拍感"],
  usage: ["日常通勤", "拍照穿搭", "旅行防晒", "校园搭配"],
  confidence: 0.92
};

export async function POST() {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return NextResponse.json({ ok: true, data: mockAnalysis });
}
