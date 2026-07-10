"use client";

/**
 * components/ExhibitionMarquee.tsx —— 参展展会横向自动滚动墙
 * ------------------------------------------------------------------
 * - 图片由父级（首页 Server Component）从 public/Exhibitions 动态传入，
 *   本组件只负责「滚动 + 悬停暂停 + 名称/年份展示」。
 * - 无缝循环：将列表复制一份，整体 translateX(-50%) 恰好移动一个副本宽度。
 *   每个卡片用 pr-6 自带右内边距代替 flex gap，保证 -50% 后严丝合缝。
 * - 悬停暂停：鼠标移入区域即暂停（符合需求），并提供显式暂停/播放按钮，
 *   兼顾触屏与无障碍（aria-pressed / aria-label）。
 * - 尊重 prefers-reduced-motion：在 globals.css 中该动画被关闭，
 *   此时仅静态展示首份副本，内容依然完整可读。
 */

import { useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import type { Exhibition } from "@/lib/exhibitions";

interface ExhibitionMarqueeProps {
  items: Exhibition[];
}

export default function ExhibitionMarquee({ items }: ExhibitionMarqueeProps) {
  const [paused, setPaused] = useState(false);

  if (items.length === 0) return null;

  // 复制一份，用于无缝循环
  const loop = [...items, ...items];

  return (
    <div
      className="group/region relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Exhibitions we attend, auto-scrolling logo wall"
    >
      {/* 暂停 / 播放 控制按钮（触屏与无障碍） */}
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Resume auto-scroll" : "Pause auto-scroll"}
        aria-pressed={paused}
        className="absolute -top-12 right-0 z-20 inline-flex h-9 w-9 items-center justify-center rounded border border-[#EEEEEE] bg-white text-[#393C41] transition-colors hover:text-[#d4343e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4343e]"
      >
        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </button>

      <div className="overflow-hidden">
        <div
          className="flex w-max animate-marquee"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {loop.map((item, i) => (
            <figure
              key={i}
              className="group/fig w-64 shrink-0 pr-6"
              // 第二份副本仅用于视觉循环，对屏幕阅读器隐藏，避免重复朗读
              aria-hidden={i >= items.length}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#EEEEEE] bg-white">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="256px"
                  className="object-contain p-4 transition-transform duration-300 ease-out group-hover/fig:scale-[1.03]"
                />
              </div>
              <figcaption className="mt-3 text-center">
                <p
                  className="truncate text-sm font-semibold text-[#171A20]"
                  title={item.name}
                >
                  {item.name}
                </p>
                {item.year && (
                  <p
                    className="mt-0.5 text-xs font-medium"
                    style={{ color: "#d4343e" }}
                  >
                    {item.year}
                  </p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
