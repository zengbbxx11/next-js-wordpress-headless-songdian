"use client";

/**
 * HorizontalTimeline — 横向时间轴
 * ------------------------------------------------------------------
 * 左到右排列，节点+线条连接，hover 展开详情。
 * 移动端自动切换为垂直布局。
 */

interface TimelineItem {
  year: string;
  title: string;
  event: string;
}

interface HorizontalTimelineProps {
  items: readonly TimelineItem[];
}

export default function HorizontalTimeline({ items }: HorizontalTimelineProps) {
  return (
    <div className="relative">
      {/* 桌面端：横向 */}
      <div className="hidden md:block">
        <div className="flex items-start">
          {items.map((item, i) => (
            <div key={item.year} className="flex items-start flex-1 min-w-0 group">
              {/* 节点 + 线条 */}
              <div className="flex-1 flex flex-col items-center relative px-1">
                {/* 线条 — 连接前后节点 */}
                {i < items.length - 1 && (
                  <div
                    className="absolute top-5 left-[calc(50%+12px)] right-0 h-[2px]"
                    style={{
                      width: "calc(100% - 24px)",
                      backgroundColor: "#D0D1D2",
                    }}
                  />
                )}

                {/* 节点圆圈 */}
                <div
                  className="relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 mb-4 border-2 border-[#d4343e] bg-white group-hover:bg-[#d4343e] group-hover:border-[#d4343e] transition-colors z-10"
                  style={{ transitionDuration: "0.3s" }}
                >
                  <span
                    className="text-[10px] font-bold text-[#d4343e] group-hover:text-white transition-colors"
                    style={{ transitionDuration: "0.3s" }}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* 年份 */}
                <p
                  className="text-xs font-bold mb-2 transition-colors"
                  style={{ color: "#d4343e", transitionDuration: "0.3s" }}
                >
                  {item.year}
                </p>

                {/* 标题 */}
                <p
                  className="text-sm font-semibold text-center leading-snug mb-1.5 transition-colors"
                  style={{ color: "#171A20", transitionDuration: "0.3s" }}
                >
                  {item.title}
                </p>

                {/* 详情 */}
                <p
                  className="text-xs text-center leading-relaxed px-1 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ color: "#5C5E62", transitionDuration: "0.3s" }}
                >
                  {item.event}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 移动端：纵向 */}
      <div className="md:hidden relative pl-10 space-y-8">
        {/* 竖线 */}
        <div
          className="absolute left-[19px] top-3 bottom-3 w-[2px]"
          style={{ backgroundColor: "#D0D1D2" }}
        />

        {items.map((item, i) => (
          <div key={item.year} className="relative">
            {/* 节点圆圈 */}
            <div
              className="absolute -left-10 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white z-10"
              style={{ borderColor: "#d4343e", transitionDuration: "0.3s" }}
            >
              <span
                className="text-[10px] font-bold"
                style={{ color: "#d4343e" }}
              >
                {i + 1}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold mb-1" style={{ color: "#d4343e" }}>
                {item.year}
              </p>
              <p className="text-sm font-semibold mb-1.5" style={{ color: "#171A20" }}>
                {item.title}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#5C5E62" }}>
                {item.event}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
