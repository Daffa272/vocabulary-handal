import React, { useState } from 'react';
import { caseStudiesList } from '../../data/caseStudies';
import { CaseStudy } from '../../types';
import { rawSalesDataset, financeDataset, hrDataset, downloadCsv } from '../../data/mockDatasets';
import { 
  Briefcase, 
  Download, 
  CheckCircle2, 
  BookOpen, 
  ListChecks, 
  Award, 
  ExternalLink,
  Table,
  Code2,
  BarChart2,
  Sparkles
} from 'lucide-react';

export const CaseStudiesView: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('project-sales');
  const [activeTab, setActiveTab] = useState<'overview' | 'dictionary' | 'steps' | 'rubric'>('overview');

  const selectedProject = caseStudiesList.find(p => p.id === selectedProjectId) || caseStudiesList[0];

  const handleDownloadDataset = (project: CaseStudy) => {
    if (project.domain === 'Finance') {
      downloadCsv(project.datasetName, financeDataset);
    } else if (project.domain === 'HR') {
      downloadCsv(project.datasetName, hrDataset);
    } else {
      downloadCsv(project.datasetName, rawSalesDataset);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>PORTFOLIO PROJECTS</span>
              <span>·</span>
              <span>4 REAL-WORLD INDUSTRY CASES</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Studi Kasus Nyata & Proyek Portofolio
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Kembangkan portofolio Data Analyst siap kerja dengan menyelesaikan 4 proyek industri lengkap dengan dataset latihan, kamus data, instruksi transformasi, formula DAX, dan rubrik penilaian.
            </p>
          </div>
        </div>

        {/* Project Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          {caseStudiesList.map(proj => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <button
                key={proj.id}
                onClick={() => {
                  setSelectedProjectId(proj.id);
                  setActiveTab('overview');
                }}
                className={`px-3.5 py-1.5 text-xs rounded-lg transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                <span className="font-medium truncate">{proj.title.split(' — ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Project Main Card */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                Domain: {selectedProject.domain}
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                Tingkat: {selectedProject.difficulty}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white font-display">
              {selectedProject.title}
            </h2>
          </div>

          <button
            onClick={() => handleDownloadDataset(selectedProject)}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg flex items-center gap-2 shadow-sm shadow-cyan-500/20 transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Dataset ({selectedProject.datasetName})</span>
          </button>
        </div>

        {/* Project Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Latar Belakang & Masalah Bisnis
          </button>
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'dictionary'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Data Dictionary (Kamus Data)
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'steps'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Instruksi & DAX Measures
          </button>
          <button
            onClick={() => setActiveTab('rubric')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'rubric'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Rubrik Penilaian Portofolio
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-5 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold font-mono uppercase tracking-wider block">
                Business Problem (Tantangan Bisnis Nyata):
              </span>
              <p className="leading-relaxed text-slate-300 text-xs">
                {selectedProject.businessProblem}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold font-mono uppercase tracking-wider block">
                  Rekomendasi Visualisasi:
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300 text-[11px]">
                  {selectedProject.recommendedVisuals.map((vis, idx) => (
                    <li key={idx}>{vis}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-indigo-400 font-bold font-mono uppercase tracking-wider block">
                  Expected Business Insights:
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300 text-[11px]">
                  {selectedProject.expectedInsights.map((ins, idx) => (
                    <li key={idx}>{ins}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Data Dictionary */}
        {activeTab === 'dictionary' && (
          <div className="space-y-4">
            <span className="text-xs text-slate-400">
              Struktur kolom dan metadata untuk file <code className="text-cyan-400 font-mono">{selectedProject.datasetName}</code>:
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-950 text-slate-300 font-mono">
                  <tr>
                    <th className="p-3 border-b border-slate-800">Nama Kolom (Field)</th>
                    <th className="p-3 border-b border-slate-800">Tipe Data</th>
                    <th className="p-3 border-b border-slate-800">Deskripsi Bisnis</th>
                    <th className="p-3 border-b border-slate-800">Contoh Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {selectedProject.dataDictionary.map((col, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-semibold text-cyan-300">{col.field}</td>
                      <td className="p-3 font-mono text-indigo-300">{col.type}</td>
                      <td className="p-3">{col.desc}</td>
                      <td className="p-3 font-mono text-slate-400">{col.sample}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Steps & DAX */}
        {activeTab === 'steps' && (
          <div className="space-y-6 text-xs text-slate-300">
            {/* Step-by-step */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono block">
                Instruksi Pengerjaan Langkah Demi Langkah:
              </span>
              <ol className="space-y-1.5 list-decimal list-inside bg-slate-950 p-4 rounded-xl border border-slate-800">
                {selectedProject.instructions.map((inst, idx) => (
                  <li key={idx} className="leading-relaxed">{inst}</li>
                ))}
              </ol>
            </div>

            {/* Power Query Steps */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono block">
                Tahapan Transformasi Power Query:
              </span>
              <ul className="space-y-1.5 list-disc list-inside bg-slate-950 p-4 rounded-xl border border-slate-800">
                {selectedProject.powerQuerySteps.map((pq, idx) => (
                  <li key={idx} className="leading-relaxed">{pq}</li>
                ))}
              </ul>
            </div>

            {/* DAX Measures */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono block">
                Formula DAX Measures Wajib:
              </span>
              <div className="space-y-2">
                {selectedProject.daxMeasures.map((dax, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-100">{dax.name}</span>
                      <span className="text-[10px] text-slate-400 font-sans">{dax.desc}</span>
                    </div>
                    <pre className="font-mono text-cyan-300 text-[11px] overflow-x-auto py-1">
                      {dax.name} = {dax.formula}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Rubric */}
        {activeTab === 'rubric' && (
          <div className="space-y-4">
            <span className="text-xs text-slate-400">
              Gunakan rubrik standar industri ini untuk mengevaluasi kualitas proyek portofolio Anda sebelum diunggah ke LinkedIn / GitHub:
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-950 text-slate-300 font-mono">
                  <tr>
                    <th className="p-3 border-b border-slate-800">Kriteria Penilaian</th>
                    <th className="p-3 border-b border-slate-800">Bobot</th>
                    <th className="p-3 border-b border-slate-800">Standar Hasil Yang Diharapkan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {selectedProject.rubric.map((rub, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-slate-100">{rub.criterion}</td>
                      <td className="p-3 font-mono text-cyan-400 font-bold">{rub.weight}</td>
                      <td className="p-3 leading-relaxed">{rub.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
