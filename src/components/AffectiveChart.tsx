import React from 'react';
import { Activity } from 'lucide-react';
import { SessionAverage } from '../types';

interface AffectiveChartProps {
  sessionAverages: SessionAverage[];
}

export const AffectiveChart: React.FC<AffectiveChartProps> = ({ sessionAverages }) => {
  const width = 380;
  const height = 220;
  const paddingLeft = 32;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const yMin = 1;
  const yMax = 5;
  const yTicks = [1, 2, 3, 4, 5];

  const getY = (val: number) => {
    const clamped = Math.max(yMin, Math.min(yMax, val));
    return paddingTop + chartHeight - ((clamped - yMin) / (yMax - yMin)) * chartHeight;
  };

  const getX = (index: number) => {
    const count = sessionAverages.length || 5;
    if (count <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (count - 1)) * chartWidth;
  };

  const makePath = (key: 'engagement' | 'confidence' | 'anxiety') => {
    if (!sessionAverages.length) return '';
    return sessionAverages
      .map((s, idx) => {
        const x = getX(idx);
        const y = getY(s[key]);
        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  const engagementPath = makePath('engagement');
  const confidencePath = makePath('confidence');
  const anxietyPath = makePath('anxiety');

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full">
      {/* Header & Legend */}
      <div className="flex flex-col gap-2 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Engagement & Affective Indicators</h3>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#2563eb] rounded-full inline-block" />
            <span>Engagement</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#10b981] rounded-full inline-block" />
            <span>Confidence</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#f59e0b] rounded-full inline-block" />
            <span>Anxiety <span className="text-[10px] text-slate-400 font-normal">(lower is better)</span></span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-[220px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible select-none">
          {/* Grid lines */}
          {yTicks.map((tick) => {
            const y = getY(tick);
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
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-medium"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Polylines */}
          <path
            d={engagementPath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={confidencePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={anxietyPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Values */}
          {sessionAverages.map((s, idx) => {
            const x = getX(idx);
            const yEng = getY(s.engagement);
            const yConf = getY(s.confidence);
            const yAnx = getY(s.anxiety);

            return (
              <g key={s.session}>
                {/* Engagement circle */}
                <circle cx={x} cy={yEng} r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                {/* Confidence circle */}
                <circle cx={x} cy={yConf} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                {/* Anxiety circle */}
                <circle cx={x} cy={yAnx} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />

                {/* Final values labels on the last session for readability */}
                {idx === sessionAverages.length - 1 && (
                  <>
                    <text x={x + 8} y={yEng + 3} className="text-[10px] font-bold fill-[#2563eb]">
                      {s.engagement}
                    </text>
                    <text x={x + 8} y={yConf + 3} className="text-[10px] font-bold fill-[#10b981]">
                      {s.confidence}
                    </text>
                    <text x={x + 8} y={yAnx + 3} className="text-[10px] font-bold fill-[#f59e0b]">
                      {s.anxiety}
                    </text>
                  </>
                )}

                {/* X-axis Session Label */}
                <text
                  x={x}
                  y={paddingTop + chartHeight + 18}
                  textAnchor="middle"
                  className="text-[11px] font-semibold fill-slate-600"
                >
                  {s.sessionLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
