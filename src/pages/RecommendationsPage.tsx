import React, { useState, useMemo } from 'react';
import {
  Lightbulb,
  Check,
  Edit3,
  X,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PedagogicalRecommendation, RecommendationStatus } from '../types';

interface RecommendationsPageProps {
  recommendations: PedagogicalRecommendation[];
  onAccept: (recId: string) => void;
  onOpenModify: (rec: PedagogicalRecommendation) => void;
  onOpenReject: (rec: PedagogicalRecommendation) => void;
  selectedClass: string;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  recommendations,
  onAccept,
  onOpenModify,
  onOpenReject,
  selectedClass,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | RecommendationStatus>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [skillFilter, setSkillFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Counters
  const pendingCount = recommendations.filter((r) => r.status === 'Pending').length;
  const acceptedCount = recommendations.filter((r) => r.status === 'Accepted').length;
  const modifiedCount = recommendations.filter((r) => r.status === 'Modified').length;
  const rejectedCount = recommendations.filter((r) => r.status === 'Rejected').length;

  const filtered = useMemo(() => {
    return recommendations.filter((rec) => {
      const classMatch = selectedClass === 'All Classes' || rec.class === selectedClass;
      if (!classMatch) return false;

      if (statusFilter !== 'ALL' && rec.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && rec.priority !== priorityFilter) return false;
      if (skillFilter !== 'ALL' && rec.skillFocus !== skillFilter) return false;

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        if (
          !rec.studentName.toLowerCase().includes(term) &&
          !rec.studentCode.toLowerCase().includes(term) &&
          !rec.detectedIssue.toLowerCase().includes(term)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [recommendations, selectedClass, statusFilter, priorityFilter, skillFilter, searchTerm]);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
            Pedagogical Recommendations &amp; Teacher Agency Queue
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Review, accept, tailor, or reject AI-generated instructional recommendations for Class {selectedClass}
        </p>
      </div>

      {/* Status Metric Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 border-blue-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[11px] font-semibold opacity-80 block">All Recommendations</span>
          <div className="text-2xl font-black mt-1">{recommendations.length}</div>
        </button>

        <button
          onClick={() => setStatusFilter('Pending')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'Pending'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 border-amber-500'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[11px] font-semibold opacity-80 block">Pending Teacher Action</span>
          <div className="text-2xl font-black mt-1">{pendingCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('Accepted')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'Accepted'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 border-emerald-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[11px] font-semibold opacity-80 block">Accepted Plans</span>
          <div className="text-2xl font-black mt-1">{acceptedCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('Modified')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'Modified'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 border-indigo-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[11px] font-semibold opacity-80 block">Teacher Modified</span>
          <div className="text-2xl font-black mt-1">{modifiedCount}</div>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search recommendation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Skill Focuses</option>
            <option value="Vocabulary in Context">Vocabulary in Context</option>
            <option value="Inference">Inference</option>
            <option value="Main Idea">Main Idea</option>
            <option value="Affective & Confidence">Affective &amp; Confidence</option>
            <option value="Engagement">Engagement</option>
          </select>
        </div>

        <span className="text-xs text-slate-400">
          Showing {filtered.length} recommendations
        </span>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rec) => {
          const isAccepted = rec.status === 'Accepted';
          const isModified = rec.status === 'Modified';
          const isRejected = rec.status === 'Rejected';

          return (
            <div
              key={rec.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      {rec.studentName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">{rec.studentName}</h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span>{rec.studentCode}</span>
                        <span>•</span>
                        <span>Class {rec.class}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        rec.priority === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : rec.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rec.priority}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        isAccepted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isModified
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : isRejected
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>
                </div>

                {/* Detected Issue */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                    Focus: {rec.skillFocus}
                  </span>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    {rec.detectedIssue}
                  </p>
                </div>

                {/* Evidence */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600">
                  <strong className="text-slate-700">Data Evidence:</strong> {rec.supportingEvidence}
                </div>

                {/* AI Recommendation */}
                <div className="mt-2.5 p-3 rounded-xl bg-blue-50/50 border border-blue-200/70 text-xs text-slate-700 leading-relaxed">
                  <div className="flex items-center gap-1 font-bold text-blue-800 mb-1 text-[11px]">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>AI Pedagogical Suggestion</span>
                  </div>
                  {rec.aiRecommendation}
                </div>

                {/* Modified Text or Rejection reason if applicable */}
                {isModified && rec.modifiedAction && (
                  <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    <strong className="block mb-0.5">Teacher Adjusted Action:</strong>
                    {rec.modifiedAction}
                    {rec.teacherNote && (
                      <span className="block mt-1 text-[11px] text-emerald-700 italic">
                        Note: {rec.teacherNote}
                      </span>
                    )}
                  </div>
                )}
                {isRejected && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                    <strong>Rejection Rationale:</strong> {rec.rejectionReason}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">Teacher Decision:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onAccept(rec.id)}
                    disabled={isAccepted}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                      isAccepted
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isAccepted ? 'Accepted' : 'Accept'}</span>
                  </button>

                  <button
                    onClick={() => onOpenModify(rec)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Modify</span>
                  </button>

                  <button
                    onClick={() => onOpenReject(rec)}
                    disabled={isRejected}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border flex items-center gap-1 cursor-pointer ${
                      isRejected
                        ? 'bg-rose-50 text-rose-700 border-rose-300 cursor-default'
                        : 'bg-white hover:bg-rose-50 text-rose-600 border-rose-200'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
