"use client";

// 客户端组件：缩略图点击切换右侧大图
import { useState } from "react";
import Image from "next/image";

/**
 * ProductGallery — 产品图片 + 竖排缩略图相册
 * ------------------------------------------------------------------
 * 左侧竖排缩略图（产品图 + 3 张相册），右侧大图。
 * 点击缩略图切换，选中高亮红框。
 */
interface ProductGalleryProps {
  /** 产品主图 */
  mainImage: string;
  /** 主图 alt */
  mainAlt: string;
  /** 相册图片（不含主图） */
  gallery: { id: number; src: string; alt?: string }[];
  /** 分类标签 */
  category?: string;
}

export default function ProductGallery({
  mainImage,
  mainAlt,
  gallery,
  category,
}: ProductGalleryProps) {
  // 当前展示的大图地址，默认取主图
  const [selected, setSelected] = useState(mainImage);

  // 缩略图列表：产品图 + 最多 3 张相册图
  const thumbs = [
    { id: -1, src: mainImage, alt: mainAlt },
    ...gallery.slice(0, 3),
  ];

  return (
    <div className="flex gap-3 md:gap-4">
      {/* 左侧缩略图列 */}
      <div className="flex flex-col gap-2 w-16 md:w-20 shrink-0">
        {thumbs.map((img) => (
          <button
            key={img.id}
            // 点击缩略图切换右侧大图
            onClick={() => setSelected(img.src)}
            className={`relative aspect-square overflow-hidden bg-gray-50 border-2 transition-colors cursor-pointer ${
              selected === img.src
                ? "border-[#d4343e]"
                : "border-[#EEEEEE] hover:border-gray-400"
            }`}
            style={{ borderRadius: "8px" }}
          >
            <Image
              src={img.src}
              alt={img.alt || mainAlt}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* 右侧大图 */}
      <div className="flex-1">
        <div
          className="relative aspect-square overflow-hidden bg-gray-50 border border-[#EEEEEE]"
          style={{ borderRadius: "12px" }}
        >
          <Image
            src={selected}
            alt={mainAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
