import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Shield,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { StudentAggregate, ClassKPISummary } from '../types';
import { generateClassAIAnalysis } from '../services/aiService';

interface AIInsightsPageProps {
  students: StudentAggregate[];
  kpis: ClassKPISummary;
  selectedClass: string;
  onSelectStudent: (studentId: string) => void;
}

export const AIInsightsPage: React.FC<AIInsightsPageProps> = ({
  students,
  kpis,
  selectedClass,
  onSelectStudent,
}) => {
  const analysis = generateClassAIAnalysis(kpis, students, selectedClass);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
            AI Diagnostic Insights &amp; Learning Analytics
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Evidence-based synthesis across Academic, Engagement, and Affective indicators for Class {selectedClass}
        </p>
      </div>

      {/* Primary Executive AI Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Executive Cohort Analysis</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            Generated with Cautious Educational Semantics
          </span>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed font-normal">
          {analysis.summary}
        </p>

        {/* Evidence Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {analysis.evidence.map((ev, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-lg bg-blue-50/70 text-blue-700 border border-blue-200 text-xs font-medium"
            >
              {ev}
            </span>
          ))}
        </div>
      </div>

      {/* Two Column: Strengths vs Areas for Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm pb-3 border-b border-slate-100">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Identified Cohort Strengths</span>
          </div>
          <ul className="mt-3.5 space-y-2.5 text-xs text-slate-700 leading-relaxed">
            {analysis.strengths.map((st, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm pb-3 border-b border-slate-100">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Observed Learning Gaps (Requires Scaffolding)</span>
          </div>
          <ul className="mt-3.5 space-y-2.5 text-xs text-slate-700 leading-relaxed">
            {analysis.areas_for_improvement.map((ar, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{ar}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Students Requiring Pedagogical Attention */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Shield className="w-4 h-4 text-rose-500" />
            <span>Students Suggested for Differentiated Attention</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Based on subskill gaps or elevated reading anxiety
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
          {analysis.students_needing_attention.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                  <span className="text-xs font-semibold text-slate-400">{item.code}</span>
                </div>
                <div className="mt-2 text-xs text-slate-600 space-y-1">
                  <div>
                    Reading Score: <strong>{item.score}%</strong>
                  </div>
                  <div>
                    Key Scaffold Focus: <strong className="text-amber-700">{item.keyArea}</strong>
                  </div>
                  <div>
                    Reported Anxiety: <strong className="text-rose-600">{item.anxiety}/5</strong>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onSelectStudent(item.code.replace('EXP-50', 'Student_'))}
                className="mt-3 py-1.5 px-3 rounded-lg bg-white border border-slate-300 text-blue-600 hover:bg-blue-50 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                <span>Examine Student</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Classroom Roadmap */}
      <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-3">
          <Lightbulb className="w-4 h-4 text-emerald-600" />
          <span>Recommended Next Instructional Steps for Class {selectedClass}</span>
        </div>
        <div className="space-y-2 text-xs text-slate-700">
          {analysis.recommended_actions.map((act, i) => (
            <div key={i} className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-emerald-200/50">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed font-medium">{act}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
