import React from 'react';
import {
  Users,
  BookOpen,
  Target,
  Heart,
  Smile,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { ClassKPISummary } from '../types';

interface MetricCardsProps {
  summary: ClassKPISummary;
  selectedClass: string;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary, selectedClass }) => {
  const formatChange = (val: number, unit = '') => {
    const isPositive = val >= 0;
    return (
      <div className={`flex items-center text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
        <span>{Math.abs(val)}{unit}</span>
        <span className="text-slate-400 font-normal ml-1">vs. last session</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
      {/* Card 1: Total Students */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-between min-w-0">
        <div className="min-w-0 flex-1 mr-2">
          <span className="text-xs font-semibold text-slate-500 block truncate">Total Students</span>
          <div className="text-2xl font-black text-slate-800 mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
            {summary.totalStudents}
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
            in Class {selectedClass}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Users className="w-6 h-6 stroke-[2.2]" />
        </div>
      </div>

      {/* Card 2: Average Reading Score */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-between min-w-0">
        <div className="min-w-0 flex-1 mr-2">
          <span className="text-xs font-semibold text-slate-500 block truncate">Average Reading Score</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
              {summary.avgReadingScore}
            </span>
            <span className="text-xs font-medium text-slate-400">/ 100</span>
          </div>
          <div className="mt-1 truncate">{formatChange(summary.readingScoreChange)}</div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <BookOpen className="w-6 h-6 stroke-[2.2]" />
        </div>
      </div>

      {/* Card 3: Avg. Task Completion */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-between min-w-0">
        <div className="min-w-0 flex-1 mr-2">
          <span className="text-xs font-semibold text-slate-500 block truncate">Avg. Task Completion</span>
          <div className="text-2xl font-black text-slate-800 mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
            {summary.avgTaskCompletion}%
          </div>
          <div className="mt-1 truncate">{formatChange(summary.taskCompletionChange, '%')}</div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Target className="w-6 h-6 stroke-[2.2]" />
        </div>
      </div>

      {/* Card 4: Avg. Confidence */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-between min-w-0">
        <div className="min-w-0 flex-1 mr-2">
          <span className="text-xs font-semibold text-slate-500 block truncate">Avg. Confidence</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
              {summary.avgConfidence}
            </span>
            <span className="text-xs font-medium text-slate-400">/ 5</span>
          </div>
          <div className="mt-1 truncate">{formatChange(summary.confidenceChange)}</div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
          <Heart className="w-6 h-6 stroke-[2.2]" />
        </div>
      </div>

      {/* Card 5: Avg. Engagement */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-between min-w-0">
        <div className="min-w-0 flex-1 mr-2">
          <span className="text-xs font-semibold text-slate-500 block truncate">Avg. Engagement</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
              {summary.avgEngagement}
            </span>
            <span className="text-xs font-medium text-slate-400">/ 5</span>
          </div>
          <div className="mt-1 truncate">{formatChange(summary.engagementChange)}</div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Smile className="w-6 h-6 stroke-[2.2]" />
        </div>
      </div>
    </div>
  );
};
