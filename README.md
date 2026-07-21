# Songdian Technology — Headless B2B 官网（Next.js + WordPress）

松典科技（广东）有限公司 B2B 官网前端。后端为 **WordPress + WooCommerce**（`localhost:10004`），前端为 **Next.js（App Router）Headless** 架构，通过 WP REST API 拉取内容，支持 ISR 增量静态再生 + Streaming SSR。

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
| 性能 | React `cache()` 请求去重 + Streaming SSR + Suspense 边界 + 5 个 loading.tsx 骨架屏 + 顶部进度条 |

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
| `NEXT_PUBLIC_SITE_NAME` | `Songdian Technology...` | 站点名称（SEO） |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | — | 站点描述（SEO） |
| `NEXT_PUBLIC_ISR_REVALIDATE` | `60` | ISR 缓存时间（秒） |
| `WOOCOMMERCE_CONSUMER_KEY` | — | WooCommerce 密钥（当前未使用） |
| `WOOCOMMERCE_CONSUMER_SECRET` | — | WooCommerce 密钥（当前未使用） |
| `NEXT_PUBLIC_GA_ID` | — | Google Analytics 4 Measurement ID（`G-XXXXXXXXXX`），留空不注入 |

### Google Analytics 4

项目已集成 `@next/third-parties` 官方组件，在 `.env.local` 中设置 `NEXT_PUBLIC_GA_ID` 即可启用：

```ini
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

GA ID 获取：Google Analytics → 管理 → 数据流 → 复制 Measurement ID。留空则不注入任何追踪代码。

### SMTP 邮件通知（可选）

配置后，Contact 页询盘提交会自动发送邮件通知。不配置则仅保存到 `data/inquiries.json`。

| 变量 | 示例 | 说明 |
|------|------|------|
| `SMTP_HOST` | `smtp.qq.com` | SMTP 服务器地址 |
| `SMTP_PORT` | `587` | 端口（TLS=587, SSL=465） |
| `SMTP_USER` | `xxx@qq.com` | 发件邮箱完整地址 |
| `SMTP_PASS` | 授权码 | **必须是授权码，非登录密码** |
| `INQUIRY_EMAIL_TO` | `zengxb21@proton.me` | 接收通知的邮箱（默认此地址） |
| `INQUIRY_EMAIL_FROM` | — | 发件人显示地址（默认取 SMTP_USER） |

> QQ 邮箱获取授权码：mail.qq.com → 设置 → 账户 → POP3/SMTP 服务 → 开启 → 发短信验证 → 复制 16 位授权码

建议在项目根目录创建 `.env.local` 按需覆盖（不入库）。

---

## 项目结构

```
├─ app/                         # App Router 路由（页面）
│  ├─ layout.tsx                # 根布局：字体(Geist + display:swap)、全局 SEO、JSON-LD、Header/Footer/FloatingInquiry/NavigationProgress
│  ├─ globals.css               # Tailwind v4 + 设计令牌（CSS 变量）
│  ├─ page.tsx                  # 首页（Streaming SSR：4 个 Suspense 边界）
│  ├─ error.tsx                 # 全局错误边界（重试 + 返回首页）
│  ├─ loading.tsx               # 全局加载骨架屏
│  ├─ not-found.tsx             # 自定义 404 页面
│  ├─ about/                    # 关于我们（品牌故事、时间线、工厂视频、VR 展厅、资质认证）
│  ├─ solutions/                # 解决方案概览（静态）
│  │  └─ faq/                   # 常见问题（粘性目录 + 锚点直达）
│  ├─ products/                 # 产品列表 + 分类筛选（ISR）
│  │  ├─ loading.tsx            # 产品列表骨架屏
│  │  └─ [slug]/                # 产品详情 + 相册 + 规格（ISR，Suspense 异步加载相关产品）
│  │     └─ loading.tsx         # 产品详情骨架屏
│  ├─ news/                     # 新闻列表 + 置顶（ISR）
│  │  ├─ loading.tsx            # 新闻列表骨架屏
│  │  └─ [slug]/                # 新闻详情（Astra 主题 HTML 清洗，ISR）
│  │     └─ loading.tsx         # 新闻详情骨架屏
│  ├─ contact/                  # 联系页：表单 + Leaflet 地图 + SMTP 邮件通知
│  ├─ privacy-policy/           # 隐私政策
│  ├─ robots.ts                 # /robots.txt
│  └─ sitemap.ts                # /sitemap.xml
│
├─ components/
│  ├─ Header.tsx / Footer.tsx   # 站点导航与页脚（Footer 为 Server Component）
│  ├─ NavigationProgress.tsx    # 顶部路由进度条（品牌红 #d4343e，零依赖）
│  ├─ FloatingInquiry.tsx       # 全站底部常驻询盘栏
│  ├─ Breadcrumbs.tsx           # Tesla 风格面包屑（light / dark 双变体）
│  ├─ ProductCard.tsx           # 产品卡片（Server Component，next/image）
│  ├─ ProductGallery.tsx        # 产品图集（客户端缩略图切换）
│  ├─ PostCard.tsx              # 文章卡片（next/image）
│  ├─ NewsGrid.tsx              # 文章网格
│  ├─ ExhibitionMarquee.tsx     # 展会滚动墙 + 点击 Lightbox 查看大图
│  ├─ VRShowroom.tsx            # 360° VR 虚拟展厅（等距柱状投影 + 拖拽旋转 + 全屏查看）
│  ├─ FaqToc.tsx                # FAQ 分类目录（滚动高亮 + 平滑锚点跳转）
│  ├─ ContactMap.tsx            # Leaflet 地图（客户端动态加载）
│  ├─ CertificateGallery.tsx    # 证书 Lightbox 画廊
│  ├─ FactoryVideo.tsx          # 工厂视频播放器
│  ├─ SpotlightCard.tsx         # 鼠标聚光灯卡片
│  ├─ HorizontalTimeline.tsx    # 横向时间线
│  ├─ AnimatedCounter.tsx       # 数字滚动动画
│  ├─ SectionHeading.tsx        # 带动画下划线标题
│  ├─ form/                     # InquiryForm + FormField + FormSelect（RHF + Zod）
│  ├─ motion/                   # framer-motion 封装（HeroSection / AnimatedSection）
│  └─ ui/                       # shadcn/ui 基础组件（button/card/input/select/textarea/badge/separator/label）
│
├─ lib/
│  ├─ wordpress.ts              # WP/WC REST 客户端（wpFetch 统一封装 + cache() 去重）
│  ├─ content-data.ts           # 全站可编辑文案（公司信息、产品分类、服务、FAQ、About 时间轴、VR 展厅场景等）
│  ├─ inquiry-service.ts        # 询盘服务端 action（文件持久化 + SMTP 邮件通知）
│  ├─ seo.ts                    # 结构化数据：organization / breadcrumb / article / product / faq / localBusiness
│  ├─ html-cleaner.ts           # Astra 主题文章 HTML 清洗器
│  ├─ media.ts                  # 图片/视频/VR 资源路径映射
│  ├─ site-config.ts            # 页脚链接等静态配置
│  ├─ coord-transform.ts        # 坐标转换（WGS-84 → GCJ-02）
│  ├─ exhibitions.ts            # 展会图片文件系统动态读取
│  ├─ types.ts                  # WP/WC 响应与前端应用层类型
│  └─ utils.ts                  # cn() 等通用工具
│
├─ data/                        # 运行时数据（不入库）
│  └─ inquiries.json            # 询盘记录
│
├─ wordpress-plugin/
│  └─ wc-product-specs-rest.php # 自建 WP 插件：WC 属性/SKU/价格/相册暴露到 REST
│
├─ public/                      # 静态资源
│  ├─ banner.webp               # 首页 Hero Banner（本地静态图片）
│  ├─ logo.png                  # 品牌 Logo
│  ├─ global-odm-partners.webp  # 全球 ODM 合作伙伴图
│  ├─ MediaIcon/                # 社媒图标（Facebook / YouTube / Instagram / TikTok）
│  ├─ CertificationsAndComplianceImages/  # 15 张认证证书（.webp）
│  ├─ Exhibitions/              # 5 张展会图片（.webp，文件名即展会信息）
│  ├─ VR/                       # 5 张 360° 全景图（.webp，等距柱状投影）
│  ├─ Video/                    # 工厂宣传视频
│  └─ Favicon/                  # 站点图标
│
├─ next.config.ts               # 图片优化（AVIF/WebP）+ 生产配置 + 重定向
├─ postcss.config.mjs           # Tailwind v4 postcss 插件
├─ tsconfig.json                # 路径别名 @/* → 项目根
└─ package.json
```

---

## 路由与渲染策略

| 路由 | 数据来源 | 渲染 |
|------|---------|------|
| `/` | `banner.webp`（本地） + `content-data.ts` + WP/WC | ISR 60s + **Streaming**（4 个 Suspense 边界） |
| `/products` | WP `product` 列表 + 6 个分类筛选 | ISR 60s |
| `/products/[slug]` | WP `product` 详情 + `wc_gallery` 相册 + 规格 | ISR 60s + **Suspense**（相关产品异步） |
| `/news` | WP `posts` 列表 + 置顶卡片 | ISR 60s |
| `/news/[slug]` | WP 文章详情（经 `html-cleaner` 清洗） + 上下篇导航 | ISR 60s |
| `/about` | `content-data.ts` + 视频 + VR 展厅 + 证书 | ISR 3600s |
| `/solutions` | `content-data.ts` 解决方案列表 | ISR 3600s |
| `/solutions/faq` | `content-data.ts` FAQ | ISR 3600s |
| `/contact` | 联系表单 + Leaflet 地图 + SMTP 邮件 | ISR 3600s |
| `/privacy-policy` | `content-data.ts` PRIVACY 常量 | ISR 3600s |

动态路由均通过 `generateStaticParams` 预生成 slug，并结合 ISR 在后台增量更新。

### 重定向（308 永久）

| 旧路由 | 新路由 | 原因 |
|--------|--------|------|
| `/services` | `/solutions` | 2026-07 路由重构 |
| `/services/faq` | `/solutions/faq` | 同上 |
| `/blog` | `/news` | 旧路径清理 |
| `/blog/:slug*` | `/news/:slug*` | 同上 |
| `/inquiry` | `/contact` | 询盘入口统一 |

### 错误处理 & 加载状态

所有数据页面配有对应的 `loading.tsx` 骨架屏：

| 文件 | 样式 |
|------|------|
| `app/loading.tsx` | 全屏居中 spinner |
| `app/error.tsx` | 友好错误页 + 重试按钮 |
| `app/not-found.tsx` | 404 页面 + 导航建议 |
| `app/products/loading.tsx` | 6 格骨架网格 |
| `app/products/[slug]/loading.tsx` | 两栏布局骨架 |
| `app/news/loading.tsx` | 网格骨架（大卡 + 4 小卡） |
| `app/news/[slug]/loading.tsx` | 全宽文章骨架 |

---

## About 页功能模块

| 区块 | 组件 | 说明 |
|------|------|------|
| 品牌故事 + 数据统计 | `AnimatedCounter` | 左侧故事，右侧数字滚动 |
| 发展历程 | `HorizontalTimeline` | 横向滑动时间线 |
| 制造实力 + 工厂视频 | `FactoryVideo` | 3 张能力卡片 + HTML5 视频 |
| 360° VR 虚拟展厅 | `VRShowroom` | 5 个全景场景，拖拽旋转/滚轮缩放 |
| 资质认证 | `CertificateGallery` | 15 张证书 Lightbox 画廊 |

### VR 展厅技术细节

- **投影方式**：等距柱状投影（equirectangular），CSS `background-image` + `background-repeat: repeat-x` 实现水平无缝循环
- **交互**：PointerEvent 拖拽旋转、滚轮缩放（1.5x ~ 6x）、键盘 ← → 切换场景、ESC 关闭
- **初始视角**：自动居中（容器挂载时测量宽度计算中心偏移）
- **场景列表**：Reception、Exhibition Hall、Production Workshop Corridor、Assembly Workshop、Office Area
- **全景图位置**：`public/VR/*.webp`

---

## 弱网/低端设备性能优化

| 优化项 | 说明 |
|--------|------|
| **顶部进度条** | `NavigationProgress.tsx` — 点击瞬间触发品牌红进度条 |
| **Streaming SSR** | 首页 4 个 Suspense 边界，静态区块零 API 首帧即出 |
| **骨架屏** | 5 个 loading.tsx 覆盖所有数据页面 |
| **`cache()` 去重** | `getProductBySlug` 用 React `cache()` 包裹 |
| **图片 WebP** | 全站资源已转为 .webp，比 PNG/JPEG 小 40-70% |
| **next/image AVIF+WebP** | 自动转换 + 响应式尺寸 + 懒加载 |
| **字体 swap** | Geist `display: "swap"`，零文字闪烁 |
| **Tree-shaking** | framer-motion / lucide-react 按需加载 |

---

## 数据来源说明

- **产品**：标准 WordPress REST API 的 `product` 自定义文章类型（`/wp-json/wp/v2/product`），**不需要 WooCommerce Consumer Key**。
- **文章 / 页面 / 分类**：标准 `wp/v2` 端点。
- **产品相册 / 属性 / 价格**：由 `wc-product-specs-rest.php` 插件注入 REST 字段。
- **展会图片**：`lib/exhibitions.ts` 从 `public/Exhibitions/` 文件系统动态读取，增删文件即生效。
- **VR 全景图**：`public/VR/` 下的 .webp 文件，由 `VRShowroom` 组件加载。
- **首页 Banner**：本地 `public/banner.webp`，不依赖 WordPress。

---

## 询盘提交流程

```
客户填表 → InquiryForm（客户端 Zod 校验，4 项必填）
         → lib/inquiry-service.ts（服务端 action）
             ① 持久化到 data/inquiries.json（始终执行）
             ② 通过 nodemailer SMTP 发送邮件通知（需配置环境变量）
         → 展示成功态
```

---

## 图片优化

- 全站静态资源已统一为 **.webp** 格式（证书、展会、VR 全景、Banner、ODM 图）
- 社交媒体小图标保持 .png（体积小，转 webp 无收益）
- 使用 `next/image` 提供 AVIF + WebP 双格式 + 响应式 srcset
- Banner 使用 `priority` 预加载（LCP 优化）
- 配置 `imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 768]` 精细断点

---

## 设计系统

| 令牌 | 值 | 用途 |
|------|----|------|
| Electric Blue | `#3E6AE1` | 主 CTA 按钮 |
| Electric Blue Hover | `#3561CC` | CTA hover 态 |
| 品牌红 | `#d4343e` | 导航激活态、进度条、VR 查看器高亮 |
| Carbon Dark | `#171A20` | 标题 + 面包屑底色 |
| Graphite | `#393C41` | 正文 |
| Pewter | `#5C5E62` | 辅助文字 |
| Light Ash | `#F4F4F4` | 卡片/区域背景 |

风格约定：无阴影、`1px border`（`#EEEEEE`）分隔；圆角 4px/6px/8px/12px；过渡 `transition-colors duration-[330ms]`。

---

## 内容编辑指南

| 你要改什么 | 改哪里 |
|-----------|--------|
| 文案 / 公司信息 / 产品分类 / FAQ / About 时间轴 / VR 场景 | `lib/content-data.ts` |
| 首页 Hero Banner | 替换 `public/banner.webp` |
| VR 全景图 | 替换 `public/VR/` 下对应 .webp |
| 展会图片 | `public/Exhibitions/` 增删文件（ISR 自动同步） |
| 工厂视频 | 替换 `public/Video/SongdianFactoryVideo.mp4` |
| 证书图片 | 替换 `public/CertificationsAndComplianceImages/` 下对应 .webp |
| 图片路径映射 | `lib/media.ts` |
| 导航菜单项 | `components/Header.tsx` 中的 `NAV_LINKS` |
| 配色 | `app/globals.css` 的 CSS 变量 |
| 页脚链接 | `lib/site-config.ts` |
| 表单字段 / 校验 | `components/form/InquiryForm.tsx` |
| 询盘收件邮箱 | `.env.local` 的 `INQUIRY_EMAIL_TO` |
| 添加重定向 | `next.config.ts` 的 `redirects()` |

---

## SEO & 结构化数据

- 全局 `metadata` 定义在 `app/layout.tsx`
- JSON-LD：`Organization`、`WebSite`、`BreadcrumbList`、`Article`、`Product`、`FAQPage`、`LocalBusiness`
- `app/robots.ts` / `app/sitemap.ts` 自动生成
- `Organization` schema 含社交链接

---

## 部署

当前生产环境：**腾讯云服务器 + 1Panel Linux 面板**，自托管运行。详见 `deploy-guide.md`。

### 服务器概览

```text
地址:      http://106.53.220.184
SSH:       ubuntu@106.53.220.184
面板:      1Panel（端口 8090）
WordPress: http://106.53.220.184:10004（容器化）
数据库:    MySQL 8.4，库名 word_dNMNbP
```

### 部署更新

```bash
ssh ubuntu@106.53.220.184
cd ~/songdianweb
git pull
npm install
npm run build
pm2 restart songdian
```

---

## 已知注意事项

- **Leaflet 必须客户端加载**：`ContactMap` 在 `useEffect` 内 `await import("leaflet")`
- **`next/image` + localhost**：开发环境需 `dangerouslyAllowLocalIP: true`
- **VR 查看器初始视角**：`VRShowroom` 挂载时通过 `useEffect` 测量容器宽度自动居中
- **图片替换后刷新**：静态图片（Banner/VR/展会/证书）替换后刷新浏览器即可，ISR 页面等待 revalidate 间隔自动更新
- **JSDoc 中文限制**：Next.js 16 Turbopack 的 Rust 字符串切片器不兼容 JSDoc 内中文，统一用 `//` 行注释
