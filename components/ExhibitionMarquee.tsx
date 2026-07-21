"use client";

// components/ExhibitionMarquee.tsx —— 展会横向自动滚动墙 + 点击查看大图
// 鼠标悬停暂停滚动，点击任意展会图片弹出全屏 Lightbox 查看大图。
// 支持键盘 ← → 切换、ESC 关闭，尊重 prefers-reduced-motion。

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Pause, Play, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { Exhibition } from "@/lib/exhibitions";

interface ExhibitionMarqueeProps {
  items: Exhibition[];
}

export default function ExhibitionMarquee({ items }: ExhibitionMarqueeProps) {
  const [paused, setPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = useCallback((i: number) => setLightboxIndex(i), []);
  const close = useCallback(() => setLightboxIndex(null), []);

  // 键盘交互 + 背景滚动锁定
  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((i) => (i === null ? null : (i + 1) % items.length));
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, items.length]);

  if (items.length === 0) return null;

  // 复制一份用于无缝循环
  const loop = [...items, ...items];

  const activeItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <>
      {/* 滚动墙 */}
      <div
        className="group/region relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        role="region"
        aria-label="Exhibitions we attend — click any image to enlarge"
      >
        {/* 暂停 / 播放按钮 */}
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
            {loop.map((item, i) => {
              const realIndex = i % items.length;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => open(realIndex)}
                  aria-label={`View ${item.name} ${item.year} exhibition photo full size`}
                  aria-hidden={i >= items.length}
                  className="w-64 shrink-0 pr-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4343e]"
                >
                  {/* 图片容器 */}
                  <div className="group/fig relative aspect-[4/3] overflow-hidden rounded-xl border border-[#EEEEEE] bg-white">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="256px"
                      className="object-contain p-4 transition-transform duration-300 ease-out group-hover/fig:scale-[1.03]"
                    />

                    {/* 悬停放大提示 */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 opacity-0 transition-all duration-300 group-hover/fig:bg-black/10 group-hover/fig:opacity-100">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#171A20] shadow-md">
                        <ZoomIn className="h-3.5 w-3.5" />
                        View
                      </span>
                    </div>
                  </div>

                  {/* 展会名称 + 年份 */}
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
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox 大图查看 */}
      {activeItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.name} ${activeItem.year} exhibition`}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
        >
          {/* 关闭按钮 */}
          <button
            type="button"
            onClick={close}
            aria-label="关闭"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {/* 图片计数 + 导航 */}
          <div className="absolute left-4 top-4 z-10 text-sm text-white/50">
            {lightboxIndex + 1} / {items.length}
          </div>

          {/* 左右切换按钮 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
            }}
            aria-label="上一张"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:left-6"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i === null ? null : (i + 1) % items.length));
            }}
            aria-label="下一张"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:right-6"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* 大图 */}
          <div className="relative flex h-full w-full items-center justify-center px-16 py-20 sm:px-24">
            <Image
              key={activeItem.src}
              src={activeItem.src}
              alt={activeItem.alt}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-contain p-4 sm:p-8"
              priority
            />
          </div>

          {/* 底部信息条 */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 bg-gradient-to-t from-black/60 to-transparent px-4 py-6">
            <span className="text-base font-semibold text-white">
              {activeItem.name}
            </span>
            {activeItem.year && (
              <span className="text-sm text-white/60">
                {activeItem.year}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
