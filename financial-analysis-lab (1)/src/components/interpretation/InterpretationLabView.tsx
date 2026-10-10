import React, { useState } from 'react';
import {
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Activity,
  Droplets,
  Boxes,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';

export const InterpretationLabView: React.FC = () => {
  const { interpretations, activePeriod, comparisonPeriod, activeCompany } = useFinancial();

  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const domains = ['All', 'Profitability', 'Liquidity', 'Solvency', 'Cash Flow', 'Working Capital'];

  const filteredInterpretations = interpretations.filter((item) =>
    selectedDomain === 'All' ? true : item.domain === selectedDomain
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'Profitability':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'Liquidity':
        return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
      case 'Solvency':
        return <Activity className="w-4 h-4 text-rose-400" />;
      case 'Cash Flow':
        return <Droplets className="w-4 h-4 text-purple-400" />;
      default:
        return <Boxes className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-cyan-400" />
            Financial Interpretation Lab (Automated 6-Part Framework)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sistem penalaran finansial deterministik berbasis kalkulasi empiris untuk{' '}
            <span className="text-slate-200 font-semibold">{activeCompany.name}</span> ({activePeriod.label}).
          </p>
        </div>

        {/* Domain Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedDomain === d
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* 6-Part Framework Guide */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-center justify-between">
        <span>
          <strong>Struktur Laporan:</strong> 1. Key Finding → 2. Evidence → 3. Interpretation → 4. Potential Risk → 5. Recommended Investigation → 6. Limitations
        </span>
        <span className="text-[11px] font-mono text-cyan-400">{filteredInterpretations.length} Temuan Aktif</span>
      </div>

      {/* Interpretation Items Cards */}
      <div className="space-y-4">
        {filteredInterpretations.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            Tidak ada temuan signifikan dalam kategori ini untuk periode yang dipilih.
          </div>
        ) : (
          filteredInterpretations.map((item) => {
            const isExpanded = expandedId === item.id;
            const fullReportText = `[${item.domain.toUpperCase()} ANALYSIS]
1. Key Finding: ${item.keyFinding}
2. Evidence: ${item.evidence}
3. Interpretation: ${item.interpretation}
4. Potential Risk: ${item.potentialRisk}
5. Recommended Investigation: ${item.recommendedInvestigation}
6. Limitations: ${item.limitations}`;

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-slate-700 transition-colors"
              >
                {/* Header */}
                <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                      {getDomainIcon(item.domain)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-cyan-400">
                          {item.domain}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="text-xs text-slate-400 font-mono">
                          {activePeriod.label} vs {comparisonPeriod?.label || 'Prior'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {item.keyFinding}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(fullReportText, item.id)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Salin seluruh temuan 6-bagian"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 6 Structured Components */}
                <div className="p-4 space-y-3.5 text-xs">
                  {/* 1. Evidence */}
                  <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800/80">
                    <span className="text-[11px] font-semibold text-cyan-300 block mb-1">
                      1. Evidence (Bukti Angka Aktual):
                    </span>
                    <p className="text-slate-200 font-mono leading-relaxed">{item.evidence}</p>
                  </div>

                  {/* 2. Interpretation */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                      2. Interpretation (Makna Finansial & Operasional):
                    </span>
                    <p className="text-slate-300 leading-relaxed">{item.interpretation}</p>
                  </div>

                  {/* 3. Potential Risk */}
                  <div>
                    <span className="text-[11px] font-semibold text-rose-300 block mb-1">
                      3. Potential Risk (Risiko yang Harus Diwaspadai):
                    </span>
                    <p className="text-rose-200/90 leading-relaxed">{item.potentialRisk}</p>
                  </div>

                  {/* 4. Recommended Investigation */}
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-300 block mb-1">
                      4. Recommended Investigation (Audit & Tindak Lanjut):
                    </span>
                    <p className="text-slate-300 leading-relaxed">{item.recommendedInvestigation}</p>
                  </div>

                  {/* 5. Limitations */}
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 italic">
                    <strong className="text-slate-400 font-semibold not-italic">
                      5. Asumsi & Batasan Data:
                    </strong>{' '}
                    {item.limitations}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
