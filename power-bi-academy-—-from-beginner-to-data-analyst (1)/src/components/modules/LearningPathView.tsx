import React, { useState } from 'react';
import { learningModules } from '../../data/learningPathModules';
import { LearningModule, NavTab } from '../../types';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  BookOpen, 
  ExternalLink,
  Layers,
  Award
} from 'lucide-react';

interface LearningPathViewProps {
  completedModules: number[];
  onToggleComplete: (moduleId: number) => void;
  onNavigateToLab: (tab: NavTab) => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  completedModules,
  onToggleComplete,
  onNavigateToLab
}) => {
  const [expandedModuleId, setExpandedModuleId] = useState<number>(1);
  const [filterLevel, setFilterLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  const filteredModules = learningModules.filter(m => 
    filterLevel === 'All' ? true : m.level === filterLevel
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>KURIKULUM END-TO-END</span>
              <span>·</span>
              <span>12 TINGKAT PEMBELAJARAN</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Learning Path: Belajar Power BI dari Nol hingga Mahir
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Alur belajar berurutan yang dirancang untuk membimbing Anda dari pemula tanpa pengalaman hingga mampu merancang arsitektur analitik data enterprise.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 font-mono">
              {completedModules.length} / {learningModules.length} Modul Selesai
            </span>
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                filterLevel === lvl
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {lvl === 'All' ? 'Semua Tingkat (12 Level)' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Modules List Accordion */}
      <div className="space-y-4">
        {filteredModules.map((module) => {
          const isCompleted = completedModules.includes(module.id);
          const isExpanded = expandedModuleId === module.id;

          return (
            <div
              key={module.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'bg-slate-900 border-cyan-500/40 shadow-md'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Bar */}
              <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none">
                <div 
                  className="flex items-start sm:items-center gap-3.5 flex-1"
                  onClick={() => setExpandedModuleId(isExpanded ? 0 : module.id)}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(module.id);
                    }}
                    className="mt-0.5 sm:mt-0 text-slate-500 hover:text-cyan-400 transition-colors shrink-0"
                    title={isCompleted ? "Tandai belum selesai" : "Tandai sudah selesai"}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-cyan-400 font-mono">
                        Level {module.id}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        module.level === 'Beginner'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : module.level === 'Intermediate'
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                          : 'bg-purple-950 text-purple-300 border border-purple-800/60'
                      }`}>
                        {module.level}
                      </span>
                      <span className="text-slate-600">·</span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{module.estTime}</span>
                      </div>
                    </div>

                    <h2 className="text-sm sm:text-base font-bold text-white font-display">
                      {module.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {module.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {module.interactiveLabLink && (
                    <button
                      onClick={() => onNavigateToLab(module.interactiveLabLink!)}
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/50 rounded-lg transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      <span>Buka Lab</span>
                    </button>
                  )}
                  <button
                    onClick={() => setExpandedModuleId(isExpanded ? 0 : module.id)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Content Body */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-6 text-xs text-slate-300">
                  {/* Overview */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono block">
                      Ringkasan Modul
                    </span>
                    <p className="leading-relaxed text-slate-300 text-xs">
                      {module.content.overview}
                    </p>

                    <div className="pt-2">
                      <span className="text-slate-400 block font-medium mb-1.5">Tujuan Pembelajaran:</span>
                      <ul className="space-y-1 list-disc list-inside text-slate-300">
                        {module.content.objectives.map((obj, oIdx) => (
                          <li key={oIdx}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Sections */}
                  {module.content.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-3 pt-2">
                      <h3 className="text-sm font-bold text-white font-display">
                        {sec.title}
                      </h3>
                      <p className="leading-relaxed text-slate-300 text-xs">
                        {sec.description}
                      </p>

                      {sec.details && (
                        <ul className="space-y-1.5 list-disc list-inside text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
                          {sec.details.map((d, dIdx) => (
                            <li key={dIdx} className="leading-relaxed">{d}</li>
                          ))}
                        </ul>
                      )}

                      {/* Embedded Table if any */}
                      {sec.table && (
                        <div className="overflow-x-auto my-3">
                          <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                            <thead className="bg-slate-950 text-slate-300 font-mono">
                              <tr>
                                {sec.table.headers.map((h, hIdx) => (
                                  <th key={hIdx} className="p-3 border-b border-slate-800">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-300">
                              {sec.table.rows.map((r, rIdx) => (
                                <tr key={rIdx} className="hover:bg-slate-800/40">
                                  {r.map((cell, cIdx) => (
                                    <td key={cIdx} className={`p-3 ${cIdx === 0 ? 'font-semibold text-cyan-300' : ''}`}>
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Code Snippet if any */}
                      {sec.codeSnippet && (
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                          <div className="text-[10px] text-slate-400 flex items-center justify-between">
                            <span>Sintaks Contoh:</span>
                            <span className="text-cyan-400">{sec.codeSnippet.language}</span>
                          </div>
                          <pre className="text-cyan-300 overflow-x-auto py-1">
                            {sec.codeSnippet.code}
                          </pre>
                          <div className="text-[11px] text-slate-400 font-sans pt-1 border-t border-slate-800">
                            {sec.codeSnippet.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Footer Action */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => onToggleComplete(module.id)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
                        isCompleted
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isCompleted ? 'Batalkan Status Selesai' : 'Tandai Modul Selesai'}</span>
                    </button>

                    {module.interactiveLabLink && (
                      <button
                        onClick={() => onNavigateToLab(module.interactiveLabLink!)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg flex items-center gap-2 shadow-sm transition-all"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Mulai Praktik di Laboratorium Terkait</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
