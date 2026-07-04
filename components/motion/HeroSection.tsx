"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { HERO } from "@/lib/content-data";

/**
 * HeroSection — 带 SMT 工厂背景的动画首页 Hero。
 * ------------------------------------------------------------------
 * 处理 Hero 内容动画的客户端组件。
 * 全视口 Hero，以工厂生产线图片为背景，
 * 渐变覆盖层，以及徽章、头条、副标题和 CTA 的错位入场动画。
 *
 * 尊重 `prefers-reduced-motion` — 为偏好减少动画的用户
 * 禁用动画。
 */
export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  // 错位动画属性
  const staggerChildren = prefersReducedMotion ? 0 : 0.12;
  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative overflow-hidden min-h-[85dvh] flex items-center">
      {/* 背景：SMT 生产线横幅图片 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="http://localhost:10004/wp-content/uploads/2026/06/banner.webp"
        alt="Songdian SMT production line — precision camera manufacturing"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />

      {/* 渐变覆盖层：深色左侧 → 透明右侧，保证文本可读性 */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-950/50 to-gray-950/20" />
      {/* 底部微妙的渐变，确保一致的对比度 */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent" />

      {/* Hero 内容 */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 lg:py-40 w-full"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren, delayChildren: 0.1 },
          },
        }}
      >
        <div className="max-w-2xl">
          {/* 行业徽章 */}
          <motion.span
            variants={itemVariants}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block px-4 py-1.5 bg-white/15 text-white/90 text-xs font-medium rounded-full mb-6 tracking-wider uppercase border border-white/20 backdrop-blur-sm"
          >
            {HERO.badge}
          </motion.span>

          {/* 主标题 */}
          <motion.h1
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6"
          >
            {HERO.title}
          </motion.h1>

          {/* 副标题 */}
          <motion.p
            variants={itemVariants}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-gray-300 leading-relaxed max-w-lg mb-10"
          >
            {HERO.subtitle}
          </motion.p>

          {/* CTA 按钮 */}
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href={HERO.cta.primary.href}
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-red-600/20"
            >
              {HERO.cta.primary.label}
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href={HERO.cta.secondary.href}
              className="inline-flex items-center px-6 py-3 border border-white/30 text-white text-sm font-semibold rounded-xl hover:bg-white/10 hover:border-white/40 transition-all duration-200"
            >
              {HERO.cta.secondary.label}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
