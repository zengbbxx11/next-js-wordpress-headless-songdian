"use client";

import { useEffect, useRef, useState } from "react";

/**
 * AnimatedCounter — 数字滚动动画组件
 * ------------------------------------------------------------------
 * 进入视口后从 0 滚动到目标数字，带 ease-out 缓动。
 */

interface CounterProps {
  /** 目标数字（不带格式，如 40000） */
  target: number;
  /** 显示格式：前缀 + 数字 + 后缀 */
  prefix?: string;
  suffix?: string;
  /** 数字格式化（true = 千分位逗号） */
  format?: boolean;
}

function AnimatedCounter({ target, prefix = "", suffix = "", format = false }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(target * eased));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  const formatted = format
    ? count.toLocaleString("en-US")
    : count.toString();

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold tracking-tight tabular-nums">
      <span style={{ color: "#171A20" }}>
        {prefix}{formatted}{suffix}
      </span>
    </div>
  );
}

// ================================================================
// 表格盘数据
// ================================================================

const STATS = [
  { value: 40000, prefix: "", suffix: " ㎡", label: "Area", format: true },
  { value: 60, prefix: "", suffix: "+", label: "Sold in 60+ countries", format: false },
  { value: 10, prefix: "", suffix: "M+", label: "Units", format: false },
  { value: 1000, prefix: "", suffix: "+", label: "Employees", format: true },
  { value: 500, prefix: "", suffix: "+", label: "Patents", format: true },
  { value: 100, prefix: "", suffix: "+", label: "R&D Staffs", format: true },
];

// ================================================================
// StatsDashboard — 数据表盘区域
// ================================================================

export default function StatsDashboard() {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#EEEEEE] overflow-hidden" style={{ borderRadius: "16px" }}>
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="relative bg-white p-6 md:p-8 flex flex-col items-center justify-center text-center group transition-colors hover:bg-gray-50"
              style={{ transitionDuration: "0.3s" }}
            >
              {/* 数字 */}
              <AnimatedCounter
                target={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                format={stat.format}
              />

              {/* 标签 */}
              <p
                className="text-xs md:text-sm mt-2 font-medium uppercase tracking-wide"
                style={{ color: "#5C5E62" }}
              >
                {stat.label}
              </p>

              {/* 分隔线 — 非首行顶部 */}
              {i >= 3 && (
                <div className="absolute top-0 left-4 right-4 h-px bg-[#EEEEEE] md:hidden" />
              )}

              {/* 竖分隔线 — 非首列 */}
              {i % 2 !== 0 && (
                <div className="absolute left-0 top-4 bottom-4 w-px bg-[#EEEEEE] md:hidden" />
              )}
              {i % 3 !== 0 && (
                <div className="absolute left-0 top-4 bottom-4 w-px bg-[#EEEEEE] hidden md:block" />
              )}

              {/* 横分隔线 — 非首行 */}
              {i >= 3 && (
                <div className="absolute top-0 left-4 right-4 h-px bg-[#EEEEEE] hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
