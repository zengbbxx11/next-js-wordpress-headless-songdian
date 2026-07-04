/**
 * @fileoverview Complete TypeScript Type Definitions
 *
 * Type declarations for the entire application, organized into logical groups:
 *
 * 1. **WordPress Core Types** — Raw shapes returned by the WP REST API (wp/v2)
 * 2. **WooCommerce Types** — Raw shapes from the WC REST API (wc/v3) and custom plugin fields
 * 3. **Application Types** — Transformed shapes used by the Next.js frontend components
 * 4. **SEO Types** — Structured data, breadcrumbs, and sitemap entry shapes
 *
 * These types serve as the contract between the WordPress backend and the
 * Next.js frontend, ensuring type safety across API calls, page props, and
 * component rendering.
 *
 * @module types
 * @package Songdian Technology — Next.js WordPress Headless B2B Website
 */

// ============================================================
// WordPress Core Types (wp/v2 REST API response shapes)
// ============================================================

/**
 * WordPress rendered content object.
 * Used for `title`, `content`, and other fields that support both raw editing
 * and rendered HTML output.
 */
export interface WPContent {
  /** Rendered HTML string */
  rendered: string;
  /** Whether the content is password-protected */
  protected: boolean;
}

/**
 * WordPress excerpt object.
 * Contains the auto-generated or manually written excerpt for a post/page.
 */
export interface WPExcerpt {
  /** Rendered HTML string (may contain `<p>` tags or be plain text) */
  rendered: string;
  /** Whether the excerpt is from a password-protected post */
  protected: boolean;
}

/**
 * A single WordPress media attachment size variant.
 * Each registered image size produces one {@link MediaSize} entry.
 */
export interface MediaSize {
  /** File name (relative to uploads directory) */
  file: string;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** MIME type (e.g. `image/jpeg`) */
  mime_type: string;
  /** Absolute URL to the sized image */
  source_url: string;
}

/**
 * Collection of all registered image size variants for a media attachment.
 * Includes WordPress core sizes plus any theme/plugin-registered sizes.
 */
export interface MediaSizes {
  /** 150x150 thumbnail (WordPress core) */
  thumbnail?: MediaSize;
  /** Max 300px width (WordPress core) */
  medium?: MediaSize;
  /** Max 768px width (WordPress core) */
  medium_large?: MediaSize;
  /** Max 1024px width (WordPress core) */
  large?: MediaSize;
  /** Full/original size — always present */
  full: MediaSize;
}

/**
 * WordPress media attachment (image, video, document, etc.).
 * Returned via `_embedded['wp:featuredmedia']` when `_embed=true` is set.
 */
export interface WPMedia {
  /** Attachment post ID */
  id: number;
  /** ISO 8601 date string */
  date: string;
  /** URL-friendly slug */
  slug: string;
  /** Rendered title (often the file name) */
  title: WPContent;
  /** Alt text for accessibility */
  alt_text: string;
  /** Image caption (may contain HTML) */
  caption: WPContent;
  /** Longer description field */
  description: WPContent;
  /** General media type (`image`, `video`, etc.) */
  media_type: string;
  /** Specific MIME type */
  mime_type: string;
  /** Absolute URL to the full-size original */
  source_url: string;
  /** Dimension and size variant details (present for images) */
  media_details?: { width: number; height: number; sizes: MediaSizes };
}

/**
 * WordPress post category.
 * Taxonomy: `category` (hierarchical).
 */
export interface WPCategory {
  /** Term ID */
  id: number;
  /** Display name (e.g. "Product News") */
  name: string;
  /** URL-friendly slug */
  slug: string;
  /** Category description */
  description: string;
  /** Number of posts in this category */
  count: number;
}

/**
 * WordPress post tag.
 * Taxonomy: `post_tag` (non-hierarchical).
 */
export interface WPTag {
  /** Term ID */
  id: number;
  /** Display name (e.g. "OEM Manufacturing") */
  name: string;
  /** URL-friendly slug */
  slug: string;
  /** Number of posts with this tag */
  count: number;
}

/**
 * WordPress user (author) profile.
 * Returned via `_embedded.author` when `_embed=true` is set.
 */
export interface WPUser {
  /** User ID */
  id: number;
  /** Display name */
  name: string;
  /** Author archive URL */
  url: string;
  /** Biographical info */
  description: string;
  /** Avatar URLs keyed by size (e.g. `"96": "https://..."`) */
  avatar_urls: Record<string, string>;
}

/**
 * Raw WordPress blog post as returned by the WP REST API.
 * The `_embedded` property is only present when `_embed=true` is added to the request.
 */
export interface WPPost {
  /** Post ID */
  id: number;
  /** ISO 8601 publication date (site timezone) */
  date: string;
  /** ISO 8601 publication date (GMT) */
  date_gmt: string;
  /** ISO 8601 last-modified date (site timezone) */
  modified: string;
  /** ISO 8601 last-modified date (GMT) */
  modified_gmt: string;
  /** URL-safe slug */
  slug: string;
  /** Post status (`publish`, `draft`, etc.) */
  status: string;
  /** Post type (`post`, `page`, `product`, etc.) */
  type: string;
  /** Rendered title */
  title: WPContent;
  /** Rendered body content (HTML) */
  content: WPContent;
  /** Rendered excerpt */
  excerpt: WPExcerpt;
  /** Author user ID */
  author: number;
  /** Featured media attachment ID */
  featured_media: number;
  /** Array of category term IDs */
  categories: number[];
  /** Array of tag term IDs */
  tags: number[];
  /** Embedded related data (present when `_embed=true`) */
  _embedded?: {
    /** Embedded author(s) */
    author?: WPUser[];
    /** Embedded featured image */
    "wp:featuredmedia"?: WPMedia[];
    /** Embedded taxonomy terms (index 0 = categories, index 1 = tags) */
    "wp:term"?: (WPCategory[] | WPTag[])[];
  };
}

/**
 * Raw WordPress page as returned by the WP REST API.
 * Similar to {@link WPPost} but without categories/tags taxonomy fields.
 */
export interface WPPage {
  /** Page ID */
  id: number;
  /** ISO 8601 publication date */
  date: string;
  /** ISO 8601 last-modified date */
  modified: string;
  /** URL-safe slug */
  slug: string;
  /** Page status (`publish`, `draft`, etc.) */
  status: string;
  /** Rendered title */
  title: WPContent;
  /** Rendered body content (HTML) */
  content: WPContent;
  /** Rendered excerpt */
  excerpt: WPExcerpt;
  /** Author user ID */
  author: number;
  /** Featured media attachment ID */
  featured_media: number;
  /** Embedded related data (present when `_embed=true`) */
  _embedded?: {
    /** Embedded author(s) */
    author?: WPUser[];
    /** Embedded featured image */
    "wp:featuredmedia"?: WPMedia[];
  };
}

/**
 * Pagination metadata parsed from WordPress/WooCommerce response headers.
 *
 * Populated from the `X-WP-TotalPages` and `X-WP-Total` HTTP headers
 * that all WP/WC REST API endpoints return.
 */
export interface WPPagination {
  /** Total number of records across all pages */
  total: number;
  /** Total number of pages */
  totalPages: number;
}

// ============================================================
// WooCommerce Types (wc/v3 REST API + custom plugin fields)
// ============================================================

/**
 * WooCommerce product image.
 * Represents a single image in the product's `images` or `gallery` arrays.
 */
export interface WCProductImage {
  /** Image attachment ID */
  id: number;
  /** ISO 8601 creation date */
  date_created: string;
  /** Absolute source URL */
  src: string;
  /** Image name/title */
  name: string;
  /** Alt text for accessibility */
  alt: string;
}

/**
 * WooCommerce product category.
 * Taxonomy: `product_cat` (hierarchical).
 */
export interface WCProductCategory {
  /** Term ID */
  id: number;
  /** Display name (e.g. "Action Cameras") */
  name: string;
  /** URL-friendly slug */
  slug: string;
}

/**
 * WooCommerce product tag.
 * Taxonomy: `product_tag` (non-hierarchical).
 */
export interface WCProductTag {
  /** Term ID */
  id: number;
  /** Display name (e.g. "Waterproof") */
  name: string;
  /** URL-friendly slug */
  slug: string;
}

/**
 * WooCommerce product attribute.
 * Used for specifications like sensor type, resolution, battery capacity, etc.
 */
export interface WCProductAttribute {
  /** Attribute ID */
  id: number;
  /** Display name (e.g. "Sensor") */
  name: string;
  /** Sort position */
  position: number;
  /** Whether visible on the product page */
  visible: boolean;
  /** Whether this attribute is used for variations */
  variation: boolean;
  /** Selected option values */
  options: string[];
}

/**
 * Raw WooCommerce product as returned by the WC REST API (wc/v3).
 * This is a simplified type covering the fields actually consumed by the frontend.
 */
export interface WCProduct {
  /** Product ID */
  id: number;
  /** Product name/title */
  name: string;
  /** URL-safe slug */
  slug: string;
  /** Full permalink on the WordPress site */
  permalink: string;
  /** ISO 8601 creation date */
  date_created: string;
  /** ISO 8601 last-modified date */
  date_modified: string;
  /** Product type */
  type: "simple" | "variable" | "grouped" | "external";
  /** Product status (`publish`, `draft`, etc.) */
  status: string;
  /** Whether the product is marked as featured */
  featured: boolean;
  /** Full HTML description */
  description: string;
  /** Short plain-text excerpt */
  short_description: string;
  /** Stock Keeping Unit */
  sku: string;
  /** Current display price (string to preserve precision) */
  price: string;
  /** Regular (non-sale) price */
  regular_price: string;
  /** Sale price (empty if not on sale) */
  sale_price: string;
  /** Rendered price HTML (e.g. `<del>$199</del> <ins>$149</ins>`) */
  price_html: string;
  /** Whether the product is currently on sale */
  on_sale: boolean;
  /** Whether the product can be purchased */
  purchasable: boolean;
  /** Cumulative sales count */
  total_sales: number;
  /** Whether the product is virtual (no shipping) */
  virtual: boolean;
  /** Whether the product is downloadable */
  downloadable: boolean;
  /** Product images (first = featured, rest = gallery) */
  images: WCProductImage[];
  /** Product categories */
  categories: WCProductCategory[];
  /** Product tags */
  tags: WCProductTag[];
  /** Product attributes/specifications */
  attributes: WCProductAttribute[];
  /** Variation product IDs (for variable products) */
  variations: number[];
  /** Related product IDs */
  related_ids: number[];
  /** Custom meta data fields */
  meta_data: { id: number; key: string; value: unknown }[];
  /** Stock availability status */
  stock_status: "instock" | "outofstock" | "onbackorder";
}

// ============================================================
// Application Types (transformed for Next.js frontend consumption)
// ============================================================

/**
 * Lightweight blog post representation used in list views (blog index, category pages).
 * Contains only the fields needed for post cards/previews.
 */
export interface PostSummary {
  /** Post ID */
  id: number;
  /** URL-safe slug */
  slug: string;
  /** Post title (plain text) */
  title: string;
  /** Short excerpt (HTML stripped) */
  excerpt: string;
  /** Featured image URL (nullable) */
  featuredImage: string | null;
  /** Featured image alt text */
  featuredImageAlt: string;
  /** Formatted publication date (e.g. "March 15, 2025") */
  date: string;
  /** Author display name */
  author: string;
  /** Associated categories */
  categories: { id: number; name: string; slug: string }[];
}

/**
 * Full blog post representation used on single post pages.
 * Includes full HTML content and all metadata needed for the detail view and SEO.
 */
export interface PostDetail {
  /** Post ID */
  id: number;
  /** URL-safe slug */
  slug: string;
  /** Post title (plain text) */
  title: string;
  /** Full body content (raw HTML from WordPress) */
  content: string;
  /** Short excerpt (HTML stripped) */
  excerpt: string;
  /** Featured image URL (nullable) */
  featuredImage: string | null;
  /** Featured image alt text */
  featuredImageAlt: string;
  /** Formatted publication date */
  date: string;
  /** ISO 8601 last-modified date string */
  modified: string;
  /** Author display name */
  author: string;
  /** Author avatar URL (96px) */
  authorAvatar: string;
  /** Associated categories */
  categories: { id: number; name: string; slug: string }[];
  /** Associated tags */
  tags: { id: number; name: string; slug: string }[];
}

/**
 * Full WordPress page representation used on static pages (About, Contact, etc.).
 * Contains HTML content and featured image for rendering.
 */
export interface PageDetail {
  /** Page ID */
  id: number;
  /** URL-safe slug */
  slug: string;
  /** Page title (plain text) */
  title: string;
  /** Full body content (raw HTML from WordPress) */
  content: string;
  /** Short excerpt (HTML stripped) */
  excerpt: string;
  /** Featured image URL (nullable) */
  featuredImage: string | null;
  /** ISO 8601 last-modified date string */
  modified: string;
}

/**
 * Lightweight product representation used in product grid/list views.
 * Contains the fields needed for product cards (image, name, price, etc.).
 */
export interface ProductSummary {
  /** Product ID */
  id: number;
  /** URL-safe slug */
  slug: string;
  /** Product name */
  name: string;
  /** Short description (HTML stripped) */
  shortDescription: string;
  /** Current display price (string for precision) */
  price: string;
  /** Regular (non-sale) price */
  regularPrice: string;
  /** Sale price (empty if not on sale) */
  salePrice: string;
  /** Whether the product is on sale */
  onSale: boolean;
  /** Whether the product is featured */
  featured: boolean;
  /** Primary product image URL (nullable) */
  image: string | null;
  /** Product image alt text */
  imageAlt: string;
  /** Product categories */
  categories: WCProductCategory[];
  /** Product tags */
  tags: WCProductTag[];
  /** Stock availability (`instock`, `outofstock`, etc.) */
  stockStatus: string;
}

/**
 * Full product representation used on single product detail pages.
 * Includes full description HTML, gallery images, attributes, and related products.
 */
export interface ProductDetail {
  /** Product ID */
  id: number;
  /** URL-safe slug */
  slug: string;
  /** Product name */
  name: string;
  /** Full HTML description (from WordPress editor) */
  description: string;
  /** Short plain-text description */
  shortDescription: string;
  /** Current display price */
  price: string;
  /** Regular price */
  regularPrice: string;
  /** Sale price */
  salePrice: string;
  /** Rendered price HTML (e.g. with sale strikethrough) */
  priceHtml: string;
  /** Whether the product is on sale */
  onSale: boolean;
  /** Stock Keeping Unit */
  sku: string;
  /** All product images (featured + gallery combined) */
  images: WCProductImage[];
  /** Gallery images (excluding featured) */
  gallery: WCProductImage[];
  /** Product categories */
  categories: WCProductCategory[];
  /** Product tags */
  tags: WCProductTag[];
  /** Product specifications/attributes */
  attributes: WCAttribute[];
  /** Related product IDs */
  relatedIds: number[];
  /** Stock availability status */
  stockStatus: string;
  /** ISO 8601 last-modified date string */
  dateModified: string;
}

/**
 * Simplified product attribute used in the application layer.
 * Flattened from {@link WCProductAttribute} — each attribute maps to a single
 * name/slug/value tuple rather than containing an options array.
 */
export interface WCAttribute {
  /** Attribute name (e.g. "Sensor") */
  name: string;
  /** URL-safe slug */
  slug: string;
  /** Attribute value (e.g. "1/2.3-inch CMOS") */
  value: string;
}

// ============================================================
// SEO Types
// ============================================================

/**
 * A single breadcrumb item used for UI rendering and Schema.org BreadcrumbList.
 * The last item in a trail typically omits the `href` since it represents the current page.
 */
export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Destination URL (omit for the current page) */
  href?: string;
}

/**
 * Generic Schema.org JSON-LD structured data object.
 * The `@context` and `@type` fields are required; additional properties are
 * added via an index signature to support all Schema.org types.
 */
export interface StructuredData {
  /** JSON-LD context (always `"https://schema.org"`) */
  "@context": string;
  /** Schema.org type (e.g. `"Article"`, `"Product"`, `"BreadcrumbList"`) */
  "@type": string;
  /** Any additional Schema.org properties */
  [key: string]: unknown;
}

// ============================================================
// Sitemap Types
// ============================================================

/**
 * A single entry in the XML sitemap.
 * Follows the sitemaps.org protocol with optional change frequency and priority.
 */
export interface SitemapEntry {
  /** Absolute URL of the page */
  url: string;
  /** Last modification date (ISO string or Date object) */
  lastModified?: string | Date;
  /** How frequently the page is likely to change */
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  /** Priority relative to other URLs on the site (0.0 – 1.0) */
  priority?: number;
}
