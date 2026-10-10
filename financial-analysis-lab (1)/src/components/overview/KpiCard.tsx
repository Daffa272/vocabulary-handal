import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  currentValue: string;
  priorValue?: string;
  changeValue?: string;
  changePercent?: number | null;
  higherIsBetter?: boolean;
  statusText?: string;
  formulaNote?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  currentValue,
  priorValue,
  changeValue,
  changePercent,
  higherIsBetter = true,
  statusText,
  formulaNote,
}) => {
  const hasChange = changePercent !== null && changePercent !== undefined;
  const isPositive = (changePercent ?? 0) > 0;
  const isNeutral = changePercent === 0 || !hasChange;

  let trendColor = 'text-slate-400';
  if (hasChange && !isNeutral) {
    if (higherIsBetter) {
      trendColor = isPositive ? 'text-emerald-400' : 'text-rose-400';
    } else {
      trendColor = isPositive ? 'text-rose-400' : 'text-emerald-400';
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-medium text-slate-300 truncate" title={label}>
            {label}
          </span>
          {statusText && (
            <span className="text-[10px] text-slate-400 font-mono tracking-tight">
              {statusText}
            </span>
          )}
        </div>

        <div className="text-xl font-bold font-mono tabular-nums text-white tracking-tight my-1">
          {currentValue}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80 mt-1 flex items-center justify-between text-[11px]">
        {hasChange ? (
          <div className={`flex items-center gap-1 font-mono font-medium ${trendColor}`}>
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            ) : changePercent! < 0 ? (
              <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Minus className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {changePercent?.toFixed(1)}%
            </span>
            {changeValue && <span className="text-slate-400">({changeValue})</span>}
          </div>
        ) : (
          <span className="text-slate-400 italic">No prior baseline</span>
        )}

        {priorValue && (
          <span className="text-slate-400 font-mono">
            Prior: {priorValue}
          </span>
        )}
      </div>

      {formulaNote && (
        <div className="mt-1 text-[10px] text-slate-400 truncate" title={formulaNote}>
          {formulaNote}
        </div>
      )}
    </div>
  );
};
