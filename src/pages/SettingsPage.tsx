import React, { useState } from 'react';
import {
  Settings,
  Sheet,
  Copy,
  Check,
  RefreshCw,
  Download,
  Upload,
  BookOpen,
  ShieldCheck,
  User,
  School,
  Sparkles,
  Info,
} from 'lucide-react';
import { GoogleSheetsConfig, RawSessionRecord, TeacherProfile } from '../types';
import {
  GOOGLE_APPS_SCRIPT_TEMPLATE,
  fetchFromGoogleAppsScript,
  exportRecordsToCSV,
  parseCSVToRecords,
} from '../services/googleSheetsService';
import { RAW_CSV_RECORDS } from '../data/studentData';

interface SettingsPageProps {
  sheetConfig: GoogleSheetsConfig;
  onSaveConfig: (cfg: GoogleSheetsConfig) => void;
  onDataLoaded: (records: RawSessionRecord[]) => void;
  onResetDemoData: () => void;
  currentRecords: RawSessionRecord[];
  teacherProfile?: TeacherProfile;
  onSaveProfile?: (profile: TeacherProfile) => void;
  onReturnToLanding?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  sheetConfig,
  onSaveConfig,
  onDataLoaded,
  onResetDemoData,
  currentRecords,
  teacherProfile = { name: 'Ms. Dewi', school: 'SMP Negeri 1', isAuthenticated: true },
  onSaveProfile,
  onReturnToLanding,
}) => {
  const [appsScriptUrl, setAppsScriptUrl] = useState(sheetConfig.appsScriptUrl || '');
  const [teacherName, setTeacherName] = useState(teacherProfile.name || 'Ms. Dewi');
  const [schoolName, setSchoolName] = useState(teacherProfile.school || 'SMP Negeri 1');
  const [profileSaved, setProfileSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSaveTeacherProfile = () => {
    if (onSaveProfile) {
      onSaveProfile({
        ...teacherProfile,
        name: teacherName.trim() || 'Ms. Dewi',
        school: schoolName.trim() || 'SMP Negeri 1',
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTestSync = async () => {
    if (!appsScriptUrl.trim()) {
      setSyncStatus('Masukkan Web App URL terlebih dahulu.');
      return;
    }
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const records = await fetchFromGoogleAppsScript(appsScriptUrl);
      onDataLoaded(records);
      const newConfig: GoogleSheetsConfig = {
        ...sheetConfig,
        appsScriptUrl,
        lastSyncTime: new Date().toLocaleTimeString(),
        status: 'connected',
      };
      onSaveConfig(newConfig);
      setSyncStatus(`Sukses! ${records.length} data tersinkronisasi dari Google Sheets.`);
    } catch (e: any) {
      setSyncStatus(`Error: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportCSV = () => {
    const csv = exportRecordsToCSV(currentRecords);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'iclarity_reading_dataset.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSVToRecords(text);
        onDataLoaded(parsed);
        setSyncStatus(`Sukses mengimpor ${parsed.length} baris data CSV lokal.`);
      } catch (err: any) {
        setSyncStatus(`Gagal membaca file CSV: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 text-left max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-200 text-slate-800">
            <Settings className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
            Settings &amp; Data Integration
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Configure Google Sheets &amp; Apps Script sync, teacher preferences, and research metadata
        </p>
      </div>

      {/* 1. Google Sheets & Apps Script Connection Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Sheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-800">
                Google Sheets &amp; Google Apps Script Integration
              </h2>
              <span className="text-[11px] text-slate-400">
                Sambungkan spreadsheet nilai membaca siswa untuk sinkronisasi otomatis
              </span>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              sheetConfig.status === 'connected'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {sheetConfig.status === 'connected' ? 'Connected (Live Sync)' : 'Standalone'}
          </span>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            Google Apps Script Web App URL:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={appsScriptUrl}
              onChange={(e) => setAppsScriptUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleTestSync}
              disabled={isSyncing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-emerald-600/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Test & Sync'}</span>
            </button>
          </div>
          {syncStatus && (
            <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              {syncStatus}
            </p>
          )}
        </div>

        {/* Apps Script Code Accordion */}
        <div className="pt-2">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-slate-700">
              Google Apps Script Source Code (Code.gs):
            </span>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Tersalin' : 'Salin Skrip'}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto border border-slate-800">
            {GOOGLE_APPS_SCRIPT_TEMPLATE}
          </pre>
        </div>

        {/* CSV Export & Local Backup */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh CSV (150 Baris Data)</span>
          </button>

          <label className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs">
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah File CSV</span>
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>

          <button
            onClick={onResetDemoData}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer ml-auto"
          >
            Reset ke Data Sintetik Awal
          </button>
        </div>
      </div>

      {/* 2. Teacher Profile Configuration */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-sm text-slate-800">Teacher &amp; Institutional Profile</h2>
          </div>
          {onReturnToLanding && (
            <button
              onClick={onReturnToLanding}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline cursor-pointer"
            >
              Kembali ke Landing Page
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Guru / Teacher Name:</label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Asal Sekolah / School Affiliation:</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleSaveTeacherProfile}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-blue-600/20"
          >
            Simpan Perubahan Profil
          </button>
          {profileSaved && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>Profil guru berhasil diperbarui di seluruh menu!</span>
            </span>
          )}
        </div>
      </div>

      {/* 3. Research Context & DBR Framework */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-3">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-sm text-slate-800">
            Research Alignment: English Reading DBR Framework
          </h2>
        </div>

        <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
          <p>
            <strong>Research Focus:</strong> &ldquo;AI-Driven Innovation and Digital Futures in English Education&rdquo;
          </p>
          <p>
            <strong>Working Research Title:</strong> &ldquo;AI-Powered Teacher Dashboard for Data-Informed English Pedagogy: Integrating Academic, Engagement, and Affective Learning Indicators&rdquo;
          </p>
          <p>
            <strong>Design-Based Research (DBR) 9-Phase Cycle:</strong>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-600 font-medium">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">1. Identify classroom problem</div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">2. Design dashboard concept</div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">3. Develop interactive prototype</div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">4. Expert evaluation</div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">5. Teacher classroom use</div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">6. Collect teacher feedback</div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">7. Usability &amp; utility analysis</div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">8. Iterative redesign</div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">9. Evaluate pedagogical impact</div>
          </div>
        </div>
      </div>

      {/* 4. Ethical & Data Privacy Statement */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-800 block">Data Privacy &amp; Synthetic Dataset Notice:</strong>
          All student records in this demonstration are synthetic and do not represent real students. When connected to actual Google Sheets, ensure compliance with student data privacy standards. The AI acts strictly as an educational decision-support partner without autonomous student grading or labeling.
        </div>
      </div>
    </div>
  );
};
