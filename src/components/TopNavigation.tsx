import React, { useState } from 'react';
import {
  GraduationCap,
  ChevronDown,
  Bell,
  Sheet,
  CheckCircle2,
  RefreshCw,
  Info,
  LogOut,
  User,
  HelpCircle,
} from 'lucide-react';
import { READING_TEXTS } from '../data/studentData';
import { GoogleSheetsConfig, TeacherProfile } from '../types';

interface TopNavigationProps {
  teacherProfile: TeacherProfile;
  selectedSchool: string;
  selectedClass: string;
  selectedTextId: string;
  onClassChange: (cls: string) => void;
  onTextChange: (textId: string) => void;
  sheetConfig: GoogleSheetsConfig;
  onOpenSheetModal: () => void;
  onQuickSync: () => void;
  isSyncing?: boolean;
  onSwitchProfile?: () => void;
  onOpenGuide?: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  teacherProfile,
  selectedSchool,
  selectedClass,
  selectedTextId,
  onClassChange,
  onTextChange,
  sheetConfig,
  onOpenSheetModal,
  onQuickSync,
  isSyncing = false,
  onSwitchProfile,
  onOpenGuide,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Calculate initials from teacher's name
  const initials = teacherProfile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('') || 'MD';

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-20 px-6 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* School Display */}
          <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/90 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium cursor-default">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-800">{teacherProfile.school || selectedSchool}</span>
          </div>

          {/* Class Filter */}
          <div className="relative">
            <label className="text-[10px] text-slate-400 font-semibold absolute left-2.5 top-0.5 pointer-events-none">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => onClassChange(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100/90 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200 pl-2.5 pr-7 pt-3.5 pb-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
            >
              <option value="VIII-A">VIII-A</option>
              <option value="VIII-B">VIII-B</option>
              <option value="VIII-C">VIII-C</option>
              <option value="All Classes">All Classes (VIII-A, B, C)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 bottom-2 pointer-events-none" />
          </div>

          {/* Reading Text Filter */}
          <div className="relative">
            <label className="text-[10px] text-slate-400 font-semibold absolute left-2.5 top-0.5 pointer-events-none">
              Reading Text
            </label>
            <select
              value={selectedTextId}
              onChange={(e) => onTextChange(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100/90 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200 pl-2.5 pr-7 pt-3.5 pb-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none max-w-[240px] truncate"
            >
              {READING_TEXTS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 bottom-2 pointer-events-none" />
          </div>

          {/* Google Sheet Sync Quick Action */}
          <button
            onClick={onOpenSheetModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              sheetConfig.status === 'connected'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Configure Google Sheet and Google Apps Script connector"
          >
            <Sheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">
              {sheetConfig.status === 'connected' ? 'Google Sheet Synced' : 'Google Sheet Connect'}
            </span>
            {sheetConfig.status === 'connected' && (
              <CheckCircle2 className="w-3 h-3 text-emerald-600 ml-0.5" />
            )}
          </button>

          {/* Petunjuk Uji Coba Quick Action */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-200 bg-cyan-50/80 hover:bg-cyan-100 text-cyan-800 text-xs font-semibold transition-colors cursor-pointer"
              title="Buka Petunjuk Penggunaan & Uji Coba Dashboard"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
              <span className="hidden md:inline">Petunjuk Uji Coba</span>
            </button>
          )}
        </div>

        {/* Right Side: Notification & Teacher Profile */}
        <div className="flex items-center gap-4">
          {/* Synthetic Data badge */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-medium text-blue-700">
            <Info className="w-3 h-3 text-blue-500" />
            <span>Synthetic / Research Dataset</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                3
              </span>
            </button>
          </div>

          {/* Teacher Profile Card with Switch Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 pl-2 border-l border-slate-200 hover:bg-slate-50 py-1 px-2 rounded-xl transition-colors cursor-pointer text-left"
            >
              <div className="w-9 h-9 rounded-full bg-[#132247] text-white flex items-center justify-center font-bold text-xs shadow-inner">
                {initials}
              </div>
              <div className="leading-tight text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-800">{teacherProfile.name}</div>
                <div className="text-[11px] text-slate-400 font-medium">{teacherProfile.role || 'English Teacher'}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-30 animate-in fade-in duration-150 text-left">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Guru Aktif
                  </span>
                  <div className="font-bold text-xs text-slate-800 mt-0.5">{teacherProfile.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{teacherProfile.school}</div>
                </div>

                {onOpenGuide && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenGuide();
                    }}
                    className="w-full px-4 py-2.5 text-xs text-slate-700 hover:text-cyan-700 hover:bg-cyan-50/60 font-medium flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Petunjuk Uji Coba</span>
                  </button>
                )}

                {onSwitchProfile && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSwitchProfile();
                    }}
                    className="w-full px-4 py-2.5 text-xs text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 font-medium flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Ganti Nama / Asal Sekolah</span>
                  </button>
                )}
                {onSwitchProfile && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSwitchProfile();
                    }}
                    className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50/60 font-medium flex items-center gap-2 transition-colors cursor-pointer border-t border-slate-100 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out / Keluar (Landing Page)</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
