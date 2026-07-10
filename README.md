# Songdian Technology — Headless B2B 官网（Next.js + WordPress）

松典科技（广东）有限公司 B2B 官网前端。后端为 **WordPress + WooCommerce**（`localhost:10004`），前端为 **Next.js（App Router）Headless** 架构，通过 WP REST API 拉取内容，支持 ISR 增量静态再生。

> 定位：面向全球 OEM / ODM 数码相机采购商。设计语言为「Tesla 极简」——无阴影、靠 border 分隔、品牌红仅用于激活态、Electric Blue 仅用于 CTA。

---

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 16.2.10（App Router，默认 Turbopack）+ React 19.2.4 |
| 语言 | TypeScript 5（`strict: true`） |
| 样式 | Tailwind CSS v4（`@tailwindcss/postcss`）+ shadcn/ui 组件库 |
| 后端 | WordPress REST API（`wp/v2`）+ WooCommerce（产品经自定义 `product` 文章类型暴露，**无需 Consumer Key**） |
| 表单 | react-hook-form + Zod（客户端校验 + 服务端 action 提交） |
| 邮件 | nodemailer SMTP（询盘通知，可选配置） |
| 动画 | framer-motion（`components/motion/*`） |
| 图标 | lucide-react（`^1.23.0`） |
| 地图 | Leaflet（仅在客户端 `useEffect` 内动态 `import`，规避 SSR） |
| SEO | next-super-meta（元信息）+ `lib/seo.ts`（JSON-LD 结构化数据）+ `app/robots.ts` / `app/sitemap.ts` |

---

## 环境要求

- **Node.js** ≥ 18（项目使用 Next 16，建议 20+）
- **WordPress** 站点可访问（默认 `http://localhost:10004`），且已安装并启用 `WC Product Specs REST API` 插件（见下文）
- 包管理器：`npm`（脚本见 `package.json`）

---

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认 Turbopack，端口 3000）
npm run dev
# 打开 http://localhost:3000

# 3. 生产构建
npm run build

# 4. 本地预览生产构建
npm run start
```

---

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `NEXT_PUBLIC_WORDPRESS_URL` | `http://localhost:10004` | WordPress 站点地址 |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | 站点规范地址 |
| `NEXT_PUBLIC_ISR_REVALIDATE` | `60` | ISR 缓存时间（秒） |

### SMTP 邮件通知（可选）

配置后，Contact 页询盘提交会自动发送邮件通知。不配置则仅保存到 `data/inquiries.json`。

| 变量 | 示例 | 说明 |
|------|------|------|
| `SMTP_HOST` | `smtp.qq.com` | SMTP 服务器地址 |
| `SMTP_PORT` | `587` | 端口（TLS=587, SSL=465） |
| `SMTP_USER` | `3932182720@qq.com` | 发件邮箱完整地址 |
| `SMTP_PASS` | 授权码 | **必须是授权码，非登录密码** |
| `INQUIRY_EMAIL_TO` | `zengxb21@proton.me` | 接收通知的邮箱（默认此地址） |

> QQ 邮箱获取授权码：mail.qq.com → 设置 → 账户 → POP3/SMTP 服务 → 开启 → 发短信验证 → 复制 16 位授权码

建议在项目根目录创建 `.env.local` 按需覆盖（不入库）。

---

## 项目结构

```
my-app/
├─ app/                         # App Router 路由（页面）
│  ├─ layout.tsx                # 根布局：字体(Geist)、全局 SEO、JSON-LD、Header/Footer/FloatingInquiry 外壳
│  ├─ globals.css               # Tailwind v4 + 设计令牌（CSS 变量）
│  ├─ page.tsx                  # 首页（Hero 取自 WP 页面 home-banner）
│  ├─ error.tsx                 # 全局错误边界（重试 + 返回首页）
│  ├─ loading.tsx               # 全局加载骨架屏
│  ├─ not-found.tsx             # 自定义 404 页面
│  ├─ about/                    # 关于我们（静态）
│  ├─ solutions/               # 解决方案概览（静态）
│  │  └─ faq/                   # 常见问题（粘性目录 + 锚点直达）
│  ├─ products/                 # 产品列表 + 分类筛选（ISR）
│  │  └─ [slug]/                # 产品详情 + 相册 + 规格（ISR）
│  ├─ news/                     # 新闻列表 + 置顶（ISR）
│  │  └─ [slug]/                # 新闻详情（Astra 主题 HTML 清洗，ISR）
│  ├─ contact/                  # 联系页：表单 + Leaflet 地图 + SMTP 邮件通知
│  ├─ privacy-policy/           # 隐私政策
│  ├─ blog/                     # → 307 重定向到 /news（兼容旧 URL）
│  │  └─ [slug]/                # → 307 重定向到 /news/[slug]
│  ├─ inquiry/                  # → 307 重定向到 /contact
│  ├─ robots.ts                 # /robots.txt
│  └─ sitemap.ts                # /sitemap.xml
│
├─ components/
│  ├─ Header.tsx / Footer.tsx   # 站点导航与页脚（Footer 为 Server Component）
│  ├─ FloatingInquiry.tsx       # 全站底部常驻询盘栏
│  ├─ Breadcrumbs.tsx           # Tesla 风格面包屑（light / dark 双变体）
│  ├─ ProductCard.tsx           # 产品卡片（Server Component，next/image）
│  ├─ ProductGallery.tsx        # 产品图集（客户端缩略图切换，next/image）
│  ├─ PostCard.tsx              # 文章卡片（next/image）
│  ├─ NewsGrid.tsx              # 文章网格
│  ├─ ExhibitionMarquee.tsx     # 展会图片横向滚动墙
│  ├─ FaqToc.tsx                # FAQ 分类目录（滚动高亮 + 平滑锚点跳转）
│  ├─ ContactMap.tsx            # Leaflet 地图（客户端动态加载）
│  ├─ CertificateGallery.tsx    # 证书 Lightbox 画廊
│  ├─ FactoryVideo.tsx          # 工厂视频播放器
│  ├─ SpotlightCard.tsx         # 鼠标聚光灯卡片（原生 matchMedia，无 framer-motion 依赖）
│  ├─ HorizontalTimeline.tsx    # 横向时间线
│  ├─ StatsDashboard.tsx        # 数据表盘
│  ├─ AnimatedCounter.tsx       # 数字滚动动画
│  ├─ form/                     # InquiryForm 及其字段组件（RHF + Zod）
│  ├─ motion/                   # framer-motion 封装（HeroSection / AnimatedSection）
│  └─ ui/                       # shadcn/ui 基础组件（button/card/input/select/...）
│
├─ lib/
│  ├─ wordpress.ts              # WP/WC REST 客户端
│  ├─ content-data.ts           # 全站可编辑文案（公司信息、产品分类、服务、FAQ、About 时间轴等）
│  ├─ inquiry-service.ts        # 询盘服务端 action（文件持久化 + SMTP 邮件通知）
│  ├─ seo.ts                    # 结构化数据：organization / breadcrumb / article / product / faq / localBusiness
│  ├─ html-cleaner.ts           # Astra 主题文章 HTML 清洗器（去容器/元信息/内联样式）
│  ├─ media.ts                  # 图片资源映射（Logo 除外，Logo 在 public/logo.png）
│  ├─ site-config.ts            # 页脚链接等静态配置
│  ├─ coord-transform.ts        # 地图坐标转换工具（WGS-84 → GCJ-02）
│  ├─ exhibitions.ts            # 展会图片动态读取
│  ├─ types.ts                  # WP/WC 响应与前端应用层类型
│  └─ utils.ts                  # cn() 等通用工具
│
├─ data/                        # 运行时数据（不入库）
│  └─ inquiries.json            # 询盘记录（SMTP 未配置时的兜底存储）
│
├─ wordpress-plugin/
│  └─ wc-product-specs-rest.php # 自建插件：把 WC 属性/SKU/价格/相册暴露到 wp/v2/product REST 字段
│
├─ public/                      # 静态资源（logo.png、展会图片、社媒图标等）
├─ next.config.ts               # 图片优化 + 生产配置 + 重定向
├─ postcss.config.mjs           # Tailwind v4 postcss 插件
├─ tsconfig.json                # 路径别名 @/* → 项目根
└─ package.json
```

---

## 路由与渲染策略

| 路由 | 数据来源 | 渲染 |
|------|---------|------|
| `/` | Hero（WP 页面 `home-banner` 特色图）+ `content-data.ts` + WP/WC | ISR（revalidate 60s） |
| `/products` | WP `product` 列表 + 6 个分类筛选（等宽网格） | ISR 60s |
| `/products/[slug]` | WP `product` 详情 + `wc_gallery` 相册 + 规格 | ISR 60s |
| `/news` | WP `posts` 列表 + 置顶卡片 | ISR 60s |
| `/news/[slug]` | WP 文章详情（经 `html-cleaner` 清洗） | ISR 60s |
| `/about` | `content-data.ts` 静态内容 | 静态 |
| `/solutions` | `content-data.ts` 解决方案列表（OEM/ODM/经销） | 静态 |
| `/solutions/faq` | `content-data.ts` FAQ | 静态（revalidate 3600s） |
| `/contact` | 联系表单 + Leaflet 地图 + SMTP 邮件 | 静态 |
| `/privacy-policy` | `content-data.ts` PRIVACY 常量 | 静态（revalidate 3600s） |
| `/blog`、`/blog/[slug]`、`/inquiry` | —— | 307 重定向（向后兼容旧 URL） |

动态路由均通过 `generateStaticParams` 预生成 slug，并结合 ISR 在后台增量更新。

---

## 数据来源说明

- **产品**：通过标准 WordPress REST API 的 `product` 自定义文章类型（`/wp-json/wp/v2/product`）获取，**不需要 WooCommerce Consumer Key**。
- **文章 / 页面 / 分类**：标准 `wp/v2` 端点（`posts`、`pages`、`categories` 等）。
- **产品相册 / 属性 / 价格**：由 `wordpress-plugin/wc-product-specs-rest.php` 插件注册为 `product` 的 REST 字段（`wc_gallery`、`wc_attributes`、`wc_price` 等）。**部署前需在 WP 后台启用该插件。**
- `lib/wordpress.ts` 的获取函数均 `try/catch` 包裹，查无结果返回 `null` / 空数组，页面渲染优雅的「Not Found」态。

---

## 询盘提交流程

```
客户填表 → InquiryForm（客户端 Zod 校验）
         → lib/inquiry-service.ts（服务端 action）
             ① 持久化到 data/inquiries.json（始终执行）
             ② 通过 nodemailer SMTP 发送邮件通知（需配置环境变量）
         → 展示成功态
```

- **SMTP 已配置**：数据保存 + 邮件通知同时发送
- **SMTP 未配置**：仅保存到 `data/inquiries.json`，数据不丢失
- **邮件模板**：HTML 格式，含姓名/邮箱/产品类型/需求描述/提交时间

---

## 图片优化

全站使用 `next/image` 替代原生 `<img>`：

- 自动 WebP 转换、响应式尺寸、懒加载
- 通过 `fill` + `sizes` 适配不同布局
- Hero Banner 使用 `priority` 预加载（LCP 优化）
- 展会图片使用 `object-contain` 保持比例

> 开发环境需在 `next.config.ts` 中配置 `dangerouslyAllowLocalIP: true`（WordPress 运行在 localhost）。生产环境部署到公网域名后，此项可移除。

---

## 设计系统

| 令牌 | 值 | 用途 |
|------|----|------|
| Electric Blue | `#3E6AE1` | 主 CTA 按钮 |
| 品牌红 | `#d4343e` | 导航 hover/激活态，Logo 中 GD 红 |
| Carbon Dark | `#171A20` | 标题 + Hero 区域底色 |
| Graphite | `#393C41` | 正文 |
| Pewter | `#5C5E62` | 辅助文字/描述 |
| Light Ash | `#F4F4F4` | 卡片/区域背景 |

风格约定：无阴影、仅用 `1px` border（`#EEEEEE`）分隔；圆角 4px / 12px；过渡通过 Tailwind `duration-[330ms]` 按需使用；面包屑行统一为深色条（`#171A20` + `variant="dark"`）。

---

## 内容编辑指南

| 你要改什么 | 改哪里 |
|-----------|--------|
| 文案 / 公司信息 / 产品分类 / 服务 / FAQ / About 时间轴 | `lib/content-data.ts` |
| 产品图、文章图、OG 图 | WordPress 后台上传；OG 配置见 `lib/media.ts` |
| 首页 Hero Banner | WP 后台编辑 `home-banner` 页面的「特色图片」 |
| 导航菜单项 | `components/Header.tsx` 中的 `NAV_LINKS` |
| 配色 | `app/globals.css` 的 CSS 变量 |
| 页脚链接 | `lib/site-config.ts` |
| 表单字段 / 校验 | `components/form/InquiryForm.tsx` |
| 邮件收件人 | `.env.local` 的 `INQUIRY_EMAIL_TO` |
| 展会图片 | `public/Exhibitions/` 目录增删文件（ISR 60s 自动同步） |

---

## SEO & 结构化数据

- 全局 `metadata`（title 模板、Open Graph、Twitter Card、robots、canonical）定义在 `app/layout.tsx`。
- 注入的 JSON-LD：`Organization`、`WebSite`（根布局）；`BreadcrumbList`（每个页面面包屑）；`Article` / `Product` / `FAQPage` / `LocalBusiness`（对应详情页）。
- `app/robots.ts` 与 `app/sitemap.ts` 自动生成 `robots.txt` 与 `sitemap.xml`。
- `Organization` schema 含 `sameAs` 社交链接（LinkedIn、YouTube、Alibaba）。
- Google Analytics 当前由 WP 侧 Site Kit 插件承载。

---

## 部署

推荐 **Vercel**（零配置，自动识别 Next.js）。关键事项：

1. **图片域名**：`next.config.ts` 的 `images.remotePatterns` 当前放行 `localhost:10004`。上线前追加生产域名规则：
   ```ts
   { protocol: "https", hostname: "your-domain.com" }
   ```
2. **环境变量**：在部署平台配置所有 `NEXT_PUBLIC_*` 变量 + SMTP 变量（`SMTP_HOST` 等）。
3. **WordPress 插件**：目标 WP 环境需启用 `wc-product-specs-rest.php`。
4. **生产安全**：部署到公网后，可移除 `dangerouslyAllowLocalIP: true`。

也可 `npm run build && npm run start` 自托管（Node 服务）。

---

## 已知注意事项

- **Turbopack dev worker 池**：Next 16 dev 用 worker 池渲染页面，偶发全站 500。重启 dev server 即可恢复。
- **`next build` 在受限沙箱会被 safe-delete 防护拦死**，此类环境请勿用构建期诊断；改用 dev server 验证。
- **Leaflet 必须客户端加载**：`ContactMap` 在 `useEffect` 内 `await import("leaflet")`。
- **`next/image` + localhost**：开发环境需 `dangerouslyAllowLocalIP: true`，否则 WP 本地图片会被拦截。
