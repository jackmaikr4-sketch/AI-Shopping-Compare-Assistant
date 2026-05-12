# AI Shopping Compare Assistant

中文名：AI购物比价避坑助手。

这是一个可本地运行、可部署到 Vercel 的 Next.js 网页 Demo。用户上传商品图片后，系统模拟 AI 识别商品，并用本地 mock 数据展示多个电商平台的相似商品，支持价格对比、评论优缺点总结、综合评分排序，最后推荐最值得买的商品。

## 功能说明

- 上传商品图片，支持拖拽和点击上传
- 显示图片预览和三段式分析 loading
- 模拟 AI 识别商品类别、关键词、颜色、风格和用途
- 使用 12 条 mock 商品数据展示跨平台比价
- 支持综合推荐分、价格、相似度、评分、销量排序
- 支持平台筛选、价格区间筛选、只看支持退货
- 展示最推荐、最便宜、最相似、售后最稳商品
- 展示 AI 评论总结、优点标签、缺点标签和购买建议

## 技术栈

- Next.js 14
- React + TypeScript
- Tailwind CSS
- Next.js Route Handlers
- 本地 mock data，无真实数据库
- 模拟 AI 识图，无真实 AI API

## 本地运行

```bash
npm install
npm run dev
```

访问：

```bash
http://localhost:3000
```

生产构建：

```bash
npm run build
npm run start
```

## 项目目录结构

```text
app/
  api/analyze-image/route.ts  # 模拟图片识别接口
  api/products/route.ts       # 模拟商品接口
  page.tsx                    # 首页主流程
components/                   # 上传、筛选、推荐、商品卡等组件
data/mockProducts.ts          # 模拟商品数据
lib/scoring.ts                # 综合推荐分算法
types/product.ts              # TypeScript 类型
public/products/placeholder.svg
```

## 综合评分算法

`lib/scoring.ts` 中实现满分 100 分的综合推荐分：

- 图片相似度：30%
- 价格优势：25%
- 用户评分：15%
- 销量热度：10%
- 评论数量：10%
- 售后保障：10%

销量和评论数使用对数归一化，避免极端值影响太大；支持七天无理由、运费险、价保、退换货的商品会获得更高售后分。

## 如何替换成真实商品 API

优先修改 `app/api/products/route.ts`，将 `mockProducts` 替换为真实平台或商品联盟 API 的返回结果。建议为每个平台建立 adapter，将淘宝、京东、拼多多、抖音商城等不同字段统一转换为 `types/product.ts` 中的 `Product` 类型，再进入 `scoreProducts` 评分。

## 如何接入真实 AI 识图 API

优先修改 `app/api/analyze-image/route.ts`：接收图片文件或图片 URL，调用真实视觉模型，返回商品类别、关键词、颜色、风格和用途。之后可把识别关键词传给商品检索 API。

## 部署到 Vercel

1. 在 Vercel 新建项目并导入本 GitHub 仓库。
2. Framework Preset 选择 Next.js。
3. Install Command 使用 `npm install`。
4. Build Command 使用 `npm run build`。
5. Output Directory 保持默认。
6. 点击 Deploy。

当前版本不需要环境变量。

## 后续可扩展方向

- 接入真实图片识别模型
- 接入商品联盟 API
- 历史价格追踪
- 评论真假分析
- 用户收藏
- 商品降价提醒
- 商家竞品分析后台
- 小程序版本
