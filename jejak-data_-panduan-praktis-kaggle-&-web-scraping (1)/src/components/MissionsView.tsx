import React, { useState } from 'react';
import { MISSIONS_DATA } from '../data/simulatorData';
import { Mission } from '../types';
import { CheckSquare, Square, CheckCircle2, Filter, Sparkles, HelpCircle } from 'lucide-react';

interface MissionsViewProps {
  completedMissions: Record<string, boolean>;
  onToggleMission: (missionId: string) => void;
  onNavigateToModule: (moduleId: number) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  completedMissions,
  onToggleMission,
  onNavigateToModule
}) => {
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<number | 'all'>('all');

  const totalMissions = MISSIONS_DATA.length;
  const completedCount = Object.values(completedMissions).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalMissions) * 100);

  const filteredMissions = MISSIONS_DATA.filter((m) => {
    if (selectedModuleFilter !== 'all' && m.moduleId !== selectedModuleFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 mb-1">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Jurnal Ekspedisi Data</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Misi Pembelajaran Berjenjang (18 Misi)
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Setiap modul memiliki 3 misi praktis untuk memastikan Anda tidak hanya membaca, tetapi juga mencoba dan memverifikasi sendiri setiap konsep. Progres tersimpan otomatis di browser Anda.
            </p>
          </div>

          {/* Progress Pill Box */}
          <div className="bg-white border border-stone-300 rounded-lg p-3 text-right shrink-0">
            <span className="text-[11px] font-mono text-stone-500 uppercase block">Total Progres</span>
            <div className="text-xl font-mono font-bold text-stone-900">
              {completedCount} / {totalMissions}
            </div>
            <span className="text-xs font-mono text-amber-700 font-bold">{progressPercent}% Selesai</span>
          </div>
        </div>
      </div>

      {/* Module Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
        <button
          onClick={() => setSelectedModuleFilter('all')}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
            selectedModuleFilter === 'all'
              ? 'bg-stone-900 text-white font-bold'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
        >
          Semua Modul (18)
        </button>
        {[1, 2, 3, 4, 5, 6].map((num) => {
          const modMissions = MISSIONS_DATA.filter((m) => m.moduleId === num);
          const modCompleted = modMissions.filter((m) => completedMissions[m.id]).length;
          return (
            <button
              key={num}
              onClick={() => setSelectedModuleFilter(num)}
              className={`whitespace-nowrap px-3 py-1.5 rounded transition-colors cursor-pointer ${
                selectedModuleFilter === num
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Modul {num} ({modCompleted}/3)
            </button>
          );
        })}
      </div>

      {/* Missions Checklist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map((mission) => {
          const isDone = Boolean(completedMissions[mission.id]);

          return (
            <div
              key={mission.id}
              onClick={() => onToggleMission(mission.id)}
              className={`p-4 rounded-lg border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-300 text-emerald-950'
                  : 'bg-white border-stone-300 hover:border-stone-400 text-stone-900'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-stone-400" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-semibold ${isDone ? 'line-through text-stone-500' : ''}`}>
                    {mission.title}
                  </h4>
                  <span className="text-[11px] font-mono text-stone-500">
                    Modul {mission.moduleId}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {mission.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="italic flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-stone-400" />
                    <span>Petunjuk: {mission.hint}</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToModule(mission.moduleId);
                    }}
                    className="text-amber-800 hover:text-amber-950 font-semibold cursor-pointer underline text-[11px]"
                  >
                    Buka Modul &rarr;
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
