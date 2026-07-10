# Songdian Technology — 松典科技 B2B 官网

> AGENTS.md — 新会话快速上手指南。所有关键信息集中在这里，避免每次从头探索。

---

## 项目定位

松典科技（广东）有限公司 B2B 官网，面向全球 OEM/ODM 数码相机采购商。
后端 WordPress + WooCommerce（`localhost:10004`），前端 Next.js Headless。

---

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Next.js 16 + React 19 + TypeScript（strict） |
| 样式 | Tailwind CSS v4 + shadcn/ui |
| 后端 | WordPress `localhost:10004` + WooCommerce（无需 API Key） |
| 表单 | react-hook-form + Zod + next-safe-form |
| SEO | next-super-meta + JSON-LD 结构化数据 |
| 动画 | framer-motion |
| 路由 | App Router（SSG/ISR 混合） |

## 项目路径

```
C:\Users\Administrator\Desktop\Front-end project\next-js-wordpress-headless\my-app
```

启动：`npm run dev` → `http://localhost:3000`

---

## 设计系统

基于极简风格 + 松典品牌红色（Logo 中 GD 字母为红色）：

| 颜色 | 色值 | 用途 |
|------|------|------|
| Electric Blue | `#3E6AE1` | 主 CTA 按钮 |
| 品牌红 | `#d4343e` | 导航 hover/激活态 |
| Carbon Dark | `#171A20` | 标题 + Hero 区域底色 |
| Graphite | `#393C41` | 正文 |
| Pewter | `#5C5E62` | 辅助文字/描述 |
| Light Ash | `#F4F4F4` | 卡片/区域背景 |

---

## 页面路由

| 路由 | 数据来源 | 渲染 |
|------|---------|------|
| `/` | Hero (WP page) + content-data.ts + WP/WC | ISR 60s |
| `/products` | WooCommerce 产品列表 + 分类筛选（6个分类，等宽网格） | ISR 60s |
| `/products/[slug]` | WooCommerce 产品详情 + 相册 | ISR 60s |
| `/news` | WP 文章列表 + 置顶卡片 | ISR 60s |
| `/news/[slug]` | WP 文章详情（Astra 主题清洗） | ISR 60s |
| `/about` | content-data.ts 静态内容 | Static |
| `/solutions` | content-data.ts 解决方案列表（OEM/ODM/经销） | Static |
| `/solutions/faq` | content-data.ts FAQ 列表 | Static |
| `/contact` | 联系表单 + Google Maps 嵌入 | Static |

---

## 关键文件

| 文件 | 职责 |
|------|------|
| `lib/content-data.ts` | 全站可编辑文本（公司信息、产品分类、服务、FAQ、About 时间轴等） |
| `lib/wordpress.ts` | WordPress/WooCommerce REST API 客户端 + `getSiteBanner()` |
| `lib/seo.ts` | JSON-LD 结构化数据生成器 |
| `lib/media.ts` | WordPress + FileBird 图片资源映射（Logo 除外） |
| `lib/html-cleaner.ts` | Astra 主题 HTML 清洗器（去除容器/元信息/内联样式） |
| `lib/site-config.ts` | 页脚链接等静态配置 |
| `components/Header.tsx` | 导航栏（白底黑字，品牌红 hover） |
| `components/Footer.tsx` | 页脚 |
| `components/motion/HeroSection.tsx` | 首页 Hero（banner 从 WP page `home-banner` 读取） |
| `components/ProductCard.tsx` | 产品卡片（hover 红框+阴影+缩放+标签） |
| `components/ProductGallery.tsx` | 产品详情页左侧缩略图+右侧大图（点击切换） |
| `components/PostCard.tsx` | 新闻卡片（hover 蓝框+阴影+亮度变化） |
| `components/StatsDashboard.tsx` | About 页数据表盘（6组数字滚动动画） |
| `components/HorizontalTimeline.tsx` | About 页横向时间轴（桌面） |
| `components/FloatingInquiry.tsx` | 底部固定咨询栏 |
| `components/form/InquiryForm.tsx` | react-hook-form + Zod 询盘表单 |
| `wordpress-plugin/wc-product-specs-rest.php` | 自建插件，暴露 WC 属性/价格/相册到 WP REST API |

---

## Hover 效果规范

| 元素 | 效果 |
|------|------|
| 导航链接 | 黑→红 `#d4343e`，0.3s |
| 下拉菜单项 | 黑→红 `#d4343e`，0.15s |
| 产品卡片 | 红框 `#d4343e` + shadow-lg + 图片 scale(1.03) + 标题变红 |
| 新闻卡片 | 蓝框 `#3E6AE1` + shadow-sm + 图片 brightness(1.06) + 标题变蓝 |
| 时间轴节点 | 红底圆圈 + 数字变白 |

---

## 图片管理

- **Logo**：`public/logo.png`（本地，不动）
- **Hero Banner**：WordPress 页面 `home-banner` 的特色图片（发布为公开）
- **OG 图**：`lib/media.ts` 配置
- **产品图 / 文章图**：WordPress 后台自动管理
- **产品相册**：`wc-product-specs-rest.php` 插件暴露 `wc_gallery` 字段（需在 WP 后台启用插件）

---

## WordPress 数据集

| 内容 | 数量 | API 端点 |
|------|------|---------|
| 产品 | 42 | `/wp/v2/product` |
| 产品分类 | 6（Mirrorless, Compact, Action, Video, Kids, Lens） | `/wp/v2/product_cat` |
| 文章 | 8 | `/wp/v2/posts` |
| 文章分类 | 2 | `/wp/v2/categories` |

> ⚠️ WooCommerce 产品通过标准 WP REST API 获取，不需 Consumer Key。

---

## 常用修改路径

| 需求 | 操作 |
|------|------|
| 改文案 | `lib/content-data.ts` |
| 改图片 | FileBird 上传 → 更新 `lib/media.ts` URL |
| 换 Banner | WP 后台编辑 `home-banner` 页面特色图片 |
| 改导航 | `components/Header.tsx` NAV_LINKS |
| 改配色 | `globals.css` CSS 变量 |
| 产品相册不显示 | 确认 `wc-product-specs-rest.php` 插件已启用 |
| 新闻详情样式乱 | Astra 主题 HTML 干扰，由 `html-cleaner.ts` 自动清洗 |

---

## 通信风格

- 用户为中文母语者，用简体中文回复
- 用户关注细节（布局对齐、间距、hover 效果）
- 偏好现代简洁设计，不喜欢冗余装饰
- 修改代码前先读文件确认当前状态
