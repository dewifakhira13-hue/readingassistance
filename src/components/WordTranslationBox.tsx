import React, { useState, useEffect, useRef } from 'react';
import {
  Languages,
  Search,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  X,
  Volume2,
} from 'lucide-react';
import {
  translateWordToIndonesian,
  WordTranslationResult,
  GRADE_5_DICTIONARY,
  getWordPronunciation,
} from '../services/aiReadService';
import { Grade5ReadingPassage } from '../data/grade5ReadingData';

interface WordTranslationBoxProps {
  currentPassage: Grade5ReadingPassage;
  onSelectWord?: (word: string) => void;
}

export const WordTranslationBox: React.FC<WordTranslationBoxProps> = ({
  currentPassage,
  onSelectWord,
}) => {
  const [inputWord, setInputWord] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WordTranslationResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTranslate = async (wordToTranslate?: string) => {
    const target = (wordToTranslate || inputWord).trim();
    if (!target) {
      setResult(null);
      return;
    }

    setIsLoading(true);
    try {
      const translationResult = await translateWordToIndonesian(
        target,
        currentPassage.paragraphs.map((p) => p.text).join(' ')
      );
      setResult(translationResult);
    } catch (e) {
      // Fallback
      setResult({
        word: target,
        indonesianTranslation: target,
        partOfSpeech: 'kata bahasa Inggris',
        contextMeaning: `Kata "${target}" ada dalam teks bacaan. Perhatikan kalimatnya untuk memahami artinya.`,
        exampleSentence: `Look at how "${target}" is used in the text.`,
        exampleTranslation: `Perhatikan bagaimana "${target}" digunakan di dalam teks bacaan.`,
        isSingleWord: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced auto-translate as user types (no need to press Enter or Cari button)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = inputWord.trim();
    if (!trimmed) {
      setResult(null);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      handleTranslate(trimmed);
    }, 350);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputWord]);

  const handleQuickWordClick = (word: string) => {
    setInputWord(word);
    handleTranslate(word);
    if (onSelectWord) {
      onSelectWord(word);
    }
  };

  const handleClear = () => {
    setInputWord('');
    setResult(null);
  };

  // Pronounce word using browser speech synthesis
  const handlePlayPronunciation = (wordToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(wordToSpeak);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // slightly slower for Grade 5 learners
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Passage vocabulary words for quick one-click translation
  const quickWords = currentPassage.vocabularyList.map((v) => v.word);

  // Filter matching suggestions if typing
  const cleanInput = inputWord.toLowerCase().trim();
  const matchingSuggestions = cleanInput.length >= 2
    ? Object.keys(GRADE_5_DICTIONARY)
        .filter((k) => k.startsWith(cleanInput) && k !== cleanInput)
        .slice(0, 4)
    : [];

  return (
    <div className="bg-slate-900/90 rounded-2xl p-5 border border-cyan-500/30 shadow-xl text-left overflow-hidden min-w-0">
      {/* Box Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-cyan-500/20 mb-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-md">
            <Languages className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif] truncate">
              Kamus Terjemahan Per Kata (Word-by-Word)
            </h3>
            <p className="text-[11px] text-cyan-300 truncate">
              Otomatis muncul saat diketik • Tanpa perlu API Key
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0">
          ✓ Aktif Otomatis
        </span>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleTranslate();
        }}
        className="space-y-3"
      >
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            placeholder="Ketik 1 kata bahasa Inggris (misal: garden, observe, save, weed...)"
            className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-400 text-xs sm:text-sm font-medium transition-colors outline-none"
          />

          {inputWord && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-16 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Hapus kata"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            disabled={!inputWord.trim() || isLoading}
            className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
          >
            {isLoading ? (
              <span className="animate-spin text-xs">⏳</span>
            ) : (
              <span>Cari</span>
            )}
          </button>
        </div>

        {/* Dynamic matching suggestions while typing */}
        {matchingSuggestions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300 bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[10px]">Saran kata:</span>
            {matchingSuggestions.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => handleQuickWordClick(sug)}
                className="px-2 py-0.5 rounded-md bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-200 font-semibold cursor-pointer transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Quick word suggestions from current passage */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>Kata penting dalam teks ini:</span>
          </span>
          {quickWords.map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => handleQuickWordClick(word)}
              className="px-2 py-0.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 text-[11px] font-medium transition-colors cursor-pointer"
            >
              {word}
            </button>
          ))}
        </div>
      </form>

      {/* Warning if student inputs whole sentence */}
      {result?.warningMessage && (
        <div className="mt-3.5 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{result.warningMessage}</span>
        </div>
      )}

      {/* Loading state indicator */}
      {isLoading && !result && (
        <div className="mt-3.5 p-4 rounded-xl bg-slate-950/50 border border-cyan-500/20 text-center py-6">
          <div className="inline-block animate-spin text-lg mb-2">⏳</div>
          <p className="text-xs text-cyan-300 font-medium">Mencari arti kata &ldquo;{inputWord}&rdquo;...</p>
        </div>
      )}

      {/* Translation Result Card */}
      {result && result.isSingleWord && (
        <div className="mt-3.5 p-4 rounded-xl bg-slate-950/70 border border-cyan-500/30 space-y-3 animate-in fade-in duration-150">
          {/* Word Heading & Translation Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            {/* Left: Word, Part of Speech, and PRONUNCIATION UNDERNEATH */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-white capitalize font-['Plus_Jakarta_Sans',sans-serif] tracking-wide">
                  {result.word}
                </span>
                <span className="text-[10px] text-slate-300 font-medium italic bg-slate-800/90 px-2.5 py-0.5 rounded-md border border-slate-700/60">
                  {result.partOfSpeech}
                </span>
              </div>

              {/* TEPAT DI BAWAH KATA: Pronunciation Box & Audio Play Button */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-200 shadow-sm">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    Pronunciation:
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-100 tracking-wider">
                    {result.pronunciation || getWordPronunciation(result.word)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayPronunciation(result.word)}
                  className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
                    isPlayingAudio
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-pulse'
                      : 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border-cyan-400/40 text-cyan-200 hover:from-cyan-500/40 hover:to-blue-500/40 hover:text-white'
                  }`}
                  title="Dengarkan pengucapan kata bahasa Inggris (Pronunciation)"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce text-slate-950' : 'text-cyan-300'}`} />
                  <span>{isPlayingAudio ? 'Sedang Memutar Suara...' : 'Dengarkan Pengucapan'}</span>
                </button>
              </div>
            </div>

            {/* Right: Indonesian Translation Pill */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/50 px-3.5 py-2 rounded-xl shadow-inner self-start sm:self-auto">
              <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-emerald-400/90 block leading-none mb-0.5">
                  Arti Bahasa Indonesia
                </span>
                <span className="text-sm sm:text-base font-black text-emerald-300">
                  {result.indonesianTranslation}
                </span>
              </div>
            </div>
          </div>

          {/* Context Meaning in Indonesian */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
              Arti dalam Konteks Cerita:
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {result.contextMeaning}
            </p>
          </div>

          {/* Bilingual Example Sentence */}
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1 text-xs">
            <div className="flex items-start gap-1.5 text-slate-200">
              <span className="text-[10px] font-bold text-cyan-400 shrink-0">EN:</span>
              <span className="italic font-normal">&ldquo;{result.exampleSentence}&rdquo;</span>
            </div>
            <div className="flex items-start gap-1.5 text-emerald-300/90">
              <span className="text-[10px] font-bold text-emerald-400 shrink-0">ID:</span>
              <span className="font-normal">&ldquo;{result.exampleTranslation}&rdquo;</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
