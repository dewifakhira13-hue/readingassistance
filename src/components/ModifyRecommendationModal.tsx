import React, { useState } from 'react';
import { X, Edit3, CheckCircle, Lightbulb } from 'lucide-react';
import { PedagogicalRecommendation } from '../types';

interface ModifyRecommendationModalProps {
  recommendation: PedagogicalRecommendation | null;
  onClose: () => void;
  onSaveModification: (recId: string, modifiedText: string, note: string) => void;
}

export const ModifyRecommendationModal: React.FC<ModifyRecommendationModalProps> = ({
  recommendation,
  onClose,
  onSaveModification,
}) => {
  if (!recommendation) return null;

  const [modifiedText, setModifiedText] = useState(
    recommendation.modifiedAction || recommendation.aiRecommendation
  );
  const [teacherNote, setTeacherNote] = useState(recommendation.teacherNote || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveModification(recommendation.id, modifiedText, teacherNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 rounded-xl">
              <Edit3 className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-base font-['Plus_Jakarta_Sans',sans-serif]">
                Modify Pedagogical Recommendation
              </h3>
              <p className="text-xs text-blue-200 font-medium">
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
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span className="font-semibold text-slate-500 block mb-1">
              Original AI Recommendation:
            </span>
            <p className="text-slate-700 italic">{recommendation.aiRecommendation}</p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Teacher Modified Action Plan:
            </label>
            <textarea
              rows={4}
              value={modifiedText}
              onChange={(e) => setModifiedText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-normal"
              placeholder="Enter your tailored instructional modification..."
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Reflect your contextual knowledge of the classroom, student background, or upcoming curriculum unit.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Pedagogical Rationale / Teacher Note (Optional):
            </label>
            <input
              type="text"
              value={teacherNote}
              onChange={(e) => setTeacherNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Adjusted to align with next week's collaborative science text"
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
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm shadow-blue-600/30"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save &amp; Accept Modified Plan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
