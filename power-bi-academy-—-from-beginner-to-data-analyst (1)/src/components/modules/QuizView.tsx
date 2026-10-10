import React, { useState, useEffect } from 'react';
import { quizQuestionsList } from '../../data/quizzes';
import { QuizQuestion } from '../../types';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Award, 
  ArrowRight, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const QuizView: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem('powerbi_academy_quiz_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('powerbi_academy_quiz_answers', JSON.stringify(userAnswers));
    } catch {
      // ignore
    }
  }, [userAnswers]);

  const currentQ = quizQuestionsList[currentIdx];
  const selectedOptionId = userAnswers[currentQ.id];
  const isAnswered = selectedOptionId !== undefined;
  const selectedOption = currentQ.options.find(o => o.id === selectedOptionId);

  // Stats calculation
  const totalQuestions = quizQuestionsList.length;
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).reduce((acc, [qId, optId]) => {
    const q = quizQuestionsList.find(x => x.id === Number(qId));
    const opt = q?.options.find(o => o.id === optId);
    return opt?.isCorrect ? acc + 1 : acc;
  }, 0);

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  const handleSelectOption = (optId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optId
    }));
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setCurrentIdx(0);
    try {
      localStorage.removeItem('powerbi_academy_quiz_answers');
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>EVALUASI KOMPREHENSIF</span>
              <span>·</span>
              <span>8 TOPIK UTAMA ANALISIS</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Kuis & Uji Kompetensi Data Analyst
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Uji pemahaman Anda tentang metode koneksi, Power Query, Star Schema, formula DAX, interpretasi distribusi statistik, optimasi Big Data, dan keamanan RLS.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-mono">Skor Anda</span>
              <span className="text-xl font-bold text-cyan-400 font-mono">
                {scorePercentage}% ({correctCount}/{totalQuestions})
              </span>
            </div>
            <button
              onClick={handleResetQuiz}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 border border-slate-700 rounded-lg flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Kuis</span>
            </button>
          </div>
        </div>

        {/* Question Stepper Indicator */}
        <div className="flex flex-wrap items-center gap-1.5 mt-6 pt-4 border-t border-slate-800/80">
          {quizQuestionsList.map((q, idx) => {
            const ans = userAnswers[q.id];
            const isCorrect = ans && q.options.find(o => o.id === ans)?.isCorrect;
            const isCurrent = idx === currentIdx;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center ${
                  isCurrent
                    ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 bg-cyan-500 text-white font-bold'
                    : ans !== undefined
                    ? isCorrect
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/60'
                      : 'bg-red-950 text-red-300 border border-red-600/60'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            Pertanyaan {currentIdx + 1} dari {totalQuestions} · Kategori: {currentQ.category}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {isAnswered ? (selectedOption?.isCorrect ? '✅ Terjawab Benar' : '❌ Kurang Tepat') : 'Belum Dijawab'}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-base sm:text-lg font-bold text-white font-display leading-relaxed">
          {currentQ.question}
        </h2>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let optStyle = "bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40";

            if (isAnswered) {
              if (opt.isCorrect) {
                optStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-200 font-medium";
              } else if (isSelected && !opt.isCorrect) {
                optStyle = "bg-red-950/40 border-red-500 text-red-200";
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${optStyle}`}
              >
                <span className={`w-6 h-6 rounded-lg font-mono font-bold flex items-center justify-center shrink-0 text-xs mt-0.5 ${
                  isSelected 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {opt.id}
                </span>
                <span className="leading-relaxed flex-1">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* In-Depth Explanation Box (Appears after answer) */}
        {isAnswered && (
          <div className={`p-4 rounded-xl border text-xs space-y-2 ${
            selectedOption?.isCorrect 
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
              : 'bg-indigo-950/30 border-indigo-500/40 text-slate-300'
          }`}>
            <div className="flex items-center gap-2 font-bold font-mono">
              {selectedOption?.isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <HelpCircle className="w-4 h-4 text-amber-400" />
              )}
              <span>Pembahasan Jawaban:</span>
            </div>
            <p className="leading-relaxed text-[11px] sm:text-xs text-slate-300">
              {selectedOption?.explanation}
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
            className={`px-4 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
              currentIdx === 0 
                ? 'text-slate-600 cursor-not-allowed' 
                : 'text-slate-300 hover:text-white bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Sebelumnya</span>
          </button>

          <button
            onClick={() => setCurrentIdx(Math.min(totalQuestions - 1, currentIdx + 1))}
            disabled={currentIdx === totalQuestions - 1}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              currentIdx === totalQuestions - 1 
                ? 'text-slate-600 cursor-not-allowed' 
                : 'text-white bg-cyan-600 hover:bg-cyan-500'
            }`}
          >
            <span>Selanjutnya</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
