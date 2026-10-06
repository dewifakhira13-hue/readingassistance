import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Lightbulb,
  Check,
  Edit3,
  TrendingUp,
  Brain,
  ShieldAlert,
  Award,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { StudentAggregate, AIInsight, PedagogicalRecommendation } from '../types';

interface StudentModalProps {
  student: StudentAggregate | null;
  insight: AIInsight | null;
  recommendation: PedagogicalRecommendation | null;
  onClose: () => void;
  onAccept: (recId: string) => void;
  onOpenModify: (rec: PedagogicalRecommendation) => void;
  onOpenReject: (rec: PedagogicalRecommendation) => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  student,
  insight,
  recommendation,
  onClose,
  onAccept,
  onOpenModify,
  onOpenReject,
}) => {
  if (!student) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'affective'>('overview');

  const rec = recommendation;
  const isAccepted = rec?.status === 'Accepted';
  const isModified = rec?.status === 'Modified';
  const isRejected = rec?.status === 'Rejected';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header Profile Bar */}
        <div className="bg-gradient-to-r from-[#0d1e38] to-[#1c335e] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
              {student.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                  {student.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  {student.code}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    student.overallLevel === 'Excellent'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : student.overallLevel === 'Good'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                      : student.overallLevel === 'Fair'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                  }`}
                >
                  {student.overallLevel}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-300 font-medium">
                <span>Class: {student.class}</span>
                <span>Gender: {student.gender}</span>
                <span>Attendance: {student.sessions.length ? '95%' : 'N/A'}</span>
                <span>Growth: {student.scoreGrowth >= 0 ? `+${student.scoreGrowth}` : student.scoreGrowth} pts</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 border-t border-white/10 pt-3 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Academic Overview &amp; AI
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'sessions'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Session 1–5 History ({student.sessions.length})
            </button>
            <button
              onClick={() => setActiveTab('affective')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'affective'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Affective Filter &amp; Engagement
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* 4 Skill Cards */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Reading Subskill Averages
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80">
                    <span className="text-[11px] font-semibold text-blue-700">Main Idea</span>
                    <div className="text-xl font-extrabold text-blue-900 mt-1">
                      {student.avgMainIdea}%
                    </div>
                    <div className="w-full bg-blue-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, student.avgMainIdea)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                    <span className="text-[11px] font-semibold text-emerald-700">Specific Info</span>
                    <div className="text-xl font-extrabold text-emerald-900 mt-1">
                      {student.avgSpecificInfo}%
                    </div>
                    <div className="w-full bg-emerald-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, student.avgSpecificInfo)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                    <span className="text-[11px] font-semibold text-amber-700">Inference</span>
                    <div className="text-xl font-extrabold text-amber-900 mt-1">
                      {student.avgInference}%
                    </div>
                    <div className="w-full bg-amber-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, student.avgInference)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80">
                    <span className="text-[11px] font-semibold text-purple-700">Vocabulary in Context</span>
                    <div className="text-xl font-extrabold text-purple-900 mt-1">
                      {student.avgVocabulary}%
                    </div>
                    <div className="w-full bg-purple-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, student.avgVocabulary)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvement Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Identified Strengths</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                    {insight?.strengths.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-2">
                    <Brain className="w-4 h-4 text-amber-600" />
                    <span>Areas for Scaffolded Support</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                    {insight?.areasForImprovement.map((ar, i) => (
                      <li key={i}>{ar}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Insight Box */}
              {insight && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-800 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>AI Learning Analytics Insight</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {insight.summary}
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-blue-200/60 text-[11px] text-blue-700 font-medium">
                    Evidence Base: {insight.evidence.join(' • ')}
                  </div>
                </div>
              )}

              {/* Pedagogical Recommendation & Teacher Agency */}
              {rec && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Pedagogical Recommendation</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      Priority: {rec.priority}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {rec.aiRecommendation}
                  </p>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                      Suggested Classroom Interventions:
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                      {rec.suggestedActions.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Decision Controls */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      Teacher Decision:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAccept(rec.id)}
                        disabled={isAccepted}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                          isAccepted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 inline mr-1" />
                        {isAccepted ? 'Accepted' : 'Accept'}
                      </button>
                      <button
                        onClick={() => onOpenModify(rec)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 inline mr-1" />
                        Modify
                      </button>
                      <button
                        onClick={() => onOpenReject(rec)}
                        disabled={isRejected}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                          isRejected
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : 'bg-white hover:bg-rose-50 text-rose-600 border-rose-200'
                        }`}
                      >
                        <X className="w-3.5 h-3.5 inline mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Instructional Progression across 5 Sessions
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-3">Session</th>
                      <th className="py-2.5 px-3">Text Title &amp; Genre</th>
                      <th className="py-2.5 px-2">Level</th>
                      <th className="py-2.5 px-3">Reading Score</th>
                      <th className="py-2.5 px-2">Main Idea</th>
                      <th className="py-2.5 px-2">Specific Info</th>
                      <th className="py-2.5 px-2">Inference</th>
                      <th className="py-2.5 px-2">Vocabulary</th>
                      <th className="py-2.5 px-2">Completion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {student.sessions.map((s) => (
                      <tr key={s.Session} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          Session {s.Session}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-800">
                            {s.Reading_Text_ID}
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {s.Text_Type}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 font-mono text-[11px] text-slate-600">
                          {s.Text_Level}
                        </td>
                        <td className="py-2.5 px-3 font-extrabold text-blue-700">
                          {s.Reading_Score.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-2 text-slate-600">
                          {s.Main_Idea_Score.toFixed(0)}%
                        </td>
                        <td className="py-2.5 px-2 text-slate-600">
                          {s.Specific_Information_Score.toFixed(0)}%
                        </td>
                        <td className="py-2.5 px-2 text-slate-600">
                          {s.Inference_Score.toFixed(0)}%
                        </td>
                        <td className="py-2.5 px-2 text-slate-600">
                          {s.Vocabulary_Context_Score.toFixed(0)}%
                        </td>
                        <td className="py-2.5 px-2 font-semibold text-emerald-600">
                          {s.Task_Completion_Percent}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'affective' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 mb-1.5">
                  <ShieldAlert className="w-4 h-4 text-indigo-600" />
                  <span>Krashen Affective Filter Appraisal</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {insight?.affectiveAssessment}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <span className="text-xs font-bold text-slate-500">Average Engagement</span>
                  <div className="text-2xl font-black text-blue-600 mt-1">
                    {student.avgEngagement} / 5
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Calculated from student interaction latencies &amp; active participation
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <span className="text-xs font-bold text-slate-500">Average Confidence</span>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    {student.avgConfidence} / 5
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Self-reported subjective readiness for reading tasks
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <span className="text-xs font-bold text-slate-500">Reading Anxiety</span>
                  <div className="text-2xl font-black text-amber-600 mt-1">
                    {student.avgAnxiety} / 5
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Lower values indicate lower affective filtering and stress
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Student record: {student.studentId} • SMP Negeri 1</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
