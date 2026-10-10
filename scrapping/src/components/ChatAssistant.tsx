import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Bot, KeyRound, LoaderCircle, MessageCircle, RotateCcw, Send, Sparkles, X } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  text: 'Halo! Saya bisa membantu menjelaskan materi Kaggle, API, Python, web scraping, dan etika pengambilan data di Jejak Data. Apa yang ingin Anda pelajari?',
};

const SUGGESTED_QUESTIONS = [
  'Kapan sebaiknya memilih API, Kaggle, atau scraping?',
  'Bagaimana cara membaca robots.txt?',
  'Apa langkah awal jika request mendapat error 403?',
];

const SYSTEM_INSTRUCTION = `Anda adalah asisten belajar untuk situs Jejak Data, panduan berbahasa Indonesia tentang pengambilan dan eksplorasi data.
Jawab dengan ramah, ringkas, dan bertahap untuk pemula. Fokus pada materi situs:
- Memilih dataset Kaggle, API resmi, atau web scraping; utamakan dataset dan API resmi bila tersedia.
- Membaca CSV menggunakan pandas: head(), info(), describe().
- Struktur HTML, tag, atribut, class, id, dan CSS selector melalui Inspect Element.
- Mengambil halaman latihan yang memang disediakan untuk scraping dengan requests dan BeautifulSoup, memeriksa status HTTP, parsing, pagination, serta menyimpan CSV.
- Memakai User-Agent yang jujur, timeout, jeda yang wajar (sekitar 1–2 detik atau mengikuti aturan situs), dan menangani 403/404/429 dengan sopan.
- Mematuhi robots.txt, Terms of Service, hak cipta, privasi, dan UU Perlindungan Data Pribadi Indonesia. Jangan membantu menghindari pembatasan akses, CAPTCHA, paywall, atau mengambil data pribadi sensitif. Jika situs menolak permintaan, sarankan berhenti dan mencari API atau izin resmi.
Jangan mengaku telah mengakses situs atau menjalankan kode. Jika pertanyaan di luar materi atau Anda tidak yakin, katakan batasannya dan arahkan ke dokumentasi resmi.`;

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyDraft, setApiKeyDraft] = useState('');
  const [isEditingApiKey, setIsEditingApiKey] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, error, isLoading]);

  useEffect(() => {
    if (isOpen && apiKey && !isEditingApiKey) {
      messageInputRef.current?.focus();
    }
  }, [isOpen, apiKey, isEditingApiKey]);

  const saveApiKey = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextApiKey = apiKeyDraft.trim();
    if (!nextApiKey) {
      setError('Masukkan Gemini API key untuk memulai percakapan.');
      return;
    }

    setApiKey(nextApiKey);
    setApiKeyDraft('');
    setIsEditingApiKey(false);
    setError(null);
  };

  const sendMessage = async (text = draft) => {
    const prompt = text.trim();
    if (!prompt || isLoading) return;
    if (!apiKey) {
      setError('Masukkan Gemini API key terlebih dahulu untuk mengirim pertanyaan.');
      setIsEditingApiKey(true);
      return;
    }

    const nextMessages = [...messages, { role: 'user' as const, text: prompt }];
    setMessages(nextMessages);
    setDraft('');
    setError(null);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: nextMessages
          .filter((message) => message.role === 'user' || message.role === 'assistant')
          .slice(-12)
          .map((message) => ({
            role: message.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: message.text }],
          })),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          maxOutputTokens: 600,
          temperature: 0.4,
        },
      });

      const answer = response.text?.trim();
      if (!answer) {
        throw new Error('AI tidak mengirim jawaban. Coba ajukan pertanyaan dengan kata-kata lain.');
      }

      setMessages((current) => [...current, { role: 'assistant', text: answer }]);
    } catch (caughtError) {
      const reason = caughtError instanceof Error ? caughtError.message : 'Terjadi kesalahan yang tidak diketahui.';
      setError(`Pesan belum berhasil dikirim. ${reason}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    setDraft('');
  };

  return (
    <>
      {isOpen && (
        <section
          aria-label="Chat Tanya AI Jejak Data"
          className="fixed bottom-24 right-4 z-[60] flex max-h-[min(680px,calc(100dvh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl sm:bottom-24 sm:right-6"
        >
          <header className="flex items-center justify-between gap-3 bg-[#0d1b2a] px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-400 text-[#0d1b2a]">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold">Tanya AI Jejak Data</h2>
                <p className="text-[11px] text-stone-300">Kaggle · Python · Web Scraping</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={resetConversation}
                aria-label="Mulai percakapan baru"
                title="Percakapan baru"
                className="rounded-lg p-2 text-stone-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-amber-400"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup chat"
                className="rounded-lg p-2 text-stone-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-amber-400"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-[#f7f7f5] p-4" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'self-end rounded-br-md bg-[#0d1b2a] text-white'
                    : 'self-start rounded-bl-md border border-stone-200 bg-white text-stone-800 shadow-sm'
                }`}
              >
                {message.text}
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-col items-start gap-2 pl-1">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => void sendMessage(question)}
                    disabled={isLoading}
                    className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs font-medium text-amber-950 transition hover:border-amber-400 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-2 self-start rounded-2xl rounded-bl-md border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-stone-600">
                <LoaderCircle className="h-4 w-4 animate-spin text-amber-600" aria-hidden="true" />
                Sedang menyiapkan jawaban...
              </div>
            )}
            <div ref={conversationEndRef} />
          </div>

          {error && (
            <p role="alert" className="border-t border-rose-200 bg-rose-50 px-4 py-2.5 text-xs leading-relaxed text-rose-800">
              {error}
            </p>
          )}

          {isEditingApiKey ? (
            <form onSubmit={saveApiKey} className="border-t border-stone-200 bg-white p-3.5">
              <label htmlFor="jejak-data-gemini-key" className="mb-1.5 flex items-center gap-2 text-xs font-bold text-stone-800">
                <KeyRound className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
                Gemini API key
              </label>
              <div className="flex gap-2">
                <input
                  id="jejak-data-gemini-key"
                  type="password"
                  autoComplete="off"
                  value={apiKeyDraft}
                  onChange={(event) => setApiKeyDraft(event.target.value)}
                  placeholder="Tempel API key Anda"
                  className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-stone-950 transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-amber-700"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Aktifkan
                </button>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-stone-500">
                Key hanya tersimpan selama halaman terbuka dan dikirim langsung ke Gemini. Jangan gunakan key bersama di perangkat publik.{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-amber-800 underline"
                >
                  Buat API key
                </a>
              </p>
            </form>
          ) : (
            <div className="border-t border-stone-200 bg-white p-3.5">
              <button
                type="button"
                onClick={() => setIsEditingApiKey(true)}
                className="mb-2 text-[10px] font-medium text-stone-500 underline decoration-stone-300 underline-offset-2 hover:text-stone-800"
              >
                Ganti API key
              </button>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage();
                }}
                className="flex items-end gap-2"
              >
                <textarea
                  ref={messageInputRef}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  rows={1}
                  maxLength={2000}
                  disabled={isLoading}
                  aria-label="Tulis pertanyaan untuk AI"
                  placeholder="Tulis pertanyaan..."
                  className="max-h-28 min-h-10 min-w-0 flex-1 resize-y rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 disabled:bg-stone-100"
                />
                <button
                  type="submit"
                  disabled={isLoading || !draft.trim()}
                  aria-label="Kirim pertanyaan"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0d1b2a] text-white transition hover:bg-[#18344c] focus-visible:outline-2 focus-visible:outline-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
              <p className="mt-2 text-[10px] text-stone-400">Enter untuk kirim · Shift+Enter untuk baris baru</p>
            </div>
          )}
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Tutup Tanya AI' : 'Buka Tanya AI Jejak Data'}
        aria-expanded={isOpen}
        className="fixed bottom-4 right-4 z-[60] grid h-14 w-14 place-items-center rounded-full border-2 border-white bg-amber-400 text-[#0d1b2a] shadow-xl transition hover:scale-105 hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 sm:bottom-6 sm:right-6"
      >
        {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <MessageCircle className="h-6 w-6" aria-hidden="true" />}
      </button>
    </>
  );
};
