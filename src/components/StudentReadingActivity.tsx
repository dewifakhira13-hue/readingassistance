import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Search,
  RotateCcw,
  LogOut,
  ChevronRight,
  Award,
  Check,
} from 'lucide-react';
import {
  Grade5ReadingPassage,
  Grade5Question,
  GRADE_5_PASSAGES,
} from '../data/grade5ReadingData';
import { consultAIRead } from '../services/aiReadService';
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

export const StudentReadingActivity: React.FC<StudentReadingActivityProps> = ({
  studentName = 'Aisyah Putri',
  attendanceCode = '05',
  studentSchool = 'SD Negeri 1',
  studentCode = 'STU-05',
  studentGrade,
  initialPassageId,
  onExit,
  onOpenGuide,
}) => {
  // Passage state
  const [selectedPassageIndex, setSelectedPassageIndex] = useState(() => {
    if (initialPassageId) {
      const idx = GRADE_5_PASSAGES.findIndex((p) => p.id === initialPassageId);
      if (idx !== -1) return idx;
    }
    return 0;
  });
  const currentPassage = GRADE_5_PASSAGES[selectedPassageIndex];

  // Activity flow state (Phase: 'reading' -> 'answering' -> 'completed')
  const [flowPhase, setFlowPhase] = useState<'reading' | 'answering' | 'completed'>('reading');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // Question interaction state
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [evidenceStepActive, setEvidenceStepActive] = useState(false);
  const [studentEvidence, setStudentEvidence] = useState('');

  // AI-READ Assistant State
  const [aiMessage, setAiMessage] = useState<string>(
    'Hello! I am AI-READ, your reading assistant. Take your time to read the passage carefully. You can click any highlighted word to learn its meaning!'
  );
  const [highlightedParagraph, setHighlightedParagraph] = useState<number | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Score summary
  const [userScoreData, setUserScoreData] = useState<
    Record<
      string,
      {
        questionId: string;
        skill: string;
        attempts: number;
        isCorrect: boolean;
        selectedKey: string;
      }
    >
  >({});

  const currentQuestion: Grade5Question = currentPassage.questions[currentQuestionIdx];

  // Handle clicking a vocabulary word in the passage
  const handleVocabularyClick = async (word: string) => {
    setIsLoadingAi(true);
    const resp = await consultAIRead({
      action: 'explain_vocabulary',
      passage: currentPassage,
      targetWord: word,
    });
    setAiMessage(resp.message);
    if (resp.suggestedParagraph) {
      setHighlightedParagraph(resp.suggestedParagraph);
    }
    setIsLoadingAi(false);
  };

  // Ready to answer questions
  const handleReadyToAnswer = () => {
    setFlowPhase('answering');
    setCurrentQuestionIdx(0);
    resetQuestionState();
    setAiMessage(
      `Great job finishing the reading! Let's answer Question 1 together. Remember, I am here to give hints and guide you to evidence!`
    );
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setAttemptCount(0);
    setIsQuestionSubmitted(false);
    setIsAnswerCorrect(null);
    setEvidenceStepActive(false);
    setStudentEvidence('');
    setHighlightedParagraph(null);
  };

  // Student requests a hint
  const handleRequestHint = async () => {
    if (!currentQuestion) return;
    setIsLoadingAi(true);
    const resp = await consultAIRead({
      action: 'request_hint',
      passage: currentPassage,
      currentQuestion,
      attemptNumber: attemptCount + 1,
    });
    setAiMessage(resp.message);
    if (resp.suggestedParagraph) {
      setHighlightedParagraph(resp.suggestedParagraph);
    }
    setIsLoadingAi(false);
  };

  // Student submits their answer for the current question
  const handleSubmitAnswer = async () => {
    if (!selectedOption || !currentQuestion) return;

    setIsLoadingAi(true);
    const newAttempt = attemptCount + 1;
    setAttemptCount(newAttempt);
    setIsQuestionSubmitted(true);

    const resp = await consultAIRead({
      action: 'check_answer',
      passage: currentPassage,
      currentQuestion,
      selectedOptionKey: selectedOption,
      attemptNumber: newAttempt,
    });

    setIsAnswerCorrect(resp.isCorrect || false);
    setAiMessage(resp.message);

    if (resp.suggestedParagraph) {
      setHighlightedParagraph(resp.suggestedParagraph);
    }

    if (resp.isCorrect) {
      // Record answer
      setUserScoreData((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          skill: currentQuestion.skill,
          attempts: newAttempt,
          isCorrect: true,
          selectedKey: selectedOption,
        },
      }));
      setEvidenceStepActive(true);
    }

    setIsLoadingAi(false);
  };

  // Student moves to next question
  const handleNextQuestion = () => {
    if (currentQuestionIdx < currentPassage.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      resetQuestionState();
      setAiMessage(
        `Moving to Question ${currentQuestionIdx + 2}. Read the question carefully!`
      );
    } else {
      // Completed all questions in the passage
      setFlowPhase('completed');
      setAiMessage(
        `Outstanding work, ${studentCode}! You have completed all reading questions for "${currentPassage.title}". Here is your feedback summary!`
      );
    }
  };

  // Reset entire activity
  const handleRestartActivity = () => {
    setFlowPhase('reading');
    setCurrentQuestionIdx(0);
    resetQuestionState();
    setUserScoreData({});
    setAiMessage(
      'Activity restarted! Read the passage carefully and click any difficult words for support.'
    );
  };

  // Calculate skill score for summary
  const totalCorrect = Object.values(userScoreData).filter((v) => v.isCorrect).length;
  const totalQuestions = currentPassage.questions.length;

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

  return (
    <div className="min-h-screen bg-[#070e1c] text-slate-100 font-['Inter',sans-serif] flex flex-col select-none overflow-x-hidden">
      {/* Top Header Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800/90 sticky top-0 z-20 px-4 sm:px-6 py-3 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Badge */}
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
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Murid: <strong className="text-cyan-300">{studentName}</strong> (Absen: {attendanceCode} • {studentSchool} • {studentGrade})
              </p>
            </div>
          </div>

          {/* Passage / Activity Switcher */}
          <div className="flex items-center gap-2 max-w-full">
            <label className="text-[11px] text-slate-400 hidden sm:inline">Aktivitas:</label>
            <select
              value={selectedPassageIndex}
              onChange={(e) => {
                setSelectedPassageIndex(Number(e.target.value));
                setFlowPhase('reading');
                resetQuestionState();
                setUserScoreData({});
              }}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-400 max-w-[280px] truncate cursor-pointer font-medium"
            >
              {GRADE_5_PASSAGES.map((p, idx) => {
                let prefix = '🌟 Sesi Treatment';
                if (p.category === 'pre-test') prefix = '📝 PRE-TEST';
                else if (p.category === 'post-test') prefix = '🎓 POST-TEST';
                else if (p.sessionNumber) prefix = `🌟 Sesi ${p.sessionNumber}`;
                return (
                  <option key={p.id} value={idx}>
                    {prefix}: {p.title} ({p.questions.length} Soal)
                  </option>
                );
              })}
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

      {/* Main Reading Activity Workspace */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col gap-6">
        {/* Step Indicator Tracker */}
        <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full font-bold text-xs ${
                flowPhase === 'reading'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              1. Read Passage
            </span>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span
              className={`px-3 py-1 rounded-full font-bold text-xs ${
                flowPhase === 'answering'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              2. Questions ({flowPhase === 'answering' ? `${currentQuestionIdx + 1}/${currentPassage.questions.length}` : `${currentPassage.questions.length} Questions`})
            </span>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span
              className={`px-3 py-1 rounded-full font-bold text-xs ${
                flowPhase === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              3. Final Feedback
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI-READ Assistant Active</span>
          </div>
        </div>

        {/* 2-Column Responsive Reading Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          {/* Left Column (8 cols): Reading Passage */}
          <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              {/* Passage Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                      {currentPassage.category === 'pre-test'
                        ? 'Pre-Test'
                        : currentPassage.category === 'post-test'
                        ? 'Post-Test'
                        : currentPassage.textType || currentPassage.focus}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                      {currentPassage.questions.length} Soal
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5 font-['Plus_Jakarta_Sans',sans-serif]">
                    {currentPassage.title}
                  </h2>
                  {currentPassage.instruction && (
                    <div className="mt-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl font-medium flex items-center gap-2">
                      <span className="font-bold text-amber-400">Petunjuk:</span>
                      <span>{currentPassage.instruction}</span>
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg shrink-0">
                  📖 {currentPassage.estimatedMinutes ? `±${currentPassage.estimatedMinutes} mins` : `±${Math.ceil(currentPassage.wordCount / 60)} mins`}
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
                  <span>Click a difficult word for AI-READ explanation:</span>
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

              {/* Dedicated Kotak Terjemahan ke Bahasa Indonesia (Per Kata) */}
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
                  <span>I Have Finished Reading! Start Questions</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column (5 cols): AI-READ Assistant & Question Area */}
          <div className="lg:col-span-5 space-y-5">
            {/* AI-READ Assistant Speech Bubble Card */}
            <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-cyan-950/40 rounded-2xl p-5 border border-cyan-500/30 shadow-xl text-left relative overflow-hidden">
              <div className="flex items-center gap-2.5 pb-3 border-b border-cyan-500/20 mb-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                    AI-READ Assistant
                  </h3>
                  <span className="text-[10px] text-cyan-300">Grade 5 Reading Guide</span>
                </div>
              </div>

              {/* Message from AI */}
              <div className="min-h-[70px] text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-cyan-500/20">
                {isLoadingAi ? (
                  <div className="flex items-center gap-2 text-cyan-300">
                    <span className="animate-spin">⏳</span>
                    <span>AI-READ is thinking...</span>
                  </div>
                ) : (
                  <p>{aiMessage}</p>
                )}
              </div>

              {/* Quick Action Buttons for AI Support */}
              {flowPhase === 'answering' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={handleRequestHint}
                    disabled={isLoadingAi || isAnswerCorrect === true}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Ask for Hint</span>
                  </button>

                  <button
                    onClick={() => {
                      if (currentQuestion) {
                        setHighlightedParagraph(currentQuestion.targetParagraph);
                        setAiMessage(`Check [Paragraph ${currentQuestion.targetParagraph}] for clues!`);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Show Target Paragraph</span>
                  </button>
                </div>
              )}
            </div>

            {/* Questions Arena (Active in 'answering' phase) */}
            {flowPhase === 'answering' && currentQuestion && (
              <div className="bg-slate-900/80 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl text-left space-y-4">
                {/* Question Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                      {currentQuestion.questionNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      Question {currentQuestion.questionNumber} of {currentPassage.questions.length}
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
                    let optionStyle =
                      'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600';

                    if (isSelected) {
                      optionStyle = 'bg-cyan-950/70 border-cyan-400 text-white ring-1 ring-cyan-400';
                    }
                    if (isQuestionSubmitted && isSelected) {
                      if (isAnswerCorrect) {
                        optionStyle = 'bg-emerald-950/70 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400';
                      } else {
                        optionStyle = 'bg-rose-950/70 border-rose-400 text-rose-200 ring-1 ring-rose-400';
                      }
                    }

                    return (
                      <button
                        key={opt.key}
                        disabled={isAnswerCorrect === true}
                        onClick={() => {
                          setSelectedOption(opt.key);
                          setIsQuestionSubmitted(false);
                        }}
                        className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                      >
                        <span className="w-5 h-5 rounded-md bg-slate-700/80 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {opt.key}
                        </span>
                        <span className="flex-1 leading-snug">{opt.text}</span>
                        {isSelected && isQuestionSubmitted && isAnswerCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isSelected && isQuestionSubmitted && isAnswerCorrect === false && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Submit / Try Again / Next Buttons */}
                <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
                  {!isAnswerCorrect && (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedOption || isLoadingAi}
                      className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>{attemptCount === 0 ? 'Submit Answer' : 'Submit Retry'}</span>
                      <Check className="w-4 h-4" />
                    </button>
                  )}

                  {/* Evidence Rule prompt when correct */}
                  {evidenceStepActive && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold text-emerald-300">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Evidence Rule: Which part of the text supports your answer?</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Supporting sentence found in Paragraph {currentQuestion.targetParagraph}:
                      </p>
                      <blockquote className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 italic text-[11px] text-slate-300">
                        &ldquo;{currentQuestion.correctEvidenceSentence}&rdquo;
                      </blockquote>

                      <button
                        onClick={handleNextQuestion}
                        className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Continue to Next Question</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Completed Summary View (Phase 3) */}
            {flowPhase === 'completed' && (
              <div className="bg-slate-900/80 rounded-2xl p-6 border border-emerald-500/40 shadow-2xl text-left space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                      Reading Activity Completed!
                    </h3>
                    <p className="text-xs text-slate-400">
                      Great job, {studentCode}! You completed &ldquo;{currentPassage.title}&rdquo;.
                    </p>
                  </div>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                    <span className="text-[11px] text-slate-400 block">Total Questions</span>
                    <span className="text-xl font-black text-white mt-1 block">
                      {totalQuestions}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                    <span className="text-[11px] text-emerald-300 block">Mastered Questions</span>
                    <span className="text-xl font-black text-emerald-400 mt-1 block">
                      {totalCorrect} / {totalQuestions}
                    </span>
                  </div>
                </div>

                {/* 4 Skills Feedback */}
                <div className="space-y-2 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Skill Mastery Breakdown:
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
                            ({data.correct}/{data.total} item)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-cyan-300">{pct}%</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              pct >= 80
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                                : pct >= 50
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                            }`}
                          >
                            {pct >= 80 ? 'Mastered ✓' : pct >= 50 ? 'Developing' : 'Needs Practice'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleRestartActivity}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Read Again</span>
                  </button>
                  <button
                    onClick={onExit}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Done / Back to Home</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
