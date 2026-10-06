import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Code2, HelpCircle } from 'lucide-react';
import { GoogleSheetsConfig, RawSessionRecord } from '../types';
import { fetchFromGoogleAppsScript } from '../services/googleSheetsService';

interface GoogleSheetsConnectionBarProps {
  config: GoogleSheetsConfig;
  onSaveConfig: (cfg: GoogleSheetsConfig) => void;
  onDataLoaded: (records: RawSessionRecord[]) => void;
  onOpenScriptModal: () => void;
}

export const GoogleSheetsConnectionBar: React.FC<GoogleSheetsConnectionBarProps> = ({
  config,
  onSaveConfig,
  onDataLoaded,
  onOpenScriptModal,
}) => {
  const [urlInput, setUrlInput] = useState(config.appsScriptUrl || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSyncNow = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setMessage({
        type: 'error',
        text: 'Silakan masukkan URL Web App Google Apps Script terlebih dahulu.',
      });
      return;
    }

    setIsSyncing(true);
    setMessage(null);

    try {
      const records = await fetchFromGoogleAppsScript(trimmed);
      if (!records || records.length === 0) {
        throw new Error('Data sheet kosong atau format data tidak valid.');
      }

      onDataLoaded(records);
      const newConfig: GoogleSheetsConfig = {
        ...config,
        appsScriptUrl: trimmed,
        status: 'connected',
        lastSyncTime: new Date().toLocaleTimeString(),
      };
      onSaveConfig(newConfig);

      setMessage({
        type: 'success',
        text: `Tersambung! Berhasil memuat ${records.length} data siswa dari Google Sheet.`,
      });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: `Gagal sinkronisasi: ${err.message}. Pastikan URL Web App diatur 'Who has access: Anyone'.`,
      });
      onSaveConfig({
        ...config,
        appsScriptUrl: trimmed,
        status: 'error',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-[#f5f6ff] border border-[#e0e4fc] rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(79,70,229,0.04)] text-left mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#23255a] font-['Plus_Jakarta_Sans',sans-serif]">
            Google Sheets Connection
          </h2>
          <p className="text-xs text-[#5e63a8] font-normal mt-0.5">
            Enter your Google Apps Script Web App URL to sync with your real data.
          </p>
        </div>

        {/* Quick action to view the Apps Script code */}
        <button
          type="button"
          onClick={onOpenScriptModal}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#4f46e5] hover:text-[#3730a3] hover:underline cursor-pointer self-start sm:self-auto"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Lihat / Salin Script (Code.gs)</span>
        </button>
      </div>

      {/* Input and Sync Button Container */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full bg-white border border-[#c7cdfc] focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 font-mono placeholder:text-slate-400 placeholder:font-sans transition-all outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSyncNow}
          disabled={isSyncing}
          className="bg-[#4338ca] hover:bg-[#3730a3] active:scale-[0.98] disabled:opacity-60 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-md shadow-[#4338ca]/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
        </button>
      </div>

      {/* Status Feedback Messages */}
      {message && (
        <div
          className={`mt-2.5 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {config.status === 'connected' && !message && (
        <div className="mt-2 text-[11px] text-[#4f46e5] flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tersambung ke Google Sheets (Terakhir disinkronkan: {config.lastSyncTime || 'Baru saja'})</span>
        </div>
      )}
    </div>
  );
};
