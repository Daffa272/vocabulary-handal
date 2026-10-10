import React, { useState } from 'react';
import { MODULES_DATA } from '../data/modulesData';
import { 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Lightbulb, 
  AlertTriangle, 
  Info, 
  Copy, 
  Check, 
  ExternalLink,
  Search,
  Send,
  Code2
} from 'lucide-react';

interface ModuleViewProps {
  currentModuleId: number;
  onSelectModule: (id: number) => void;
  onOpenInspectSimulator: () => void;
  onOpenRequestSimulator: () => void;
  onOpenCodeBuilder: () => void;
  onOpenWindowsGuide: () => void;
}

export const ModuleView: React.FC<ModuleViewProps> = ({
  currentModuleId,
  onSelectModule,
  onOpenInspectSimulator,
  onOpenRequestSimulator,
  onOpenCodeBuilder,
  onOpenWindowsGuide
}) => {
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const currentModule = MODULES_DATA.find((m) => m.id === currentModuleId) || MODULES_DATA[0];

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handlePrev = () => {
    if (currentModuleId > 1) onSelectModule(currentModuleId - 1);
  };

  const handleNext = () => {
    if (currentModuleId < MODULES_DATA.length) onSelectModule(currentModuleId + 1);
  };

  return (
    <div className="space-y-6">
      {/* Module Navigation Tabs (1 - 6) */}
      <div className="bg-stone-100 p-1.5 rounded-lg border border-stone-200 overflow-x-auto scrollbar-none flex items-center gap-1">
        {MODULES_DATA.map((mod) => {
          const isActive = mod.id === currentModuleId;
          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className={`whitespace-nowrap px-3.5 py-2 text-xs font-mono rounded-md transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-white text-stone-900 font-bold shadow-xs border border-stone-300'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                isActive ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-stone-300 text-stone-700'
              }`}>
                {mod.id}
              </span>
              <span>{mod.title.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Module Header Card */}
      <div className="bg-white border border-stone-300 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-700 uppercase tracking-wider mb-1">
              <span>Modul {currentModule.id} dari 6</span>
              <span aria-hidden="true">·</span>
              <span>Estimasi {currentModule.duration}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold">{currentModule.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
              {currentModule.title}
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-3xl leading-relaxed">
              {currentModule.subtitle}
            </p>
          </div>
        </div>

        {/* Quick Topics Checklist */}
        <div className="mt-4 pt-2">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-500 block mb-2">
            Topik Utama di Modul Ini:
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            {currentModule.topics.map((t) => (
              <span
                key={t}
                className="bg-stone-100 border border-stone-200 text-stone-700 px-2.5 py-1 rounded font-medium"
              >
                ✓ {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Jump Helpers per Module */}
      {currentModule.id === 2 && (
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg flex items-center justify-between text-xs text-sky-950">
          <div>
            <strong>Ingin memasang token Kaggle API di Windows?</strong> Panduan direktori <code>C:\Users\&lt;Nama&gt;\.kaggle\kaggle.json</code> tersedia lengkap.
          </div>
          <button
            onClick={onOpenWindowsGuide}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded transition-colors cursor-pointer shrink-0 ml-4"
          >
            Buka Panduan Windows
          </button>
        </div>
      )}

      {currentModule.id === 3 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-950">
          <div>
            <strong>Latihan Langsung CSS Selector:</strong> Coba fitur Simulator Inspect Element untuk menguji seleksi tag HTML secara real-time!
          </div>
          <button
            onClick={onOpenInspectSimulator}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded transition-colors cursor-pointer shrink-0 ml-4 flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Buka Simulator Inspect</span>
          </button>
        </div>
      )}

      {currentModule.id === 4 && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-950">
          <div>
            <strong>Ingin membuat skrip scraper otomatis?</strong> Gunakan Pembangun Kode (Code Builder) untuk menyusun kode Python yang siap dijalankan.
          </div>
          <button
            onClick={onOpenCodeBuilder}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded transition-colors cursor-pointer shrink-0 ml-4 flex items-center gap-1.5"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Buka Pembangun Kode</span>
          </button>
        </div>
      )}

      {currentModule.id === 5 && (
        <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg flex items-center justify-between text-xs text-violet-950">
          <div>
            <strong>Pelajari Status HTTP 200, 404, 403, dan 429:</strong> Uji respon server dan diagnosa error di Simulator Request/Response.
          </div>
          <button
            onClick={onOpenRequestSimulator}
            className="px-3 py-1.5 bg-violet-700 hover:bg-violet-800 text-white font-medium rounded transition-colors cursor-pointer shrink-0 ml-4 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Buka Simulator Request</span>
          </button>
        </div>
      )}

      {/* Sections Content */}
      <div className="space-y-6">
        {currentModule.sections.map((section) => (
          <article
            key={section.id}
            className="bg-white border border-stone-300 rounded-lg p-6 shadow-sm space-y-4"
          >
            <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">
              {section.title}
            </h3>

            {/* Markdown-like Text Body */}
            <div className="text-stone-700 text-sm leading-relaxed space-y-3 font-sans">
              {section.content.split('\n\n').map((paragraph, pIdx) => {
                if (paragraph.startsWith('|') && paragraph.includes('|')) {
                  // Table rendering
                  const lines = paragraph.split('\n');
                  const headerCols = lines[0].split('|').filter(Boolean).map((s) => s.trim());
                  const bodyLines = lines.slice(2);

                  return (
                    <div key={pIdx} className="overflow-x-auto my-3">
                      <table className="w-full text-left text-xs border border-stone-200 border-collapse">
                        <thead>
                          <tr className="bg-stone-100 border-b border-stone-300">
                            {headerCols.map((col, idx) => (
                              <th key={idx} className="py-2 px-3 font-mono font-bold text-stone-700">
                                {col.replace(/\*\*/g, '')}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 font-mono text-stone-800">
                          {bodyLines.map((row, rIdx) => {
                            const cells = row.split('|').filter(Boolean).map((c) => c.trim());
                            return (
                              <tr key={rIdx} className="hover:bg-stone-50">
                                {cells.map((cell, cIdx) => (
                                  <td key={cIdx} className="py-2 px-3">
                                    {cell.replace(/`/g, '')}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                if (paragraph.startsWith('```')) {
                  // Code block rendering inside content
                  const codeLines = paragraph.split('\n');
                  const codeText = codeLines.slice(1, -1).join('\n');
                  return (
                    <pre
                      key={pIdx}
                      className="bg-[#101725] text-amber-200/90 font-mono text-xs p-3.5 rounded overflow-x-auto leading-relaxed my-2"
                    >
                      {codeText}
                    </pre>
                  );
                }

                return (
                  <p key={pIdx} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Code Snippet Box (if provided) */}
            {section.codeSnippet && (
              <div className="mt-4 bg-[#101725] rounded-lg border border-stone-800 overflow-hidden text-stone-200">
                <div className="bg-[#0a0f18] px-4 py-2 border-b border-stone-800 flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span>{section.codeSnippet.caption || `Kode Contoh (${section.codeSnippet.language})`}</span>
                  <button
                    onClick={() => handleCopyCode(section.id, section.codeSnippet!.code)}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition-colors cursor-pointer text-[10px]"
                  >
                    {copiedSnippetId === section.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippetId === section.id ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <pre className="p-4 font-mono text-xs text-sky-200/90 leading-relaxed overflow-x-auto whitespace-pre">
                  {section.codeSnippet.code}
                </pre>
              </div>
            )}

            {/* Pedagogical Callout Box */}
            {section.callout && (
              <div
                className={`p-4 rounded-lg border flex items-start gap-3 text-xs leading-relaxed ${
                  section.callout.type === 'tip'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : section.callout.type === 'warning'
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : 'bg-sky-50 border-sky-200 text-sky-950'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {section.callout.type === 'tip' && <Lightbulb className="w-4 h-4 text-amber-600" />}
                  {section.callout.type === 'warning' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                  {section.callout.type === 'info' && <Info className="w-4 h-4 text-sky-600" />}
                </div>
                <div>
                  <h4 className="font-mono uppercase font-bold text-[11px] mb-0.5">
                    {section.callout.title}
                  </h4>
                  <p className="font-sans">{section.callout.text}</p>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Prev / Next Navigation Footer */}
      <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentModuleId === 1}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-300 rounded text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Modul Sebelumnya</span>
        </button>

        <span className="text-xs font-mono text-stone-500">
          Halaman Modul {currentModuleId} dari 6
        </span>

        <button
          onClick={handleNext}
          disabled={currentModuleId === MODULES_DATA.length}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-300 text-stone-950 disabled:text-stone-500 rounded text-xs font-bold transition-colors cursor-pointer"
        >
          <span>Modul Selanjutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
