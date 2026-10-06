import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  ArrowRight,
  LogOut,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Compass,
  Lock,
  Key,
  XCircle,
  CheckCircle2,
  Check,
} from 'lucide-react';
import {
  Grade5ReadingPassage,
  Grade5Question,
  GRADE_5_PASSAGES,
} from '../data/grade5ReadingData';
import { WordTranslationBox } from './WordTranslationBox';

interface StudentReadingActivityProps {
  studentName?: string;
  attendanceCode?: string;
  studentSchool?: string;
  studentCode?: string;
  studentGrade: string;
  initialPassageId?: string;
  onExit: () => void;
  onOpenGuide: () => void;
}

interface UserAnswerRecord {
  questionId: string;
  questionNumber: number;
  questionText: string;
  skill: string;
  attempts: number;
  isCorrect: boolean;
  selectedKey: 'A' | 'B' | 'C' | 'D';
  correctKey: 'A' | 'B' | 'C' | 'D';
  selectedText: string;
  correctText: string;
  reasoning: string;
  evidenceSentence: string;
  targetParagraph: number;
}

interface SavedTestResult {
  studentName: string;
  attendanceCode: string;
  studentSchool: string;
  studentGrade: string;
  completedAt: string;
  totalQuestions: number;
  totalCorrect: number;
  score: number;
  skillBreakdown: Record<string, { total: number; correct: number }>;
}

export const StudentReadingActivity: React.FC<StudentReadingActivityProps> = ({
  studentName = 'Siswa',
  attendanceCode = '-',
  studentSchool = 'Sekolah',
  studentGrade,
  initialPassageId,
  onExit,
  onOpenGuide,
}) => {
  // Passage sequence:
  // Index 0: PRE-TEST (20 items)
  // Index 1: AYO BERLATIH (10 items)
  // Index 2: POST-TEST (20 items)
  const [selectedPassageIndex, setSelectedPassageIndex] = useState(() => {
    if (initialPassageId) {
      const idx = GRADE_5_PASSAGES.findIndex((p) => p.id === initialPassageId);
      if (idx !== -1) return idx;
    }
    return 0; // Default: always start at Pre-Test
  });
  const currentPassage = GRADE_5_PASSAGES[selectedPassageIndex] || GRADE_5_PASSAGES[0];

  // Activity flow state ('reading' -> 'answering' -> 'completed')
  const [flowPhase, setFlowPhase] = useState<'reading' | 'answering' | 'completed'>('reading');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // Question interaction state
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [highlightedParagraph, setHighlightedParagraph] = useState<number | null>(null);

  // Detailed records of all answers
  const [userScoreData, setUserScoreData] = useState<Record<string, UserAnswerRecord>>({});

  // Review section accordion toggle in completion view
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  // Password modal state for Post-Test
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Storage key generator tied strictly to this student
  const cleanName = (studentName || 'student').trim().toLowerCase().replace(/\s+/g, '_');
  const cleanAbsen = (attendanceCode || '0').trim();
  const pretestStorageKey = `airead_pretest_${cleanName}_${cleanAbsen}`;
  const ayoBerlatihStorageKey = `airead_ayoberlatih_${cleanName}_${cleanAbsen}`;
  const posttestStorageKey = `airead_posttest_${cleanName}_${cleanAbsen}`;

  // Strict progression lock trackers (Ayo Berlatih starts LOCKED until Pre-Test is finished)
  const [isPreTestDone, setIsPreTestDone] = useState<boolean>(() => {
    try {
      const sessionFlag = sessionStorage.getItem(`active_pretest_${cleanName}_${cleanAbsen}`);
      if (sessionFlag === 'true') return true;
      const specificData = localStorage.getItem(pretestStorageKey);
      if (specificData) {
        const parsed = JSON.parse(specificData);
        return !!(parsed && parsed.totalQuestions && parsed.completedAt);
      }
    } catch {
      // ignore
    }
    return false; // Default: LOCKED
  });

  const [isAyoBerlatihDone, setIsAyoBerlatihDone] = useState<boolean>(() => {
    try {
      const sessionFlag = sessionStorage.getItem(`active_ayoberlatih_${cleanName}_${cleanAbsen}`);
      if (sessionFlag === 'true') return true;
      const specificData = localStorage.getItem(ayoBerlatihStorageKey);
      if (specificData) {
        const parsed = JSON.parse(specificData);
        return !!(parsed && parsed.completedAt);
      }
    } catch {
      // ignore
    }
    return false; // Default: LOCKED
  });

  const currentQuestion: Grade5Question = currentPassage.questions[currentQuestionIdx];

  // Stage identifiers
  const isPreTest = currentPassage.category === 'pre-test';
  const isAyoBerlatih = currentPassage.category === 'treatment' || currentPassage.id.includes('AYO-BERLATIH');
  const isPostTest = currentPassage.category === 'post-test';

  // Feature flag: Evaluation box (Image 2) active for Ayo Berlatih and Post-Test, but OFF for Pre-Test
  const showEvaluationBox = !isPreTest;

  // Handle clicking a vocabulary word in the passage
  const handleVocabularyClick = (word: string) => {
    const vocab = currentPassage.vocabularyList.find(
      (v) => v.word.toLowerCase() === word.toLowerCase()
    );
    if (vocab) {
      setHighlightedParagraph(vocab.paragraph);
    }
  };

  // Ready to answer questions
  const handleReadyToAnswer = () => {
    setFlowPhase('answering');
    setCurrentQuestionIdx(0);
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setIsQuestionSubmitted(false);
    setIsAnswerCorrect(null);
    setHighlightedParagraph(null);
  };

  // Move to next question or complete stage
  const handleNextQuestion = () => {
    if (currentQuestionIdx < currentPassage.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      resetQuestionState();
    } else {
      resetQuestionState();
      setFlowPhase('completed');
    }
  };

  // Direct progression for Pre-Test (NO evaluation box, student answers and moves directly)
  const handlePreTestNextQuestion = () => {
    if (!selectedOption || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correctKey;
    const selectedOptObj = currentQuestion.options.find((o) => o.key === selectedOption);
    const correctOptObj = currentQuestion.options.find((o) => o.key === currentQuestion.correctKey);

    // Record answer details in background
    setUserScoreData((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        questionNumber: currentQuestion.questionNumber,
        questionText: currentQuestion.questionText,
        skill: currentQuestion.skill,
        attempts: 1,
        isCorrect,
        selectedKey: selectedOption,
        correctKey: currentQuestion.correctKey,
        selectedText: selectedOptObj?.text || '',
        correctText: correctOptObj?.text || '',
        reasoning:
          currentQuestion.reasoning ||
          `Kunci jawaban yang tepat adalah [${currentQuestion.correctKey}]. Perhatikan bukti kalimat dalam paragraf ${currentQuestion.targetParagraph}.`,
        evidenceSentence: currentQuestion.correctEvidenceSentence,
        targetParagraph: currentQuestion.targetParagraph,
      },
    }));

    handleNextQuestion();
  };

  // Submit answer for Ayo Berlatih & Post-Test (Displays Kotak Evaluasi / Jawaban from Gambar 2)
  const handleSubmitAnswerWithEvaluation = () => {
    if (!selectedOption || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correctKey;
    const selectedOptObj = currentQuestion.options.find((o) => o.key === selectedOption);
    const correctOptObj = currentQuestion.options.find((o) => o.key === currentQuestion.correctKey);

    setIsQuestionSubmitted(true);
    setIsAnswerCorrect(isCorrect);
    setHighlightedParagraph(currentQuestion.targetParagraph);

    // Record answer details
    setUserScoreData((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        questionNumber: currentQuestion.questionNumber,
        questionText: currentQuestion.questionText,
        skill: currentQuestion.skill,
        attempts: 1,
        isCorrect,
        selectedKey: selectedOption,
        correctKey: currentQuestion.correctKey,
        selectedText: selectedOptObj?.text || '',
        correctText: correctOptObj?.text || '',
        reasoning:
          currentQuestion.reasoning ||
          `Kunci jawaban yang tepat adalah [${currentQuestion.correctKey}]. Perhatikan bukti kalimat dalam paragraf ${currentQuestion.targetParagraph}.`,
        evidenceSentence: currentQuestion.correctEvidenceSentence,
        targetParagraph: currentQuestion.targetParagraph,
      },
    }));
  };

  // Calculate scores for summary
  const totalQuestions = currentPassage.questions.length;
  const totalCorrect = Object.values(userScoreData).filter((v) => v.isCorrect).length;
  const currentScore = Math.round((totalCorrect / totalQuestions) * 100);

  const skillBreakdown = useMemo(() => {
    const map: Record<string, { total: number; correct: number }> = {
      'Main Idea': { total: 0, correct: 0 },
      'Specific Information': { total: 0, correct: 0 },
      'Inference': { total: 0, correct: 0 },
      'Vocabulary in Context': { total: 0, correct: 0 },
    };
    currentPassage.questions.forEach((q) => {
      if (!map[q.skill]) {
        map[q.skill] = { total: 0, correct: 0 };
      }
      map[q.skill].total += 1;
      if (userScoreData[q.id]?.isCorrect) {
        map[q.skill].correct += 1;
      }
    });
    return map;
  }, [currentPassage, userScoreData]);

  // When completing a stage, handle saving & updating stage flags
  useEffect(() => {
    if (flowPhase !== 'completed') return;

    if (isPreTest) {
      const pretestPayload: SavedTestResult = {
        studentName,
        attendanceCode,
        studentSchool,
        studentGrade,
        completedAt: new Date().toISOString(),
        totalQuestions,
        totalCorrect,
        score: currentScore,
        skillBreakdown,
      };
      try {
        localStorage.setItem(pretestStorageKey, JSON.stringify(pretestPayload));
        sessionStorage.setItem(`active_pretest_${cleanName}_${cleanAbsen}`, 'true');
        setIsPreTestDone(true); // Unlock Ayo Berlatih immediately!
      } catch (e) {
        console.error('Failed to save pretest result:', e);
      }
    } else if (isAyoBerlatih) {
      const ayoPayload = {
        studentName,
        attendanceCode,
        completedAt: new Date().toISOString(),
        score: currentScore,
        totalCorrect,
        totalQuestions,
      };
      try {
        localStorage.setItem(ayoBerlatihStorageKey, JSON.stringify(ayoPayload));
        sessionStorage.setItem(`active_ayoberlatih_${cleanName}_${cleanAbsen}`, 'true');
        setIsAyoBerlatihDone(true); // Unlock Post-Test!
      } catch (e) {
        console.error('Failed to save ayo berlatih result:', e);
      }
    } else if (isPostTest) {
      const posttestPayload: SavedTestResult = {
        studentName,
        attendanceCode,
        studentSchool,
        studentGrade,
        completedAt: new Date().toISOString(),
        totalQuestions,
        totalCorrect,
        score: currentScore,
        skillBreakdown,
      };
      try {
        localStorage.setItem(posttestStorageKey, JSON.stringify(posttestPayload));
      } catch (e) {
        console.error('Failed to save posttest result:', e);
      }
    }
  }, [flowPhase, isPreTest, isAyoBerlatih, isPostTest, currentScore, totalCorrect, totalQuestions, skillBreakdown, pretestStorageKey, ayoBerlatihStorageKey, posttestStorageKey, studentName, attendanceCode, studentSchool, studentGrade, cleanName, cleanAbsen]);

  // Retrieve saved pretest result for comparison during post-test review
  const savedPretest = useMemo<SavedTestResult | null>(() => {
    if (flowPhase !== 'completed' || !isPostTest) {
      return null;
    }
    try {
      const raw = localStorage.getItem(pretestStorageKey);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading pretest from localStorage:', e);
    }
    return null;
  }, [flowPhase, isPostTest, pretestStorageKey]);

  // Comparison metrics for post-test review
  const comparisonData = useMemo(() => {
    if (!savedPretest) return null;
    const preScore = savedPretest.score;
    const postScore = currentScore;
    const gainScore = postScore - preScore;
    const preCorrect = savedPretest.totalCorrect;
    const postCorrect = totalCorrect;
    const gainCorrect = postCorrect - preCorrect;
    const isImproved = gainScore > 0 || gainCorrect > 0;
    const isSame = gainScore === 0 && gainCorrect === 0;
    const isDecreased = gainScore < 0;

    return {
      preScore,
      postScore,
      gainScore,
      preCorrect,
      postCorrect,
      gainCorrect,
      isImproved,
      isSame,
      isDecreased,
    };
  }, [savedPretest, currentScore, totalCorrect]);

  // Navigation: Pre-Test ➔ Ayo Berlatih (ensures Ayo Berlatih is open right after Pre-Test)
  const handleGoToAyoBerlatih = () => {
    setIsPreTestDone(true);
    const ayoIdx = GRADE_5_PASSAGES.findIndex(
      (p) => p.category === 'treatment' || p.id.includes('AYO-BERLATIH')
    );
    setSelectedPassageIndex(ayoIdx !== -1 ? ayoIdx : 1);
    setFlowPhase('reading');
    setCurrentQuestionIdx(0);
    resetQuestionState();
    setUserScoreData({});
  };

  // Trigger Post-Test password modal
  const handleOpenPostTestModal = () => {
    setPasswordInput('');
    setPasswordError('');
    setIsPasswordModalOpen(true);
  };

  // Verify password and unlock Post-Test
  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === '123abc') {
      setIsPasswordModalOpen(false);
      const postIdx = GRADE_5_PASSAGES.findIndex((p) => p.category === 'post-test');
      setSelectedPassageIndex(postIdx !== -1 ? postIdx : 2);
      setFlowPhase('reading');
      setCurrentQuestionIdx(0);
      resetQuestionState();
      setUserScoreData({});
    } else {
      setPasswordError('Password salah! Silakan tanyakan kepada Guru Anda.');
    }
  };

  // Strict manual dropdown check: prevents clicking locked stages
  const handleSelectPassage = (targetIdx: number) => {
    if (targetIdx === 1 && !isPreTestDone) {
      alert('Sesi AYO BERLATIH masih terkunci 🔒! Siswa wajib menyelesaikan seluruh soal PRE-TEST terlebih dahulu.');
      return;
    }
    if (targetIdx === 2) {
      if (!isPreTestDone) {
        alert('Sesi POST-TEST masih terkunci 🔒! Siswa wajib menyelesaikan PRE-TEST terlebih dahulu.');
        return;
      }
      if (!isAyoBerlatihDone) {
        alert('Sesi POST-TEST masih terkunci 🔒! Siswa wajib menyelesaikan sesi AYO BERLATIH terlebih dahulu.');
        return;
      }
      // Require password
      handleOpenPostTestModal();
      return;
    }

    setSelectedPassageIndex(targetIdx);
    setFlowPhase('reading');
    setCurrentQuestionIdx(0);
    resetQuestionState();
    setUserScoreData({});
  };

  return (
    <div className="min-h-screen bg-[#070e1c] text-slate-100 font-['Inter',sans-serif] flex flex-col select-none overflow-x-hidden">
      {/* Top Header Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800/90 sticky top-0 z-20 px-4 sm:px-6 py-3 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Student Badge */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  AI-READ
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Grade 5
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isPreTest
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      : isAyoBerlatih
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  }`}
                >
                  {isPreTest ? '1. 📝 PRE-TEST' : isAyoBerlatih ? '2. 📖 AYO BERLATIH' : '3. 🎓 POST-TEST'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Murid: <strong className="text-cyan-300">{studentName}</strong> (No. Absen: {attendanceCode} • {studentSchool} • {studentGrade})
              </p>
            </div>
          </div>

          {/* Sequential Stage Navigation Dropdown (Ayo Berlatih strictly locked until pre-test is done) */}
          <div className="flex items-center gap-2 max-w-full">
            <label className="text-[11px] text-slate-400 hidden sm:inline">Alur Sesi:</label>
            <select
              value={selectedPassageIndex}
              onChange={(e) => handleSelectPassage(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400 max-w-[280px] truncate cursor-pointer font-medium"
            >
              <option value={0}>
                1. 📝 PRE-TEST (20 Soal) — The School Garden (Pre-Test)
              </option>
              <option value={1} disabled={!isPreTestDone}>
                {`2. 📖 AYO BERLATIH (10 Soal) — Ayo Berlatih: The School Garden${!isPreTestDone ? ' [🔒 Terkunci - Selesaikan Pre-Test]' : ''}`}
              </option>
              <option value={2} disabled={!isAyoBerlatihDone}>
                {`3. 🎓 POST-TEST (20 Soal) — The School Garden (Post-Test)${!isAyoBerlatihDone ? ' [🔒 Terkunci - Selesaikan Ayo Berlatih]' : ' [🔑 Butuh Password]'}`}
              </option>
            </select>

            {/* Help / Petunjuk Button */}
            <button
              onClick={onOpenGuide}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Petunjuk Aktivitas AI-READ"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Petunjuk</span>
            </button>

            {/* Exit Button */}
            <button
              onClick={onExit}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Keluar / Ganti Siswa"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col gap-6">
        {/* Step Progression Bar: Pre-Test -> Ayo Berlatih -> Post-Test */}
        <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Step 1: Pre-Test */}
            <span
              className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 ${
                isPreTest
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 ring-1 ring-amber-400/30'
                  : isPreTestDone
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isPreTestDone ? '✓' : '1.'} Pre-Test (20 Soal)
            </span>
            <ChevronRight className="w-4 h-4 text-slate-600" />

            {/* Step 2: Ayo Berlatih (Locked with Lock icon until Pre-Test completes) */}
            <span
              className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 ${
                isAyoBerlatih
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40 ring-1 ring-blue-400/30'
                  : isAyoBerlatihDone
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-800'
              }`}
            >
              {!isPreTestDone && <Lock className="w-3 h-3 text-amber-400" />}
              {isAyoBerlatihDone ? '✓' : '2.'} Ayo Berlatih (10 Soal)
            </span>
            <ChevronRight className="w-4 h-4 text-slate-600" />

            {/* Step 3: Post-Test */}
            <span
              className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 ${
                isPostTest
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 ring-1 ring-emerald-400/30'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-800'
              }`}
            >
              {!isAyoBerlatihDone && <Lock className="w-3 h-3 text-slate-500" />}
              3. Post-Test (20 Soal)
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Fase: <strong className="text-white">{flowPhase === 'reading' ? 'Membaca Teks' : flowPhase === 'answering' ? `Menjawab Soal (${currentQuestionIdx + 1}/${currentPassage.questions.length})` : 'Hasil & Evaluasi'}</strong></span>
          </div>
        </div>

        {/* 2-Column Clean Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          {/* Left Column (7 cols): Reading Passage & Word Translation Box */}
          <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              {/* Passage Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isPreTest
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                          : isAyoBerlatih
                          ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      }`}
                    >
                      {isPreTest ? 'Tahap 1: Pre-Test' : isAyoBerlatih ? 'Tahap 2: Ayo Berlatih' : 'Tahap 3: Post-Test'}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                      {currentPassage.questions.length} Soal
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5 font-['Plus_Jakarta_Sans',sans-serif]">
                    {currentPassage.title}
                  </h2>
                  <div className="mt-2 text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-xl font-medium flex items-center gap-2">
                    <span className="font-bold text-cyan-400">Instruksi:</span>
                    <span>{currentPassage.instruction || 'Read each text carefully and choose the best answer.'}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg shrink-0">
                  📖 {currentPassage.wordCount} Kata
                </div>
              </div>

              {/* Passage Paragraphs */}
              <div className="space-y-4 py-5 text-sm sm:text-base text-slate-200 leading-relaxed text-left">
                {currentPassage.paragraphs.map((p) => (
                  <div
                    key={p.number}
                    className={`p-3.5 rounded-xl transition-all ${
                      highlightedParagraph === p.number
                        ? 'bg-cyan-950/40 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/30'
                        : 'bg-slate-800/30 border border-slate-800/60'
                    }`}
                  >
                    <span className="inline-block text-[10px] font-bold text-cyan-400 bg-slate-800 px-2 py-0.5 rounded mr-2 mb-1">
                      Paragraph {p.number}
                    </span>
                    <p className="inline text-slate-200 font-normal">{p.text}</p>
                  </div>
                ))}
              </div>

              {/* Interactive Vocabulary Helper Chips */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kosa kata penting dalam teks (klik untuk menyorot paragraf):</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentPassage.vocabularyList.map((v) => (
                    <button
                      key={v.word}
                      onClick={() => handleVocabularyClick(v.word)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>{v.word}</span>
                      <span className="text-[9px] text-cyan-400/70">(P{v.paragraph})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Kamus Terjemahan Per Kata */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <WordTranslationBox
                  currentPassage={currentPassage}
                  onSelectWord={(w) => handleVocabularyClick(w)}
                />
              </div>
            </div>

            {/* Ready to Answer Button (Only in reading phase) */}
            {flowPhase === 'reading' && (
              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={handleReadyToAnswer}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>Saya Sudah Selesai Membaca! Mulai Jawab {currentPassage.questions.length} Soal</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Focused Question Arena or Completion Summary */}
          <div className="lg:col-span-5 space-y-5">
            {/* Phase 1 (Reading Phase): Guidance Card */}
            {flowPhase === 'reading' && (
              <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-xl text-left space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Panduan Membaca</h3>
                </div>
                <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                  <p>
                    1. Baca teks bacaan di sebelah kiri dengan tenang dan teliti.
                  </p>
                  <p>
                    2. Jika menemukan kata sulit, gunakan <strong>Kamus Terjemahan Per Kata</strong> di bawah teks bacaan.
                  </p>
                  <p>
                    3. Setelah selesai membaca, klik tombol hijau <strong>&ldquo;Saya Sudah Selesai Membaca!&rdquo;</strong> untuk mulai menjawab pertanyaan.
                  </p>
                </div>
              </div>
            )}

            {/* Phase 2: Questions Arena */}
            {flowPhase === 'answering' && currentQuestion && (
              <div className="bg-slate-900/80 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl text-left space-y-4">
                {/* Question Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                      {currentQuestion.questionNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      Soal {currentQuestion.questionNumber} dari {currentPassage.questions.length}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-400/30">
                    Skill: {currentQuestion.skill}
                  </span>
                </div>

                {/* Question Text */}
                <p className="text-sm font-semibold text-white leading-snug">
                  {currentQuestion.questionText}
                </p>

                {/* 4 Multiple Choice Options */}
                <div className="space-y-2.5 pt-1">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOption === opt.key;
                    const isThisTheCorrectKey = opt.key === currentQuestion.correctKey;

                    let optionStyle =
                      'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600';

                    // Selection style when answering or before submitting
                    if (isSelected && (!showEvaluationBox || !isQuestionSubmitted)) {
                      optionStyle =
                        'bg-cyan-950/80 border-cyan-400 text-white ring-1 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]';
                    }

                    // For Ayo Berlatih & Post-Test after submission: show evaluation highlight
                    if (showEvaluationBox && isQuestionSubmitted) {
                      if (isSelected) {
                        if (isAnswerCorrect) {
                          optionStyle =
                            'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400';
                        } else {
                          optionStyle =
                            'bg-rose-950/80 border-rose-400 text-rose-200 ring-1 ring-rose-400';
                        }
                      } else if (isThisTheCorrectKey && !isAnswerCorrect) {
                        optionStyle =
                          'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 border-dashed';
                      } else {
                        optionStyle =
                          'bg-slate-800/30 border-slate-800 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={opt.key}
                        disabled={showEvaluationBox && isQuestionSubmitted}
                        onClick={() => {
                          if (!showEvaluationBox || !isQuestionSubmitted) {
                            setSelectedOption(opt.key);
                          }
                        }}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${optionStyle}`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            showEvaluationBox && isQuestionSubmitted && isSelected && isAnswerCorrect
                              ? 'bg-emerald-500 text-slate-950'
                              : showEvaluationBox && isQuestionSubmitted && isSelected && !isAnswerCorrect
                              ? 'bg-rose-500 text-white'
                              : isSelected
                              ? 'bg-cyan-400 text-slate-950'
                              : 'bg-slate-700/80 text-white'
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span className="flex-1 leading-snug">{opt.text}</span>
                        {showEvaluationBox && isQuestionSubmitted && isSelected && isAnswerCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {showEvaluationBox && isQuestionSubmitted && isSelected && !isAnswerCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        {showEvaluationBox && isQuestionSubmitted && !isSelected && isThisTheCorrectKey && !isAnswerCorrect && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Kunci Benar
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* ------------------------------------------------------------- */}
                {/* CASE A: PRE-TEST (NO EVALUATION BOX, DIRECT NEXT BUTTON) */}
                {/* ------------------------------------------------------------- */}
                {!showEvaluationBox && (
                  <div className="pt-3 border-t border-slate-800">
                    <button
                      disabled={!selectedOption}
                      onClick={handlePreTestNextQuestion}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <span>
                        {currentQuestionIdx < currentPassage.questions.length - 1
                          ? `Lanjut ke Soal ${currentQuestionIdx + 2} →`
                          : 'Selesai & Kumpulkan Jawaban 🎓'}
                      </span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* CASE B: AYO BERLATIH & POST-TEST (EVALUATION BOX AS IN GAMBAR 2) */}
                {/* ------------------------------------------------------------- */}
                {showEvaluationBox && (
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    {/* Before submission: "Kirim Jawaban" button */}
                    {!isQuestionSubmitted && (
                      <button
                        onClick={handleSubmitAnswerWithEvaluation}
                        disabled={!selectedOption}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Kirim Jawaban (Submit Answer)</span>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    )}

                    {/* After submission: Kotak Evaluasi / Jawaban (Persis seperti Gambar 2) */}
                    {isQuestionSubmitted && (
                      <div className="space-y-3">
                        {isAnswerCorrect ? (
                          <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs space-y-2 shadow-md">
                            <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              <span>Jawaban Kamu Benar! (Correct Answer)</span>
                            </div>
                            <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                              Pilihan kamu: <strong>[{selectedOption}]</strong> tepat sesuai informasi teks bacaan.
                            </p>
                            <div className="pt-2 border-t border-emerald-500/30 text-[11px] text-slate-200">
                              <span className="font-bold text-emerald-300 block mb-1">
                                💡 Alasan &amp; Penjelasan (Reasoning):
                              </span>
                              <p className="leading-relaxed">{currentQuestion.reasoning}</p>
                            </div>
                            <div className="pt-2 border-t border-emerald-500/30 text-[11px] text-slate-300">
                              <span className="font-bold text-emerald-300 block mb-1">
                                📖 Bukti Kalimat Teks (Paragraph {currentQuestion.targetParagraph}):
                              </span>
                              <blockquote className="p-2 rounded-lg bg-slate-900/80 border border-emerald-500/30 italic text-[11px] text-emerald-200">
                                &ldquo;{currentQuestion.correctEvidenceSentence}&rdquo;
                              </blockquote>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs space-y-2 shadow-md">
                            <div className="flex items-center gap-2 font-bold text-sm text-rose-300">
                              <XCircle className="w-5 h-5 text-rose-400" />
                              <span>Jawaban Belum Tepat</span>
                            </div>
                            <div className="text-[11px] text-slate-200 leading-relaxed space-y-1">
                              <p>
                                Pilihan kamu: <strong className="text-rose-300">[{selectedOption}]</strong>
                              </p>
                              <p>
                                Kunci jawaban yang benar:{' '}
                                <strong className="text-emerald-300">
                                  [{currentQuestion.correctKey}] {currentQuestion.options.find((o) => o.key === currentQuestion.correctKey)?.text}
                                </strong>
                              </p>
                            </div>
                            <div className="pt-2 border-t border-rose-500/30 text-[11px] text-slate-200">
                              <span className="font-bold text-amber-300 block mb-1">
                                💡 Alasan &amp; Penjelasan (Reasoning):
                              </span>
                              <p className="leading-relaxed">{currentQuestion.reasoning}</p>
                            </div>
                            <div className="pt-2 border-t border-rose-500/30 text-[11px] text-slate-300">
                              <span className="font-bold text-amber-300 block mb-1">
                                📖 Bukti Kalimat Teks (Paragraph {currentQuestion.targetParagraph}):
                              </span>
                              <blockquote className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 italic text-[11px] text-slate-300">
                                &ldquo;{currentQuestion.correctEvidenceSentence}&rdquo;
                              </blockquote>
                            </div>
                          </div>
                        )}

                        {/* Button to advance to next question */}
                        <button
                          onClick={handleNextQuestion}
                          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                        >
                          <span>
                            {currentQuestionIdx < currentPassage.questions.length - 1
                              ? `Lanjut ke Soal ${currentQuestionIdx + 2} →`
                              : 'Selesai & Lihat Hasil Evaluasi 🎓'}
                          </span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Phase 3: Completed Summary View */}
            {flowPhase === 'completed' && (
              <div className="bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-emerald-500/40 shadow-2xl text-left space-y-6">
                {/* Header Badge */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                      {isPreTest ? 'Pre-Test Selesai!' : isAyoBerlatih ? 'Sesi Ayo Berlatih Selesai!' : 'Post-Test Selesai & Review Hasil!'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Siswa: <strong className="text-cyan-300">{studentName}</strong> • {currentPassage.title}
                    </p>
                  </div>
                </div>

                {/* ==================================================== */}
                {/* 1. PRE-TEST SUMMARY SCREEN */}
                {/* ==================================================== */}
                {isPreTest && (
                  <div className="space-y-5">
                    {/* Score Cards */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                        <span className="text-[11px] text-slate-400 block">Total Soal</span>
                        <span className="text-2xl font-black text-white mt-1 block">
                          20 Soal
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                        <span className="text-[11px] text-emerald-300 block">Skor Pre-Test Awal</span>
                        <span className="text-2xl font-black text-emerald-400 mt-1 block">
                          {currentScore} <span className="text-xs font-semibold text-slate-400">({totalCorrect}/20 Benar)</span>
                        </span>
                      </div>
                    </div>

                    {/* Pre-Test Notification & Sequence Notice */}
                    <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-cyan-300">
                        <Star className="w-4 h-4 text-cyan-400" />
                        <span>Pre-Test Telah Selesai! Saatnya Melatih Kemampuanmu</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Nilai Pre-Test kamu tersimpan sebagai data awal. Sekarang, mari lanjutkan ke tahap berikutnya yaitu <strong>Ayo Berlatih</strong> untuk memperkuat strategi membaca pemahamanmu!
                      </p>
                    </div>

                    {/* Skill Breakdown */}
                    <div className="space-y-2 text-xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Capaian Pre-Test Per Indikator Membaca:
                      </span>
                      {(
                        [
                          'Main Idea',
                          'Specific Information',
                          'Inference',
                          'Vocabulary in Context',
                        ] as const
                      ).map((skillName) => {
                        const data = skillBreakdown[skillName] || { total: 0, correct: 0 };
                        if (data.total === 0) return null;
                        const pct = Math.round((data.correct / data.total) * 100);
                        return (
                          <div
                            key={skillName}
                            className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between"
                          >
                            <div>
                              <span className="font-semibold text-slate-200">{skillName}</span>
                              <span className="text-[10px] text-slate-400 ml-2">
                                ({data.correct}/{data.total} soal)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-cyan-300">{pct}%</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  pct >= 75
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                                    : pct >= 50
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                                }`}
                              >
                                {pct >= 75 ? 'Kuasai ✓' : pct >= 50 ? 'Cukup' : 'Perlu Latihan'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ONLY BUTTON ALLOWED AFTER PRE-TEST: Ayo Berlatih */}
                    <div className="pt-2">
                      <button
                        onClick={handleGoToAyoBerlatih}
                        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                      >
                        <span>Ayo Berlatih ➔</span>
                        <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ==================================================== */}
                {/* 2. AYO BERLATIH SUMMARY SCREEN */}
                {/* ==================================================== */}
                {isAyoBerlatih && (
                  <div className="space-y-5">
                    {/* Score Cards */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                        <span className="text-[11px] text-slate-400 block">Total Latihan</span>
                        <span className="text-2xl font-black text-white mt-1 block">
                          10 Soal
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/40">
                        <span className="text-[11px] text-blue-300 block">Hasil Latihan</span>
                        <span className="text-2xl font-black text-blue-300 mt-1 block">
                          {currentScore} <span className="text-xs font-semibold text-slate-400">({totalCorrect}/10 Benar)</span>
                        </span>
                      </div>
                    </div>

                    {/* Congratulations & Preparation for Post-Test */}
                    <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-blue-300">
                        <Award className="w-4 h-4 text-blue-400" />
                        <span>Sesi Ayo Berlatih Berhasil Diselesaikan!</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Kamu telah mempraktikkan cara mencari bukti teks dan memahami informasi bacaan. Sekarang saatnya membuktikan kemampuanmu pada tahap akhir: <strong>Post-Test</strong>!
                      </p>
                    </div>

                    {/* BUTTON AFTER AYO BERLATIH: Mulai Post-Test Sekarang with Password Modal (123abc) */}
                    <div className="pt-2">
                      <button
                        onClick={handleOpenPostTestModal}
                        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                      >
                        <Lock className="w-4 h-4 stroke-[2.5]" />
                        <span>Mulai Post-Test Sekarang 🚀</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ==================================================== */}
                {/* 3. POST-TEST SUMMARY & COMPARISON REVIEW SCREEN */}
                {/* ==================================================== */}
                {isPostTest && (
                  <div className="space-y-6">
                    {/* Comparison 3-Column Card */}
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">
                        📊 Perbandingan Hasil Pre-Test &amp; Post-Test:
                      </span>
                      <div className="grid grid-cols-3 gap-2.5 text-center">
                        {/* Pre-Test Box */}
                        <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700">
                          <span className="text-[10px] text-slate-400 block font-semibold">Pre-Test Awal</span>
                          <span className="text-xl font-black text-white mt-1 block">
                            {comparisonData ? comparisonData.preScore : savedPretest?.score ?? '-'}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {comparisonData ? `${comparisonData.preCorrect}/20 Benar` : '-'}
                          </span>
                        </div>

                        {/* Post-Test Box */}
                        <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/50">
                          <span className="text-[10px] text-cyan-300 block font-semibold">Post-Test Akhir</span>
                          <span className="text-xl font-black text-cyan-300 mt-1 block">
                            {currentScore}
                          </span>
                          <span className="text-[10px] text-cyan-400/80 block">
                            {totalCorrect}/20 Benar
                          </span>
                        </div>

                        {/* Gain / Progress Box */}
                        <div
                          className={`p-3 rounded-xl border ${
                            comparisonData && comparisonData.isImproved
                              ? 'bg-emerald-950/60 border-emerald-400/60'
                              : comparisonData && comparisonData.isSame
                              ? 'bg-amber-950/40 border-amber-500/40'
                              : 'bg-slate-800/60 border-slate-700'
                          }`}
                        >
                          <span className="text-[10px] text-slate-300 block font-semibold">Perkembangan (Gain)</span>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            {comparisonData && comparisonData.gainScore > 0 ? (
                              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : comparisonData && comparisonData.gainScore < 0 ? (
                              <TrendingDown className="w-4 h-4 text-rose-400 shrink-0" />
                            ) : (
                              <Minus className="w-4 h-4 text-amber-400 shrink-0" />
                            )}
                            <span
                              className={`text-xl font-black ${
                                comparisonData && comparisonData.isImproved
                                  ? 'text-emerald-300'
                                  : comparisonData && comparisonData.gainScore < 0
                                  ? 'text-rose-300'
                                  : 'text-amber-300'
                              }`}
                            >
                              {comparisonData
                                ? comparisonData.gainScore > 0
                                  ? `+${comparisonData.gainScore}`
                                  : `${comparisonData.gainScore}`
                                : '0'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-300 block">
                            {comparisonData
                              ? comparisonData.gainCorrect >= 0
                                ? `+${comparisonData.gainCorrect} Soal`
                                : `${comparisonData.gainCorrect} Soal`
                              : '-'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* JIKA MENGALAMI PENINGKATAN: Apresiasi & Kata Afirmatif */}
                    {comparisonData && comparisonData.isImproved ? (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-teal-950/70 to-cyan-950/80 border border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.2)] text-emerald-100 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-300">
                          <Star className="w-6 h-6 text-amber-300 fill-amber-300 animate-pulse" />
                          <h4 className="text-base font-black tracking-wide font-['Plus_Jakarta_Sans',sans-serif]">
                            🌟 BRILLIANT! EXCELLENT ACHIEVEMENT!
                          </h4>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                          Luar biasa sekali, <strong className="text-amber-300">{studentName}</strong>! Kemampuan membacamu terbukti mengalami perkembangan yang sangat nyata dan membanggakan!
                        </p>

                        <p className="text-xs text-emerald-100/90 leading-relaxed">
                          Nilaimu melonjak dari <strong className="text-white">{comparisonData.preScore}</strong> pada Pre-Test menjadi <strong className="text-white">{comparisonData.postScore}</strong> pada Post-Test (meningkat sebesar <strong className="text-amber-300">+{comparisonData.gainScore} poin</strong> dan <strong className="text-amber-300">+{comparisonData.gainCorrect} soal benar</strong>). Kamu membuktikan bahwa kamu adalah pembaca yang hebat, teliti, dan cerdas (<em>Outstanding Super Reader</em>)! Terus pertahankan prestasi dan semangat belajarmu! 🎉👏
                        </p>

                        <div className="pt-2 border-t border-emerald-500/30 text-xs text-slate-200">
                          <span className="font-bold text-emerald-300 block mb-1">
                            🔍 Analisis Perkembangan Kemampuan Membaca:
                          </span>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Siswa berhasil meningkatkan ketelitian dalam mengidentifikasi informasi rinci (<em>Specific Information</em>) serta penarikan kesimpulan tersirat (<em>Inference</em>). Strategi membaca terarah dan pencarian bukti teks (<em>textual evidence</em>) terbukti berdampak positif secara signifikan.
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* JIKA BELUM MENGALAMI PENINGKATAN: Evaluasi & Rekomendasi Hangat untuk Anak Usia 10-11 Tahun */
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/70 via-slate-900 to-blue-950/70 border border-amber-400/50 shadow-lg text-slate-100 space-y-3.5">
                        <div className="flex items-center gap-2 text-amber-300">
                          <Compass className="w-5 h-5 text-amber-400" />
                          <h4 className="text-sm sm:text-base font-extrabold tracking-wide font-['Plus_Jakarta_Sans',sans-serif]">
                            📖 Evaluasi &amp; Rekomendasi Belajar Membaca untuk {studentName}
                          </h4>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed">
                          Halo <strong className="text-amber-300">{studentName}</strong>, tetap semangat ya! Kamu sudah berusaha dengan sangat baik menyelesaikan 20 soal bacaan ini. Dalam belajar membaca bahasa Inggris, setiap anak memiliki proses dan kecepatannya masing-masing. Nilai Pre-Test kamu ({comparisonData ? comparisonData.preScore : 'Awal'}) dan Post-Test kamu ({currentScore}) menunjukkan kamu punya potensi hebat yang masih bisa terus diasah!
                        </p>

                        <div className="pt-2 border-t border-amber-500/30 space-y-2 text-xs">
                          <span className="font-bold text-amber-300 block">
                            💡 Rekomendasi Tips Meningkatkan Kemampuan Membaca:
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-200">
                            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80">
                              <strong className="text-cyan-300 block mb-0.5">1. Cara Menemukan Ide Pokok (Main Idea)</strong>
                              <span>Baca kalimat pertama dan terakhir di setiap paragraf terlebih dahulu. Pesan utama cerita biasanya ada di sana!</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80">
                              <strong className="text-cyan-300 block mb-0.5">2. Cara Mencari Fakta (Specific Info)</strong>
                              <span>Jadilah seperti detektif! Cari kata kunci seperti nama hari (Monday), nama tempat (behind the library), atau nama benda di dalam teks sebelum menjawab.</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80">
                              <strong className="text-cyan-300 block mb-0.5">3. Cara Menarik Kesimpulan (Inference)</strong>
                              <span>Gabungkan petunjuk dari cerita dengan hal yang masuk akal di dunia nyata. Jangan terburu-buru, bayangkan ceritanya di kepalamu.</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80">
                              <strong className="text-cyan-300 block mb-0.5">4. Cara Memahami Kosa Kata Asing (Vocab)</strong>
                              <span>Jika bertemu kata sulit, jangan panik! Tebak artinya dari kalimat di sekitarnya atau manfaatkan fitur Kamus Terjemahan AI-READ.</span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-[11px] text-cyan-200 flex items-center gap-2">
                            <span className="text-base">⏰</span>
                            <span><strong>Rutin Membaca 10 Menit Sehari:</strong> Coba luangkan waktu santai 10–15 menit setiap hari untuk membaca cerita pendek bergambar bahasa Inggris bersama teman atau guru!</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Skill Comparison Breakdown Table */}
                    <div className="space-y-2 text-xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Detail Capaian Per Skill (Post-Test Saat Ini):
                      </span>
                      {(
                        [
                          'Main Idea',
                          'Specific Information',
                          'Inference',
                          'Vocabulary in Context',
                        ] as const
                      ).map((skillName) => {
                        const postData = skillBreakdown[skillName] || { total: 0, correct: 0 };
                        const preData = savedPretest?.skillBreakdown?.[skillName];
                        if (postData.total === 0) return null;
                        const postPct = Math.round((postData.correct / postData.total) * 100);
                        const prePct = preData ? Math.round((preData.correct / preData.total) * 100) : null;

                        return (
                          <div
                            key={skillName}
                            className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex flex-wrap items-center justify-between gap-2"
                          >
                            <div>
                              <span className="font-semibold text-slate-200">{skillName}</span>
                              <span className="text-[10px] text-slate-400 ml-2">
                                ({postData.correct}/{postData.total} item)
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              {prePct !== null && (
                                <span className="text-[11px] text-slate-400">
                                  Pre: <strong className="text-slate-300">{prePct}%</strong>
                                </span>
                              )}
                              <span className="text-[11px] text-cyan-300">
                                Post: <strong>{postPct}%</strong>
                              </span>
                              {prePct !== null && (
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    postPct > prePct
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : postPct === prePct
                                      ? 'bg-slate-700 text-slate-300'
                                      : 'bg-rose-500/20 text-rose-300'
                                  }`}
                                >
                                  {postPct > prePct ? `+${postPct - prePct}%` : `${postPct - prePct}%`}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ONLY FINAL BUTTON ON POST-TEST: Selesai / Kembali ke Menu Utama */}
                    <div className="pt-2">
                      <button
                        onClick={onExit}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <span>Selesai Seluruh Aktivitas &amp; Kembali ke Halaman Utama</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Collapsible Accordion: Review Questions with Clear Reasonings (In completed phase) */}
                <div className="pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setShowDetailedReview(!showDetailedReview)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 hover:text-cyan-200 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>{showDetailedReview ? 'Sembunyikan Review Soal' : `Lihat Review Lengkap ${currentPassage.questions.length} Soal & Alasan (Reasoning)`}</span>
                    </span>
                    {showDetailedReview ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {showDetailedReview && (
                    <div className="mt-3 space-y-3 max-h-[420px] overflow-y-auto pr-1">
                      {currentPassage.questions.map((q) => {
                        const ans = userScoreData[q.id];
                        const isCorrect = ans?.isCorrect ?? false;
                        const userKey = ans?.selectedKey ?? '-';

                        return (
                          <div
                            key={q.id}
                            className={`p-3 rounded-xl border text-xs text-left space-y-2 ${
                              isCorrect
                                ? 'bg-emerald-950/30 border-emerald-500/40'
                                : 'bg-rose-950/30 border-rose-500/40'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-white">
                                Soal {q.questionNumber}. [{q.skill}]
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isCorrect
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                                }`}
                              >
                                {isCorrect ? 'Benar ✓' : 'Salah ✗'}
                              </span>
                            </div>

                            <p className="text-slate-300 font-medium">{q.questionText}</p>

                            <div className="text-[11px] space-y-0.5">
                              <p>
                                Pilihan Siswa: <strong className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>[{userKey}]</strong>
                              </p>
                              <p>
                                Kunci Jawaban Benar: <strong className="text-emerald-300">[{q.correctKey}] {q.options.find((o) => o.key === q.correctKey)?.text}</strong>
                              </p>
                            </div>

                            {/* Reasoning */}
                            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                              <strong className="text-cyan-300 block mb-0.5">Alasan (Reasoning):</strong>
                              <span>{q.reasoning || `Sesuai dengan paragraf ${q.targetParagraph}.`}</span>
                            </div>

                            {/* Evidence sentence */}
                            <blockquote className="text-[10px] italic text-slate-400 border-l-2 border-slate-700 pl-2">
                              Bukti: &ldquo;{q.correctEvidenceSentence}&rdquo; (P{q.targetParagraph})
                            </blockquote>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Password Modal for Post-Test Access (Password: 123abc) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl max-w-sm w-full p-6 text-left shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shrink-0">
                <Key className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  Akses Post-Test Terkunci
                </h3>
                <p className="text-xs text-slate-400">
                  Minta password kepada Guru atau Peneliti
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password Post-Test:
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="Masukkan password..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-sm font-semibold outline-none transition-colors"
                />
                {passwordError && (
                  <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{passwordError}</span>
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Password default pengujian: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-bold">123abc</code>
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Buka Akses</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
