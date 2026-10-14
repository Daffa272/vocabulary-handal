# Voice Studio 🎙️⚽ (100% Google Gemini AI)

> Character Voice Audio Generation, Preview, and Export Studio for Comic & Manga Creators.
> Powered entirely by **Google AI Studio (Gemini 3.8 Flash Speech)**.

Voice Studio adalah aplikasi web untuk komik kreator, penulis naskah, dan sutradara suara yang memproduksi audio dialog untuk proyek komik. Proyek ini dilengkapi dengan cast komik sepak bola fiksi **Titan Striker Chronicles** berbahasa Inggris.

---

## 🚀 Fitur Utama (100% Bawaan Google Gemini AI)

1. **Character Library & Pemetaan Suara Gemini**
   - 9 karakter bawaan dengan pemetaan suara resmi Google Gemini:
     - **Alexander Berg**: Striker (young male, 21, deep warm voice, slow calm pace) ➔ `Fenrir`
     - **Diego Ramirez**: Playmaker (young male, 22, smooth confident, playful smirk) ➔ `Puck`
     - **Coach Anders Brekke**: Head Coach (middle-aged male, 45, gravelly tired voice) ➔ `Charon`
     - **Lucas Moreno**: Winger (male, 25, energetic talkative, cheeky) ➔ `Puck`
     - **Daniel Moreno**: Captain (male, 30, calm refined, composed) ➔ `Fenrir`
     - **Emma Wilson**: Reporter (female, 24, bright eager reporter) ➔ `Kore`
     - **Bill Harris**: Commentator (male, 55, broadcast baritone, shouting) ➔ `Charon`
     - **Maya Tanaka**: Co-Commentator (female, 32, lively commentator) ➔ `Zephyr`
     - **Referee**: Match Official (male, 40, firm authoritative voice) ➔ `Charon`
   - Tambah, edit, dan uji coba suara langsung dengan tombol preview.

2. **Hierarchical Script Editor**
   - Terorganisasi berdasarkan **Chapter > Page > Panel > Line**.
   - Tag emosi per dialog (*Neutral, Excited, Shouting, Angry, Sarcastic, Sleepy, Whisper, Sad*).
   - **Voice Acting Description** per panel untuk memberi arahan delivery khusus (misalnya jeda, volume, atau nuansa bicara); arahan ini digabungkan dengan deskripsi suara default karakter saat generate.
   - Pengatur kecepatan (*pace multiplier*) dan penghitung karakter real-time.
   - Bulk import parser untuk format naskah:
     ```text
     CH2 P1 P2 | Berg | Eleven eggs is a reasonable number.
     ```
     dan file spreadsheet CSV.

3. **Multi-Take Generation & Waveform Player**
   - Buat audio per baris atau **Generate All** untuk seluruh halaman dengan antrean paralel aman.
   - Simpan hingga **5 takes per baris dialog** untuk membandingkan hasil terbaik.
   - **Interactive Waveform Player**: visualisasi gelombang audio HTML5 canvas, kendali kecepatan (0.75x–1.5x), dan seekbar.

4. **Penggabungan Halaman & Ekspor ZIP**
   - **Download Line**: Ekspor baris tunggal sebagai WAV atau MP3.
   - **Download ZIP**: Unduh semua dialog halaman atau bab dalam satu file ZIP dengan format penamaan standar:
     `ch2_p1_panel2_berg_001.wav` beserta file manifest CSV.
   - **Page Audio Merger**: Gabungkan seluruh dialog dalam satu halaman menjadi satu master audio berurutan dengan jeda diam (*silence gap*) yang dapat disesuaikan (default 0.4s).
   - **Cadangan Proyek**: Ekspor dan impor seluruh naskah dan karakter dalam format JSON.

---

## 🛠️ Tech Stack

- **Model AI**: Google Gemini Speech (`gemini-3.8-flash-lite-tts`) via `@google/genai`
- **Frontend**: React 19 + TypeScript + Tailwind CSS (Vite SPA)
- **Backend**: Express server (`/api/tts`, `/api/voices`, `/api/health`)
- **Penyimpanan**: Browser IndexedDB dengan autosave otomatis

---

## 📦 Menjalankan Proyek Secara Lokal

1. Salin repository dan install dependensi:
   ```bash
   npm install
   ```
2. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
3. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

4. Buka tab **Pengaturan**, masukkan Gemini API Key dari [Google AI Studio](https://aistudio.google.com/apikey), lalu pilih **Simpan**.

API Key disimpan di local storage browser dan dikirim ke server hanya pada permintaan pembuatan audio. Alternatifnya, atur `GEMINI_API_KEY` di environment server. Key dari Pengaturan akan digunakan untuk permintaan browser tersebut.

Menu Voice Studio pada halaman utama membuka `/voice-studio/` saat beranda dilayani oleh situs atau Vercel. Jangan membuka `index.html` langsung sebagai berkas lokal (`file://`); jika dibuka demikian, menu menampilkan petunjuk menjalankan server karena aset React dan API tidak dapat dimuat sebagai berkas lokal.

## 🚀 Deployment ke Vercel

Deploy repository ini sebagai satu project Vercel dengan **Root Directory** di root repository. Konfigurasi `vercel.json` akan membangun aplikasi React, mempertahankan halaman-halaman utama di root situs, serta menyediakan endpoint serverless untuk API Voice Studio.

1. Impor repository ini di Vercel dan biarkan **Root Directory** pada root repository.
2. Tambahkan environment variable `GEMINI_API_KEY` di **Project Settings → Environment Variables** untuk environment yang akan digunakan.
3. Deploy. Setelah deployment selesai, buka `/voice-studio/` atau pilih **Voice Studio** pada kategori **Pekerjaan**.

API Key juga dapat dimasukkan pada tab **Pengaturan** aplikasi; key tersebut disimpan di browser dan dikirim hanya saat membuat audio. Tanpa API Key, aplikasi menyediakan audio fallback lokal.
