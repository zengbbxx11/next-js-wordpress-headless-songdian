/**
 * @fileoverview 可编辑内容数据模块
 *
 * Songdian Technology B2B 网站中所有静态文本、图片和公司信息的中央存储库。
 * 所有内容均以常量形式定义在此，编辑人员可以直接修改文案、产品描述、FAQ
 * 和公司详情，无需修改各个页面组件。
 *
 * @module content-data
 * @package Songdian Technology — Next.js WordPress Headless B2B Website
 */

/**
 * 站点全局使用的公司信息（meta 标签、页脚、关于页面、联系页面）。
 * 所有字段通过 `as const` 深度只读，防止意外修改。
 */
export const COMPANY = {
  /** 在头部和导航中显示的简短品牌名称 */
  name: "Songdian Technology",
  /** 完整的法律实体名称 */
  fullName: "Songdian Technology (Guangdong) Co., Ltd.",
  /** 一句话价值主张 */
  tagline: "Digital Camera OEM/ODM Manufacturer",
  /** SEO meta 描述和简介段落 */
  description:
    "A leading OEM/ODM digital camera manufacturer with 19 years of industry expertise. 30+ new products annually, 8,000 units daily output, and 500+ patents — serving global brands across 50+ countries.",
  /** 公司成立年份 */
  founded: 2010,
  /** 员工数量范围 */
  employees: "500-1,000",
  /** 工厂面积范围 */
  factorySize: "10,000-30,000 m²",
  /** 最大日产能 */
  dailyOutput: "8,000+ units",
  /** 每年发布的新产品数量 */
  annualProducts: "30+",
  /** 注册专利总数 */
  patents: "500+",
  /** 大致年营收 */
  annualRevenue: "US$100M+",

  /** 联系页面和结构化数据中显示的联系方式 */
  contact: {
    /** 物理地址 */
    address: "B-10, Qiaozhu North Road, Ronggui Subdistrict, Shunde District, Foshan, Guangdong, China",
    /** 城市 */
    city: "Foshan",
    /** 国家 */
    country: "China",
    /** 主要业务邮箱 */
    email: "leon@sonida.com",
    /** 备用联系邮箱 */
    emailAlt: "whvpn1208@gmail.com",
    /** 主要电话号码 */
    phone: "+86 18800375068",
    /** WhatsApp 商务号码 */
    whatsapp: "+86 19143890442",
    /** 工作时间描述 */
    hours: "Monday – Friday, 9:00 AM – 6:00 PM (GMT+8)",
  },

  /** 社交媒体和 marketplace 资料 */
  social: {
    /** LinkedIn 公司主页 */
    linkedin: "https://linkedin.com/company/songdian-technology",
    /** YouTube 频道 */
    youtube: "https://youtube.com/@songdiantech",
    /** 阿里巴巴店铺 */
    alibaba: "https://songdiantech.en.alibaba.com",
  },
} as const;

// ============================================================
// Hero 区域
// ============================================================

/**
 * 首页 Hero 区域内容。
 * 包含徽章、主标题、副标题和 CTA 按钮标签及其目标路由。
 */
export const HERO = {
  /** 主标题上方显示的小徽章/标签 */
  badge: "B2B Camera Manufacturing Partner",
  /** 主 Hero 标题（首页的 H1） */
  title: "Your Trusted Digital Camera Manufacturer",
  /** 标题下方的支持性段落 */
  subtitle: "19 years of OEM/ODM expertise. 30+ new products annually, 8,000 units daily output, and 500+ patents. Premium digital cameras designed and manufactured for global brands.",
  /** 行动号召按钮配置 */
  cta: {
    /** 主要（高亮）CTA */
    primary: { label: "Explore Products", href: "/products" },
    /** 次要（轮廓样式）CTA */
    secondary: { label: "Get a Quote", href: "/contact" },
  },
} as const;

// ============================================================
// 信任条
// ============================================================

/**
 * Hero 区域下方显示的信任指标条。
 * 每个项目将 Lucide 图标名称与简短的可信度声明配对。
 */
export const TRUST_ITEMS = [
  /** ISO 9001 质量管理认证 */
  { icon: "shield", text: "ISO 9001 Certified" },
  /** 日产能 */
  { icon: "lightning", text: "8,000 Units/Day Capacity" },
  /** 全球市场覆盖 */
  { icon: "globe", text: "50+ Countries Served" },
  /** 专利组合 */
  { icon: "trophy", text: "500+ Patents" },
] as const;

// ============================================================
// 产品分类（显示在首页）
// ============================================================

/**
 * 首页显示的产品分类卡片。
 * 每个分类包含名称、简短描述和 Lucide 图标标识符。
 */
export const PRODUCT_CATEGORIES = [
  /** 消费级和专业级数码相机 */
  {
    name: "Digital Cameras",
    description: "4K/48MP compact point-and-shoot cameras with autofocus and flip screens",
    icon: "camera",
  },
  /** 可换镜头微单相机 */
  {
    name: "Mirrorless Cameras",
    description: "Interchangeable lens cameras with advanced imaging for enthusiasts",
    icon: "aperture",
  },
  /** 视频相机和摄像机 */
  {
    name: "Video Cameras",
    description: "1080p/4K camcorders and vlogging cameras with stabilization",
    icon: "video",
  },
  /** 儿童友好型耐用相机 */
  {
    name: "Kids Cameras",
    description: "Durable, child-friendly instant print and digital cameras",
    icon: "smile",
  },
  /** 户外运动相机 */
  {
    name: "Action Cameras",
    description: "Waterproof 4K action cameras with EIS for outdoor adventures",
    icon: "shield",
  },
] as const;

// ============================================================
// 为什么选择我们（首页）
// ============================================================

/**
 * 首页"为什么选择我们"区域显示的竞争优势亮点。
 * 每个优势包含标题和描述段落。
 */
export const STRENGTHS = [
  {
    title: "19 Years of Expertise",
    description: "Since 2010, we've been dedicated to digital camera R&D and manufacturing. Our veteran engineering team delivers products that win markets.",
  },
  {
    title: "30+ New Products Annually",
    description: "Fast-paced innovation cycle — we launch over 30 new models each year, keeping your product lineup fresh and competitive.",
  },
  {
    title: "8,000 Units Daily Output",
    description: "10 production lines across 10,000-30,000 m² facility. Daily capacity of 8,000 units ensures timely delivery at any scale.",
  },
  {
    title: "500+ Patents",
    description: "Deep investment in R&D with a portfolio of 500+ registered patents covering optical design, electronics, and manufacturing processes.",
  },
  {
    title: "Global B2B Partner",
    description: "Serving brands across North America, Europe, Asia, Middle East, and Oceania. Verified by TÜV Rheinland onsite inspection.",
  },
  {
    title: "End-to-End Service",
    description: "From industrial design and prototyping to mass production, packaging, and logistics — we're your single-source camera manufacturing partner.",
  },
] as const;

// ============================================================
// 服务（服务页面）
// ============================================================

/**
 * 服务页面显示的服务产品详情。
 * 每个服务包含用于锚点链接的 id、标题、副标题、摘要
 * 和功能要点列表。
 */
export const SERVICES = [
  {
    /** 用于锚点/哈希链接的唯一标识符 */
    id: "oem",
    /** 服务标题 */
    title: "OEM Manufacturing",
    /** 简短口号 */
    subtitle: "Build to Your Specification",
    /** 概述段落 */
    summary:
      "Hand us your product specifications, BOM, and branding requirements — we handle everything from component sourcing and PCB assembly to firmware flashing, QC testing, and custom packaging. 10 production lines, 8,000 units daily output.",
    /** 主要功能/交付物 */
    features: [
      "Full BOM procurement and supply chain management",
      "High-precision SMT assembly across 10 production lines",
      "Custom firmware with your splash screen and UI",
      "Custom enclosure with your logo and color scheme",
      "Retail-ready packaging with your brand design",
      "100% functional QC with detailed inspection reports",
      "Daily capacity of 8,000 units for rapid fulfillment",
    ],
  },
  {
    id: "odm",
    title: "ODM Design & Development",
    subtitle: "We Design, You Brand",
    summary:
      "Choose from our library of 500+ patented designs or let our R&D team create a custom product for your market. 30+ new products developed annually — from concept to mass production in as little as 3 months.",
    features: [
      "Access to 500+ patented camera designs",
      "Industrial design and mechanical engineering (CAD/CAM)",
      "Custom PCB schematic and layout design",
      "Embedded firmware development and ISP tuning",
      "Rapid prototyping with 3D printing and CNC",
      "CE, FCC, RoHS compliance support",
      "White-label and private-label options available",
    ],
  },
  {
    id: "branding",
    title: "Brand Customization",
    subtitle: "Your Brand, Our Quality",
    summary:
      "Full-spectrum branding services for distributors and retailers. Custom logos, packaging, firmware UI, user manuals, and product photography — everything you need to launch your own camera brand.",
    features: [
      "Custom logo printing on camera body and lens",
      "Bespoke packaging design and printing",
      "Branded firmware with custom splash screen and UI colors",
      "Multi-language user manual creation and printing",
      "Professional product photography for your catalog",
      "Drop-shipping and FBA prep services available",
      "Low MOQ for brand trials — start with 100 units",
    ],
  },
  {
    id: "qc",
    title: "Quality Assurance",
    subtitle: "TÜV Rheinland Verified",
    summary:
      "Every camera undergoes a rigorous 5-stage QC process. Onsite verified by TÜV Rheinland — one of the world's leading inspection companies — ensuring consistent quality at any production scale.",
    features: [
      "IQC — Incoming material inspection for all components",
      "IPQC — In-process quality control at each production stage",
      "AOI — Automated optical inspection after SMT assembly",
      "Full functional testing of all ports, buttons, and sensors",
      "24-hour burn-in / aging test for reliability",
      "OQC — AQL sampling inspection before shipment",
      "Detailed QC reports provided with every order",
    ],
  },
] as const;

// ============================================================
// FAQ 数据
// ============================================================

/**
 * 按分类组织的 FAQ 内容，显示在 FAQ 页面并用于生成
 * FAQPage 结构化数据（SEO）。
 *
 * 每个分类包含一组问答项目对。
 */
export const FAQS = [
  {
    /** 分类标题 */
    category: "Capabilities & Certification",
    items: [
      {
        question: "How do you prove your factory's strength?",
        answer:
          "We have 19 years of experience, an in-house R&D team, and hold certifications like ISO 9001, CE, RoHS, FCC, Sedex. We serve as a long-term manufacturing partner for brands like Minolta, Rollei and Kenko.",
      },
      {
        question: "What is your quality control process?",
        answer:
          "We implement full-process QC (IQC, IPQC, FQC, OQC) with traceable components, ensuring every batch meets EU & USA standards.",
      },
    ],
  },
  {
    category: "Product Quality",
    items: [
      {
        question: "How is product quality consistency ensured?",
        answer:
          "Standardized automated production minimizes errors. We perform batch testing and provide quality reports.",
      },
      {
        question: "What certifications do your products have?",
        answer:
          "UL, CE, RoHS, FDA, MSDS. Specific certificates are provided per product.",
      },
    ],
  },
  {
    category: "Delivery",
    items: [
      {
        question: "What is your lead time? Can you expedite?",
        answer:
          "Standard lead time: 15–35 days after deposit. Samples: 7 days. Rush orders are eligible for expedited production.",
      },
      {
        question: "How reliable is your on-time delivery?",
        answer:
          "We guarantee on-time delivery with regular order progress updates.",
      },
    ],
  },
  {
    category: "After-Sales Service",
    items: [
      {
        question: "What after-sales support do you offer?",
        answer:
          "12-month warranty + professional technical support + free replacement for confirmed defects.",
      },
    ],
  },
  {
    category: "Cooperation",
    items: [
      {
        question: "What is your sample policy?",
        answer:
          "Samples are available. Sample cost + shipping fee can be refunded in formal orders.",
      },
      {
        question: "What are your payment terms?",
        answer:
          "T/T, L/C are accepted. Final terms confirmed in the sales contract.",
      },
    ],
  },
  {
    category: "Customization Services",
    items: [
      {
        question: "Do you offer customization?",
        answer:
          "Yes. We provide full customization including: Software — UI, functions, compliance; Hardware — Specifications, components, design; Branding & Packaging — Logo, retail package; One-stop solution from design to shipment.",
      },
    ],
  },
] as const;

// ============================================================
// 关于页面内容
// ============================================================

/**
 * 关于我们页面的所有内容，包括 hero 区域、公司故事、
 * 历史时间线、核心价值观、认证和研发亮点。
 */
export const ABOUT = {
  /** 关于页面 hero/横幅区域 */
  hero: {
    title: "About Songdian Technology",
    subtitle:
      "A leading digital camera OEM/ODM manufacturer with 19 years of expertise. 30+ new products annually, 8,000 units daily output, and 500+ registered patents.",
  },

  /** 公司起源故事 */
  story: {
    title: "Our Story",
    /** 构成叙述的段落数组 */
    content: [
      "SONGDIAN Technology is a wholly-owned subsidiary of Shenzhen Sonida, established in 2023. Its parent company, Shenzhen Sonida Digital Technology Co., Ltd., was founded in 2006. We are a national high-tech enterprise integrating R&D, design, production, sales, and brand operations.",
      "Specializing in digital imaging equipment, our products cover digital cameras, camcorders, printers, and imaging accessories. We are one of the largest digital camera companies in China.",
      "The group operates two major centers in Shenzhen and Shunde, with a 40,000m² facility and over 1,000 employees. Our annual production capacity exceeds 10 million units, and we hold over 500 national patents.",
      "We are certified by ISO9001, CE, FCC, and Sedex, and have long-term ODM cooperation with global brands including Minolta, Rollei, and Kenko.",
    ],
  },

  /** 公司里程碑时间线 */
  timeline: [
    {
      year: "2006",
      title: "Company Established",
      event: "Shenzhen Sonida Digital Technology Co., Ltd. was established, beginning involvement in the digital imaging field.",
    },
    {
      year: "2009",
      title: "First Independently Developed Camcorder",
      event: "First independently developed camcorder DV801 launched, marking the start of independent camera product R&D.",
    },
    {
      year: "2023",
      title: "SONGDIAN Company Established",
      event: "Subsidiary SONGDIAN Technology (Guangdong) Co., Ltd. established. Member of the Brand Powerhouse in Electronic Digital Industry. Launched brand upgrade strategy.",
    },
    {
      year: "2024",
      title: "Disney Authorized",
      event: "Obtained Disney authorization, launching SONGDIAN Disney series. Won Best Outdoor Marketing Case at 9th China Advertising Festival.",
    },
    {
      year: "2025",
      title: "China Top 500 Brands",
      event: "Selected as Top 10 China Camera Brand, honored on China's Top 500 Brands list. Recognized as Outstanding China Compact Camera of 2025.",
    },
  ],

  /** 核心价值观 */
  values: [
    {
      title: "Craftsmanship",
      description:
        "We treat every component and every process with meticulous attention to detail. Our engineering team brings 19 years of camera-specific manufacturing expertise to every project.",
    },
    {
      title: "Innovation Driven",
      description:
        "With 500+ registered patents and 30+ new products launched annually, innovation is in our DNA. We invest heavily in R&D to stay ahead of market trends.",
    },
    {
      title: "B2B Partnership",
      description:
        "We succeed when our clients succeed. Our flexible OEM/ODM model adapts to your needs — whether you need a small branding run or full custom product development.",
    },
    {
      title: "Quality Without Compromise",
      description:
        "TÜV Rheinland onsite-verified manufacturer. Every camera undergoes rigorous multi-stage QC testing before it leaves our factory.",
    },
  ],

  /** 公司持有的认证 */
  certifications: [
    { name: "ISO 9001", description: "Quality Management System", year: "2015" },
    { name: "CE Certification", description: "European Conformity", year: "2013" },
    { name: "FCC Certification", description: "Federal Communications Commission (USA)", year: "2013" },
    { name: "RoHS Compliant", description: "Restriction of Hazardous Substances", year: "2013" },
    { name: "Sedex / SMETA", description: "Ethical & Responsible Sourcing Audit", year: "2019" },
    { name: "500+ Patents", description: "Registered Design & Utility Patents", year: "Ongoing" },
  ],

  /** 研发区域内容 */
  rd: {
    title: "Research & Development",
    content:
      "Our R&D center is the engine behind 30+ new products each year. With 500+ registered patents spanning optical design, electronic engineering, firmware development, and manufacturing processes, we have the technical depth to tackle any camera development challenge — from entry-level point-and-shoot cameras to advanced 4K mirrorless systems.",
    /** 以统计卡片形式显示的关键研发指标 */
    highlights: [
      { label: "Annual New Products", value: "30+" },
      { label: "Registered Patents", value: "500+" },
      { label: "Production Lines", value: "10" },
      { label: "Daily Output", value: "8,000 Units" },
    ],
  },
} as const;

// ============================================================
// 询盘表单指南（显示在联系页面）
// ============================================================

/**
 * 联系/询盘页面显示的询盘表单指导提示，
 * 帮助潜在客户了解在提交制造询盘时应提供哪些信息。
 */
export const INQUIRY_GUIDE = [
  {
    title: "Product Type",
    description:
      "What type of camera do you need? Action cam, trail cam, dashcam, instant print, or custom module?",
  },
  {
    title: "Target Specifications",
    description:
      "Resolution, sensor, lens, battery life, waterproof rating, connectivity — the more details, the better.",
  },
  {
    title: "Order Quantity",
    description:
      "Estimated annual volume or first order quantity. This helps us prepare the right production plan.",
  },
  {
    title: "Service Type",
    description: "Do you need OEM (build to your spec) or ODM (we design for you)?",
  },
  {
    title: "Target Markets",
    description:
      "Which countries will you sell in? This determines certification requirements (CE, FCC, etc.).",
  },
  {
    title: "Timeline",
    description: "Expected launch date or delivery deadline. We'll assess feasibility and plan accordingly.",
  },
] as const;
