/**
 * 可编辑内容数据模块（中央内容仓库）
 * ------------------------------------------------------------------
 * 站点的所有静态文案、图片与公司信息统一在此以常量形式集中管理。
 * 编辑人员可直接修改此处文案、产品描述、FAQ、公司详情，
 * 而无需改动各个页面组件。
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
    "A leading OEM/ODM digital camera manufacturer with 20 years of industry expertise. 30+ new products annually, 10 million units annual output, and 500+ patents — serving global brands across 60+ countries.",
  /** 公司成立年份（集团母公司深圳 Sonida 创立于 2006 年） */
  founded: 2006,
  /** 员工数量 */
  employees: "1,000+",
  /** 工厂面积 */
  factorySize: "40,000 m²",
  /** 最大年产能 */
  annualOutput: "10M+ units/year",
  /** 每年发布的新产品数量 */
  annualProducts: "30+",
  /** 注册专利总数 */
  patents: "500+",
  /** 大致年营收 */
  annualRevenue: "US$100M+",

  /** 联系页面和结构化数据中显示的联系方式 */
  contact: {
    /** 物理地址（英文，便于海外访客阅读） */
    address: "Room 801, Building 17, Tongde Intelligent Manufacturing Park, No. 9 Guizhou Avenue East, Shangjiashi Community, Ronggui Subdistrict, Shunde District, Foshan, Guangdong, China",
    /** 地址纬度（用于地图精准定位，避免文本地址落点偏移） */
    lat: 22.75499,
    /** 地址经度（同德智造园东缘，已按页面拖拽校准至 17 栋一带） */
    lng: 113.28204,
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
 * 包含徽章、主标题、副标题，以及主/次 CTA 按钮标签与其目标路由。
 */
export const HERO = {
  /** 主标题上方显示的小徽章/标签 */
  badge: "B2B Camera Manufacturing Partner",
  /** 主 Hero 标题（首页的 H1） */
  title: "Your Trusted Digital Camera Manufacturer",
  /** 标题下方的支持性段落 */
  subtitle: "20 years of OEM/ODM expertise. 30+ new products annually, 10 million units annual output, and 500+ patents. Premium digital cameras designed and manufactured for global brands.",
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
 * Hero 区域下方展示的信任指标条。
 * 每个项目将 Lucide 图标名称与一句简短的可信度声明配对。
 */
export const TRUST_ITEMS = [
  /** ISO 9001 质量管理认证 */
  { icon: "shield", text: "ISO 9001 Certified" },
  /** 日产能 */
  { icon: "lightning", text: "10M Units/Year Capacity" },
  /** 全球市场覆盖 */
  { icon: "globe", text: "60+ Countries Served" },
  /** 专利组合 */
  { icon: "trophy", text: "500+ Patents" },
] as const;

// ============================================================
// 信任条 — 认证标识墙（Certification Wall）
// ============================================================

/**
 * 首页信任条（认证标识墙）展示的资质认证。
 * 选用全球 B2B 买家最熟悉的几项，均对应 ABOUT.certificationImages 中的真实证书图片。
 * code 为证书代号（徽章主显示），full 为全称（用于 tooltip / 无障碍标签）。
 */
export const TRUST_CERTS = [
  { code: "ISO 9001", full: "Quality Management System" },
  { code: "CE", full: "European Conformity" },
  { code: "FCC", full: "U.S. Federal Communications Commission" },
  { code: "RoHS", full: "Restriction of Hazardous Substances" },
  { code: "UL", full: "Underwriters Laboratories" },
  { code: "UKCA", full: "UK Conformity Assessed" },
  { code: "BSCI", full: "Business Social Compliance Initiative" },
  { code: "FDA", full: "U.S. Food & Drug Administration" },
  { code: "TELEC", full: "Japan Radio Equipment Certification" },
  { code: "WEEE", full: "Waste Electrical & Electronic Equipment" },
] as const;

// ============================================================
// 产品分类（显示在首页）
// ============================================================

/**
 * 首页展示的产品分类卡片。
 * 每个分类包含名称、简短描述与对应的 Lucide 图标标识符。
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
// 首页 — 产品类目展示（我们有哪些相机类目）
// ============================================================

/**
 * 首页"产品类目"卡片展示配置。
 * 键为产品分类 slug（与 WordPress /products?category=<slug> 筛选、以及下方 categoryOrder 保持一致），
 * 值为该类目在首页卡片上展示的名称与一句话描述。
 * 卡片图片动态取该类目下最新一个产品的特色图，不在此写死。
 */
export const CATEGORY_SHOWCASE: Record<string, { name: string; description: string }> = {
  mirrorless: {
    name: "Mirrorless Cameras",
    description: "Interchangeable-lens systems with advanced imaging for enthusiasts and professionals.",
  },
  compact: {
    name: "Compact Cameras",
    description: "Pocketable 4K point-and-shoot cameras with autofocus and flip screens.",
  },
  action: {
    name: "Action Cameras",
    description: "Waterproof 4K action cameras with EIS for outdoor adventures.",
  },
  video: {
    name: "Video Cameras",
    description: "1080p/4K camcorders and vlogging cameras with built-in stabilization.",
  },
  kids: {
    name: "Kids Cameras",
    description: "Durable, child-friendly instant-print and digital cameras.",
  },
};


// ============================================================
// 全球 ODM 合作伙伴（首页）
// ============================================================

/**
 * 首页"Global ODM Partners"区域内容。
 * 展示全球出口网络（地图+辐射箭头）与国际合作品牌 Logo 墙。
 */
export const GLOBAL_ODM = {
  /** 区块主标题 */
  title: "Global ODM Partners",
  /** 品牌红 eyebrow 标签 */
  eyebrow: "Global Reach",
  /** 核心标语（主标语） */
  tagline: "World-Class Quality, Certified Excellence",
  /** 核心标语（副标语） */
  taglineSecondary: "Proven Partner for Global Imaging Brands",
  /** 出口国家/地区描述 */
  exportDescription:
    "Products exported to 60+ countries/regions including US, Japan, Europe, Australia, Middle East, South Africa, Thailand, Mexico, Indonesia, South America, Russia, and Central Asia.",
  /** ODM 服务合作品牌列表（用于文字展示 + 结构化数据） */
  brands: ["Konica Minolta", "Kenko", "Rollei", "YASHICA", "aiwa", "ILFORD", "B+H", "Gripo", "AKITO"],
} as const;

// ============================================================
// 为什么选择我们（首页）
// ============================================================

/**
 * 首页"为什么选择我们"区域展示的竞争优势亮点。
 * 每个优势包含标题与一段描述文字。
 */
export const STRENGTHS = [
  {
    title: "20 Years of Expertise",
    description: "Since 2006, we've been dedicated to digital camera R&D and manufacturing. Our veteran engineering team delivers products that win markets.",
  },
  {
    title: "30+ New Products Annually",
    description: "Fast-paced innovation cycle — we launch over 30 new models each year, keeping your product lineup fresh and competitive.",
  },
  {
    title: "10M Units Annual Output",
    description: "10 production lines across 40,000 m² facility. Annual capacity of 10 million units ensures timely delivery at any scale.",
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
 * 服务页面展示的服务项目详情。
 * 每个服务包含用于锚点链接的 id、标题、副标题、概述段落
 * 以及功能要点列表。
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
      "Hand us your product specifications, BOM, and branding requirements — we handle everything from component sourcing and PCB assembly to firmware flashing, QC testing, and custom packaging. 10 production lines, 10 million units annual output.",
    /** 主要功能/交付物 */
    features: [
      "Full BOM procurement and supply chain management",
      "High-precision SMT assembly across 10 production lines",
      "Custom firmware with your splash screen and UI",
      "Custom enclosure with your logo and color scheme",
      "Retail-ready packaging with your brand design",
      "100% functional QC with detailed inspection reports",
      "Annual capacity of 10 million units for rapid fulfillment",
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
 * 按分类组织的 FAQ 内容，用于 FAQ 页面展示，
 * 并生成 FAQPage 结构化数据（SEO）。
 * 每个分类下包含一组"问题/答案"对。
 */
export const FAQS = [
  {
    /** 分类标题 */
    category: "Capabilities & Certification",
    items: [
      {
        question: "How do you prove your factory's strength?",
        answer:
          "We have 20 years of experience, an in-house R&D team, and hold certifications like ISO 9001, CE, RoHS, FCC, Sedex. We serve as a long-term manufacturing partner for brands like Minolta, Rollei and Kenko.",
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
 * 关于我们页面的全部内容，涵盖 hero 区域、公司故事、
 * 历史时间线、核心价值观、认证资质与研发亮点。
 */
export const ABOUT = {
  /** 关于页面 hero/横幅区域 */
  hero: {
    title: "About Songdian Technology",
    subtitle:
      "A leading digital camera OEM/ODM manufacturer with 20 years of expertise. 30+ new products annually, 10 million units annual output, and 500+ registered patents.",
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

  /** 关键经营指标（数字滚动展示，嵌入 Our Story 右侧栏） */
  stats: [
    { value: 40000, prefix: "", suffix: " ㎡", label: "Facility Area", format: true },
    { value: 60, prefix: "", suffix: "+", label: "Countries Served", format: false },
    { value: 10, prefix: "", suffix: "M+", label: "Annual Output", format: false },
    { value: 1000, prefix: "", suffix: "+", label: "Employees", format: true },
    { value: 500, prefix: "", suffix: "+", label: "Patents", format: true },
    { value: 100, prefix: "", suffix: "+", label: "R&D Experts", format: true },
  ],

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
        "We treat every component and every process with meticulous attention to detail. Our engineering team brings 20 years of camera-specific manufacturing expertise to every project.",
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

  /** 资质认证证书图片（图标格栅 + 点击 Lightbox 展示高清大图）
   * 图片统一存放于 public/CertificationsAndComplianceImages/，文件名前缀即证书类型。
   * title 为证书代号，description 为证书全称/适用范围，src 指向 public 下的图片。 */
  certificationImages: [
    { title: "BSCI", description: "Business Social Compliance Initiative", src: "/CertificationsAndComplianceImages/BSCI-sonida.png" },
    { title: "CE", description: "European Conformity", src: "/CertificationsAndComplianceImages/CE-DC312-songdian.png" },
    { title: "CPC", description: "Children's Product Certificate", src: "/CertificationsAndComplianceImages/CPC-DC50X-sonida.png" },
    { title: "EMC", description: "Electromagnetic Compatibility", src: "/CertificationsAndComplianceImages/EMC-sonida.png" },
    { title: "EPA", description: "U.S. Environmental Protection Agency", src: "/CertificationsAndComplianceImages/EPA-sonida.png" },
    { title: "FCC", description: "U.S. Federal Communications Commission", src: "/CertificationsAndComplianceImages/FCC-DC312-songdian.png" },
    { title: "FDA", description: "U.S. Food & Drug Administration", src: "/CertificationsAndComplianceImages/FDA-sonida.png" },
    { title: "ISO 9001", description: "Quality Management System", src: "/CertificationsAndComplianceImages/ISO9001-songdian.png" },
    { title: "MSDS", description: "Material Safety Data Sheet", src: "/CertificationsAndComplianceImages/MSDS-sonida.png" },
    { title: "RoHS", description: "Restriction of Hazardous Substances", src: "/CertificationsAndComplianceImages/RoHS-DC312-songdain.png" },
    { title: "TELEC", description: "Japan Radio Equipment Certification", src: "/CertificationsAndComplianceImages/TELEC-sonida.png" },
    { title: "UKCA", description: "UK Conformity Assessed", src: "/CertificationsAndComplianceImages/UKCA-DC312-songdian.png" },
    { title: "UL", description: "Underwriters Laboratories", src: "/CertificationsAndComplianceImages/UL-HDV301-sonida.png" },
    { title: "UN38.3", description: "Battery Transport Safety", src: "/CertificationsAndComplianceImages/UN38.3-NP60-sonida.png" },
    { title: "WEEE", description: "Waste Electrical & Electronic Equipment", src: "/CertificationsAndComplianceImages/WEEE-sonida.png" },
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
      { label: "Annual Output", value: "10M Units" },
    ],
  },

  /** 制造实力三大板块（并入工厂视频区，作为能力卡片展示）
   * 说明：与现有 Our Story / 右侧数字 / 研发区保持一致口径——
   * 工厂面积采用 40,000㎡、每年新品采用 30+（用户确认以现状为准）；
   * 净新增事实：总投资约 3.5 亿元、线材加工 7+ 年、垂直整合产线。 */
  manufacturing: [
    {
      title: "Mega Factory",
      body: "Our mega factory spans approximately 40,000 m² with a total investment of around 350 million RMB. It integrates product design, R&D, manufacturing, and sales under one roof.",
    },
    {
      title: "Production Capability",
      body: "Leveraging 20 years of manufacturing expertise in 3C digital products and 7+ years in cable processing, we operate a vertically integrated process — in-house R&D, mold development, injection molding, and final assembly — ensuring high efficiency and reliable on-time delivery.",
    },
    {
      title: "Innovation Technology",
      body: "Committed to innovation in digital imaging, we continuously introduce top technical talent and launch 30+ new products annually, with 500+ design patents and product certifications recognized domestically and internationally.",
    },
  ],

  /** 工厂宣传视频区块（About 页，CTA 之前） */
  factory: {
    title: "Take a Look Inside Our Factory",
    caption:
      "Step inside our 40,000 m² manufacturing facility — where over 10 million cameras are precision-built every year.",
  },
} as const;

// ============================================================
// 联系页面文案（Contact）
// ============================================================
// 注：「Send an Inquiry」表单的信任背书条（24h 回复 / 免费报价 / 60+ 国家）
// 与 Lucide 图标组件强耦合，直接定义在 components/form/InquiryForm.tsx 内，
// 不在此集中管理，避免 icon 名称到组件的映射冗余。
