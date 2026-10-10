/* =========================================================
   quiz.js : kuis 15 soal. Tambahkan soal baru dengan menambah
   objek ke array QUESTIONS.
   m = nomor modul terkait, a = indeks jawaban benar (mulai 0)
   ========================================================= */
(function () {
  var MODUL = {
    1: 'Distribusi', 2: 'Spread', 3: 'Korelasi dan regresi',
    4: 'Sampling dan CLT', 5: 'Inferensi', 6: 'Pola waktu'
  };

  var QUESTIONS = [
    {
      m: 1,
      q: 'Gaji karyawan sebuah startup: mean Rp14 juta, median Rp8 juta. Pernyataan mana yang paling masuk akal?',
      o: ['Distribusinya simetris karena mean dan median sama-sama berada di tengah.',
          'Distribusinya miring ke kanan; beberapa gaji sangat tinggi menarik mean ke atas, dan median lebih mewakili gaji tipikal.',
          'Distribusinya miring ke kiri; sebagian besar karyawan bergaji lebih dari Rp14 juta.',
          'Median pasti salah hitung karena selalu harus lebih besar dari mean.'],
      a: 1,
      e: 'Mean yang jauh di atas median adalah tanda khas distribusi miring ke kanan. Nilai ekstrem besar menarik mean, sedangkan median hanya bergantung pada urutan data.'
    },
    {
      m: 1,
      q: 'Histogram nilai ujian satu angkatan memperlihatkan dua puncak, sekitar 52 dan 83. Mean angkatan adalah 67. Apa yang sebaiknya dilakukan?',
      o: ['Melaporkan 67 sebagai nilai tipikal angkatan.',
          'Menghapus salah satu puncak agar datanya rapi.',
          'Menyelidiki dua subkelompok yang mungkin ada dan menganalisisnya terpisah; 67 jatuh di lembah dan hampir tidak mewakili siapa pun.',
          'Mengganti histogram dengan satu angka standard deviation.'],
      a: 2,
      e: 'Dua puncak (bimodal) biasanya berarti dua populasi tercampur. Mean berada di antara keduanya, tempat hampir tidak ada data.'
    },
    {
      m: 1,
      q: 'Kamu mengubah jumlah bin sebuah histogram dari 10 menjadi 30 dan bentuknya tampak berubah. Kesimpulan yang tepat?',
      o: ['Datanya berubah saat bin diganti.',
          'Pilihan bin memengaruhi apa yang terlihat, jadi sebaiknya coba beberapa nilai sebelum menyimpulkan bentuk distribusi.',
          'Jumlah bin yang benar selalu 10.',
          'Histogram tidak bisa dipercaya sama sekali.'],
      a: 1,
      e: 'Data tetap sama, tetapi bin yang terlalu lebar menyembunyikan struktur (misalnya dua puncak), sedangkan bin yang terlalu sempit menampilkan keributan acak.'
    },
    {
      m: 2,
      q: 'Dua kelas sama-sama bermean 70. Kelas X memiliki SD 4 dan kelas Y memiliki SD 15. Apa artinya?',
      o: ['Kelas Y lebih pintar.',
          'Nilai kelas Y jauh lebih beragam; ada siswa yang jauh di atas maupun di bawah 70.',
          'Kelas X pasti punya pencilan.',
          'Kelas X lebih besar jumlah siswanya.'],
      a: 1,
      e: 'Standard deviation mengukur sebaran di sekitar mean. Mean yang sama tidak menjamin kelompok yang sama.'
    },
    {
      m: 2,
      q: 'Pada boxplot, ada titik di luar whisker atas (lebih dari Q3 + 1,5 × IQR). Langkah yang paling tepat?',
      o: ['Langsung menghapusnya karena itu pasti kesalahan.',
          'Mengabaikannya karena hanya satu titik.',
          'Menyelidiki asal titik itu (salah input, kejadian khusus, atau nilai nyata) sebelum memutuskan apa yang dilakukan.',
          'Mengganti semua data dengan mean.'],
      a: 2,
      e: 'Aturan 1,5 × IQR hanya menandai kandidat pencilan. Keputusan membuang atau mempertahankan harus berdasarkan penyebabnya.'
    },
    {
      m: 2,
      q: 'Statistik mana yang paling tahan terhadap satu nilai ekstrem?',
      o: ['Mean', 'Standard deviation', 'Median dan IQR', 'Range (maksimum dikurangi minimum)'],
      a: 2,
      e: 'Median dan IQR hanya bergantung pada posisi urutan di bagian tengah data, sehingga satu nilai ekstrem hampir tidak menggesernya.'
    },
    {
      m: 3,
      q: 'Korelasi antara harga es teh dan jumlah terjual adalah r = −0,82. Interpretasi yang paling tepat?',
      o: ['Menurunkan harga pasti menaikkan penjualan 82%.',
          'Ada hubungan linear negatif yang kuat: harga lebih tinggi cenderung berpasangan dengan penjualan lebih rendah, tetapi ini belum membuktikan sebab-akibat.',
          'Harga menjelaskan 82% variasi penjualan.',
          'Tidak ada hubungan karena r bernilai negatif.'],
      a: 1,
      e: 'Tanda negatif menunjukkan arah, besar |r| menunjukkan kekuatan. Persentase variasi yang dijelaskan adalah R² (sekitar 0,67), bukan r.'
    },
    {
      m: 3,
      q: 'Dosis pupuk dan hasil panen memiliki r ≈ 0,02, tetapi scatter plot membentuk lengkung U terbalik yang jelas. Apa yang terjadi?',
      o: ['Tidak ada hubungan apa pun antara pupuk dan panen.',
          'Hubungannya kuat tetapi tidak linear; r hanya mengukur hubungan linear, jadi selalu lihat grafiknya.',
          'Datanya pasti salah.',
          'Ukuran sampel terlalu besar.'],
      a: 1,
      e: 'r mendekati nol tidak sama dengan tidak ada hubungan. Pola lengkung dengan puncak di tengah menghasilkan korelasi linear yang saling menghapus.'
    },
    {
      m: 3,
      q: 'Penjualan es krim dan kasus tenggelam di kolam renang berkorelasi r = 0,7 di sebuah kota. Penjelasan yang paling masuk akal?',
      o: ['Makan es krim membuat orang tenggelam.',
          'Tenggelam membuat orang membeli es krim.',
          'Variabel ketiga, yaitu cuaca panas, meningkatkan keduanya (confounding variable).',
          'Korelasi itu hanya terjadi karena kesalahan hitung.'],
      a: 2,
      e: 'Dua variabel bisa berkorelasi karena sama-sama dipengaruhi variabel lain. Korelasi saja tidak menunjukkan arah sebab-akibat.'
    },
    {
      m: 3,
      q: 'Sebuah regresi linear menghasilkan R² = 0,64. Artinya?',
      o: ['Prediksi benar 64% kali.',
          'Sekitar 64% variasi variabel y dapat dijelaskan oleh hubungan linearnya dengan x.',
          'Korelasi antara x dan y adalah 0,64.',
          'Kenaikan x sebesar 1 menaikkan y sebesar 0,64.'],
      a: 1,
      e: 'R² adalah proporsi variasi y yang dijelaskan model. Korelasinya adalah akar R² (sekitar 0,8 dengan tanda sesuai slope), dan kenaikan y per satuan x adalah slope.'
    },
    {
      m: 4,
      q: 'Ukuran sampel dinaikkan dari 25 menjadi 100 (populasi sama). Apa yang terjadi pada standard error rata-rata sampel?',
      o: ['Turun menjadi setengahnya.', 'Turun menjadi seperempatnya.', 'Tidak berubah.', 'Naik dua kali lipat.'],
      a: 0,
      e: 'SE = σ/√n. Menaikkan n empat kali lipat membuat √n naik dua kali lipat, sehingga SE turun menjadi setengahnya.'
    },
    {
      m: 4,
      q: 'Populasi waktu tunggu berbentuk miring ke kanan. Kamu mengambil ribuan sampel berukuran n = 50 dan menggambar histogram rata-ratanya. Bentuk yang diharapkan?',
      o: ['Tetap miring ke kanan seperti populasinya.',
          'Mendekati lonceng normal, sesuai Central Limit Theorem.',
          'Rata dengan tinggi sama di semua nilai.',
          'Berpuncak dua.'],
      a: 1,
      e: 'Central Limit Theorem: sebaran rata-rata sampel mendekati normal ketika n cukup besar, apa pun bentuk populasinya (dengan varians terhingga).'
    },
    {
      m: 5,
      q: 'Confidence interval 95% untuk rata-rata tinggi siswa adalah [158,2; 161,4] cm. Pernyataan mana yang benar?',
      o: ['Ada peluang 95% bahwa mean populasi berada di antara 158,2 dan 161,4 untuk interval yang ini.',
          '95% siswa memiliki tinggi antara 158,2 dan 161,4 cm.',
          'Jika prosedur pengambilan sampel dan perhitungan ini diulang berkali-kali, sekitar 95% interval yang dihasilkan akan menangkap mean populasi.',
          'Mean sampel pasti berada di tepi interval.'],
      a: 2,
      e: 'Tingkat kepercayaan menggambarkan prosedur dalam pengulangan. Interval bukan rentang untuk individu, dan mean populasi bersifat tetap, bukan acak.'
    },
    {
      m: 5,
      q: 'Uji t menghasilkan p = 0,03. Interpretasi yang paling tepat?',
      o: ['Peluang hipotesis nol benar adalah 3%.',
          'Bila hipotesis nol benar, data yang sedekat ini atau lebih ekstrem dari hasil observasi akan muncul sekitar 3% kali.',
          'Efeknya 97% penting secara praktis.',
          'Hasil ini pasti akan terulang pada penelitian berikutnya.'],
      a: 1,
      e: 'p-value adalah peluang data (atau yang lebih ekstrem) dengan asumsi hipotesis nol benar. Ia tidak mengukur peluang hipotesis maupun besarnya efek.'
    },
    {
      m: 6,
      q: 'Kunjungan toko online naik tiap tahun dan selalu melonjak setiap Desember. Pola apa saja yang tampak?',
      o: ['Hanya noise acak.',
          'Tren naik dan pola musiman (seasonality) tahunan.',
          'Hanya anomali.',
          'Hanya pencilan yang perlu dihapus.'],
      a: 1,
      e: 'Kenaikan jangka panjang adalah tren; lonjakan yang berulang di bulan yang sama setiap tahun adalah seasonality. Keduanya bisa ada bersamaan.'
    }
  ];

  Modules.quiz = function (root) {
    var i = 0, score = 0, answered = false, missed = {};

    function save(s) {
      try {
        var best = +(localStorage.getItem('jd-quiz-best') || 0);
        if (s > best) localStorage.setItem('jd-quiz-best', s);
        return Math.max(best, s);
      } catch (e) { return s; }
    }

    function render() {
      if (i >= QUESTIONS.length) { return result(); }
      var q = QUESTIONS[i];
      answered = false;
      root.innerHTML =
        '<div class="quiz-top"><span>Pertanyaan ' + (i + 1) + ' dari ' + QUESTIONS.length + ' <span class="muted">(Modul ' + q.m + ': ' + MODUL[q.m] + ')</span></span><span>Benar: ' + score + '</span></div>' +
        '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + QUESTIONS.length + '" aria-valuenow="' + i + '"><div style="width:' + (i / QUESTIONS.length * 100) + '%"></div></div>' +
        '<p class="quiz-q">' + q.q + '</p>' +
        '<div class="opts">' + q.o.map(function (t, k) {
          return '<button type="button" class="opt" data-k="' + k + '"><b>' + String.fromCharCode(65 + k) + '</b><span>' + t + '</span></button>';
        }).join('') + '</div>' +
        '<div class="quiz-fb" aria-live="polite"></div>' +
        '<div class="quiz-nav"></div>';
      root.querySelectorAll('.opt').forEach(function (b) {
        b.addEventListener('click', function () { choose(+b.dataset.k); });
      });
    }

    function choose(k) {
      if (answered) return;
      answered = true;
      var q = QUESTIONS[i], ok = k === q.a;
      if (ok) score++; else missed[q.m] = (missed[q.m] || 0) + 1;
      root.querySelectorAll('.opt').forEach(function (b, idx) {
        b.disabled = true;
        if (idx === q.a) b.classList.add('right');
        else if (idx === k) b.classList.add('wrong');
      });
      root.querySelector('.quiz-fb').innerHTML =
        '<p class="' + (ok ? 'fb-ok' : 'fb-no') + '"><strong>' + (ok ? 'Benar.' : 'Belum tepat.') + '</strong> ' + q.e + '</p>';
      root.querySelector('.quiz-nav').innerHTML =
        '<button type="button" class="btn" id="quiz-next">' + (i === QUESTIONS.length - 1 ? 'Lihat hasil' : 'Pertanyaan berikutnya') + '</button>';
      root.querySelector('#quiz-next').addEventListener('click', function () { i++; render(); });
      root.querySelector('#quiz-next').focus();
    }

    function result() {
      var best = save(score), pct = Math.round(score / QUESTIONS.length * 100);
      var level = pct >= 85 ? 'Kamu sudah nyaman membaca pola data dasar.' :
                  pct >= 60 ? 'Dasar-dasarnya sudah ada; beberapa konsep masih perlu dilatih.' :
                              'Tidak apa-apa. Ulangi modul lab di bawah, lalu coba kuis lagi.';
      var review = Object.keys(missed).map(function (m) {
        return '<li><a href="#m' + m + '">Modul ' + m + ': ' + MODUL[m] + '</a> (' + missed[m] + ' soal belum tepat)</li>';
      }).join('');
      root.innerHTML =
        '<div class="quiz-result">' +
          '<p class="quiz-score">' + score + ' dari ' + QUESTIONS.length + ' benar (' + pct + '%)</p>' +
          '<p>' + level + ' Skor terbaikmu di perangkat ini: ' + best + '.</p>' +
          (review ? '<h4>Modul yang layak diulang</h4><ul>' + review + '</ul>' : '<p>Tidak ada modul yang perlu diulang.</p>') +
          '<button type="button" class="btn" id="quiz-again">Ulangi kuis</button>' +
        '</div>';
      root.querySelector('#quiz-again').addEventListener('click', function () { i = 0; score = 0; missed = {}; render(); });
    }

    render();
  };
})();
