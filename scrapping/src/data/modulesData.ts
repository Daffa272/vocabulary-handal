import { ModuleInfo } from '../types';

export const MODULES_DATA: (ModuleInfo & {
  sections: {
    id: string;
    title: string;
    content: string; // rich markdown-like or structured HTML/bullet points
    codeSnippet?: {
      language: string;
      code: string;
      caption?: string;
    };
    callout?: {
      type: 'tip' | 'warning' | 'info';
      title: string;
      text: string;
    };
  }[];
})[] = [
  {
    id: 1,
    title: 'Peta Data: Dari Mana Data Berasal',
    subtitle: 'Memahami 3 jalur utama perolehan data dan panduan memilih metode terbaik',
    badge: 'Fondasi Utama',
    duration: '15 menit',
    summary: 'Sebelum menulis satu baris kode pun, seorang praktisi data harus tahu dari mana data bisa didapatkan secara legal, efisien, dan andal.',
    topics: ['Dataset Siap Pakai (Kaggle)', 'API Resmi Penyedia Layanan', 'Web Scraping Mandiri', 'Matriks Panduan Memilih'],
    sections: [
      {
        id: '1-1',
        title: 'Tiga Sumber Data Utama di Dunia Digital',
        content: `Ketika Anda ingin menganalisis tren harga buku, prediksi cuaca, atau sentimen pasar, dari mana data tersebut berasal? Secara umum, ada tiga jalur utama:

1. **Dataset Siap Pakai (Contoh: Kaggle, Hugging Face, Data.gov)**
   Data yang sudah dikumpulkan, dibersihkan sebagian, dan dikemas dalam format file seperti **CSV (Comma-Separated Values)**, JSON, atau Parquet.
   *Kelebihan:* Langsung bisa dipakai, tidak butuh waktu scraping, struktur tabel jelas.
   *Kekurangan:* Data bersifat statis (tidak selalu mutakhir/real-time) dan terbatas pada apa yang diunggah pembuatnya.

2. **API Resmi (Application Programming Interface)**
   Pintu resmi yang disediakan pemilik platform (seperti Google Maps, Twitter/X, BMKG, GitHub, Spotify) untuk meminta data secara terstruktur melalui sambungan jaringan.
   *Kelebihan:* Resmi, stabil, terstruktur format JSON, selalu mutakhir, dan diizinkan secara tertulis.
   *Kekurangan:* Seringkali butuh kunci akses (**API Key**), ada kuota permintaan (**Rate Limit**), dan beberapa berbayar.

3. **Web Scraping Mandiri**
   Teknik menggunakan kode program (misalnya skrip Python) untuk mengunjungi halaman website layaknya manusia, lalu menyalin informasi spesifik dari tampilan HTML secara otomatis.
   *Kelebihan:* Bisa mengambil data apa pun yang terlihat publik di layar browser, tidak bergantung pada ada tidaknya API.
   *Kekurangan:* Rapuh jika pemilik web mengubah desain tampilan HTML, rawan diblokir, butuh penanganan etika dan hukum yang ketat.`,
        callout: {
          type: 'info',
          title: 'Istilah Kunci: API vs Web Scraping',
          text: 'Bayangkan restoran: API adalah memesan makanan lewat buku menu resmi (pelayan membawakan makanan tertata rapi di piring). Web Scraping adalah Anda datang ke dapur sendiri lalu memilah bumbu yang Anda lihat di rak.'
        }
      },
      {
        id: '1-2',
        title: 'Panduan Memilih: Kapan Memakai yang Mana?',
        content: `Jangan langsung membuka browser dan menulis scraper! Selalu ikuti hierarki efisiensi kerja berikut:

**Langkah 1: Periksa Dataset Siap Pakai Dulu**
Apakah dataset yang Anda cari sudah pernah dikumpulkan orang lain di Kaggle atau repositori terbuka? Jika ya, unduh saja langsung. Ini menghemat waktu berjam-jam kerja.

**Langkah 2: Cari Tahu Apakah Ada API Resmi**
Jika butuh data mutakhir (misal harga saham hari ini atau prakiraan cuaca jam ini), cek apakah penyedia memiliki API resmi gratis atau tier pengembang. Menggunakan API resmi 10x lebih stabil daripada scraping.

**Langkah 3: Gunakan Web Scraping Bila Tidak Ada Alternatif**
Jika data hanya ada di website biasa tanpa tombol unduh dan tanpa API publik, barulah web scraping menjadi jalan keluar yang tepat.`,
        callout: {
          type: 'tip',
          title: 'Aturan Emas Data Engineer',
          text: 'Waktu Anda berharga. Lebih baik menghabiskan 10 menit mencari di Kaggle daripada menghabiskan 3 hari membuat scraper untuk website yang bulan depan mengubah struktur kodenya.'
        }
      }
    ]
  },
  {
    id: 2,
    title: 'Kaggle Langkah demi Langkah',
    subtitle: 'Dari membuat akun, membaca metrik dataset, unduh otomatis via API & kagglehub, hingga membaca dengan Pandas',
    badge: 'Kaggle & Pandas',
    duration: '25 menit',
    summary: 'Kaggle adalah platform komunitas data science terbesar di dunia. Pelajari cara memanfaatkan jutaan dataset gratis dengan alur kerja modern.',
    topics: ['Navigasi Halaman Dataset', 'Usability Score & Lisensi', 'Unduh Manual vs Kaggle API', 'Library kagglehub', 'Inspeksi CSV dengan Pandas'],
    sections: [
      {
        id: '2-1',
        title: 'Membedah Halaman Dataset Kaggle',
        content: `Ketika Anda membuka sebuah dataset di Kaggle (misal pencarian "indonesia population" atau "book store"), jangan langsung klik unduh. Perhatikan indikator kualitas berikut:

- **Usability Score (Nilai Kegunaan):** Angka dari 0.0 hingga 10.0. Dataset berkualitas biasanya memiliki skor > 8.0 karena menyertakan deskripsi kolom, file format jelas, dan pembuat aktif.
- **License (Lisensi):** Apakah datanya berlisensi **CC0: Public Domain** (bebas digunakan untuk apa saja), **CC-BY** (wajib mencantumkan atribusi pembuat), atau lisensi non-komersial?
- **Data Explorer (Pratinjau File):** Kaggle memungkinkan Anda melihat 5-10 baris pertama tiap file CSV langsung di browser sebelum mengunduh. Periksa tipe data setiap kolom.
- **Ukuran File:** Pastikan Anda memiliki ruang disk yang cukup (mulai dari beberapa Kilobyte hingga puluhan Gigabyte).`,
        callout: {
          type: 'info',
          title: 'Mengapa Lisensi Itu Krusial?',
          text: 'Menggunakan dataset berlisensi non-komersial (misal CC BY-NC) untuk produk bisnis atau skripsi berbayar dapat menimbulkan masalah hak cipta. Selalu catat lisensi dataset Anda!'
        }
      },
      {
        id: '2-2',
        title: 'Dua Cara Otomatisasi Unduh: Kaggle API vs kagglehub',
        content: `Selain tombol unduh manual di browser, Anda bisa mengunduh otomatis lewat Python:

### Cara 1: Library Modern \`kagglehub\` (Sangat Direkomendasikan)
Kaggle merilis library resmi bernama \`kagglehub\` yang sangat ringkas:
\`\`\`python
import kagglehub

# Unduh versi terbaru dataset wine reviews
path = kagglehub.dataset_download("zynicide/wine-reviews")
print("Path folder dataset:", path)
\`\`\`

### Cara 2: Kaggle CLI (Command Line Interface)
Jika Anda memasang package \`kaggle\` lewat pip, Anda bisa mengunduh langsung dari Command Prompt:
\`\`\`cmd
kaggle datasets download -d zynicide/wine-reviews --unzip
\`\`\`
*Catatan:* Opsi \`--unzip\` otomatis mengekstrak file arsip sehingga Anda langsung mendapatkan file .csv siap pakai.`,
        callout: {
          type: 'warning',
          title: 'Lokasi Rahasia kaggle.json di Windows',
          text: 'Token API Kaggle Anda wajib disimpan di file bernama kaggle.json dan diletakkan di: C:\\Users\\<NamaUserAnda>\\.kaggle\\kaggle.json. Jangan ubah nama filenya!'
        }
      },
      {
        id: '2-3',
        title: 'Membuka dan Memeriksa CSV dengan Pandas',
        content: `Setelah file CSV berhasil didapatkan, kita menggunakan **Pandas**—alat standar industri untuk manipulasi data tabel di Python.

Berikut 4 fungsi wajib yang selalu dijalankan pertama kali:
1. \`df.head()\`: Menampilkan 5 baris teratas untuk melihat contoh isi nyata.
2. \`df.shape\`: Memberitahu ukuran tabel dalam format (jumlah_baris, jumlah_kolom).
3. \`df.info()\`: Menampilkan nama setiap kolom, jumlah data yang tidak kosong (non-null), dan tipe datanya (int64, float64, object/string).
4. \`df.describe()\`: Menghitung ringkasan statistik otomatis untuk kolom angka (rata-rata/mean, standar deviasi, nilai minimum, median/50%, dan maksimum).`,
        codeSnippet: {
          language: 'python',
          caption: 'Contoh inspeksi data awal di Python',
          code: `import pandas as pd

# 1. Baca file CSV
df = pd.read_csv("contoh_buku.csv")

# 2. Lihat 5 baris pertama
print(df.head())

# 3. Cek tipe data dan kelengkapan kolom
df.info()

# 4. Ringkasan statistik harga dan rating
print(df.describe())`
        }
      }
    ]
  },
  {
    id: 3,
    title: 'Dasar HTML untuk Web Scraping',
    subtitle: 'Membaca bahasa halaman web, DOM Tree, dan menguasai Inspect Element di browser',
    badge: 'Struktur Web',
    duration: '20 menit',
    summary: 'Web scraper tidak membaca halaman web seperti manusia melihat visual. Scraper membaca teks kode HTML. Kuasai cara membedah tag dan class untuk mengambil data dengan tepat.',
    topics: ['Anatomi Tag & Atribut HTML', 'Konsep DOM (Document Object Model)', 'Menggunakan Fitur Inspect Element', 'Formula CSS Selector'],
    sections: [
      {
        id: '3-1',
        title: 'Anatomi Tag HTML: Wadah Penyimpan Data',
        content: `Website dibangun dari pasangan tag pembuka dan penutup. Informasi yang ingin kita ambil biasanya berada **di antara tag** atau **di dalam atribut tag**.

Contoh elemen kartu buku:
\`\`\`html
<article class="product_pod">
  <h3>
    <a href="buku-1.html" title="A Light in the Attic">A Light in the Attic</a>
  </h3>
  <p class="price_color">£51.77</p>
  <p class="instock availability">In stock</p>
</article>
\`\`\`

- **Tag Name (\`article\`, \`h3\`, \`a\`, \`p\`):** Tipe elemen tersebut.
- **Class (\`class="product_pod"\`):** Penanda gaya/kategori elemen. Sering dipakai scraper karena elemen serupa memiliki class yang sama.
- **Id (\`id="header-utama"\`):** Penanda unik dalam satu halaman (hanya ada satu elemen per id).
- **Atribut (\`href\`, \`title\`):** Data tambahan di dalam tag pembuka. Perhatikan: judul panjang buku sering tersimpan di atribut \`title\`!`,
        callout: {
          type: 'info',
          title: 'Teks vs Atribut: Jangan Salah Ambil!',
          text: 'Terkadang teks yang tampil di layar terpotong ("A Light in the..."), sedangkan judul lengkap tersimpan di dalam atribut title: <a title="A Light in the Attic">. Scraper yang cerdas selalu memeriksa atribut!'
        }
      },
      {
        id: '3-2',
        title: 'Cara Praktis Memakai Inspect Element di Browser',
        content: `Anda tidak perlu membaca ribuan baris HTML dari atas ke bawah. Gunakan fitur bawaan browser Anda:

1. Buka situs yang ingin dipelajari (misal di Google Chrome atau Microsoft Edge).
2. Arahkan kursor mouse ke teks atau angka yang ingin Anda ambil (misalnya harga buku).
3. **Klik Kanan** -> pilih menu **Inspect** (atau tekan tombol keyboard **F12**).
4. Panel pengembang (*Developer Tools*) akan terbuka di samping atau bawah.
5. Elemen kode HTML yang membungkus teks tersebut akan otomatis **tersorot warna biru**!
6. Perhatikan tag apa yang membungkusnya, serta apa nama \`class\` atau \`id\` yang dimilikinya.`,
        callout: {
          type: 'tip',
          title: 'Pintasan Tombol Cepat',
          text: 'Tekan Ctrl + Shift + C di Windows untuk mengaktifkan kursor inspeksi. Cukup arahkan kursor ke elemen mana pun di layar, dan kodenya langsung muncul di panel.'
        }
      },
      {
        id: '3-3',
        title: 'Rumus CSS Selector untuk Scraper',
        content: `CSS Selector adalah "alamat penunjuk" yang kita berikan ke BeautifulSoup untuk mencari elemen tertentu di tengah ribuan tag HTML:

| Pola Selector | Penulisan | Contoh | Arti |
|---|---|---|---|
| **Berdasarkan Tag** | \`nama_tag\` | \`p\` | Cari semua paragraf |
| **Berdasarkan Class** | \`.nama_class\` | \`.price_color\` | Cari elemen yang punya class \`price_color\` |
| **Berdasarkan Id** | \`#nama_id\` | \`#total-harga\` | Cari elemen dengan id unik \`total-harga\` |
| **Kombinasi Tag & Class** | \`tag.class\` | \`article.product_pod\` | Cari tag \`article\` yang berkelas \`product_pod\` |
| **Anak Elemen (Hierarki)** | \`induk anak\` | \`h3 a\` | Cari tag \`a\` yang berada di dalam \`h3\` |
| **Berdasarkan Atribut** | \`tag[attr=val]\` | \`a[title]\` | Cari tag \`a\` yang memiliki atribut \`title\` |`
      }
    ]
  },
  {
    id: 4,
    title: 'Scraping dengan Python: requests & BeautifulSoup',
    subtitle: 'Memahami siklus Request-Response-Parsing dan menulis skrip scraper pertama',
    badge: 'Praktik Coding',
    duration: '30 menit',
    summary: 'Waktunya menyatukan teori! Pelajari bagaimana library requests bertindak sebagai kurir pengambil data dan BeautifulSoup sebagai pisau bedah untuk mengekstrak informasi.',
    topics: ['Siklus Request -> Response -> Parsing', 'Library requests & Headers', 'BeautifulSoup select() vs select_one()', 'Menyimpan Hasil ke List Dict'],
    sections: [
      {
        id: '4-1',
        title: 'Alur Kerja 4 Langkah Pemula',
        content: `Setiap program web scraping di Python selalu mengikuti 4 langkah berulang yang sama:

1. **Kirim Permintaan (Request):** Python menghubungi server web menggunakan \`requests.get(url)\`.
2. **Terima Respons (Response):** Server menjawab dengan kode status (misal 200 OK) dan mengembalikan seluruh teks kode HTML halaman tersebut.
3. **Pembedahan Kode (Parsing):** \`BeautifulSoup\` mengubah teks HTML mentah menjadi pohon objek yang bisa dicari menggunakan CSS Selector.
4. **Penyimpanan (Storage):** Nilai teks yang berhasil diambil dikumpulkan dalam bentuk list berisi dictionary, lalu disimpan ke file CSV.`,
        codeSnippet: {
          language: 'python',
          caption: 'Struktur kode standar scraping Python',
          code: `import requests
from bs4 import BeautifulSoup

# Langkah 1 & 2: Kirim permintaan dan terima teks HTML
url = "http://quotes.toscrape.com/"
response = requests.get(url, headers={"User-Agent": "LatihanData/1.0"})

# Langkah 3: Parsing HTML dengan BeautifulSoup
soup = BeautifulSoup(response.text, "html.parser")

# Ambil semua kartu quote
kartu_quotes = soup.select("div.quote")

# Langkah 4: Ekstraksi teks
data = []
for item in kartu_quotes:
    teks = item.select_one("span.text").get_text(strip=True)
    penulis = item.select_one("small.author").get_text(strip=True)
    data.append({"penulis": penulis, "teks": teks})

print(f"Total kutipan berhasil diambil: {len(data)}")`
        }
      },
      {
        id: '4-2',
        title: 'Perbedaan select() vs select_one()',
        content: `Banyak pemula bingung kapan memakai \`select\` dan \`select_one\`:

- **\`soup.select("selector")\`:**
  Mengembalikan **LIST (kumpulan banyak elemen)** yang cocok dengan selector. Anda harus melakukan looping \`for item in hasil:\` untuk memproses setiap elemennya. Jika tidak ada yang cocok, hasilnya adalah list kosong \`[]\`.
- **\`soup.select_one("selector")\`:**
  Hanya mengembalikan **SATU elemen pertama** yang cocok. Cocok digunakan ketika mencari judul atau harga di dalam satu kotak kartu produk tertentu. Jika tidak ditemukan, hasilnya bernilai \`None\`.`,
        callout: {
          type: 'tip',
          title: 'Cegah Error AttributeError: NoneType',
          text: 'Jika selector Anda salah ketik, select_one akan menghasilkan None. Selalu gunakan pengecekan: teks = tag.get_text() if tag else "Tidak Ditemukan"'
        }
      }
    ]
  },
  {
    id: 5,
    title: 'Scraping yang Lebih Sulit & Penanganan Masalah',
    subtitle: 'Pagination, perbedaan Static HTML vs JavaScript (SPA), Status Codes, dan Error Handling',
    badge: 'Trik Lanjutan',
    duration: '25 menit',
    summary: 'Di dunia nyata, data tidak tersimpan di satu halaman saja dan website bisa memberikan error. Kuasai pagination, pemahaman dynamic rendering, dan penanganan status code.',
    topics: ['Pagination (Multi-Halaman)', 'Halaman JavaScript (SPA) vs Static HTML', 'Kapan Butuh Selenium / Playwright', 'Status Codes (200, 403, 404, 429)', 'try-except & Timeout'],
    sections: [
      {
        id: '5-1',
        title: 'Menembus Banyak Halaman (Pagination)',
        content: `Situs web umumnya membagi katalog produk menjadi ratusan halaman (Halaman 1, 2, 3...). Bagaimana scraper kita menjelajahinya?

Ada 2 strategi umum:
1. **Pola URL Teratur:**
   Perhatikan bilah alamat browser saat Anda klik Next. Seringkali polanya sangat rapi:
   - \`website.com/katalog/page-1.html\`
   - \`website.com/katalog/page-2.html\`
   Kita cukup membuat perulangan \`for page in range(1, 10):\` dan menyisipkan nomor halaman dengan f-string Python!
2. **Mengikuti Tombol Next:**
   Jika URL menggunakan acakan kode unik, cari tag tombol \`<li class="next"><a href="...">\` di akhir halaman, ambil nilai \`href\`-nya, lalu gunakan tautan tersebut untuk request putaran berikutnya.`,
        callout: {
          type: 'warning',
          title: 'Wajib: Beri Jeda time.sleep()!',
          text: 'Saat looping 100 halaman, komputer Anda bisa menembak 100 permintaan dalam 2 detik. Server akan menganggap ini serangan DDoS dan memblokir IP Anda. Selalu sertakan time.sleep(2) di antara putaran perulangan!'
        }
      },
      {
        id: '5-2',
        title: 'Mengapa requests Gagal pada Halaman Tertentu? (JavaScript vs Static)',
        content: `Pernahkah Anda menjalankan \`requests.get()\`, tetapi saat mencetak \`response.text\`, datanya kosong melompong padahal di browser terlihat jelas?

Penyebabnya adalah **Client-Side Rendering (JavaScript/React/Vue/Angular)**:
- Library \`requests\` hanya mengunduh file HTML mentah pertama yang dikirim server. Ia **tidak menjalankan JavaScript**.
- Di browser, browser Anda menjalankan skrip JavaScript yang kemudian memanggil data tambahan dari server dan merender tampilannya.

**Apa solusinya?**
1. **Solusi Cerdas (Cek Network Tab):** Buka Inspect Element -> tab Network -> Fetch/XHR. Seringkali Anda menemukan API internal berformat JSON asli yang bisa langsung diminta dengan \`requests.get()\` tanpa perlu BeautifulSoup sama sekali!
2. **Solusi Browser Automation (Selenium / Playwright):** Jika memang harus membuka browser sungguhan yang menjalankan JavaScript, barulah kita memakai Playwright atau Selenium. Namun cara ini jauh lebih lambat dan memakan RAM besar.`,
        callout: {
          type: 'info',
          title: 'Rekomendasi Pemula',
          text: 'Sebagai pemula, mulailah berlatih di situs statis terlebih dahulu (seperti books.toscrape.com) sebelum beralih ke website yang sarat rendering JavaScript.'
        }
      },
      {
        id: '5-3',
        title: 'Kamus Status Code HTTP yang Wajib Dipahami',
        content: `Server web menjawab setiap permintaan dengan kode status 3 digit:

- **200 OK:** Sukses gemilang! Server mengembalikan data yang diminta secara utuh.
- **403 Forbidden:** Ditolak! Server mendeteksi bahwa permintaan berasal dari bot (seringkali karena tidak menyertakan header User-Agent yang wajar) atau IP Anda masuk daftar blokir.
- **404 Not Found:** Alamat tidak ditemukan. Sering terjadi saat Anda mencapai halaman terakhir pada pagination.
- **429 Too Many Requests:** Peringatan keras! Anda mengirim permintaan terlalu cepat tanpa jeda. Hentikan skrip segera dan perbesar durasi \`time.sleep()\`.
- **500 / 503 Internal Server Error:** Server situs target sedang kewalahan atau rusak di pihak mereka.`
      }
    ]
  },
  {
    id: 6,
    title: 'Etika, Hukum & Checklist Scraping',
    subtitle: 'Robots.txt, Terms of Service, UU PDP di Indonesia, batas privasi, dan checklist kepatuhan',
    badge: 'Etika & Hukum',
    duration: '20 menit',
    summary: 'Kemampuan scraping adalah kekuatan teknis yang besar. Bertanggung jawablah: pahami batasan hukum, privasi data pribadi, dan sopan santun digital.',
    topics: ['Membaca File robots.txt', 'Ketentuan Layanan (ToS)', 'Prinsip UU PDP No. 27/2022 di Indonesia', 'Data Pribadi vs Data Publik', 'Checklist Keamanan'],
    sections: [
      {
        id: '6-1',
        title: 'Membaca Panduan robots.txt Pemilik Situs',
        content: `Hampir setiap website memiliki file teks di alamat dasar mereka yang memberi tahu bot halaman mana yang boleh dan tidak boleh diakses:
Contoh: \`https://nama-situs.com/robots.txt\`

Mari kita bedah artinya:
\`\`\`txt
User-agent: *
Disallow: /admin/
Disallow: /keranjang/
Disallow: /api-internal/
Crawl-delay: 5
Allow: /katalog/
\`\`\`

- **\`User-agent: *\`:** Aturan ini berlaku untuk semua crawler dan bot scraper umum.
- **\`Disallow: /keranjang/\`:** Scraper **dilarang keras** membuka halaman yang beralamat di dalam folder \`/keranjang/\`.
- **\`Crawl-delay: 5\`:** Pemilik web meminta Anda memberi jeda minimal 5 detik sebelum mengirim permintaan berikutnya.
- **\`Allow: /katalog/\`:** Bagian ini diizinkan secara terbuka untuk dibaca mesin pencari atau crawler publik.`,
        callout: {
          type: 'tip',
          title: 'Langkah Pertama Sebelum Mulai Proyek',
          text: 'Sebelum mengetik scraper untuk situs baru, selalu buka URL/robots.txt terlebih dahulu di browser Anda untuk melihat batasannya.'
        }
      },
      {
        id: '6-2',
        title: 'Hukum & Privasi: UU PDP di Indonesia Secara Umum',
        content: `Di Indonesia, perlindungan data diatur dalam **Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)**.

Prinsip penting yang wajib diketahui praktisi data pemula:
1. **Jangan Mengambil Data Pribadi Spesifik Tanpa Dasar Hukum Sah:**
   Data seperti NIK, rekam medis kesehatan, informasi keuangan perbankan, orientasi pribadi, atau data anak di bawah umur memiliki proteksi hukum ketat dengan sanksi pidana dan denda administratif.
2. **Data Publik Bukan Berarti Bebas Disalahgunakan:**
   Meskipun seseorang menulis nomor HP atau email pribadinya di forum terbuka, mengambilnya secara massal (*bulk harvesting*) untuk keperluan spamming telemarketing atau dijual kembali melanggar privasi pengguna dan ketentuan UU PDP.
3. **Patuhi Terms of Service (Ketentuan Layanan):**
   Jika dokumen perjanjian layanan sebuah situs menyatakan secara eksplisit: *"Dilarang menggunakan perangkat otomatis, spider, robot, atau scraper untuk mengakses situs ini"*, maka scraping dapat dikategorikan sebagai pelanggaran kontrak perdata akses situs.`,
        callout: {
          type: 'warning',
          title: 'Batas Penafian Edukasi',
          text: 'Informasi ini adalah panduan edukasi umum prinsip rekayasa perangkat lunak, bukan merupakan nasihat hukum formal (legal counsel). Jika proyek Anda melibatkan tujuan komersial bernilai tinggi, selalu konsultasikan dengan ahli hukum berlisensi.'
        }
      },
      {
        id: '6-3',
        title: 'Checklist Sopan Santun Seorang Pengambil Data yang Baik',
        content: `Sebelum menyalakan scraper Anda, pastikan Anda mencentang prinsip berikut:
- [ ] Apakah saya sudah memeriksa apakah ada API resmi atau dataset Kaggle yang siap pakai?
- [ ] Apakah saya menyertakan header \`User-Agent\` yang jelas dan tidak menyamar sebagai bot peretas?
- [ ] Apakah saya menyertakan jeda waktu wajar (\`time.sleep\` minimal 1-3 detik)?
- [ ] Apakah saya hanya mengambil halaman yang diizinkan di \`robots.txt\`?
- [ ] Apakah saya memastikan tidak mengumpulkan data pribadi sensitif perorangan?
- [ ] Apakah waktu scraping saya menghindari jam puncak sibuk server (misal dijalankan malam hari jika datanya berjumlah besar)?`
      }
    ]
  }
];
