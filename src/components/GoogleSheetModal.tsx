import React, { useState } from 'react';
import {
  X,
  Sheet,
  Copy,
  Check,
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { GoogleSheetsConfig, RawSessionRecord } from '../types';
import {
  GOOGLE_APPS_SCRIPT_TEMPLATE,
  fetchFromGoogleAppsScript,
  parseCSVToRecords,
  exportRecordsToCSV,
} from '../services/googleSheetsService';
import { RAW_CSV_RECORDS } from '../data/studentData';

interface GoogleSheetModalProps {
  config: GoogleSheetsConfig;
  onSaveConfig: (config: GoogleSheetsConfig) => void;
  onDataLoaded: (records: RawSessionRecord[]) => void;
  onResetDemoData: () => void;
  onClose: () => void;
  currentRecords: RawSessionRecord[];
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  config,
  onSaveConfig,
  onDataLoaded,
  onResetDemoData,
  onClose,
  currentRecords,
}) => {
  const [appsScriptUrl, setAppsScriptUrl] = useState(config.appsScriptUrl || '');
  const [sheetUrl, setSheetUrl] = useState(config.sheetUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'connect' | 'script' | 'csv'>('connect');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTestAndSync = async () => {
    if (!appsScriptUrl.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Harap masukkan Web App URL Google Apps Script yang valid.',
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const records = await fetchFromGoogleAppsScript(appsScriptUrl);
      if (records.length === 0) {
        throw new Error('Data sheet kosong atau tidak memiliki baris data.');
      }

      onDataLoaded(records);
      const newConfig: GoogleSheetsConfig = {
        appsScriptUrl,
        sheetUrl,
        autoSync: true,
        lastSyncTime: new Date().toLocaleTimeString(),
        status: 'connected',
      };
      onSaveConfig(newConfig);

      setStatusMessage({
        type: 'success',
        text: `Berhasil tersinkronisasi! Memuat ${records.length} baris data dari Google Sheet.`,
      });
    } catch (err: any) {
      console.error(err);
      const newConfig: GoogleSheetsConfig = {
        ...config,
        appsScriptUrl,
        sheetUrl,
        status: 'error',
        errorMessage: err.message,
      };
      onSaveConfig(newConfig);

      setStatusMessage({
        type: 'error',
        text: `Gagal menyinkronkan: ${err.message}. Pastikan URL Web App dapat diakses (Who has access: Anyone) dan skrip Apps Script telah di-deploy.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    const csv = exportRecordsToCSV(currentRecords);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'iclarity_english_reading_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        setStatusMessage({
          type: 'success',
          text: `Berhasil mengimpor ${parsed.length} baris data dari file CSV.`,
        });
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: `Gagal membaca CSV: ${err.message}`,
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/15 rounded-2xl">
              <Sheet className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                Google Sheet &amp; Google Apps Script Integration
              </h2>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Sinkronisasi data penilaian membaca siswa dari spreadsheet secara real-time
              </p>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('connect')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'connect'
                  ? 'bg-white text-emerald-950 font-bold shadow-sm'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              1. Sambungkan Web App URL
            </button>
            <button
              onClick={() => setActiveTab('script')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'script'
                  ? 'bg-white text-emerald-950 font-bold shadow-sm'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              2. Kode Google Apps Script (Code.gs)
            </button>
            <button
              onClick={() => setActiveTab('csv')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'csv'
                  ? 'bg-white text-emerald-950 font-bold shadow-sm'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              3. Ekspor / Impor CSV
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-left text-xs">
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{statusMessage.text}</div>
            </div>
          )}

          {activeTab === 'connect' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Google Apps Script Web App URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    value={appsScriptUrl}
                    onChange={(e) => setAppsScriptUrl(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <button
                    onClick={handleTestAndSync}
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer shadow-sm shadow-emerald-600/30"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{isLoading ? 'Menghubungkan...' : 'Sinkronkan'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  URL ini didapatkan setelah Anda memilih <strong>Deploy &gt; New deployment &gt; Web app</strong> pada Google Sheets.
                </p>
              </div>

              {/* Status info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Status Koneksi:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                      config.status === 'connected'
                        ? 'bg-emerald-100 text-emerald-800'
                        : config.status === 'error'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {config.status === 'connected'
                      ? 'Tersambung (Live)'
                      : config.status === 'error'
                      ? 'Gagal / Perlu Periksa'
                      : 'Belum Terhubung'}
                  </span>
                </div>
                {config.lastSyncTime && (
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Terakhir Disinkronkan:</span>
                    <span className="font-medium text-slate-700">{config.lastSyncTime}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-500">
                  <span>Data Saat Ini:</span>
                  <span className="font-medium text-slate-700">
                    {currentRecords.length} baris data pembelajaran
                  </span>
                </div>
              </div>

              {/* Quick instructions in Indonesian */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 space-y-2">
                <span className="font-bold text-blue-900 block">
                  Cara Cepat Menghubungkan Google Sheet:
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700 text-[11px] leading-relaxed">
                  <li>
                    Buka Google Sheet nilai membaca siswa Anda, atau unduh format CSV dari tab{' '}
                    <strong>Ekspor / Impor CSV</strong> lalu buka di Google Sheets.
                  </li>
                  <li>
                    Pilih menu <strong>Extensions &gt; Apps Script</strong>.
                  </li>
                  <li>
                    Buka tab <strong>Kode Google Apps Script</strong> di atas, salin kodenya, dan tempelkan ke editor Google Apps Script.
                  </li>
                  <li>
                    Klik <strong>Deploy &gt; New deployment</strong>, pilih tipe <strong>Web app</strong>, atur <em>Who has access</em> ke <strong>Anyone</strong>, lalu deploy.
                  </li>
                  <li>
                    Salin <strong>Web app URL</strong> yang dihasilkan dan tempelkan di kotak di atas.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">
                    Kode Google Apps Script (Code.gs)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Tempelkan kode ini di Google Sheet: Extensions &gt; Apps Script &gt; Code.gs
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-900 text-emerald-300 font-mono text-[11px] leading-relaxed max-h-[320px] overflow-y-auto border border-slate-800 select-all">
                  {GOOGLE_APPS_SCRIPT_TEMPLATE}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'csv' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block">
                  Ekspor Data ke Format Google Sheet / CSV
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Unduh 150 baris data membaca siswa saat ini dalam format CSV standar. Anda dapat langsung mengunggah file ini ke Google Drive dan membukanya sebagai Google Sheet.
                </p>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Data CSV (150 Baris)</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block">
                  Unggah File CSV Lokal
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Jika Anda memiliki data evaluasi membaca dalam format CSV, Anda dapat mengunggahnya langsung ke aplikasi tanpa melalui Google Apps Script.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-sm">
                  <Upload className="w-4 h-4" />
                  <span>Pilih File CSV</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportCSV}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-2">
                <span className="font-bold text-rose-900 block">
                  Reset ke Data Sintetik Awal
                </span>
                <p className="text-slate-600 text-[11px]">
                  Kembalikan dataset ke 30 siswa contoh awal (SMP Negeri 1, Kelas VIII-A/B/C, Sesi 1–5).
                </p>
                <button
                  onClick={() => {
                    onResetDemoData();
                    setStatusMessage({
                      type: 'info',
                      text: 'Data telah direset ke dataset demo sintetik awal.',
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer"
                >
                  Reset ke Demo Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Google Sheets API Bridge</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-900 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
