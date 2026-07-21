"use client";

/*
 * 文件：components/VRShowroom.tsx（360° VR 虚拟展厅）
 * 职责：响应式网格展示 VR 场景缩略图，点击进入全屏 360° 查看器。
 *       查看器内支持鼠标拖拽 / 触摸滑动 / 滚轮缩放、场景切换、ESC 关闭、键盘 ← → 切换。
 * 渲染方式：客户端组件（依赖 PointerEvent、键盘事件、动态状态）。
 * 360 投影方式：等距柱状投影（equirectangular）。通过 background-image + background-repeat
 *              + background-position 实现水平方向无缝循环（wraparound）。
 *
 * 注意：避免在 JSDoc 风格注释（/** ... *\/）里写中文。
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, Move, X, ChevronLeft, ChevronRight, Maximize2, Minimize2, RotateCw } from "lucide-react";

export interface VRScene {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  src: string;
}

interface VRShowroomProps {
  scenes: readonly VRScene[];
}

export default function VRShowroom({ scenes }: VRShowroomProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const close = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i === null ? i : (i + 1) % scenes.length));
      } else if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (i === null ? i : (i - 1 + scenes.length) % scenes.length));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, scenes.length]);

  const active = activeIndex !== null ? scenes[activeIndex] : null;

  return (
    <>
      {/* 响应式网格：3 列桌面 / 2 列平板 / 1 列手机 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {scenes.map((scene, i) => (
          <button
            key={scene.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={`进入 ${scene.title} 360° 场景`}
            className="group relative overflow-hidden border border-[#EEEEEE] bg-white text-left transition-all hover:border-[#d4343e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4343e]"
            style={{
              aspectRatio: "21 / 9",
              borderRadius: "6px",
              transitionDuration: "0.33s",
            }}
          >
            {/* 全景缩略图 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={scene.src}
              alt={scene.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
              draggable={false}
            />

            {/* 渐变暗化层 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

            {/* 360° badge */}
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              <RotateCw className="h-3 w-3" />
              360°
            </span>

            {/* 悬停遮罩 + Enter 按钮 */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-[#171A20] shadow-xl transition-transform duration-300 group-hover:scale-105">
                <Eye className="h-4 w-4" />
                Enter
              </span>
            </div>

            {/* 场景名 + 副标题 — 左下角 */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-sm font-semibold text-white drop-shadow-md sm:text-base">
                {scene.title}
              </div>
              {scene.subtitle && (
                <div className="mt-0.5 text-[11px] font-medium text-white/75 sm:text-xs">
                  {scene.subtitle}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* 全屏 360° 查看器 */}
      {active && activeIndex !== null && (
        <VRViewerModal
          key={activeIndex}
          scenes={scenes}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          close={close}
        />
      )}
    </>
  );
}

// =============================================================================
// VRViewerModal — 全屏 360° 查看器
// =============================================================================

interface VRViewerModalProps {
  scenes: readonly VRScene[];
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  close: () => void;
}

function VRViewerModal({ scenes, activeIndex, setActiveIndex, close }: VRViewerModalProps) {
  const scene = scenes[activeIndex];
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [bgScaleX, setBgScaleX] = useState(3);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const centeredRef = useRef(false);
  const dragRef = useRef<{
    startClientX: number;
    startClientY: number;
    startOffsetX: number;
    startOffsetY: number;
  } | null>(null);

  // 初始居中：等距柱状投影全景图中部对准视口中心
  // bgScaleX=3 时背景宽 300%，中心偏移 = -容器宽度
  useEffect(() => {
    if (centeredRef.current || !containerRef.current) return;
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    if (w > 0) {
      setOffsetX(-w);
      setOffsetY(-h * 1.10);
      centeredRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragRef.current = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startOffsetX: offsetX,
      startOffsetY: offsetY,
    };
    setIsDragging(true);
    setHasInteracted(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startClientX;
    const dy = e.clientY - dragRef.current.startClientY;
    setOffsetX(dragRef.current.startOffsetX + dx);
    setOffsetY(dragRef.current.startOffsetY + dy);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // releasePointerCapture 可能已释放
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setBgScaleX((prev) => {
      const next = prev * (e.deltaY < 0 ? 1.1 : 0.9);
      return Math.min(6, Math.max(1.5, next));
    });
    setHasInteracted(true);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const bgStyle: React.CSSProperties = {
    backgroundImage: `url(${scene.src})`,
    backgroundRepeat: "repeat-x",
    backgroundSize: `${bgScaleX * 100}% auto`,
    backgroundPosition: `${offsetX}px ${offsetY}px`,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const goPrev = () =>
    setActiveIndex((i) => (i === null ? i : (i - 1 + scenes.length) % scenes.length));
  const goNext = () =>
    setActiveIndex((i) => (i === null ? i : (i + 1) % scenes.length));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${scene.title} 360° virtual tour`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="fixed inset-0 z-50 flex flex-col bg-black"
    >
      {/* 顶部工具条 */}
      <div className="flex shrink-0 items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">
            <RotateCw className="h-3 w-3" />
            360°
          </span>
          <span className="text-sm font-medium text-white truncate">
            {scene.title}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <span className="text-xs text-white/40 mr-1 hidden sm:inline">
            {activeIndex + 1}/{scenes.length}
          </span>
          <button
            type="button"
            onClick={goPrev}
            aria-label="上一个场景"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="下一个场景"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "退出全屏" : "进入全屏"}
            className="hidden h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white sm:flex"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={close}
            aria-label="关闭"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 中央 360° 查看区 */}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
          style={bgStyle}
          className="absolute inset-0 select-none touch-none"
          role="img"
          aria-label={`${scene.title} 360° panorama — drag to look around`}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-6 w-6 rounded-full border-2 border-white/60" />
            <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />
          </div>
        </div>

        {!hasInteracted && (
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/70 backdrop-blur-sm">
              <Move className="h-3.5 w-3.5" />
              Drag to look around · Scroll to zoom
            </div>
          </div>
        )}
      </div>

      {/* 底部场景缩略图条 */}
      <div className="shrink-0 border-t border-white/10 bg-black/30 px-3 py-2.5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg gap-2 overflow-x-auto">
          {scenes.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`切换到 ${s.title}`}
              className={
                "group relative shrink-0 overflow-hidden rounded transition-all " +
                (i === activeIndex
                  ? "ring-1 ring-white/60 opacity-100"
                  : "opacity-50 hover:opacity-80")
              }
            >
              <div className="h-10 w-16 sm:h-12 sm:w-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0.5 left-1 right-1 truncate text-[10px] text-white/90">
                  {s.title}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
