import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    moduleId: 1,
    moduleName: 'Modul 1: Peta Data',
    question: 'Jika sebuah penyedia layanan (misalnya BMKG untuk cuaca atau Spotify untuk musik) menyediakan API resmi gratis dan terdokumentasi, mengapa kita sebaiknya memilih API daripada membuat web scraper?',
    options: [
      { id: 'A', text: 'Karena API otomatis mengubah data menjadi file Excel di komputer tanpa perlu kode' },
      { id: 'B', text: 'Karena API resmi lebih stabil, formatnya terstruktur (JSON), legal, dan tidak mudah rusak saat tampilan website diubah' },
      { id: 'C', text: 'Karena web scraper dilarang oleh semua sistem operasi termasuk Windows' },
      { id: 'D', text: 'Karena API tidak membutuhkan koneksi internet sama sekali' }
    ],
    correctId: 'B',
    explanation: 'API resmi adalah jalur resmi yang dirancang khusus untuk mesin. Format datanya konsisten (JSON/XML) dan tidak akan pecah saat tampilan desain web diubah, berbeda dengan scraper yang mengandalkan struktur tag HTML yang rapuh.',
    wrongExplanations: {
      A: 'API mengembalikan respon data mentah (biasanya JSON), kita tetap perlu menulis kode untuk mengolah atau menyimpannya.',
      C: 'Web scraping tidak dilarang oleh OS; scraping adalah teknik pemrograman jaringan biasa.',
      D: 'API tetap memerlukan sambungan internet untuk mengirimkan request ke server.'
    }
  },
  {
    id: 2,
    moduleId: 1,
    moduleName: 'Modul 1: Peta Data',
    question: 'Di antara skenario berikut, kapan web scraping menjadi pilihan yang paling tepat?',
    options: [
      { id: 'A', text: 'Ketika dataset yang dicari sudah tersedia lengkap dan bersih di Kaggle' },
      { id: 'B', text: 'Ketika website target memiliki API publik dengan kuota tak terbatas' },
      { id: 'C', text: 'Ketika data hanya tampil di halaman web publik tanpa tombol unduh dan tidak ada API resmi yang disediakan' },
      { id: 'D', text: 'Ketika kita ingin mengambil data akun rahasia pengguna dari database bank' }
    ],
    correctId: 'C',
    explanation: 'Scraping digunakan sebagai jalan keluar ketika tidak ada cara resmi (tidak ada dataset siap pakai dan tidak ada API), namun data tersebut memang ditampilkan secara publik di halaman web.',
    wrongExplanations: {
      A: 'Jika sudah ada di Kaggle, langsung unduh saja untuk menghemat waktu.',
      B: 'Jika ada API publik, utamakan API karena jauh lebih stabil.',
      D: 'Mengambil data akun pribadi rahasia adalah tindakan ilegal dan pelanggaran keamanan serius.'
    }
  },
  {
    id: 3,
    moduleId: 2,
    moduleName: 'Modul 2: Kaggle Langkah demi Langkah',
    question: 'Di sistem operasi Windows, di manakah lokasi folder dan file token yang tepat agar Kaggle API dapat membaca kredensial akun Anda secara otomatis?',
    options: [
      { id: 'A', text: 'C:\\Program Files\\Kaggle\\token.txt' },
      { id: 'B', text: 'C:\\Users\\<NamaPengguna>\\.kaggle\\kaggle.json' },
      { id: 'C', text: 'C:\\Windows\\System32\\kaggle.json' },
      { id: 'D', text: 'Di folder Desktop dengan nama token_kaggle.csv' }
    ],
    correctId: 'B',
    explanation: 'Library resmi Kaggle di Windows secara baku mencari file konfigurasi autentikasi di direktori pengguna home: C:\\Users\\<NamaPengguna>\\.kaggle\\kaggle.json.',
    wrongExplanations: {
      A: 'Kaggle tidak menggunakan folder Program Files untuk token pengguna.',
      C: 'Folder System32 adalah folder file sistem Windows dan sangat berbahaya untuk menyimpan token aplikasi.',
      D: 'Nama file harus tepat kaggle.json dan berada di dalam subfolder tersembunyi .kaggle.'
    }
  },
  {
    id: 4,
    moduleId: 2,
    moduleName: 'Modul 2: Kaggle Langkah demi Langkah',
    question: 'Fungsi Pandas manakah yang digunakan untuk menampilkan ringkasan tipe data setiap kolom dan mendeteksi apakah ada nilai yang kosong (missing values)?',
    options: [
      { id: 'A', text: 'df.head()' },
      { id: 'B', text: 'df.info()' },
      { id: 'C', text: 'df.describe()' },
      { id: 'D', text: 'df.shape' }
    ],
    correctId: 'B',
    explanation: 'df.info() mencetak informasi ringkas mengenai index, nama kolom, jumlah entri non-null (tidak kosong), serta tipe data (Dtype) dari setiap kolom.',
    wrongExplanations: {
      A: 'df.head() hanya mencetak 5 baris pertama dari tabel.',
      C: 'df.describe() menampilkan statistik deskriptif angka (mean, std, min, max).',
      D: 'df.shape adalah atribut tuple yang mengembalikan jumlah (baris, kolom).'
    }
  },
  {
    id: 5,
    moduleId: 2,
    moduleName: 'Modul 2: Kaggle Langkah demi Langkah',
    question: 'Pada halaman dataset Kaggle, apa arti dari "Usability Score" bernilai 10.0?',
    options: [
      { id: 'A', text: 'Dataset tersebut dibuat langsung oleh tim resmi Google' },
      { id: 'B', text: 'Dataset tersebut memiliki dokumentasi sangat lengkap, lisensi jelas, deskripsi kolom detail, dan format file terstandarisasi' },
      { id: 'C', text: 'Dataset tersebut hanya boleh diunduh sebanyak 10 kali sehari' },
      { id: 'D', text: 'Dataset tersebut memiliki akurasi model machine learning sebesar 100%' }
    ],
    correctId: 'B',
    explanation: 'Usability Score di Kaggle mengukur kelengkapan metadata: adanya deskripsi pengantar, penjelasan kolom, lisensi hak cipta, file format yang mudah dibaca, dan sub judul yang jelas.',
    wrongExplanations: {
      A: 'Skor 10.0 bisa dicapai oleh siapa saja anggota komunitas yang mendokumentasikan datasetnya dengan baik.',
      C: 'Usability Score bukan batas kuota unduh.',
      D: 'Skor ini mengukur dokumentasi dataset, bukan performa akurasi model AI.'
    }
  },
  {
    id: 6,
    moduleId: 3,
    moduleName: 'Modul 3: Dasar HTML',
    question: 'Diberikan kode HTML: <article class="product_pod"><h3 id="judul-1"><a href="buku.html" title="Belajar Python">Belajar Python Singkat</a></h3></article>. CSS Selector manakah yang paling spesifik untuk memilih tag <a> tersebut?',
    options: [
      { id: 'A', text: 'article.product_pod h3 a' },
      { id: 'B', text: 'p.price_color' },
      { id: 'C', text: 'div#container' },
      { id: 'D', text: '.author > span' }
    ],
    correctId: 'A',
    explanation: 'article.product_pod h3 a menunjuk hierarki dari tag article berkelas product_pod, ke tag anak h3, dan tag link a di dalamnya.',
    wrongExplanations: {
      B: 'p.price_color mencari tag paragraf harga yang tidak ada dalam cuplikan tersebut.',
      C: 'div#container mencari div dengan id container.',
      D: '.author > span mencari span di dalam elemen berkelas author.'
    }
  },
  {
    id: 7,
    moduleId: 3,
    moduleName: 'Modul 3: Dasar HTML',
    question: 'Jika sebuah judul buku di layar terpotong menjadi "Belajar...", namun judul lengkapnya tersimpan di dalam atribut title: <a title="Belajar Python Menyenangkan Lengkap">. Bagaimana cara BeautifulSoup mengambil teks lengkap tersebut?',
    options: [
      { id: 'A', text: 'tag.get_text()' },
      { id: 'B', text: 'tag["title"] atau tag.get("title")' },
      { id: 'C', text: 'tag.innerText' },
      { id: 'D', text: 'tag.title()' }
    ],
    correctId: 'B',
    explanation: 'Di BeautifulSoup, atribut tag diakses seperti dictionary Python menggunakan kurung siku tag["nama_atribut"] atau metode tag.get("nama_atribut").',
    wrongExplanations: {
      A: 'tag.get_text() mengambil teks yang berada di antara tag pembuka dan penutup, yang dalam kasus ini adalah teks yang terpotong.',
      C: 'innerText adalah properti JavaScript di browser, bukan metode bawaan BeautifulSoup Python.',
      D: 'tag.title() bukan cara membaca atribut HTML di BeautifulSoup.'
    }
  },
  {
    id: 8,
    moduleId: 3,
    moduleName: 'Modul 3: Dasar HTML',
    question: 'Pintasan keyboard apakah yang umum digunakan di browser modern di Windows untuk langsung membuka panel pengembang (Developer Tools / Inspect)?',
    options: [
      { id: 'A', text: 'Tombol F12 atau Ctrl + Shift + I' },
      { id: 'B', text: 'Tombol Esc' },
      { id: 'C', text: 'Tombol F5' },
      { id: 'D', text: 'Ctrl + Alt + Del' }
    ],
    correctId: 'A',
    explanation: 'F12 atau Ctrl + Shift + I adalah jalan pintas universal di Chrome, Edge, dan Firefox untuk membuka DevTools.',
    wrongExplanations: {
      B: 'Tombol Esc menutup dialog atau membatalkan operasi.',
      C: 'Tombol F5 melakukan refresh/reload halaman web.',
      D: 'Ctrl + Alt + Del adalah pintasan keamanan Windows untuk Task Manager/Lock screen.'
    }
  },
  {
    id: 9,
    moduleId: 4,
    moduleName: 'Modul 4: Scraping dengan Python',
    question: 'Apa perbedaan utama antara soup.select() dan soup.select_one() di library BeautifulSoup?',
    options: [
      { id: 'A', text: 'select() hanya bisa mencari tag div, sedangkan select_one() bisa mencari tag apa saja' },
      { id: 'B', text: 'select() mengembalikan LIST dari semua elemen yang cocok, sedangkan select_one() hanya mengembalikan elemen PERTAMA yang cocok' },
      { id: 'C', text: 'select() berjalan di Python 2, sedangkan select_one() berjalan di Python 3' },
      { id: 'D', text: 'select_one() otomatis menyimpan hasil ke file CSV tanpa perlu pandas' }
    ],
    correctId: 'B',
    explanation: 'soup.select() menghasilkan daftar (list) semua elemen yang memenuhi kriteria CSS selector, sedangkan soup.select_one() mengembalikan elemen pertama yang ditemukan atau None jika tidak ada.',
    wrongExplanations: {
      A: 'Keduanya bisa mencari tag HTML apa saja sesuai selector yang diberikan.',
      C: 'Keduanya adalah metode standar di BeautifulSoup4.',
      D: 'Tidak ada fungsi select yang otomatis menyimpan file ke CSV.'
    }
  },
  {
    id: 10,
    moduleId: 4,
    moduleName: 'Modul 4: Scraping dengan Python',
    question: 'Mengapa kita sebaiknya menambahkan header "User-Agent" saat mengirim request dengan library requests di Python?',
    options: [
      { id: 'A', text: 'Agar kecepatan unduh meningkat menjadi 100x lebih cepat' },
      { id: 'B', text: 'Agar server mengenali identitas peramban/klien kita dengan sopan dan tidak langsung menolak kita dengan status 403 Forbidden' },
      { id: 'C', text: 'Agar server mengirimkan kode sumber database internalnya' },
      { id: 'D', text: 'Karena Python mewajibkan User-Agent jika dijalankan di sistem operasi Windows' }
    ],
    correctId: 'B',
    explanation: 'Bawaan library requests mengirimkan User-Agent berupa "python-requests/x.x". Banyak server memblokir User-Agent ini secara otomatis karena dianggap bot liar. Memberikan User-Agent yang jelas dan santun mencegah pemblokiran sepihak.',
    wrongExplanations: {
      A: 'User-Agent tidak mempengaruhi kapasitas bandwidth kecepatan internet fisik.',
      C: 'Header tidak bisa membongkar database internal server.',
      D: 'Library requests bisa berjalan tanpa header tambahan, namun rawan diblokir server.'
    }
  },
  {
    id: 11,
    moduleId: 5,
    moduleName: 'Modul 5: Kasus Sulit & Masalah',
    question: 'Ketika scraper Anda menerima Status Code 429 (Too Many Requests), tindakan apa yang paling benar dan bertanggung jawab?',
    options: [
      { id: 'A', text: 'Menambah jumlah thread loop agar mengirim request lebih cepat lagi' },
      { id: 'B', text: 'Segera menghentikan skrip atau memperbesar jeda waktu (time.sleep) karena server memberi sinyal kewalahan menerima beban permintaan' },
      { id: 'C', text: 'Menghapus instalasi Python di komputer' },
      { id: 'D', text: 'Mengubah ekstensi file dari .py menjadi .txt' }
    ],
    correctId: 'B',
    explanation: 'Status 429 adalah sinyal rate-limiting dari server yang artinya "Anda meminta terlalu cepat dalam waktu singkat". Penanganan yang tepat adalah memperlambat frekuensi permintaan atau menghentikan eksekusi sementara waktu.',
    wrongExplanations: {
      A: 'Mempercepat request saat status 429 akan membuat IP address Anda diblokir permanen oleh firewall server.',
      C: 'Tidak perlu menghapus Python, cukup perbaiki logika skrip Anda.',
      D: 'Mengubah ekstensi file tidak berpengaruh pada protokol jaringan HTTP.'
    }
  },
  {
    id: 12,
    moduleId: 5,
    moduleName: 'Modul 5: Kasus Sulit & Masalah',
    question: 'Mengapa library requests + BeautifulSoup seringkali menghasilkan teks kosong saat digunakan pada situs modern yang dibangun dengan React/Vue/Angular (Single Page Application)?',
    options: [
      { id: 'A', text: 'Karena library requests tidak menjalankan kode JavaScript di sisi klien, sedangkan data baru dimuat setelah skrip JS dijalankan browser' },
      { id: 'B', text: 'Karena library requests hanya mendukung teks bahasa Latin' },
      { id: 'C', text: 'Karena BeautifulSoup tidak bisa membaca tag div' },
      { id: 'D', text: 'Karena Windows Defender mematikan koneksi secara otomatis' }
    ],
    correctId: 'A',
    explanation: 'Library requests adalah HTTP client murni yang hanya mengunduh respon awal dari server tanpa engine peramban JavaScript. Jika konten baru dibuat oleh skrip JavaScript setelah halaman dimuat, requests tidak akan melihat konten tersebut.',
    wrongExplanations: {
      B: 'Requests mendukung semua encoding teks UTF-8 dari seluruh bahasa di dunia.',
      C: 'BeautifulSoup sangat andal dalam membedah tag div dan tag HTML lainnya.',
      D: 'Windows Defender tidak memblokir parsing HTML standar.'
    }
  },
  {
    id: 13,
    moduleId: 5,
    moduleName: 'Modul 5: Kasus Sulit & Masalah',
    question: 'Mengapa penambahan baris `time.sleep(2)` sangat penting di dalam perulangan saat melakukan scraping banyak halaman (Pagination)?',
    options: [
      { id: 'A', text: 'Agar menghemat daya baterai laptop' },
      { id: 'B', text: 'Untuk memberikan jeda istirahat pada server target agar tidak mengalami beban berlebih (overload) layaknya serangan DDoS' },
      { id: 'C', text: 'Karena sistem operasi Windows mewajibkan waktu istirahat pada prosesor' },
      { id: 'D', text: 'Agar hasil scraping menjadi file CSV secara otomatis' }
    ],
    correctId: 'B',
    explanation: 'Scraping tanpa jeda dapat membombardir server web dengan puluhan request per detik yang berpotensi melumpuhkan layanan orang lain. Jeda waktu wajar (1-3 detik) adalah etika dasar scraper yang bertanggung jawab.',
    wrongExplanations: {
      A: 'Tujuan utamanya adalah etika jaringan dan beban server, bukan sekadar baterai.',
      C: 'Windows tidak memiliki aturan wajib istirahat prosesor seperti ini.',
      D: 'time.sleep hanya menjeda waktu eksekusi thread Python.'
    }
  },
  {
    id: 14,
    moduleId: 6,
    moduleName: 'Modul 6: Etika, Hukum & Checklist',
    question: 'Jika file robots.txt sebuah situs web mencantumkan aturan berikut: "User-agent: * \\n Disallow: /profil-pengguna/", apa tindakan yang harus diambil scraper Anda?',
    options: [
      { id: 'A', text: 'Menghindari dan tidak mengambil data dari tautan yang berada di dalam direktori /profil-pengguna/' },
      { id: 'B', text: 'Mengabaikan file tersebut karena robots.txt hanya berupa saran opsional tanpa arti' },
      { id: 'C', text: 'Menghapus file robots.txt di server situs target' },
      { id: 'D', text: 'Mengganti nama direktori di browser menjadi /user-profile/' }
    ],
    correctId: 'A',
    explanation: 'Disallow: /profil-pengguna/ adalah instruksi resmi dari pemilik situs bahwa bot publik dilarang mengakses bagian tersebut. Menghormati aturan ini adalah pondasi etika web crawler.',
    wrongExplanations: {
      B: 'Mengabaikan robots.txt dapat berujung pemblokiran IP dan tuntutan pelanggaran ketentuan layanan.',
      C: 'Kita tidak memiliki akses admin untuk menghapus file di server orang lain.',
      D: 'Mengganti nama direktori tidak mengubah aturan akses server target.'
    }
  },
  {
    id: 15,
    moduleId: 6,
    moduleName: 'Modul 6: Etika, Hukum & Checklist',
    question: 'Berdasarkan prinsip perlindungan privasi (seperti UU Perlindungan Data Pribadi No. 27/2022 di Indonesia), manakah jenis data berikut yang TIDAK BOLEH dikumpulkan secara massal tanpa izin resmi?',
    options: [
      { id: 'A', text: 'Daftar judul buku dan harga yang dipajang di katalog toko online terbuka' },
      { id: 'B', text: 'Prakiraan cuaca harian kota di Indonesia dari situs resmi stasiun meteorologi' },
      { id: 'C', text: 'Daftar kutipan motivasi dari tokoh-tokoh sejarah' },
      { id: 'D', text: 'Nomor Induk Kependudukan (NIK), riwayat rekam medis pribadi, dan data keuangan rekening perorangan' }
    ],
    correctId: 'D',
    explanation: 'NIK, riwayat kesehatan rekam medis, dan informasi rekening adalah Data Pribadi Spesifik/Sensitif yang dilindungi ketat oleh undang-undang dengan ancaman sanksi pidana dan denda bagi yang memproses tanpa hak.',
    wrongExplanations: {
      A: 'Katalog harga buku toko online publik bukan merupakan data pribadi perseorangan.',
      B: 'Prakiraan cuaca publik adalah data agregat ilmiah terbuka.',
      C: 'Kutipan motivasi sejarah adalah konten literatur publik.'
    }
  }
];
