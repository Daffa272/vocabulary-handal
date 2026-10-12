import React, { useState } from 'react';
import { quizQuestions } from '../data/financialData';
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight } from 'lucide-react';

export const QuizModule: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const totalQuestions = quizQuestions.length;
  const currentQ = quizQuestions[currentIdx];

  const handleSelectOption = (questionId: number, label: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: label,
    }));
    setShowExplanation((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentIdx(0);
    setSubmitted(false);
  };

  const score = calculateScore();
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 mb-1">
          <span>Modul 06</span>
          <span aria-hidden="true">·</span>
          <span>Kuis & Uji Pemahaman Analis</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Evaluasi Mandiri: 10 Soal Analisis Laporan Keuangan
        </h2>
        <p className="mt-2 text-slate-600 max-w-3xl text-sm sm:text-base leading-relaxed">
          Uji pemahaman Anda terhadap konsep dasar Laba Rugi, Neraca, Arus Kas, Rasio Finansial, 
          dan penalaran studi kasus data riil. Dapatkan pembahasan lengkap untuk setiap jawaban.
        </p>
      </div>

      {/* Score Summary Banner if finished */}
      {submitted && (
        <div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Hasil Evaluasi Anda</h3>
                <p className="text-xs text-slate-300">
                  Skor: <span className="font-mono font-bold text-sky-400 text-sm">{score} / {totalQuestions}</span> Benar ({percentage}%)
                </p>
              </div>
            </div>

            <button
              onClick={handleResetQuiz}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Kuis</span>
            </button>
          </div>

          <div className="text-xs text-slate-300 pt-2 border-t border-slate-800 leading-relaxed">
            {percentage >= 80 ? (
              <span className="text-emerald-400 font-medium">
                Luar biasa! Anda telah menguasai fundamental akuntansi dan ketajaman audit laporan keuangan dengan sangat baik.
              </span>
            ) : percentage >= 50 ? (
              <span className="text-amber-400 font-medium">
                Bagus! Anda memahami konsep dasar dengan cukup baik. Pelajari kembali materi rasio anomali Perusahaan A dan arus kas akrual.
              </span>
            ) : (
              <span className="text-rose-400 font-medium">
                Terus berlatih! Buka kembali modul Laba Rugi dan Neraca untuk memperkuat pemahaman rumus dan konsep.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Question Card & Progress */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 lg:p-8 space-y-6">
        {/* Progress bar and question indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Soal {currentIdx + 1} dari {totalQuestions}</span>
            <span aria-hidden="true">·</span>
            <span className="text-sky-700 font-semibold">{currentQ.section}</span>
          </div>

          {/* Quick jump tabs */}
          <div className="flex items-center gap-1">
            {quizQuestions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
              const isCurrent = currentIdx === idx;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-7 h-7 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 text-white'
                      : isAnswered
                      ? isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {q.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.label;
              const isCorrect = opt.label === currentQ.correctAnswer;
              const hasAnswered = selectedAnswers[currentQ.id] !== undefined;

              let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 border-rose-300 text-rose-950';
                } else {
                  btnStyle = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={opt.label}
                  onClick={() => handleSelectOption(currentQ.id, opt.label)}
                  className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm flex items-start gap-3 transition-colors cursor-pointer ${btnStyle}`}
                >
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      hasAnswered && isCorrect
                        ? 'bg-emerald-600 text-white'
                        : hasAnswered && isSelected
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="flex-1 mt-0.5">{opt.text}</span>

                  {hasAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Immediate Explanation Card */}
        {showExplanation[currentQ.id] && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-700">
                Pembahasan Jawaban
              </span>
              <span className={`font-semibold ${selectedAnswers[currentQ.id] === currentQ.correctAnswer ? 'text-emerald-700' : 'text-rose-700'}`}>
                {selectedAnswers[currentQ.id] === currentQ.correctAnswer ? 'Jawaban Benar!' : 'Kurang Tepat'}
              </span>
            </div>

            {currentQ.formula && (
              <div className="font-mono text-sky-800 bg-sky-50 px-2.5 py-1 rounded border border-sky-100 inline-block">
                Rumus: {currentQ.formula}
              </div>
            )}

            <p className="text-slate-600 leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              currentIdx === 0
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-100 cursor-pointer'
            }`}
          >
            ← Soal Sebelumnya
          </button>

          {currentIdx < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIdx((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
            >
              <span>Soal Berikutnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setSubmitted(true)}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <span>Selesaikan & Lihat Skor</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
