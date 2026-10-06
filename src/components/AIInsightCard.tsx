import React from 'react';
import {
  Sparkles,
  Lightbulb,
  Check,
  Edit3,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { PedagogicalRecommendation, AIInsight } from '../types';

interface AIInsightCardProps {
  currentRecommendation: PedagogicalRecommendation | null;
  insight: AIInsight | null;
  onAccept: (recId: string) => void;
  onOpenModify: (rec: PedagogicalRecommendation) => void;
  onOpenReject: (rec: PedagogicalRecommendation) => void;
  onViewAll: () => void;
  onPrevStudent?: () => void;
  onNextStudent?: () => void;
  studentIndex?: number;
  totalStudents?: number;
  teacherName?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  currentRecommendation,
  insight,
  onAccept,
  onOpenModify,
  onOpenReject,
  onViewAll,
  onPrevStudent,
  onNextStudent,
  studentIndex = 1,
  totalStudents = 30,
  teacherName = 'Ms. Dewi',
}) => {
  if (!currentRecommendation || !insight) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div className="text-center py-8 text-slate-400 text-xs">
          Select a student to inspect AI insights and pedagogical recommendations.
        </div>
      </div>
    );
  }

  const rec = currentRecommendation;
  const isAccepted = rec.status === 'Accepted';
  const isModified = rec.status === 'Modified';
  const isRejected = rec.status === 'Rejected';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              AI Insights &amp; Recommendations
            </h3>
          </div>
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Student Highlight with navigation controls */}
        <div className="flex items-center justify-between py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {rec.studentName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-800">
                  {rec.studentName}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  ({rec.studentCode})
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Focus: {rec.skillFocus}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                insight.level === 'Excellent'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : insight.level === 'Good'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : insight.level === 'Fair'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {insight.level}
            </span>

            {/* Stepper buttons */}
            {onPrevStudent && onNextStudent && (
              <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                <button
                  onClick={onPrevStudent}
                  className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                  title="Previous student"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] text-slate-400 font-medium">
                  {studentIndex}/{totalStudents}
                </span>
                <button
                  onClick={onNextStudent}
                  className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                  title="Next student"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70 mb-3 text-left">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>AI Insight</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-normal">
            {rec.aiRecommendation || insight.summary}
          </p>
        </div>

        {/* Suggested Actions Section */}
        <div className="bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-200/60 mb-4 text-left">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Suggested Actions</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside leading-relaxed">
            {rec.suggestedActions.map((action, idx) => (
              <li key={idx} className="pl-1">
                <span className="font-normal">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Status notice if already decided */}
        {isAccepted && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-emerald-100/70 border border-emerald-300 text-xs font-medium text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Recommendation accepted by {teacherName}</span>
          </div>
        )}
        {isModified && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-blue-100/70 border border-blue-300 text-xs font-medium text-blue-800 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-blue-600" />
            <span>Modified by Teacher: &ldquo;{rec.modifiedAction || rec.teacherNote}&rdquo;</span>
          </div>
        )}
        {isRejected && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-rose-100/70 border border-rose-300 text-xs font-medium text-rose-800 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>Rejected: {rec.rejectionReason || 'Pedagogical override applied'}</span>
          </div>
        )}
      </div>

      {/* Teacher Agency Actions */}
      <div>
        <div className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mb-2">
          Teacher Decision Support (Agency)
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onAccept(rec.id)}
            disabled={isAccepted}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
              isAccepted
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-95'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isAccepted ? 'Accepted' : 'Accept'}</span>
          </button>

          <button
            onClick={() => onOpenModify(rec)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
              isModified
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 active:scale-95'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modify</span>
          </button>

          <button
            onClick={() => onOpenReject(rec)}
            disabled={isRejected}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
              isRejected
                ? 'bg-rose-50 text-rose-700 border-rose-300 cursor-default'
                : 'bg-white hover:bg-rose-50 text-rose-600 border-rose-200 hover:border-rose-300 active:scale-95'
            }`}
          >
            <X className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>
        </div>
      </div>
    </div>
  );
};
