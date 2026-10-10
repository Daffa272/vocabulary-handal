import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { LEARNING_TOPICS, LearningTopic } from '../../data/learningTopics';

export const LearningCenterView: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(LEARNING_TOPICS[0].id);

  const activeTopic =
    LEARNING_TOPICS.find((t) => t.id === selectedTopicId) || LEARNING_TOPICS[0];

  // State for interactive inputs per topic
  const [inputValues, setInputValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    activeTopic.interactiveInputs.forEach((i) => {
      init[i.key] = i.defaultValue;
    });
    return init;
  });

  // State for quiz answers
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<Record<number, boolean>>({});

  const handleTopicChange = (newTopicId: string) => {
    setSelectedTopicId(newTopicId);
    const topic = LEARNING_TOPICS.find((t) => t.id === newTopicId);
    if (topic) {
      const init: Record<string, number> = {};
      topic.interactiveInputs.forEach((i) => {
        init[i.key] = i.defaultValue;
      });
      setInputValues(init);
      setSelectedAnswers({});
      setShowQuizResults({});
    }
  };

  const handleInputChange = (key: string, val: number) => {
    setInputValues((prev) => ({ ...prev, [key]: val }));
  };

  const outputs = activeTopic.computeOutput(inputValues);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            Interactive Corporate Finance Learning Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Laboratorium pemahaman fundamental keuangan: pelajari konsep teoritis, coba simulasi angka interaktif, dan uji pemahaman dengan kuis diagnostik.
          </p>
        </div>
      </div>

      {/* Main Layout: Topic Sidebar + Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Topic List Nav */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1.5 h-fit">
          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Daftar Modul Belajar
          </div>
          {LEARNING_TOPICS.map((topic, idx) => {
            const isActive = topic.id === activeTopic.id;
            return (
              <button
                key={topic.id}
                onClick={() => handleTopicChange(topic.id)}
                className={`w-full text-left p-2.5 rounded-md text-xs transition-colors flex items-start gap-2.5 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className="font-mono text-[10px] text-cyan-500 shrink-0 mt-0.5">
                  0{idx + 1}.
                </span>
                <span className="leading-snug">{topic.title}</span>
              </button>
            );
          })}
        </div>

        {/* Lesson View Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* 1. Theory & Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
              <BookOpen className="w-4 h-4" />
              <span>{activeTopic.category.toUpperCase()} MODULE</span>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">{activeTopic.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {activeTopic.summary}
            </p>

            {activeTopic.formula && (
              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs font-mono text-cyan-300">
                Formula Inti: {activeTopic.formula}
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              {activeTopic.content.map((paragraph, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                  <span className="text-cyan-500 font-bold shrink-0">•</span>
                  <span>{paragraph}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Interactive Live Sandbox */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white text-sm font-semibold">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Simulasi Angka Interaktif (Sandbox Playground)</span>
              </div>
              <span className="text-[11px] text-slate-400 italic">
                Ubah nilai input di bawah untuk melihat kalkulasi dan dampaknya secara real-time
              </span>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeTopic.interactiveInputs.map((input) => (
                <div key={input.key} className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{input.label}</span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {input.unit === '$' ? '$' : ''}{inputValues[input.key]?.toLocaleString()}{input.unit !== '$' ? ` ${input.unit}` : ''}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={inputValues[input.key] ?? input.defaultValue}
                    step={input.step}
                    onChange={(e) => handleInputChange(input.key, parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono"
                  />
                </div>
              ))}
            </div>

            {/* Calculated Outputs */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Hasil Perhitungan Dinamis:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {outputs.map((out, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/80 rounded border border-cyan-800/40 space-y-1">
                    <span className="text-[11px] text-slate-400 block">{out.label}</span>
                    <span className="text-lg font-bold font-mono text-cyan-300 block">{out.value}</span>
                    <span className="text-[10px] text-slate-500 block">{out.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Self-Assessment Quiz */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 text-white text-sm font-semibold">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Uji Pemahaman Finansial (Self-Assessment Quiz)</span>
            </div>

            <div className="space-y-4">
              {activeTopic.quiz.map((q, qIdx) => {
                const userChoice = selectedAnswers[qIdx];
                const isAnswered = userChoice !== undefined;
                const isCorrect = userChoice === q.correctIndex;
                const showExplanation = showQuizResults[qIdx];

                return (
                  <div key={qIdx} className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 text-xs">
                    <p className="font-semibold text-slate-200 leading-relaxed">{q.question}</p>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/70';
                        if (userChoice === optIdx) {
                          btnStyle = 'bg-cyan-950/80 border-cyan-500 text-cyan-200 font-semibold';
                        }
                        if (showExplanation) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                          } else if (userChoice === optIdx && !isCorrect) {
                            btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => {
                              setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                              setShowQuizResults((prev) => ({ ...prev, [qIdx]: true }));
                            }}
                            className={`w-full text-left p-2.5 rounded border transition-colors flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {showExplanation && optIdx === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {showExplanation && userChoice === optIdx && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {showExplanation && (
                      <div className={`p-3 rounded border text-xs leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
                      }`}>
                        <strong>{isCorrect ? 'Jawaban Benar!' : 'Jawaban Kurang Tepat.'}</strong>{' '}
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
