<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/45be3b36-e6d5-4746-a7a0-a8227b305aca

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Tanya AI

Gunakan tombol bulat **Tanya AI** di pojok kanan bawah. Fitur ini memerlukan koneksi internet
dan Gemini API key: buat key di [Google AI Studio](https://aistudio.google.com/app/apikey),
lalu masukkan ke panel chat. Key hanya disimpan sementara di memori halaman dan tidak ditulis
ke file atau `localStorage`; pertanyaan dikirim langsung ke Gemini. Jangan gunakan key pada
perangkat publik atau membagikan pertanyaan yang berisi data sensitif.
