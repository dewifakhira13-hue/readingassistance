import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  TrendingUp,
  TrendingDown,
  Award,
  ArrowUpDown,
  BookOpen,
  UserPlus,
  X,
  Check,
} from 'lucide-react';
import { StudentAggregate } from '../types';

interface StudentsPageProps {
  students: StudentAggregate[];
  onSelectStudent: (studentId: string) => void;
  selectedClass: string;
  onAddStudent?: (newStudent: { name: string; attendanceName: string; class: string }) => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({
  students,
  onSelectStudent,
  selectedClass,
  onAddStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'name' | 'avgReadingScore' | 'scoreGrowth' | 'avgAnxiety'>('avgReadingScore');
  const [sortAsc, setSortAsc] = useState(false);

  // Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAttendanceName, setNewAttendanceName] = useState('');
  const [newClass, setNewClass] = useState(selectedClass !== 'All Classes' ? selectedClass : 'Grade 5-A');
  const [addError, setAddError] = useState('');

  const filtered = useMemo(() => {
    let list = students.filter((s) => {
      const matchClass = selectedClass === 'All Classes' || s.class === selectedClass;
      if (!matchClass) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        if (
          !s.name.toLowerCase().includes(term) &&
          !s.code.toLowerCase().includes(term) &&
          !s.studentId.toLowerCase().includes(term)
        ) {
          return false;
        }
      }
      if (levelFilter !== 'ALL' && s.overallLevel !== levelFilter) {
        return false;
      }
      return true;
    });

    list.sort((a, b) => {
      const vA = a[sortField];
      const vB = b[sortField];
      if (typeof vA === 'number' && typeof vB === 'number') {
        return sortAsc ? vA - vB : vB - vA;
      }
      return sortAsc
        ? String(vA).localeCompare(String(vB))
        : String(vB).localeCompare(String(a[sortField]));
    });

    return list;
  }, [students, selectedClass, searchTerm, levelFilter, sortField, sortAsc]);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setAddError('Harap masukkan Nama Lengkap siswa.');
      return;
    }
    if (!newAttendanceName.trim()) {
      setAddError('Harap masukkan Nama Absen / No. Absen.');
      return;
    }

    setAddError('');
    if (onAddStudent) {
      onAddStudent({
        name: newName.trim(),
        attendanceName: newAttendanceName.trim(),
        class: newClass,
      });
    }

    // Reset and close
    setNewName('');
    setNewAttendanceName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
            Student Performance Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive profile of {filtered.length} students enrolled in Class {selectedClass}
          </p>
        </div>

        {/* Controls and Add Student Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Add Student Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add New Student</span>
          </button>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-44 sm:w-52"
            />
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Levels</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Needs Support">Needs Support</option>
          </select>

          <select
            value={sortField}
            onChange={(e: any) => setSortField(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="avgReadingScore">Sort: Reading Score</option>
            <option value="scoreGrowth">Sort: Growth (S5 vs S1)</option>
            <option value="avgAnxiety">Sort: Anxiety</option>
          </select>
        </div>
      </div>

      {/* Students Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s) => (
          <div
            key={s.studentId}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-md transition-all hover:border-blue-300 flex flex-col justify-between overflow-hidden min-w-0"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
                    {s.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-slate-800 truncate block">{s.name}</h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                      <span>{s.code}</span>
                      <span>•</span>
                      <span className="truncate">Class {s.class}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                    s.overallLevel === 'Excellent'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : s.overallLevel === 'Good'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : s.overallLevel === 'Fair'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {s.overallLevel}
                </span>
              </div>

              {/* Score Metrics */}
              <div className="grid grid-cols-2 gap-2 my-3.5">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 min-w-0">
                  <span className="text-[10px] text-slate-400 font-medium block truncate">Avg Score</span>
                  <div className="text-lg font-black text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] truncate">
                    {s.avgReadingScore}%
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 min-w-0">
                  <span className="text-[10px] text-slate-400 font-medium block truncate">Growth (S1-S5)</span>
                  <div className={`text-lg font-black font-['Plus_Jakarta_Sans',sans-serif] flex items-center gap-1 truncate ${
                    s.scoreGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {s.scoreGrowth >= 0 ? <TrendingUp className="w-4 h-4 shrink-0" /> : <TrendingDown className="w-4 h-4 shrink-0" />}
                    <span>{s.scoreGrowth >= 0 ? `+${s.scoreGrowth}` : s.scoreGrowth}</span>
                  </div>
                </div>
              </div>

              {/* Subskill Progress items */}
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="truncate mr-2">Main Idea:</span>
                  <span className="font-bold text-slate-800 shrink-0">{s.avgMainIdea}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate mr-2">Specific Info:</span>
                  <span className="font-bold text-slate-800 shrink-0">{s.avgSpecificInfo}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate mr-2">Inference:</span>
                  <span className="font-bold text-slate-800 shrink-0">{s.avgInference}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate mr-2">Vocabulary:</span>
                  <span className="font-bold text-slate-800 shrink-0">{s.avgVocabulary}%</span>
                </div>
              </div>

              {/* Affective Indicators */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500">
                <span>Confidence: <strong className="text-emerald-600">{s.avgConfidence}</strong>/5</span>
                <span>Anxiety: <strong className={s.avgAnxiety >= 3.5 ? 'text-rose-600' : 'text-slate-700'}>{s.avgAnxiety}</strong>/5</span>
                <span>Engagement: <strong className="text-blue-600">{s.avgEngagement}</strong>/5</span>
              </div>
            </div>

            {/* Action */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => onSelectStudent(s.studentId)}
                className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Student Profile</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-gradient-to-r from-[#0d1e38] to-[#1c335e] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/40 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base font-['Plus_Jakarta_Sans',sans-serif]">
                    Add New Student
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Tambah data siswa baru ke dalam sistem
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-4 text-left">
              {addError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {addError}
                </div>
              )}

              {/* 1. Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rizky Pratama"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* 2. Nama Absen / No. Absen */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Absen / Panggilan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rizky / 18"
                  value={newAttendanceName}
                  onChange={(e) => setNewAttendanceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* 3. Kelas */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kelas <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  <option value="Grade 5-A">Grade 5-A</option>
                  <option value="Grade 5-B">Grade 5-B</option>
                  <option value="Grade 5-C">Grade 5-C</option>
                  <option value="VIII-A">VIII-A</option>
                  <option value="VIII-B">VIII-B</option>
                  <option value="VIII-C">VIII-C</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Siswa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
