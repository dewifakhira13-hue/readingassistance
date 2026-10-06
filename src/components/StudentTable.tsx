import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { EnrichedRecord } from '../types';

interface StudentTableProps {
  records: EnrichedRecord[];
  onSelectStudent: (studentId: string) => void;
  selectedSession: string;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  records,
  onSelectStudent,
  selectedSession,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'Excellent' | 'Good' | 'Fair' | 'Needs Support'>('ALL');
  const [sortField, setSortField] = useState<keyof EnrichedRecord>('Reading_Score');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Deduplicate to latest record per student if multi-session
  const displayRecords = useMemo(() => {
    let list: EnrichedRecord[] = [];
    if (selectedSession === 'Session 1–5' || selectedSession === 'all') {
      const map = new Map<string, EnrichedRecord>();
      records.forEach((r) => {
        const existing = map.get(r.Student_ID);
        if (!existing || r.Session > existing.Session) {
          map.set(r.Student_ID, r);
        }
      });
      list = Array.from(map.values());
    } else {
      list = [...records];
    }

    // Filter search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (r) =>
          r.studentName.toLowerCase().includes(term) ||
          r.displayId.toLowerCase().includes(term) ||
          r.Student_ID.toLowerCase().includes(term)
      );
    }

    // Filter level
    if (levelFilter !== 'ALL') {
      list = list.filter((r) => r.normalizedLevel === levelFilter);
    }

    // Sort
    list.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    return list;
  }, [records, selectedSession, searchTerm, levelFilter, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(displayRecords.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return displayRecords.slice(start, start + pageSize);
  }, [displayRecords, currentPage]);

  const handleSort = (field: keyof EnrichedRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Excellent':
        return (
          <span className="inline-flex items-center justify-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Excellent
          </span>
        );
      case 'Good':
      case 'High':
        return (
          <span className="inline-flex items-center justify-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Good
          </span>
        );
      case 'Fair':
      case 'Developing':
        return (
          <span className="inline-flex items-center justify-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Fair
          </span>
        );
      case 'Needs Support':
      default:
        return (
          <span className="inline-flex items-center justify-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Needs Support
          </span>
        );
    }
  };

  const getScoreBadge = (score: number) => {
    let colorClass = 'bg-slate-100 text-slate-700';
    if (score >= 85) colorClass = 'bg-emerald-100 text-emerald-800 font-bold';
    else if (score >= 70) colorClass = 'bg-blue-100 text-blue-800 font-bold';
    else if (score >= 55) colorClass = 'bg-amber-100 text-amber-800 font-medium';
    else colorClass = 'bg-rose-100 text-rose-800 font-bold';

    return (
      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${colorClass}`}>
        {score.toFixed(0)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">Student Performance</h3>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">
                Sampel Uji Coba: 2–3 Murid
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Showing {displayRecords.length} student records • Cukup telaah sampel 2–3 murid untuk evaluasi penelitian
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-44 sm:w-56"
            />
          </div>

          {/* Level Filter Dropdown */}
          <select
            value={levelFilter}
            onChange={(e: any) => {
              setLevelFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Levels</option>
            <option value="Excellent">Excellent (85+)</option>
            <option value="Good">Good (70-84)</option>
            <option value="Fair">Fair (55-69)</option>
            <option value="Needs Support">Needs Support (&lt;55)</option>
          </select>
        </div>
      </div>

      {/* Table Canvas with Responsive Scroll */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/70">
        <table className="w-full min-w-[760px] text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200/80">
              <th className="py-3 px-3 w-10 text-center">No.</th>
              <th
                onClick={() => handleSort('displayId')}
                className="py-3 px-3 cursor-pointer hover:text-slate-800"
              >
                <div className="flex items-center gap-1">
                  <span>Student ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('studentName')}
                className="py-3 px-3 cursor-pointer hover:text-slate-800"
              >
                <div className="flex items-center gap-1">
                  <span>Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-2">Class</th>
              <th
                onClick={() => handleSort('Reading_Score')}
                className="py-3 px-3 cursor-pointer hover:text-slate-800"
              >
                <div className="flex items-center gap-1">
                  <span>Reading Score</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('Main_Idea_Score')}
                className="py-3 px-2 cursor-pointer hover:text-slate-800 text-center"
              >
                Main Idea
              </th>
              <th
                onClick={() => handleSort('Specific_Information_Score')}
                className="py-3 px-2 cursor-pointer hover:text-slate-800 text-center"
              >
                Specific Info
              </th>
              <th
                onClick={() => handleSort('Inference_Score')}
                className="py-3 px-2 cursor-pointer hover:text-slate-800 text-center"
              >
                Inference
              </th>
              <th
                onClick={() => handleSort('Vocabulary_Context_Score')}
                className="py-3 px-2 cursor-pointer hover:text-slate-800 text-center"
              >
                Vocabulary
              </th>
              <th
                onClick={() => handleSort('Engagement_Level_1to5')}
                className="py-3 px-2 cursor-pointer hover:text-slate-800 text-center"
              >
                Engagement
              </th>
              <th
                onClick={() => handleSort('Confidence_Level_1to5')}
                className="py-3 px-2 cursor-pointer hover:text-slate-800 text-center"
              >
                Confidence
              </th>
              <th
                onClick={() => handleSort('Reading_Anxiety_1to5')}
                className="py-3 px-2 cursor-pointer hover:text-slate-800 text-center"
              >
                Anxiety
              </th>
              <th className="py-3 px-3 text-center">Level</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedList.map((row, idx) => {
              const rowNumber = (currentPage - 1) * pageSize + idx + 1;
              return (
                <tr
                  key={`${row.Student_ID}-${row.Session}`}
                  className="hover:bg-blue-50/40 transition-colors"
                >
                  <td className="py-2.5 px-3 text-center text-slate-400 font-medium">
                    {rowNumber}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    {row.displayId}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    {row.studentName}
                  </td>
                  <td className="py-2.5 px-2 text-slate-500 font-medium">{row.Class}</td>
                  <td className="py-2.5 px-3">{getScoreBadge(row.Reading_Score)}</td>
                  <td className="py-2.5 px-2 text-center text-slate-600 font-medium">
                    {Math.round(row.Main_Idea_Score)}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600 font-medium">
                    {Math.round(row.Specific_Information_Score)}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600 font-medium">
                    {Math.round(row.Inference_Score)}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600 font-medium">
                    {Math.round(row.Vocabulary_Context_Score)}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600">
                    <span className="font-semibold text-blue-600">
                      {row.Engagement_Level_1to5.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600">
                    <span className="font-semibold text-emerald-600">
                      {row.Confidence_Level_1to5.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600">
                    <span
                      className={`font-semibold ${
                        row.Reading_Anxiety_1to5 >= 3.5 ? 'text-rose-600' : 'text-slate-600'
                      }`}
                    >
                      {row.Reading_Anxiety_1to5.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {getLevelBadge(row.normalizedLevel)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => onSelectStudent(row.Student_ID)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              );
            })}
            {paginatedList.length === 0 && (
              <tr>
                <td colSpan={14} className="py-8 text-center text-slate-400 text-xs">
                  No students found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-800">
            {displayRecords.length ? (currentPage - 1) * pageSize + 1 : 0}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-800">
            {Math.min(currentPage * pageSize, displayRecords.length)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-slate-800">
            {displayRecords.length}
          </span>{' '}
          students
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 py-1 font-semibold text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
