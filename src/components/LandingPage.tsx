import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  School,
  User,
  GraduationCap,
  Hash,
} from 'lucide-react';
import { TeacherProfile } from '../types';
import { Aurora3D } from './Aurora3D';

interface LandingPageProps {
  currentProfile: TeacherProfile;
  onStartStudentReading: (
    studentName: string,
    attendanceCode: string,
    studentSchool: string,
    studentGrade: string,
    activityId?: string
  ) => void;
  onEnterTeacherDashboard: (profile: TeacherProfile) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentProfile,
  onStartStudentReading,
  onEnterTeacherDashboard,
}) => {
  // Student form state
  const [studentName, setStudentName] = useState('Aisyah Putri');
  const [attendanceCode, setAttendanceCode] = useState('05');
  const [studentSchool, setStudentSchool] = useState('SD Negeri 1');
  const [selectedGrade, setSelectedGrade] = useState('Grade 5-A');
  const [selectedActivity, setSelectedActivity] = useState('PRE-TEST-01');
  const [errorMessage, setErrorMessage] = useState('');
  const [showTeacherLogin, setShowTeacherLogin] = useState(false);

  // Teacher fallback state
  const [teacherName, setTeacherName] = useState(currentProfile.name || 'Teacher');
  const [teacherSchool, setTeacherSchool] = useState(currentProfile.school || 'SD Negeri 1');
  const [teacherClass, setTeacherClass] = useState('Grade 5-A');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMessage('Harap isi Nama siswa.');
      return;
    }
    if (!attendanceCode.trim()) {
      setErrorMessage('Harap isi Kode / No. Absen.');
      return;
    }
    if (!studentSchool.trim()) {
      setErrorMessage('Harap isi Asal Sekolah.');
      return;
    }

    setErrorMessage('');
    onStartStudentReading(
      studentName.trim(),
      attendanceCode.trim(),
      studentSchool.trim(),
      selectedGrade,
      selectedActivity
    );
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) {
      setErrorMessage('Please enter Teacher Name.');
      return;
    }
    setErrorMessage('');
    onEnterTeacherDashboard({
      name: teacherName.trim(),
      school: teacherSchool.trim() || 'SD Negeri 1',
      role: 'English Teacher',
      defaultClass: teacherClass,
      isAuthenticated: true,
    });
  };

  const sampleAttendanceCodes = ['01', '02', '05', '08', '12'];

  return (
    <div className="min-h-screen bg-[#060c18] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-y-auto overflow-x-hidden select-none font-['Inter',sans-serif]">
      {/* Vertical 3D Aurora Pillars (Vertical northern light curtains) */}
      <Aurora3D intensity="high" />

      {/* Main Glass Card */}
      <div className="w-full max-w-[430px] my-auto relative z-10 transition-all duration-300">
        {/* Exterior 3D Aurora Glow Rim */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400/40 via-cyan-400/35 to-violet-500/40 rounded-[28px] blur-md opacity-85" />

        {/* 3D Glass Card */}
        <div className="relative rounded-[26px] bg-slate-900/85 backdrop-blur-xl border border-white/20 border-t-white/45 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85),_inset_0_1px_1px_rgba(255,255,255,0.45),_inset_0_-1px_1px_rgba(0,0,0,0.4)] p-6 sm:p-7 text-left overflow-hidden">
          {/* Card Header */}
          <div className="flex flex-col items-center text-center mb-5 relative z-10">
            {/* App Icon */}
            <div className="relative mb-3 group cursor-default">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-13 h-13 rounded-2xl bg-gradient-to-b from-[#0f2e46] to-[#0d1e38] text-cyan-300 flex items-center justify-center shadow-[0_8px_25px_rgba(6,182,212,0.35),_inset_0_1px_1px_rgba(255,255,255,0.5)] border border-cyan-400/40">
                <BookOpen className="w-6 h-6 stroke-[2.2] text-cyan-300 drop-shadow-sm" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 justify-center">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                AI-READ
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-md border border-cyan-400/40">
                Grade 5
              </span>
            </div>

            <p className="text-[11px] text-slate-300 font-medium mt-0.5">
              AI-Assisted English Reading Activity
            </p>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] text-emerald-300 font-medium mt-2">
              <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Elementary Reading Intervention</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-3.5 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-[11px] font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              <span className="truncate">{errorMessage}</span>
            </div>
          )}

          {/* Student Entry Mode */}
          {!showTeacherLogin ? (
            <form onSubmit={handleStudentSubmit} className="space-y-3.5 relative z-10">
              {/* Field 1: Nama (Menggantikan Student Code) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Nama <span className="text-cyan-400">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="misal: Aisyah Putri atau Bima Santoso"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-xs sm:text-sm font-semibold transition-colors outline-none"
                />
              </div>

              {/* Field 2: Kode Absen dengan Keterangan */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Kode / No. Absen <span className="text-cyan-400">*</span></span>
                  </label>
                  <span className="text-[10px] text-cyan-300/90 font-normal">
                    Pilihan cepat:
                  </span>
                </div>

                <input
                  type="text"
                  required
                  value={attendanceCode}
                  onChange={(e) => setAttendanceCode(e.target.value)}
                  placeholder="misal: 05 atau STU-05"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-xs font-bold uppercase tracking-wider transition-colors outline-none"
                />

                {/* Keterangan Kode Absen */}
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 leading-tight">
                    Keterangan: Masukkan nomor atau kode presensi murid di kelas.
                  </span>
                  <div className="flex gap-1 shrink-0 ml-1">
                    {sampleAttendanceCodes.map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setAttendanceCode(code)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          attendanceCode === code
                            ? 'bg-cyan-500 text-slate-950 font-black'
                            : 'bg-white/[0.08] text-slate-300 hover:bg-white/[0.15]'
                        }`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Field 3: Asal Sekolah */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <School className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Asal Sekolah <span className="text-cyan-400">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={studentSchool}
                  onChange={(e) => setStudentSchool(e.target.value)}
                  placeholder="misal: SD Negeri 1 atau SMP Negeri..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 text-xs sm:text-sm font-semibold transition-colors outline-none"
                />
              </div>

              {/* Field 4: Kelas / Grade */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Kelas
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="Grade 5-A">Grade 5-A</option>
                  <option value="Grade 5-B">Grade 5-B</option>
                  <option value="Grade 5-C">Grade 5-C</option>
                  <option value="VIII-A">VIII-A</option>
                  <option value="VIII-B">VIII-B</option>
                </select>
              </div>

              {/* Field 5: Sesi / Instrumen Aktivitas */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Pilihan Sesi / Instrumen</span>
                  <span className="text-[10px] text-cyan-300 font-bold">Riset AI-READ</span>
                </label>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="PRE-TEST-01">📝 PRE-TEST (20 Soal) — The School Garden</option>
                  <option value="SESSION-01">🌟 Sesi 1 AI-READ (10 Soal) — The School Garden</option>
                  <option value="SESSION-02">🌟 Sesi 2 AI-READ (10 Soal) — A Smart Way to Save Water</option>
                  <option value="SESSION-03">🌟 Sesi 3 AI-READ (10 Soal) — Learning with Digital Books</option>
                  <option value="SESSION-04">🌟 Sesi 4 AI-READ (10 Soal) — The Amazing World of Mangroves</option>
                  <option value="POST-TEST-01">🎓 POST-TEST (20 Soal) — Saving Water at School</option>
                </select>
              </div>

              {/* Start Reading Activity Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm shadow-[0_8px_25px_-5px_rgba(20,184,166,0.6)] border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Mulai Aktivitas Membaca</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Teacher Portal Switch */}
              <div className="pt-2.5 border-t border-white/10 text-center">
                <button
                  type="button"
                  onClick={() => setShowTeacherLogin(true)}
                  className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer hover:underline"
                >
                  Bapak/Ibu Guru &amp; Peneliti? Masuk Dashboard Analitik
                </button>
              </div>
            </form>
          ) : (
            /* Teacher Portal Fallback Form */
            <form onSubmit={handleTeacherSubmit} className="space-y-3.5 relative z-10">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>Portal Guru &amp; Peneliti</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowTeacherLogin(false)}
                  className="text-[10px] text-cyan-300 hover:underline cursor-pointer"
                >
                  ← Kembali ke Mode Siswa
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Nama Guru <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="misal: Dewi Fakhira"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Asal Sekolah
                </label>
                <input
                  type="text"
                  value={teacherSchool}
                  onChange={(e) => setTeacherSchool(e.target.value)}
                  placeholder="misal: SD Negeri 1"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Kelas Binaan
                </label>
                <select
                  value={teacherClass}
                  onChange={(e) => setTeacherClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs"
                >
                  <option value="Grade 5-A">Grade 5-A</option>
                  <option value="Grade 5-B">Grade 5-B</option>
                  <option value="VIII-A">VIII-A</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Buka Dashboard Guru</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
