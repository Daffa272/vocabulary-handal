import React, { useState } from 'react';
import { ShieldAlert, X, Info } from 'lucide-react';

export const LegalNoticeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div className="bg-sky-950/70 border-b border-sky-800/60 px-4 py-2.5 text-xs text-sky-200 flex items-center justify-between gap-3 backdrop-blur-sm">
        <div className="flex items-center gap-2 overflow-hidden">
          <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="truncate">
            <strong className="text-sky-300 font-semibold">Voice Safety & Licensing Notice:</strong> Only use original or properly licensed voices. Do not clone or imitate real people (such as real footballers or actors) or protected characters without authorization.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowDetails(true)}
            className="text-sky-300 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
          >
            Read Policy
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-sky-900/60 rounded text-sky-400 hover:text-white transition-colors cursor-pointer"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl p-6 shadow-2xl relative text-slate-200">
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Voice Ethics & Licensing Guidelines</h3>
                <p className="text-xs text-slate-400">For comic and fiction audio creators</p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <p>
                Voice Studio is designed for indie comic artists, scriptwriters, and creators producing original fictional drama in sports and fantasy leagues.
              </p>
              <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/60 space-y-2">
                <div className="font-semibold text-sky-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4" /> Core Rules:
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-slate-300 pl-1">
                  <li><strong>Original Characters Only:</strong> Use assigned provider voice IDs for your fictional comic characters.</li>
                  <li><strong>No Unauthorized Imitation:</strong> Do not clone, sample, or replicate real professional football players, coaches, TV commentators, or public personalities.</li>
                  <li><strong>No Cloned Audio Uploads:</strong> In accordance with safety policies, voice-cloning upload features are intentionally excluded from this studio.</li>
                  <li><strong>License Compliance:</strong> Voice synthesis is powered by Google Gemini AI Speech in compliance with Google AI Studio terms.</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors cursor-pointer"
              >
                I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
