import { NextResponse } from "next/server";
import { mockProducts } from "@/data/mockProducts";
import { scoreProducts } from "@/lib/scoring";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return NextResponse.json({ ok: true, data: scoreProducts(mockProducts) });
}
