import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2, HelpCircle, RefreshCw, FileText } from 'lucide-react';

interface EthicsQuestion {
  id: string;
  title: string;
  description: string;
  lawContext: string;
  // ideal answer for safety: 'yes' | 'no'
  safeAnswer: 'yes' | 'no';
}

export const EthicsChecklist: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, 'yes' | 'no' | 'unsure'>>({
    pii: 'no',
    tos: 'no',
    robots: 'no',
    api: 'no',
    delay: 'yes',
    commercial: 'no'
  });

  const questions: EthicsQuestion[] = [
    {
      id: 'pii',
      title: '1. Apakah data target memuat Data Pribadi Sensitif (PII)?',
      description: 'Contoh: NIK, nomor telepon pribadi, email perorangan, riwayat rekam medis pasien, informasi keuangan/perbankan, atau data anak di bawah umur.',
      lawContext: 'UU No. 27 Tahun 2022 (UU PDP Indonesia) melarang keras pemrosesan dan pengumpulan data pribadi tanpa persetujuan eksplisit pemilik data atau dasar hukum yang sah.',
      safeAnswer: 'no'
    },
    {
      id: 'tos',
      title: '2. Apakah Terms of Service (ToS) situs melarang scraper otomatis?',
      description: 'Cek klausul ketentuan layanan situs: Apakah ada larangan seperti "Dilarang menggunakan bot, crawler, atau spider untuk mengambil data"?',
      lawContext: 'Pelanggaran ToS dapat dikategorikan sebagai wanprestasi kontrak perdata akses layanan dan berisiko pemblokiran permanen serta sanksi hukum.',
      safeAnswer: 'no'
    },
    {
      id: 'robots',
      title: '3. Apakah jalur URL dilarang dalam file robots.txt?',
      description: 'Periksa https://nama-situs.com/robots.txt: Apakah ada aturan "Disallow:" pada direktori atau tautan yang ingin Anda ambil?',
      lawContext: 'Robots.txt adalah standar etika industri internet tertua. Mengabaikan Disallow adalah tindakan intrusif dan tidak santun.',
      safeAnswer: 'no'
    },
    {
      id: 'api',
      title: '4. Apakah situs sudah menyediakan API resmi atau dataset terbuka?',
      description: 'Apakah ada API publik (gratis/berbayar) atau dataset yang sudah diunggah di Kaggle/data.gov untuk informasi yang sama?',
      lawContext: 'Mengutamakan API resmi adalah standar integritas rekayasa perangkat lunak. Jangan melakukan scraping jika ada pintu resmi.',
      safeAnswer: 'no' // If 'yes', advice will say: "Gunakan API tersebut daripada scraping!"
    },
    {
      id: 'delay',
      title: '5. Apakah scraper Anda menyertakan jeda waktu (time.sleep)?',
      description: 'Apakah Anda memberikan jeda minimal 1 hingga 3 detik di antara setiap permintaan HTTP agar tidak membebani server?',
      lawContext: 'Scraping tanpa jeda berpotensi dianggap sebagai serangan DoS (Denial of Service) yang melumpuhkan server target dan bisa melanggar UU ITE.',
      safeAnswer: 'yes'
    },
    {
      id: 'commercial',
      title: '6. Apakah Anda berniat menjual kembali data ini untuk keuntungan komersial?',
      description: 'Apakah data ini akan dikomersialkan secara langsung menyaingi pemilik bisnis asli (bukan untuk riset/pembelajaran pribadi)?',
      lawContext: 'Komersialisasi data hasil scrape memiliki risiko tuntutan hak cipta (copyright), persaingan usaha tidak sehat, dan pelanggaran basis data.',
      safeAnswer: 'no'
    }
  ];

  const handleSelect = (id: string, value: 'yes' | 'no' | 'unsure') => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // Calculate verdict
  const calculateVerdict = () => {
    // Red flags (immediate risk)
    const hasPII = answers.pii === 'yes';
    const noDelay = answers.delay === 'no';
    const violatedRobots = answers.robots === 'yes';
    const violatedToS = answers.tos === 'yes';
    const commercialScrape = answers.commercial === 'yes';
    const apiAvailable = answers.api === 'yes';

    if (hasPII) {
      return {
        level: 'danger',
        title: 'SANGAT BERISIKO / SEBAIKNYA HENTIKAN PROYEK INI',
        badge: 'Status: Dilarang (Risiko Pelanggaran UU PDP)',
        color: 'rose',
        explanation: 'Mengambil data pribadi sensitif perorangan (seperti NIK, nomor telepon, atau data kesehatan) tanpa izin sah bertentangan langsung dengan UU Perlindungan Data Pribadi di Indonesia dan standar etika internasional.'
      };
    }

    if (violatedToS || violatedRobots || noDelay) {
      return {
        level: 'warning',
        title: 'PERLU WASPADA & PENYESUAIAN TEKNIS MENDALAM',
        badge: 'Status: Perlu Penyesuaian Etika & Teknis',
        color: 'amber',
        explanation: 'Ada potensi masalah hukum atau teknis! Pastikan Anda mematuhi robots.txt, menambahkan jeda waktu (time.sleep), dan membaca ulang Terms of Service sebelum melanjutkan.'
      };
    }

    if (apiAvailable) {
      return {
        level: 'warning',
        title: 'SEBAIKNYA BERALIH KE API RESMI',
        badge: 'Status: Ada Alternatif Resmi',
        color: 'sky',
        explanation: 'Karena penyedia sudah menyediakan API resmi atau dataset Kaggle, gunakanlah pintu resmi tersebut. Menggunakan API resmi jauh lebih aman, stabil, dan terhindar dari pemblokiran.'
      };
    }

    return {
      level: 'safe',
      title: 'AMAN DIJALANKAN (ETIS & BERTANGGUNG JAWAB)',
      badge: 'Status: Hijau (Etika Baik)',
      color: 'emerald',
      explanation: 'Proyek scraping Anda memenuhi standar kesantunan: data bersifat publik non-pribadi, menghormati beban server dengan jeda waktu wajar, dan tidak mengabaikan aturan robots.txt.'
    };
  };

  const verdict = calculateVerdict();

  const resetAll = () => {
    setAnswers({
      pii: 'no',
      tos: 'no',
      robots: 'no',
      api: 'no',
      delay: 'yes',
      commercial: 'no'
    });
  };

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Audit Kepatuhan & Etika Pengambilan Data</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Checklist: Boleh atau Tidak Boleh Scraping?
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Jawab 6 pertanyaan diagnostik di bawah ini untuk menguji apakah proyek pengambilan data yang Anda rencanakan aman, sopan, dan sesuai dengan prinsip hukum digital (seperti UU PDP di Indonesia).
            </p>
          </div>
          <button
            onClick={resetAll}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-200/60 rounded cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Jawaban</span>
          </button>
        </div>
      </div>

      {/* Real-time Verdict Banner */}
      <div
        className={`p-5 rounded-lg border transition-all ${
          verdict.level === 'danger'
            ? 'bg-rose-50 border-rose-300 text-rose-950'
            : verdict.level === 'warning'
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-emerald-50 border-emerald-300 text-emerald-950'
        }`}
      >
        <div className="flex items-start gap-3">
          {verdict.level === 'danger' && <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />}
          {verdict.level === 'warning' && <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />}
          {verdict.level === 'safe' && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />}

          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider font-bold block opacity-80">
              {verdict.badge}
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold">{verdict.title}</h3>
            <p className="text-xs sm:text-sm leading-relaxed opacity-90 font-sans">{verdict.explanation}</p>
          </div>
        </div>
      </div>

      {/* Questionnaire Cards */}
      <div className="space-y-4">
        {questions.map((q) => {
          const currentVal = answers[q.id];

          return (
            <div
              key={q.id}
              className="bg-white border border-stone-300 rounded-lg p-4 sm:p-5 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-stone-900">{q.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{q.description}</p>
                </div>

                {/* Segmented Radio Buttons */}
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded self-start shrink-0 text-xs font-mono">
                  <button
                    onClick={() => handleSelect(q.id, 'yes')}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                      currentVal === 'yes'
                        ? q.safeAnswer === 'yes'
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'bg-rose-600 text-white font-bold shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Ya
                  </button>
                  <button
                    onClick={() => handleSelect(q.id, 'no')}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                      currentVal === 'no'
                        ? q.safeAnswer === 'no'
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'bg-amber-600 text-white font-bold shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Tidak
                  </button>
                  <button
                    onClick={() => handleSelect(q.id, 'unsure')}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                      currentVal === 'unsure'
                        ? 'bg-stone-700 text-white font-bold shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Ragu
                  </button>
                </div>
              </div>

              {/* Context Law Note */}
              <div className="pt-2 border-t border-stone-100 flex items-start gap-2 text-[11px] text-stone-500 font-mono">
                <FileText className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                <span>{q.lawContext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legal Disclaimer Box */}
      <div className="p-4 rounded-lg bg-stone-100 border border-stone-300 text-xs text-stone-600 leading-relaxed">
        <strong>Pemberitahuan Edukasi:</strong> Panduan ini dirancang untuk tujuan pembelajaran prinsip rekayasa perangkat lunak dan etika komunitas data, bukan sebagai nasihat hukum formal (legal counsel). Keputusan pemrosesan data skala besar hendaknya dikonsultasikan dengan penasihat hukum berkualifikasi.
      </div>
    </div>
  );
};
