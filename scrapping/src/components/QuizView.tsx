import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, ArrowLeft, RotateCcw, Award, BookOpen, AlertCircle } from 'lucide-react';

interface QuizViewProps {
  onQuizScoreUpdated: (score: number) => void;
  onNavigateToModule: (moduleId: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onQuizScoreUpdated, onNavigateToModule }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Load saved answers or finished state from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('jejak_data_quiz_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.userAnswers) setUserAnswers(parsed.userAnswers);
        if (parsed.isFinished) setIsFinished(parsed.isFinished);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];
  const selectedAnswerId = userAnswers[currentQ.id];
  const isAnswered = selectedAnswerId !== undefined;
  const isCorrect = isAnswered && selectedAnswerId === currentQ.correctId;

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return; // prevent changing after answered

    const updated = { ...userAnswers, [currentQ.id]: optionId };
    setUserAnswers(updated);

    // Save to localStorage
    localStorage.setItem(
      'jejak_data_quiz_state',
      JSON.stringify({ userAnswers: updated, isFinished: false })
    );
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate total score and finish
      let score = 0;
      QUIZ_QUESTIONS.forEach((q) => {
        if (userAnswers[q.id] === q.correctId) {
          score += 1;
        }
      });
      setIsFinished(true);
      onQuizScoreUpdated(score);
      localStorage.setItem('jejak_data_quiz_score', score.toString());
      localStorage.setItem(
        'jejak_data_quiz_state',
        JSON.stringify({ userAnswers, isFinished: true })
      );
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
    localStorage.removeItem('jejak_data_quiz_state');
  };

  // Calculate stats on finish
  const calculateResultStats = () => {
    let score = 0;
    const wrongByModule: Record<number, { name: string; count: number }> = {};

    QUIZ_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctId) {
        score += 1;
      } else {
        if (!wrongByModule[q.moduleId]) {
          wrongByModule[q.moduleId] = { name: q.moduleName, count: 0 };
        }
        wrongByModule[q.moduleId].count += 1;
      }
    });

    const percent = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    const passed = percent >= 70;

    return { score, percent, passed, wrongByModule };
  };

  const resultStats = isFinished ? calculateResultStats() : null;

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Evaluasi Kompetensi Mandiri</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Kuis Pemahaman: 15 Soal Praktis Kaggle & Scraping
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Uji ketajaman pemahaman konsep Anda: dari pemilihan API vs Kaggle vs Scraping, struktur selector HTML, penanganan status code HTTP, hingga kepatuhan etika dan regulasi privasi.
            </p>
          </div>
          {isFinished && (
            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-700 hover:text-stone-900 bg-stone-200/70 rounded cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Kuis</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Quiz Flow or Final Result */}
      {!isFinished ? (
        <div className="bg-white border border-stone-300 rounded-lg shadow-sm overflow-hidden">
          
          {/* Progress Header */}
          <div className="bg-stone-100 px-5 py-3 border-b border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-stone-500">Soal {currentIndex + 1} dari {QUIZ_QUESTIONS.length}</span>
              <span className="text-stone-300">|</span>
              <span className="font-medium text-amber-800">{currentQ.moduleName}</span>
            </div>
            <span className="font-mono text-stone-500">
              {Object.keys(userAnswers).length}/{QUIZ_QUESTIONS.length} Terjawab
            </span>
          </div>

          {/* Question Text */}
          <div className="p-5 sm:p-6 space-y-6">
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswerId === opt.id;
                const isCorrectOption = opt.id === currentQ.correctId;

                let buttonClass = 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-800';

                if (isAnswered) {
                  if (isCorrectOption) {
                    buttonClass = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-1 ring-emerald-500 font-medium';
                  } else if (isSelected && !isCorrectOption) {
                    buttonClass = 'border-rose-400 bg-rose-50/80 text-rose-950 ring-1 ring-rose-400';
                  } else {
                    buttonClass = 'border-stone-200 opacity-60 text-stone-500';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm flex items-start gap-3 transition-all cursor-pointer ${buttonClass}`}
                  >
                    <span className="font-mono font-bold w-6 h-6 rounded-full bg-stone-200/80 text-stone-700 flex items-center justify-center shrink-0 text-xs">
                      {opt.id}
                    </span>
                    <span className="flex-1 pt-0.5 leading-relaxed">{opt.text}</span>
                    {isAnswered && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {isAnswered && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation Feedback */}
            {isAnswered && (
              <div
                className={`p-4 rounded-lg border text-xs leading-relaxed transition-all ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="font-mono font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Jawaban Anda Tepat Sekali!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      <span>Belum Tepat (Kunci: {currentQ.correctId})</span>
                    </>
                  )}
                </div>
                <p className="mt-1 font-sans">{currentQ.explanation}</p>

                {/* Specific explanation for selected wrong answer */}
                {!isCorrect && currentQ.wrongExplanations && currentQ.wrongExplanations[selectedAnswerId] && (
                  <div className="mt-2 pt-2 border-t border-amber-200/60 text-stone-700 font-sans">
                    <strong>Mengapa opsi {selectedAnswerId} keliru?</strong>{' '}
                    {currentQ.wrongExplanations[selectedAnswerId]}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-200 text-stone-950 disabled:text-stone-400 font-bold text-xs rounded transition-all cursor-pointer"
              >
                <span>{currentIndex === QUIZ_QUESTIONS.length - 1 ? 'Lihat Skor Akhir' : 'Soal Berikutnya'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* Results View */
        <div className="bg-white border border-stone-300 rounded-lg shadow-sm p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-700 mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900">
              Hasil Kuis Kompetensi Anda
            </h3>
            
            <div className="py-4">
              <div className="text-4xl sm:text-5xl font-mono font-bold text-stone-900">
                {resultStats?.score} <span className="text-xl text-stone-400 font-normal">/ {QUIZ_QUESTIONS.length}</span>
              </div>
              <div className="text-sm font-mono text-stone-600 mt-1">
                Persentase Keberhasilan: <span className="font-bold text-amber-700">{resultStats?.percent}%</span>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg border text-xs font-medium ${
                resultStats?.passed
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              {resultStats?.passed
                ? ' Selamat! Anda menguasai prinsip dasar pengambilan data dengan sangat baik.'
                : ' Tetap semangat! Anda membutuhkan sedikit penguatan di beberapa modul sebelum memulai proyek riil.'}
            </div>
          </div>

          {/* Module-by-module Recommendations */}
          <div className="pt-6 border-t border-stone-200 space-y-4">
            <h4 className="text-sm font-mono uppercase tracking-wider text-stone-700 font-bold">
              Rekomendasi Modul yang Perlu Diulas:
            </h4>

            {resultStats && Object.keys(resultStats.wrongByModule).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(resultStats.wrongByModule).map(([modId, info]) => (
                  <div
                    key={modId}
                    className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900">{info.name}</div>
                      <div className="text-stone-600 mt-0.5">
                        Anda melewatkan <strong className="text-amber-800">{info.count} soal</strong> pada topik ini.
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigateToModule(Number(modId))}
                      className="px-2.5 py-1.5 bg-amber-200/70 hover:bg-amber-300 text-amber-950 font-medium rounded transition-colors cursor-pointer shrink-0"
                    >
                      Buka Modul
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded bg-stone-50 text-xs text-stone-600 text-center">
                Luar biasa! Tidak ada modul yang perlu diulang. Anda menjawab semua pertanyaan dengan benar!
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-stone-200 flex justify-center gap-3">
            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs rounded transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Coba Kuis Sekali Lagi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
