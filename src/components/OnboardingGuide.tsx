import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  Eye,
  Check,
  Edit3,
  X,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Heart,
  Users,
  Lightbulb,
  Search,
  Award,
} from 'lucide-react';
import { Aurora3D } from './Aurora3D';

interface OnboardingGuideProps {
  onFinishGuide: () => void;
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({
  onFinishGuide,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      id: 'intro',
      tag: 'Pengantar & Penelitian',
      title: 'Petunjuk Aktivitas Membaca AI-READ (Grade 5)',
      subtitle: 'AI-assisted English reading activity for Grade 5 elementary school students',
      content: (
        <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed text-left">
          <p>
            Selamat datang di <strong className="text-cyan-300 font-semibold">AI-READ</strong>! Aktivitas ini dirancang khusus untuk mendampingi siswa kelas 5 SD (*Grade 5 elementary school*) dalam membaca teks bahasa Inggris dan menjawab pertanyaan pemahaman membaca secara mandiri.
          </p>

          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200">
            <strong className="block text-cyan-300 font-semibold mb-1 text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Research Context (Konteks Penelitian):</span>
            </strong>
            <p className="text-xs leading-relaxed text-slate-300">
              Aktivitas ini digunakan sebagai bagian dari intervensi edukasi terstruktur untuk meneliti pengaruh bantuan kecerdasan buatan (AI) terhadap pemahaman membaca (*English reading comprehension*) siswa sekolah dasar.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 flex items-start gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Student Privacy:</strong> Menggunakan kode siswa (*Student Code*, misal: <em>STU-05</em>). Tidak meminta data pribadi sensitif seperti alamat atau nomor telepon.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'core-principle',
      tag: 'Prinsip Utama & 4 Keterampilan',
      title: 'Core Principle: Reading Assistant, Not Answer Provider',
      subtitle: 'Peran AI-READ adalah memandu dan mendampingi, bukan memberikan jawaban langsung',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed text-left">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
            <strong className="block text-emerald-300 font-semibold mb-1 text-xs">
              Prinsip Pokok AI-READ:
            </strong>
            <p className="text-xs leading-relaxed">
              &ldquo;You are a reading assistant, not an answer provider.&rdquo; AI-READ membantu siswa memahami isi bacaan, memikirkan pertanyaan, menemukan bukti di teks, dan meningkatkan pemahaman secara mandiri.
            </p>
          </div>

          <div className="space-y-1.5">
            <strong className="text-white text-xs block font-semibold">
              4 Fokus Keterampilan Membaca (Reading Skills):
            </strong>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10">
                <span className="font-bold text-cyan-300 block">1. Main Idea</span>
                <span className="text-[11px] text-slate-300">Ide pokok dan topik utama keseluruhan teks.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10">
                <span className="font-bold text-emerald-300 block">2. Specific Information</span>
                <span className="text-[11px] text-slate-300">Fakta detail, tokoh, benda, dan lokasi cerita.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10">
                <span className="font-bold text-amber-300 block">3. Inference</span>
                <span className="text-[11px] text-slate-300">Menyimpulkan makna tersirat dari petunjuk teks.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10">
                <span className="font-bold text-purple-300 block">4. Vocabulary in Context</span>
                <span className="text-[11px] text-slate-300">Memahami arti kata sulit sesuai kalimatnya.</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'support-rules',
      tag: 'Bantuan & Perlindungan Jawaban',
      title: 'Allowed Support & Answer Protection Rules',
      subtitle: 'Ketentuan pemberian petunjuk (hints) dan perlindungan kunci jawaban',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed text-left">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
            <strong className="block text-amber-300 font-semibold mb-1">
              Aturan Perlindungan Jawaban (Answer Protection Rule):
            </strong>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
              <li>AI tidak pernah membocorkan opsi jawaban yang benar sebelum siswa mencoba.</li>
              <li>Jika jawaban salah pertama kali: AI memberikan <strong>1 petunjuk singkat</strong> dan mengarahkan ke paragraf yang relevan untuk mencoba lagi.</li>
              <li>Jika masih salah pada percobaan ke-2: AI memberikan petunjuk lebih kuat untuk mempertimbangkan kembali bukti di teks.</li>
            </ul>
          </div>

          <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs">
            <strong className="block text-cyan-300 font-semibold mb-1 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Evidence Rule &amp; Vocabulary Support:</span>
            </strong>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Ketika jawaban benar, AI menanyakan: <em>&ldquo;Which part of the text supports your answer?&rdquo;</em> untuk melatih kebiasaan membaca berbasis bukti. Kata sulit dijelaskan secara kontekstual dengan contoh kalimat sederhana.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'activity-flow',
      tag: 'Alur 10 Langkah',
      title: 'Alur Aktivitas Siswa (10-Step Activity Flow)',
      subtitle: 'Langkah terstruktur dari membaca hingga ringkasan akhir',
      content: (
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed text-left">
          <p className="text-[11px] text-slate-400">
            Setiap sesi membaca mengikuti prosedur baku yang sama:
          </p>
          <div className="space-y-1.5 max-h-[35vh] overflow-y-auto pr-1">
            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span><strong>Membaca Teks:</strong> Siswa membaca teks cerita/informasi dengan tenang.</span>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span><strong>Indikasi Siap:</strong> Siswa menekan tombol kesiapan setelah selesai membaca.</span>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span><strong>Dukungan Kosakata:</strong> Klik kata sulit untuk penjelasan dan contoh kalimat.</span>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">4-5</span>
              <span><strong>Satu Soal Setiap Waktu:</strong> Menjawab soal pilihan berganda secara terfokus.</span>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">6-8</span>
              <span><strong>Umpan Balik &amp; Bukti Teks:</strong> Petunjuk terarah jika keliru, verifikasi bukti jika benar.</span>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">9-10</span>
              <span><strong>Ringkasan Akhir:</strong> Ulasan penguasaan 4 keterampilan membaca di akhir sesi.</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onFinishGuide();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060c18]/85 backdrop-blur-md text-slate-100 flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none font-['Inter',sans-serif]">
      {/* 3D Glass Container */}
      <div className="w-full max-w-[580px] my-auto relative z-10 transition-all duration-300">
        {/* Exterior 3D Aurora Glow Rim */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400/40 via-cyan-400/30 to-violet-500/40 rounded-[28px] blur-md opacity-85" />

        <div className="relative rounded-[26px] bg-slate-900/95 backdrop-blur-2xl border border-white/20 border-t-white/40 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85),_inset_0_1px_1px_rgba(255,255,255,0.4)] p-5 sm:p-7 overflow-hidden text-left flex flex-col justify-between max-h-[90vh]">
          {/* Top Skip Button & Step Badge */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-bold uppercase tracking-wider">
                {currentStepData.tag}
              </span>
              <span className="text-slate-400 text-xs font-medium">
                Langkah {currentStep + 1} dari {steps.length}
              </span>
            </div>

            <button
              onClick={onFinishGuide}
              className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer font-medium hover:underline"
            >
              Tutup Petunjuk
            </button>
          </div>

          {/* Header Title */}
          <div className="mb-3 shrink-0">
            <h2 className="text-lg sm:text-xl font-bold text-white font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
              {currentStepData.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentStepData.subtitle}
            </p>
          </div>

          {/* Dynamic Content with Internal Scroll */}
          <div className="flex-1 overflow-y-auto pr-1 my-1 max-h-[48vh] space-y-3">
            {currentStepData.content}
          </div>

          {/* Footer Controls: Dots, Prev Button, and Next Button */}
          <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
            {/* Step Dots Indicator */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentStep
                      ? 'w-6 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                      : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={`Langkah ${idx + 1}`}
                />
              ))}
            </div>

            {/* Right Action Cluster with Next Button */}
            <div className="flex items-center gap-2 ml-auto">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 active:scale-[0.97] text-slate-950 font-bold text-xs py-2 px-3.5 rounded-xl shadow-[0_6px_20px_-4px_rgba(20,184,166,0.6),_inset_0_1px_1px_rgba(255,255,255,0.6)] border border-white/30 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>{isLastStep ? 'Mulai Aktivitas' : 'Next'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
