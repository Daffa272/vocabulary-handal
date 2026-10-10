# Jejak Data: belajar statistik lewat eksplorasi

Situs belajar statistik dan interpretasi pola data untuk pemula. Bahasa Indonesia dengan istilah statistik Inggris.
Tidak butuh internet, instalasi, atau library: hanya HTML, CSS, dan JavaScript biasa.

## Isi

| Bagian | Yang dipelajari |
|---|---|
| Hero | Seret titik pada scatter plot dan lihat korelasi berubah langsung |
| Modul 1 Distribusi | Histogram, mean, median, modus, skewness, pengaruh pencilan |
| Modul 2 Spread | Standard deviation, kuartil, IQR, boxplot, aturan 1,5 x IQR |
| Modul 3 Korelasi dan regresi | r, R2, slope, residual, nonlinear, titik berpengaruh, Simpson's paradox |
| Modul 4 Sampling | Standard error dan Central Limit Theorem |
| Modul 5 Inferensi | Confidence interval, p-value, false positive, power |
| Modul 6 Pola waktu | Trend, seasonality, noise, moving average, anomali |
| Kuis | 15 soal dengan penjelasan dan saran modul yang perlu diulang |

Setiap modul punya: penjelasan konsep, misi eksplorasi (checklist), lab interaktif, catatan interpretasi yang
berubah mengikuti data, dan pembahasan lengkap.

## Cara menjalankan di Windows

### Cara 1: paling mudah (tanpa Python)
1. Klik kanan file zip, pilih **Extract All...**, lalu pilih folder tujuan.
2. Buka folder hasil ekstrak `jejak-data`.
3. Klik dua kali **`index.html`**. Situs terbuka di browser (Chrome, Edge, atau Firefox).

### Cara 2: lewat server lokal (disarankan bila ada Python)
1. Ekstrak zip seperti di atas.
2. Klik dua kali **`JALANKAN.bat`**.
3. Browser terbuka otomatis di `http://localhost:8000`. Biarkan jendela hitam tetap terbuka selama belajar.
4. Tekan `CTRL+C` di jendela itu untuk menghentikan server.

Bila `JALANKAN.bat` tidak menemukan Python, ia otomatis membuka `index.html` langsung (sama seperti Cara 1).

### Cara 3: manual lewat PowerShell atau Command Prompt
```
cd C:\path\ke\jejak-data
python -m http.server 8000
```
Lalu buka http://localhost:8000 di browser. Bila perintah `python` membuka Microsoft Store, pasang Python dari
python.org atau gunakan `py -m http.server 8000`.

## Catatan
- **Font**: situs memuat font Bricolage Grotesque dan Source Serif 4 dari Google Fonts bila ada internet.
  Tanpa internet, browser memakai Segoe UI dan Georgia; semuanya tetap berfungsi.
- **Penyimpanan**: centang misi dan skor kuis terbaik disimpan di browser lewat `localStorage`.
  Untuk mengosongkannya, hapus data situs di pengaturan browser.
- **Semua data adalah simulasi** dengan seed tetap, jadi angkanya sama setiap dibuka.
  Simulasi sampling, confidence interval, dan uji hipotesis memakai angka acak baru setiap klik.

## Struktur folder
```
jejak-data/
  index.html        halaman utama dan seluruh teks penjelasan
  JALANKAN.bat      peluncur untuk Windows
  css/style.css     tampilan
  js/stats.js       fungsi statistik (mean, SD, regresi, distribusi t, uji t Welch)
  js/data.js        dataset simulasi (ubah angka seed untuk data baru)
  js/charts.js      pembantu grafik SVG
  js/ui.js          pembangun kontrol (slider, tombol pilihan)
  js/hero.js        scatter plot yang bisa diseret
  js/modul1.js ... modul6.js   satu file per modul lab
  js/quiz.js        daftar soal kuis (tambah soal di array QUESTIONS)
  js/app.js         inisialisasi dan navigasi
```

## Mengubah atau menambah
- **Data baru**: ubah angka seed di `js/data.js`, misalnya `gen(11, 300, ...)` menjadi `gen(99, 300, ...)`.
- **Soal kuis baru**: tambahkan objek `{ m, q, o, a, e }` di `js/quiz.js`.
- **Warna**: ubah variabel di bagian `:root` pada `css/style.css`.
