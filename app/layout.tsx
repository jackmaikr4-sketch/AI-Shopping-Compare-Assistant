import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Shopping Compare Assistant",
  description: "AI购物比价避坑助手：上传图片，模拟识别商品并进行跨平台比价、评论总结和推荐排序。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
