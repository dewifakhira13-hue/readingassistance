import React from 'react';
import { PieChart as PieIcon } from 'lucide-react';
import { PerformanceDistribution } from '../types';

interface DistributionChartProps {
  distribution: PerformanceDistribution;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({ distribution }) => {
  const { excellent, good, fair, needsSupport, total } = distribution;

  const data = [
    { label: 'Excellent (85–100)', count: excellent.count, pct: excellent.percentage, color: '#10b981' },
    { label: 'Good (70–84)', count: good.count, pct: good.percentage, color: '#3b82f6' },
    { label: 'Fair (55–69)', count: fair.count, pct: fair.percentage, color: '#f59e0b' },
    { label: 'Needs Support (<55)', count: needsSupport.count, pct: needsSupport.percentage, color: '#ef4444' },
  ];

  // SVG Donut calculations
  const size = 160;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full">
      {/* Title */}
      <div className="flex items-center gap-2 pb-2">
        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
          <PieIcon className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Performance Level Distribution</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
        {/* Donut SVG */}
        <div className="relative w-40 h-40 shrink-0">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90 select-none">
            {/* Background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
            {data.map((item, idx) => {
              if (item.pct <= 0) return null;
              const strokeDasharray = `${(item.pct / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += item.pct;

              return (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 ease-out hover:opacity-90"
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-2xl font-black text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] leading-none">
              {total}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
              Students
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 w-full max-w-[210px] text-xs">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-slate-600">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-[11px] truncate">{item.label}</span>
              </div>
              <span className="font-bold text-[11px] text-slate-800 shrink-0 ml-1">
                {item.count} ({item.pct}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
