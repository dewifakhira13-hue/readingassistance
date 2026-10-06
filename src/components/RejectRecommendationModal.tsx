import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PedagogicalRecommendation } from '../types';

interface RejectRecommendationModalProps {
  recommendation: PedagogicalRecommendation | null;
  onClose: () => void;
  onSaveRejection: (recId: string, reason: string) => void;
}

export const RejectRecommendationModal: React.FC<RejectRecommendationModalProps> = ({
  recommendation,
  onClose,
  onSaveRejection,
}) => {
  if (!recommendation) return null;

  const [selectedReason, setSelectedReason] = useState(
    'Student has already demonstrated mastery in alternative classroom assessments.'
  );
  const [customNote, setCustomNote] = useState('');

  const standardReasons = [
    'Student has already demonstrated mastery in alternative classroom assessments.',
    'Affective response is temporary due to external, non-instructional factors.',
    'Alternative differentiated instruction has already been scheduled.',
    'Curriculum pacing requires priority on narrative comprehension this term.',
    'Other pedagogical judgment (specify below)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason =
      selectedReason === 'Other pedagogical judgment (specify below)'
        ? customNote || 'Teacher pedagogical override'
        : selectedReason + (customNote ? ` (${customNote})` : '');
    onSaveRejection(recommendation.id, finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 to-red-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <h3 className="font-bold text-base font-['Plus_Jakarta_Sans',sans-serif]">
                Reject Recommendation (Teacher Agency)
              </h3>
              <p className="text-xs text-rose-200 font-medium">
                Student: {recommendation.studentName} ({recommendation.studentCode})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-left">
          <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200/80 text-rose-900 leading-relaxed">
            This dashboard is a teacher decision-support tool. The teacher always retains ultimate pedagogical authority to reject AI suggestions based on classroom intuition.
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-2">
              Select Primary Pedagogical Rationale:
            </label>
            <div className="space-y-2">
              {standardReasons.map((r, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    selectedReason === r
                      ? 'bg-rose-50/80 border-rose-300 text-rose-950 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejection_reason"
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="leading-snug">{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Additional Teacher Notes (Optional):
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="e.g. Discussed with student during individual conference"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 shadow-sm shadow-rose-600/30"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm Rejection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
