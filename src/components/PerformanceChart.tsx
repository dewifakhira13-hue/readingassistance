import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { SessionAverage } from '../types';

interface PerformanceChartProps {
  sessionAverages: SessionAverage[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ sessionAverages }) => {
  const [hoveredSession, setHoveredSession] = useState<SessionAverage | null>(null);

  // SVG Chart Geometry
  const width = 480;
  const height = 220;
  const paddingLeft = 40;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const yTicks = [0, 20, 40, 60, 80, 100];

  const series = [
    { key: 'mainIdea' as const, label: 'Main Idea', color: '#2563eb' },
    { key: 'specificInfo' as const, label: 'Specific Information', color: '#10b981' },
    { key: 'inference' as const, label: 'Inference', color: '#f59e0b' },
    { key: 'vocabulary' as const, label: 'Vocabulary in Context', color: '#8b5cf6' },
  ];

  const sessionCount = sessionAverages.length || 5;
  const groupWidth = chartWidth / sessionCount;
  const barGap = 2;
  const barWidth = Math.max(6, Math.min(13, (groupWidth - 20) / 4 - barGap));

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full">
      {/* Header & Legend */}
      <div className="flex flex-col gap-2.5 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Class Performance Overview</h3>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-600 font-medium">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: s.color }} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-[220px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible select-none"
        >
          {/* Y-Axis Label */}
          <text
            x={-height / 2 + 10}
            y={12}
            transform="rotate(-90)"
            textAnchor="middle"
            className="text-[10px] fill-slate-400 font-medium"
          >
            Average Score (%)
          </text>

          {/* Grid lines and Y-axis ticks */}
          {yTicks.map((tick) => {
            const y = paddingTop + chartHeight - (tick / 100) * chartHeight;
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-400 font-medium"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Grouped Bars */}
          {sessionAverages.map((sess, sIdx) => {
            const groupX = paddingLeft + sIdx * groupWidth + (groupWidth - (4 * barWidth + 3 * barGap)) / 2;

            return (
              <g
                key={sess.session}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredSession(sess)}
                onMouseLeave={() => setHoveredSession(null)}
              >
                {/* Invisible hover zone */}
                <rect
                  x={paddingLeft + sIdx * groupWidth}
                  y={paddingTop}
                  width={groupWidth}
                  height={chartHeight}
                  fill="transparent"
                />

                {/* 4 bars */}
                {series.map((ser, bIdx) => {
                  const val = sess[ser.key];
                  const barH = (Math.max(0, Math.min(100, val)) / 100) * chartHeight;
                  const bx = groupX + bIdx * (barWidth + barGap);
                  const by = paddingTop + chartHeight - barH;

                  return (
                    <g key={ser.key}>
                      <rect
                        x={bx}
                        y={by}
                        width={barWidth}
                        height={barH}
                        fill={ser.color}
                        rx="2"
                        className="transition-all duration-200 group-hover:opacity-90"
                      />
                      {/* Sub-label score directly above bar if space permits */}
                      <text
                        x={bx + barWidth / 2}
                        y={by - 3}
                        textAnchor="middle"
                        className="text-[8px] font-bold fill-slate-700 opacity-90 hidden sm:block"
                      >
                        {Math.round(val)}
                      </text>
                    </g>
                  );
                })}

                {/* X-Axis Session Label */}
                <text
                  x={paddingLeft + sIdx * groupWidth + groupWidth / 2}
                  y={paddingTop + chartHeight + 18}
                  textAnchor="middle"
                  className="text-[11px] font-semibold fill-slate-600"
                >
                  {sess.sessionLabel}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredSession && (
          <div className="absolute top-2 right-4 bg-slate-900/90 text-white backdrop-blur-xs px-3 py-2 rounded-xl text-xs shadow-xl pointer-events-none z-10 border border-slate-700">
            <div className="font-bold text-blue-300 border-b border-slate-700 pb-1 mb-1.5">
              Session {hoveredSession.session} Breakdown
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
              <span className="text-blue-400">Main Idea:</span>
              <span className="font-semibold text-right">{hoveredSession.mainIdea}%</span>
              <span className="text-emerald-400">Specific Info:</span>
              <span className="font-semibold text-right">{hoveredSession.specificInfo}%</span>
              <span className="text-amber-400">Inference:</span>
              <span className="font-semibold text-right">{hoveredSession.inference}%</span>
              <span className="text-purple-400">Vocabulary:</span>
              <span className="font-semibold text-right">{hoveredSession.vocabulary}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
