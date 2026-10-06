import React from 'react';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Sparkles,
  Lightbulb,
  FileText,
  Settings,
  BookOpen,
  Sprout,
  Sheet,
  LogOut,
  UserCheck,
  HelpCircle,
} from 'lucide-react';
import { TeacherProfile } from '../types';

export type NavPage = 'dashboard' | 'students' | 'analytics' | 'insights' | 'recommendations' | 'reports' | 'settings';

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  pendingRecCount?: number;
  onOpenGoogleSheetSync?: () => void;
  teacherProfile?: TeacherProfile;
  onSwitchProfile?: () => void;
  onOpenGuide?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  pendingRecCount = 0,
  onOpenGoogleSheetSync,
  teacherProfile,
  onSwitchProfile,
  onOpenGuide,
}) => {
  const navItems = [
    { id: 'dashboard' as NavPage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students' as NavPage, label: 'Students', icon: Users },
    { id: 'analytics' as NavPage, label: 'Reading Analytics', icon: BarChart3 },
    { id: 'insights' as NavPage, label: 'AI Insights', icon: Sparkles },
    {
      id: 'recommendations' as NavPage,
      label: 'Recommendations',
      icon: Lightbulb,
      badge: pendingRecCount > 0 ? pendingRecCount : undefined,
    },
    { id: 'reports' as NavPage, label: 'Reports', icon: FileText },
    { id: 'settings' as NavPage, label: 'Settings & Data Source', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0d1e38] text-slate-200 flex flex-col h-screen fixed left-0 top-0 z-30 shadow-xl border-r border-slate-800/60 select-none">
      {/* Brand Header with 3D Aurora Accent */}
      <div className="p-5 pb-6 border-b border-slate-800/80 relative overflow-hidden">
        {/* Subtle Aurora Ambient Ribbon */}
        <div className="absolute -top-12 -left-10 w-40 h-24 bg-gradient-to-r from-emerald-500/20 via-cyan-400/20 to-indigo-500/20 blur-xl pointer-events-none rounded-full" />
        
        <div className="flex items-start gap-3 relative z-10">
          <div className="p-2.5 bg-gradient-to-br from-teal-500 to-blue-600 text-white rounded-xl shadow-md shadow-teal-500/20 flex items-center justify-center shrink-0 border border-teal-400/30">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base text-white tracking-wide font-['Plus_Jakarta_Sans',sans-serif]">
                READING AI
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-400/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1 leading-snug">
              English Teacher Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white text-blue-700' : 'bg-blue-500/30 text-blue-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Actions */}
        <div className="pt-3 space-y-1.5">
          <button
            onClick={onOpenGoogleSheetSync}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 transition-colors"
          >
            <Sheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Sheet Connector</span>
          </button>

          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Petunjuk Uji Coba</span>
            </button>
          )}
        </div>
      </nav>

      {/* Log Out Box (Only Log Out button) */}
      {onSwitchProfile && (
        <div className="mx-3 mb-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <button
            onClick={onSwitchProfile}
            title="Log Out / Keluar ke Landing Page"
            className="w-full py-2 px-3 rounded-lg text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 hover:border-rose-400/50 transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      )}

      {/* Bottom Philosophy Quote */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-slate-900/80 border border-slate-800/90 text-left relative overflow-hidden">
        <div className="absolute right-2 bottom-1 opacity-10">
          <Sprout className="w-16 h-16 text-blue-400" />
        </div>
        <p className="text-[12px] italic text-slate-300 leading-snug font-normal relative z-10">
          &ldquo;Better understanding leads to better learning.&rdquo;
        </p>
        <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-teal-400 font-semibold relative z-10">
          <Sprout className="w-3.5 h-3.5" />
          <span>English Pedagogy Research</span>
        </div>
      </div>
    </aside>
  );
};
