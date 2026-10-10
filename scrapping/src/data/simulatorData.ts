import { Mission, MockRequestPreset, ScrapedBookItem } from '../types';

export const MISSIONS_DATA: Mission[] = [
  // Modul 1
  {
    id: 'm1-1',
    moduleId: 1,
    title: 'Mengenal 3 Jalur Data',
    description: 'Pelajari perbedaan mendasar antara Dataset Kaggle, API Resmi, dan Web Scraping.',
    hint: 'Buka Modul 1 dan baca bagian "Tiga Sumber Data Utama".'
  },
  {
    id: 'm1-2',
    moduleId: 1,
    title: 'Pahami Matriks Pemilihan',
    description: 'Ketahui hierarki efisiensi: Kapan mengutamakan Kaggle, kapan memakai API, dan kapan scraping.',
    hint: 'Selalu cek Kaggle dan API resmi terlebih dahulu sebelum membuat web scraper.'
  },
  {
    id: 'm1-3',
    moduleId: 1,
    title: 'Periksa Analogi Dapur Restoran',
    description: 'Pahami mengapa API seperti menu restoran dan scraping seperti memilah bahan di dapur.',
    hint: 'Simak kotak informasi di Modul 1 bagian pertama.'
  },

  // Modul 2
  {
    id: 'm2-1',
    moduleId: 2,
    title: 'Lokasi Token Kaggle di Windows',
    description: 'Ketahui direktori tepat untuk file kaggle.json di C:\\Users\\<Nama>\\.kaggle\\kaggle.json.',
    hint: 'Buka Modul 2 atau menu Panduan Windows untuk melihat jalur direktori sistem.'
  },
  {
    id: 'm2-2',
    moduleId: 2,
    title: 'Empat Fungsi Wajib Pandas',
    description: 'Pahami kegunaan df.head(), df.shape, df.info(), dan df.describe().',
    hint: 'Pelajari bagian inspeksi CSV di Modul 2.'
  },
  {
    id: 'm2-3',
    moduleId: 2,
    title: 'Membaca Usability Score & Lisensi',
    description: 'Pastikan Anda memahami arti skor kegunaan dan jenis lisensi dataset sebelum digunakan.',
    hint: 'Lihat penjelasan Usability Score di Modul 2.'
  },

  // Modul 3
  {
    id: 'm3-1',
    moduleId: 3,
    title: 'Kuasai Inspect Element (F12)',
    description: 'Pelajari cara klik kanan Inspect atau tekan F12 untuk melihat tag pembungkus di browser.',
    hint: 'Baca Modul 3 bagian Inspect Element.'
  },
  {
    id: 'm3-2',
    moduleId: 3,
    title: 'Uji Coba Simulator Inspect Element',
    description: 'Buka fitur Simulator Inspect Element dan coba ketik selector "h3 a" atau ".price_color".',
    hint: 'Kunjungi tab menu "Simulator Inspect" di bilah atas.'
  },
  {
    id: 'm3-3',
    moduleId: 3,
    title: 'Ambil Atribut Tersembunyi (title)',
    description: 'Pahami mengapa teks terpotong bisa diambil versi lengkapnya lewat atribut title.',
    hint: 'Coba pilih selector "a[title]" di Simulator Inspect.'
  },

  // Modul 4
  {
    id: 'm4-1',
    moduleId: 4,
    title: 'Pahami Siklus 4 Langkah Scraping',
    description: 'Kuasai siklus: Request HTTP -> Response Text -> Parsing BeautifulSoup -> Simpan ke CSV.',
    hint: 'Baca alur kerja di Modul 4.'
  },
  {
    id: 'm4-2',
    moduleId: 4,
    title: 'Eksperimen di Pembangun Kode',
    description: 'Buka fitur "Pembangun Kode" (Code Builder), pilih opsi sumber dan buat skrip Python.',
    hint: 'Gunakan tab "Pembangun Kode" di menu atas.'
  },
  {
    id: 'm4-3',
    moduleId: 4,
    title: 'Pelajari Skrip Latihan 03 & 05',
    description: 'Periksa kode di tab "Folder Latihan Python" untuk melihat implementasi nyata.',
    hint: 'Buka menu "Folder Latihan Python" dan baca skrip 03_scrape_satu_halaman.py.'
  },

  // Modul 5
  {
    id: 'm5-1',
    moduleId: 5,
    title: 'Uji Coba Simulator Request & Response',
    description: 'Kirim permintaan simulasi untuk melihat status code 200, 404, 403, dan 429.',
    hint: 'Buka tab "Simulator Request/Response" di menu atas.'
  },
  {
    id: 'm5-2',
    moduleId: 5,
    title: 'Pahami Hambatan JavaScript (SPA)',
    description: 'Pahami mengapa requests tidak bisa membaca konten yang baru dimuat oleh JavaScript.',
    hint: 'Baca Modul 5 bagian "Mengapa requests Gagal pada Halaman Tertentu".'
  },
  {
    id: 'm5-3',
    moduleId: 5,
    title: 'Terapkan time.sleep() pada Pagination',
    description: 'Ketahui bahaya scraping tanpa jeda dan mengapa time.sleep(2) wajib digunakan.',
    hint: 'Simak penjelasan pagination di Modul 5.'
  },

  // Modul 6
  {
    id: 'm6-1',
    moduleId: 6,
    title: 'Pahami File robots.txt',
    description: 'Pelajari arti User-agent, Disallow, Allow, dan Crawl-delay pada situs web.',
    hint: 'Buka Modul 6 bagian membaca robots.txt.'
  },
  {
    id: 'm6-2',
    moduleId: 6,
    title: 'Coba Checklist Etika & UU PDP',
    description: 'Gunakan fitur interaktif Checklist Etika untuk menilai apakah ide scraping Anda aman.',
    hint: 'Buka menu "Checklist Etika" di atas.'
  },
  {
    id: 'm6-3',
    moduleId: 6,
    title: 'Tuntaskan Kuis 15 Soal (Nilai >= 70%)',
    description: 'Uji seluruh pemahaman Anda dengan mengerjakan kuis interaktif 15 soal.',
    hint: 'Buka menu "Kuis Pemahaman" dan selesaikan seluruh pertanyaan.'
  }
];

export const MOCK_REQUEST_PRESETS: MockRequestPreset[] = [
  {
    id: 'books-ok',
    name: 'Books to Scrape (Halaman Utama)',
    url: 'http://books.toscrape.com/index.html',
    method: 'GET',
    statusCode: 200,
    statusText: 'OK',
    latencyMs: 142,
    description: 'Permintaan sukses mengambil halaman depan katalog buku latihan legal.',
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'server': 'nginx/1.18.0',
      'cache-control': 'public, max-age=3600',
      'content-length': '51420'
    },
    responseBody: `<!DOCTYPE html>
<html lang="en-us">
  <head>
    <title>All products | Books to Scrape - Sandbox</title>
  </head>
  <body>
    <div class="page_inner">
      <ul class="breadcrumb"><li><a href="index.html">Home</a></li></ul>
      <div class="alert alert-warning">Situs sandbox legal untuk latihan scraping.</div>
      <section>
        <article class="product_pod">
          <h3><a href="catalogue/a-light-in-the-attic_1000/index.html" title="A Light in the Attic">A Light in the Attic</a></h3>
          <p class="price_color">£51.77</p>
          <p class="instock availability"><i class="icon-ok"></i> In stock</p>
        </article>
      </section>
    </div>
  </body>
</html>`,
    diagnosis: 'Koneksi berjalan sempurna. Server merespons dalam 142ms dan mengirimkan dokumen HTML lengkap berstatus 200 OK.',
    remedy: 'Data siap diparsing dengan BeautifulSoup: soup = BeautifulSoup(response.text, "html.parser").'
  },
  {
    id: 'quotes-ok',
    name: 'Quotes to Scrape (Halaman Utama)',
    url: 'http://quotes.toscrape.com/',
    method: 'GET',
    statusCode: 200,
    statusText: 'OK',
    latencyMs: 110,
    description: 'Permintaan sukses mengambil daftar kutipan motivasi dari situs latihan.',
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'server': 'gunicorn/20.1.0',
      'content-length': '11054'
    },
    responseBody: `<!DOCTYPE html>
<html lang="en">
  <head><title>Quotes to Scrape</title></head>
  <body>
    <div class="container">
      <div class="quote">
        <span class="text">“The world as we have created it is a process of our thinking...”</span>
        <span>by <small class="author">Albert Einstein</small></span>
        <div class="tags">Tags: <a class="tag">change</a>, <a class="tag">thinking</a></div>
      </div>
    </div>
  </body>
</html>`,
    diagnosis: 'Respon diterima dengan lancar. Elemen quote berformat teks bersih dan mudah diekstraksi.',
    remedy: 'Gunakan soup.select("div.quote") untuk mengambil setiap kotak kutipan.'
  },
  {
    id: 'page-404',
    name: 'Pagination Melewati Batas Halaman (404)',
    url: 'http://books.toscrape.com/catalogue/page-51.html',
    method: 'GET',
    statusCode: 404,
    statusText: 'Not Found',
    latencyMs: 85,
    description: 'Mencoba mengambil halaman 51 pada katalog yang hanya memiliki 50 halaman.',
    headers: {
      'content-type': 'text/html',
      'server': 'nginx/1.18.0',
      'content-length': '162'
    },
    responseBody: `<html>
<head><title>404 Not Found</title></head>
<body>
<center><h1>404 Not Found</h1></center>
<hr><center>nginx/1.18.0</center>
</body>
</html>`,
    diagnosis: 'Halaman yang diminta tidak ada di server. Dalam konteks pagination, ini biasanya menandakan Anda sudah mencapai halaman terakhir.',
    remedy: 'Gunakan pengecekan: if response.status_code == 404: break untuk menghentikan perulangan (loop) secara bersih.'
  },
  {
    id: 'block-403',
    name: 'Akses Ditolak Tanpa User-Agent (403)',
    url: 'https://contoh-situs-ketat.com/katalog',
    method: 'GET',
    statusCode: 403,
    statusText: 'Forbidden',
    latencyMs: 45,
    description: 'Server menolak koneksi karena mendeteksi User-Agent default bawaan Python.',
    headers: {
      'content-type': 'text/html',
      'server': 'cloudflare',
      'cf-ray': '87c941320fa00021-SIN'
    },
    responseBody: `<html>
<head><title>403 Forbidden</title></head>
<body>
<h1>403 Forbidden</h1>
<p>Akses Anda ditolak oleh sistem keamanan. Automated scripts tidak diizinkan tanpa identitas terverifikasi.</p>
</body>
</html>`,
    diagnosis: 'Firewall server menolak permintaan karena User-Agent terdeteksi sebagai "python-requests" atau permintaan tidak wajar.',
    remedy: 'Tambahkan parameter headers={"User-Agent": "Mozilla/5.0 ..."} saat memanggil requests.get() dan patuhi aturan robots.txt situs.'
  },
  {
    id: 'rate-429',
    name: 'Terlalu Cepat Tanpa Jeda (429)',
    url: 'https://api.latihan-data.com/v1/produk',
    method: 'GET',
    statusCode: 429,
    statusText: 'Too Many Requests',
    latencyMs: 32,
    description: 'Server memblokir sementara karena skrip menembak 50 request dalam 1 detik.',
    headers: {
      'content-type': 'application/json',
      'retry-after': '60',
      'x-ratelimit-remaining': '0'
    },
    responseBody: `{
  "error": "Rate limit exceeded",
  "message": "Anda mengirimkan lebih dari 30 permintaan per menit. Silakan tunggu 60 detik.",
  "retry_after_seconds": 60
}`,
    diagnosis: 'Rate limiter aktif! Komputer Anda mengirimkan permintaan terlalu cepat melebihi kapasitas yang diizinkan server.',
    remedy: 'Wajib gunakan time.sleep(2) di dalam setiap perulangan! Perhatikan header "Retry-After" untuk mengetahui berapa lama harus menunggu.'
  }
];

export const MOCK_BOOKS_DATASET: ScrapedBookItem[] = [
  { id: 1, title: 'A Light in the Attic', category: 'Poetry', price: 51.77, priceFormatted: '£51.77', rating: 3, inStock: true, stockCount: 22, upc: 'a897fe39b1053632' },
  { id: 2, title: 'Tipping the Velvet', category: 'Historical Fiction', price: 53.74, priceFormatted: '£53.74', rating: 1, inStock: true, stockCount: 20, upc: '90fa61229261140a' },
  { id: 3, title: 'Soumission', category: 'Fiction', price: 50.10, priceFormatted: '£50.10', rating: 1, inStock: true, stockCount: 20, upc: '6957f44c3847a760' },
  { id: 4, title: 'Sharp Objects', category: 'Mystery', price: 47.82, priceFormatted: '£47.82', rating: 4, inStock: true, stockCount: 20, upc: 'e00eb4fb7fe39da0' },
  { id: 5, title: 'Sapiens: A Brief History of Humankind', category: 'History', price: 54.23, priceFormatted: '£54.23', rating: 5, inStock: true, stockCount: 20, upc: '4165285e16e16363' },
  { id: 6, title: 'The Requiem Red', category: 'Young Adult', price: 22.65, priceFormatted: '£22.65', rating: 1, inStock: true, stockCount: 19, upc: 'f77dbf2323eb7404' },
  { id: 7, title: 'The Dirty Little Secrets of Getting Your Dream Job', category: 'Business', price: 33.34, priceFormatted: '£33.34', rating: 4, inStock: true, stockCount: 19, upc: '2597b5a345f45e1b' },
  { id: 8, title: 'The Coming Woman: A Novel Based on the Life of Victoria Woodhull', category: 'Historical Fiction', price: 17.93, priceFormatted: '£17.93', rating: 3, inStock: true, stockCount: 19, upc: 'e72a5acda134376f' },
  { id: 9, title: 'The Boys in the Boat', category: 'History', price: 22.60, priceFormatted: '£22.60', rating: 4, inStock: true, stockCount: 19, upc: 'e10e1e165dc8682a' },
  { id: 10, title: 'The Black Maria', category: 'Poetry', price: 52.15, priceFormatted: '£52.15', rating: 1, inStock: true, stockCount: 19, upc: '1aaf241107704e0a' },
  { id: 11, title: 'Starving Hearts (Triangular Trade Trilogy, #1)', category: 'Default', price: 13.99, priceFormatted: '£13.99', rating: 2, inStock: false, stockCount: 0, upc: 'bd3387152de6fa5e' },
  { id: 12, title: "Shakespeare's Sonnets", category: 'Poetry', price: 20.66, priceFormatted: '£20.66', rating: 4, inStock: true, stockCount: 19, upc: '30a7f60e64108437' },
  { id: 13, title: 'Set Me Free', category: 'Young Adult', price: 17.46, priceFormatted: '£17.46', rating: 5, inStock: true, stockCount: 19, upc: 'ce6396b0f23f6ecc' },
  { id: 14, title: "Scott Pilgrim's Precious Little Life", category: 'Sequential Art', price: 52.29, priceFormatted: '£52.29', rating: 5, inStock: true, stockCount: 19, upc: '3b1c02bac40e823a' },
  { id: 15, title: 'Rip it Up and Start Again', category: 'Music', price: 35.02, priceFormatted: '£35.02', rating: 5, inStock: false, stockCount: 0, upc: 'a34ba61dd42816b8' }
];

export interface InspectMockItem {
  id: string;
  tag: string;
  title: string;
  fullTitle: string;
  price: string;
  ratingWord: string;
  ratingStars: number;
  inStockText: string;
  category: string;
  upc: string;
  thumbnail: string;
}

export const INSPECT_MOCK_ITEMS: InspectMockItem[] = [
  {
    id: 'buku-1',
    tag: 'article',
    title: 'A Light in the Attic...',
    fullTitle: 'A Light in the Attic',
    price: '£51.77',
    ratingWord: 'Three',
    ratingStars: 3,
    inStockText: 'In stock',
    category: 'Poetry',
    upc: 'a897fe39b1053632',
    thumbnail: '📘'
  },
  {
    id: 'buku-2',
    tag: 'article',
    title: 'Tipping the Velvet...',
    fullTitle: 'Tipping the Velvet',
    price: '£53.74',
    ratingWord: 'One',
    ratingStars: 1,
    inStockText: 'In stock',
    category: 'Historical Fiction',
    upc: '90fa61229261140a',
    thumbnail: '📕'
  },
  {
    id: 'buku-3',
    tag: 'article',
    title: 'Soumission...',
    fullTitle: 'Soumission',
    price: '£50.10',
    ratingWord: 'One',
    ratingStars: 1,
    inStockText: 'In stock',
    category: 'Fiction',
    upc: '6957f44c3847a760',
    thumbnail: '📗'
  },
  {
    id: 'buku-4',
    tag: 'article',
    title: 'Sharp Objects...',
    fullTitle: 'Sharp Objects',
    price: '£47.82',
    ratingWord: 'Four',
    ratingStars: 4,
    inStockText: 'In stock',
    category: 'Mystery',
    upc: 'e00eb4fb7fe39da0',
    thumbnail: '📙'
  }
];
