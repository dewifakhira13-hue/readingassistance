import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { StudentAggregate, ClassKPISummary, PedagogicalRecommendation, TeacherProfile } from '../types';
import { exportRecordsToCSV } from '../services/googleSheetsService';
import { RAW_CSV_RECORDS } from '../data/studentData';

interface ReportsPageProps {
  students: StudentAggregate[];
  kpis: ClassKPISummary;
  recommendations: PedagogicalRecommendation[];
  selectedClass: string;
  teacherProfile?: TeacherProfile;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  students,
  kpis,
  recommendations,
  selectedClass,
  teacherProfile = { name: 'Ms. Dewi', school: 'SMP Negeri 1', isAuthenticated: true },
}) => {
  const [reportType, setReportType] = useState<
    'class_perf' | 'student_prog' | 'reading_skill' | 'affective' | 'ai_rec'
  >('class_perf');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('ALL');
  const [selectedSessionFilter, setSelectedSessionFilter] = useState<string>('Session 1–5');

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csv = exportRecordsToCSV(RAW_CSV_RECORDS);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `English_Reading_Report_${reportType}_Class_${selectedClass}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
              Educational Analytics Report Generator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Produce formal academic progress dossiers, subskill diagnostics, and affective reports
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-blue-600/30 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
          Report Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Select Report Type
            </label>
            <select
              value={reportType}
              onChange={(e: any) => setReportType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="class_perf">Class Performance Report</option>
              <option value="student_prog">Student Progress Report</option>
              <option value="reading_skill">Reading Skill Diagnostics</option>
              <option value="affective">Engagement &amp; Affective Report</option>
              <option value="ai_rec">AI Pedagogical Recommendations</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Student Focus
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">Entire Cohort ({students.length} Students)</option>
              {students.map((s) => (
                <option key={s.studentId} value={s.studentId}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Instructional Session
            </label>
            <select
              value={selectedSessionFilter}
              onChange={(e) => setSelectedSessionFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Session 1–5">All Sessions (Session 1–5)</option>
              <option value="Session 5">Session 5 (Latest)</option>
              <option value="Session 4">Session 4</option>
              <option value="Session 3">Session 3</option>
              <option value="Session 2">Session 2</option>
              <option value="Session 1">Session 1</option>
            </select>
          </div>
        </div>
      </div>

      {/* Printable Report Document Preview */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none space-y-6">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-5 flex items-start justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold block">
              {teacherProfile.school} • Academic Year 2026/2027
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] mt-1">
              English Reading Evaluation Report
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Subject: English Reading Comprehension • Target Class: {selectedClass} • Teacher: {teacherProfile.name}
            </p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <span className="block font-bold text-slate-700">Date Generated:</span>
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Executive Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Average Score</span>
            <div className="text-xl font-black text-slate-900">{kpis.avgReadingScore} / 100</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Task Completion</span>
            <div className="text-xl font-black text-slate-900">{kpis.avgTaskCompletion}%</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Confidence</span>
            <div className="text-xl font-black text-slate-900">{kpis.avgConfidence} / 5</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Anxiety Level</span>
            <div className="text-xl font-black text-slate-900">{kpis.avgAnxiety} / 5</div>
          </div>
        </div>

        {/* Dynamic Table Body depending on report type */}
        <div>
          <h4 className="font-bold text-sm text-slate-800 mb-3">
            {reportType === 'class_perf' && 'Class Performance Student Registry'}
            {reportType === 'student_prog' && 'Student Learning Progression Analysis'}
            {reportType === 'reading_skill' && 'Reading Subskill Decomposition (Main Idea, Specific Info, Inference, Vocab)'}
            {reportType === 'affective' && 'Engagement and Krashen Affective Indicators'}
            {reportType === 'ai_rec' && 'AI Pedagogical Recommendations and Teacher Decisions'}
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-2">Class</th>
                  <th className="py-2.5 px-3">Reading Score</th>
                  <th className="py-2.5 px-2">Main Idea</th>
                  <th className="py-2.5 px-2">Specific Info</th>
                  <th className="py-2.5 px-2">Inference</th>
                  <th className="py-2.5 px-2">Vocabulary</th>
                  <th className="py-2.5 px-3">Performance Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students.slice(0, 15).map((s) => (
                  <tr key={s.studentId}>
                    <td className="py-2 px-3 font-mono font-medium text-slate-600">{s.code}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">{s.name}</td>
                    <td className="py-2 px-2 text-slate-500">{s.class}</td>
                    <td className="py-2 px-3 font-bold text-blue-700">{s.avgReadingScore}%</td>
                    <td className="py-2 px-2">{s.avgMainIdea}%</td>
                    <td className="py-2 px-2">{s.avgSpecificInfo}%</td>
                    <td className="py-2 px-2">{s.avgInference}%</td>
                    <td className="py-2 px-2">{s.avgVocabulary}%</td>
                    <td className="py-2 px-3 font-semibold text-slate-700">{s.overallLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Teacher Certification Sign-off */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
          <div>
            <span className="font-bold text-slate-700 block">Pedagogical Verification:</span>
            <p className="text-slate-500 mt-1 leading-relaxed text-[11px]">
              This report represents decision-support learning analytics generated for English pedagogy. All pedagogical interventions are verified and authorized by the classroom teacher.
            </p>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block mb-12">Authorized English Teacher,</span>
            <span className="font-bold text-slate-900 border-t border-slate-400 pt-1 inline-block min-w-[160px]">
              {teacherProfile.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
