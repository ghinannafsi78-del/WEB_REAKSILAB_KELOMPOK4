# PRD.md — REAKSI LAB

## 1. Informasi Produk

**Nama Produk:** REAKSI LAB  
**Jenis Produk:** Aplikasi pembelajaran kimia berbasis web  
**Mata Pelajaran:** Kimia  
**Materi Utama:** Laju Reaksi  
**Target Pengguna:** Siswa SMA/MA kelas XI  
**Platform:** Web  
**Bahasa:** Indonesia  
**Teknologi:** React, Vite, JavaScript, CSS  
**Penyimpanan Progres:** LocalStorage  

---

## 2. Latar Belakang

Materi laju reaksi mencakup konsep abstrak dan perhitungan matematis, seperti teori tumbukan, faktor-faktor yang memengaruhi laju reaksi, energi aktivasi, serta persamaan laju reaksi. Siswa sering mengalami kesulitan menghubungkan teori dengan fenomena nyata.

REAKSI LAB dikembangkan sebagai media pembelajaran interaktif yang menggabungkan materi terstruktur, visualisasi konsep, simulasi praktikum virtual, latihan soal, dan pemantauan progres belajar.

Aplikasi harus membantu siswa memahami konsep melalui eksplorasi, bukan hanya membaca materi dan menghafal rumus.

---

## 3. Tujuan Produk

1. Membantu siswa memahami konsep laju reaksi secara bertahap.
2. Menjelaskan pengaruh konsentrasi, suhu, luas permukaan, dan katalis terhadap laju reaksi.
3. Menyediakan simulasi praktikum virtual yang dapat dimanipulasi oleh siswa.
4. Menghubungkan fenomena makroskopik, representasi mikroskopik, dan persamaan simbolik.
5. Memberikan latihan soal dengan umpan balik dan pembahasan.
6. Menyimpan progres belajar siswa secara lokal pada perangkat.
7. Menyediakan pengalaman belajar yang responsif, menarik, dan mudah digunakan.

---

## 4. Target Pengguna

### Pengguna Utama
Siswa SMA/MA kelas XI yang sedang mempelajari materi laju reaksi.

### Karakteristik Pengguna
- Memerlukan penjelasan konsep secara sederhana dan sistematis.
- Membutuhkan visualisasi untuk memahami proses tumbukan partikel.
- Memerlukan latihan soal dengan pembahasan.
- Membutuhkan pengalaman praktikum tanpa harus selalu menggunakan laboratorium fisik.
- Mengakses aplikasi melalui laptop, tablet, atau ponsel.

### Kebutuhan Pengguna
- Mengetahui materi yang harus dipelajari.
- Membaca penjelasan dan contoh soal.
- Melakukan eksperimen virtual.
- Mengamati perubahan hasil simulasi ketika variabel diubah.
- Mengerjakan kuis.
- Mengetahui materi dan eksperimen yang sudah diselesaikan.

---

## 5. Ruang Lingkup Produk

### Fitur Wajib

1. Dashboard pembelajaran.
2. Modul materi laju reaksi.
3. Contoh soal dan pembahasan.
4. Laboratorium virtual interaktif.
5. Visualisasi partikel dan tumbukan.
6. Simulasi pengaruh faktor-faktor laju reaksi.
7. Kuis interaktif.
8. Hasil kuis dan pembahasan jawaban.
9. Penyimpanan progres belajar menggunakan LocalStorage.
10. Navigasi yang responsif dan konsisten.

### Fitur Tambahan
- Grafik perubahan konsentrasi terhadap waktu.
- Ringkasan hasil eksperimen.
- Indikator penyelesaian materi.
- Rekomendasi materi yang belum diselesaikan.
- Tombol untuk mengulang eksperimen dan mengatur ulang progres.

### Di Luar Ruang Lingkup Versi Pertama
- Login dan registrasi akun.
- Database atau backend.
- Sinkronisasi progres antarperangkat.
- Kelas daring dengan banyak pengguna.
- Penilaian otomatis berbasis AI.
- Klaim bahwa simulasi merupakan pengganti sepenuhnya bagi eksperimen laboratorium nyata.

---

## 6. Struktur Navigasi

Aplikasi memiliki navigasi utama berikut:

1. **Beranda**
   - Pengenalan REAKSI LAB.
   - Ringkasan progres belajar.
   - Tombol mulai belajar.
   - Akses cepat ke materi, laboratorium, dan kuis.

2. **Materi**
   - Daftar modul.
   - Status penyelesaian modul.
   - Halaman detail materi.
   - Contoh soal dan pembahasan.
   - Ringkasan materi.

3. **Laboratorium Virtual**
   - Daftar eksperimen.
   - Panel pengaturan variabel.
   - Visualisasi reaksi.
   - Hasil pengamatan.
   - Grafik dan kesimpulan.

4. **Kuis**
   - Pemilihan kategori soal.
   - Pertanyaan pilihan ganda.
   - Umpan balik jawaban.
   - Pembahasan.
   - Skor akhir.

5. **Progres Belajar**
   - Materi yang telah diselesaikan.
   - Eksperimen yang telah dijalankan atau diselesaikan.
   - Riwayat percobaan kuis.
   - Persentase progres keseluruhan.

---

## 7. Spesifikasi Modul Materi

Materi disusun secara bertahap dari konsep dasar hingga penerapan.

### Modul 1 — Konsep Dasar Laju Reaksi
- Pengertian laju reaksi.
- Perubahan konsentrasi terhadap waktu.
- Laju reaksi rata-rata dan sesaat.
- Teori tumbukan.
- Tumbukan efektif.
- Energi aktivasi.
- Contoh penerapan dalam kehidupan sehari-hari.

### Modul 2 — Faktor-Faktor yang Memengaruhi Laju Reaksi
- Konsentrasi pereaksi.
- Suhu.
- Luas permukaan.
- Katalis.
- Hubungan setiap faktor dengan frekuensi dan efektivitas tumbukan.
- Contoh fenomena nyata.
- Perbandingan hasil percobaan.

### Modul 3 — Persamaan dan Perhitungan Laju Reaksi
- Persamaan laju reaksi.
- Orde reaksi.
- Tetapan laju reaksi.
- Penentuan orde reaksi dari data eksperimen.
- Pengaruh suhu terhadap laju reaksi.
- Energi aktivasi dan persamaan Arrhenius sebagai materi pendukung sesuai kebutuhan kurikulum.
- Contoh soal beserta langkah penyelesaian.

### Format Setiap Modul
Setiap modul harus memiliki:
- Judul.
- Deskripsi singkat.
- Tujuan pembelajaran.
- Materi inti.
- Penjelasan konsep.
- Visualisasi atau ilustrasi.
- Contoh soal.
- Pembahasan.
- Ringkasan.
- Kuis atau aktivitas terkait.
- Status penyelesaian.

Materi harus menggunakan bahasa Indonesia yang jelas, akurat, dan sesuai tingkat pemahaman siswa SMA/MA.

---

## 8. Spesifikasi Laboratorium Virtual

Laboratorium virtual merupakan fitur utama REAKSI LAB.

Siswa dapat mengubah variabel eksperimen dan mengamati perubahan laju reaksi melalui visualisasi serta data simulasi.

### Eksperimen A — Pengaruh Konsentrasi
Variabel yang dapat diubah:
- Konsentrasi pereaksi.

Variabel yang dikendalikan:
- Suhu.
- Luas permukaan.
- Keberadaan katalis.
- Kondisi awal lainnya.

Hasil yang ditampilkan:
- Visualisasi jumlah partikel.
- Frekuensi tumbukan secara kualitatif.
- Perubahan konsentrasi terhadap waktu.
- Grafik hasil simulasi.
- Penjelasan hubungan konsentrasi dengan laju reaksi.

### Eksperimen B — Pengaruh Suhu
Variabel yang dapat diubah:
- Suhu reaksi.

Variabel yang dikendalikan:
- Konsentrasi.
- Luas permukaan.
- Keberadaan katalis.
- Kondisi awal lainnya.

Hasil yang ditampilkan:
- Visualisasi gerakan partikel.
- Perbandingan energi kinetik secara kualitatif.
- Perubahan frekuensi tumbukan.
- Perubahan jumlah tumbukan efektif secara kualitatif.
- Grafik dan kesimpulan.

### Eksperimen C — Pengaruh Luas Permukaan
Variabel yang dapat diubah:
- Ukuran partikel atau tingkat pembagian zat padat.

Variabel yang dikendalikan:
- Konsentrasi zat lain.
- Suhu.
- Keberadaan katalis.
- Kondisi awal lainnya.

Hasil yang ditampilkan:
- Perbandingan partikel padatan berukuran besar dan kecil.
- Visualisasi area kontak.
- Penjelasan pengaruh luas permukaan terhadap laju reaksi.

### Eksperimen D — Pengaruh Katalis
Variabel yang dapat diubah:
- Kondisi tanpa katalis dan dengan katalis.

Variabel yang dikendalikan:
- Konsentrasi.
- Suhu.
- Luas permukaan.
- Kondisi awal lainnya.

Hasil yang ditampilkan:
- Perbandingan jalur reaksi.
- Diagram energi dengan dan tanpa katalis.
- Perbandingan energi aktivasi.
- Penjelasan bahwa katalis menyediakan jalur reaksi alternatif dengan energi aktivasi lebih rendah.

### Interaksi Laboratorium
Setiap eksperimen harus menyediakan:
- Pengaturan variabel yang mudah digunakan.
- Tombol mulai simulasi.
- Tombol jeda jika diperlukan.
- Tombol ulangi eksperimen.
- Tombol reset parameter.
- Tampilan hasil pengamatan.
- Kesimpulan berdasarkan hasil simulasi.

### Ketentuan Ilmiah
- Simulasi harus konsisten dengan konsep kimia yang benar.
- Pengaruh variabel harus dapat dibandingkan secara adil.
- Variabel lain harus dikendalikan ketika satu faktor sedang diuji.
- Model matematis harus diberi keterangan sebagai model sederhana jika tidak mewakili mekanisme reaksi nyata secara lengkap.
- Data simulasi tidak boleh ditampilkan sebagai hasil eksperimen laboratorium nyata.
- Grafik harus memiliki label sumbu, satuan jika relevan, dan legenda yang jelas.

---

## 9. Spesifikasi Visualisasi

Visualisasi harus membantu siswa menghubungkan tiga representasi kimia.

### Representasi Makroskopik
Menampilkan fenomena yang dapat diamati, seperti perubahan warna, terbentuknya gas, atau perubahan jumlah zat dalam model simulasi jika sesuai dengan sistem reaksi yang dipilih.

### Representasi Mikroskopik
Menampilkan partikel yang bergerak dan mengalami tumbukan.

Visualisasi harus:
- Menunjukkan perbedaan gerak partikel ketika suhu berubah.
- Menunjukkan perbedaan jumlah partikel ketika konsentrasi berubah.
- Menunjukkan perbedaan luas kontak ketika ukuran padatan berubah.
- Menjelaskan efek katalis melalui jalur energi, bukan dengan menggambarkan katalis sebagai pereaksi yang habis.

### Representasi Simbolik
Menampilkan persamaan reaksi, rumus laju reaksi, variabel, dan grafik yang relevan.

Ketiga representasi harus saling terhubung melalui penjelasan singkat.

---

## 10. Spesifikasi Kuis

Kuis digunakan untuk mengukur pemahaman siswa terhadap materi.

### Ketentuan
- Pertanyaan pilihan ganda.
- Setiap pertanyaan memiliki satu jawaban benar.
- Setiap opsi jawaban harus jelas dan tidak ambigu.
- Setiap soal memiliki pembahasan.
- Jawaban yang dipilih harus mendapat umpan balik.
- Skor akhir dihitung berdasarkan jawaban benar.
- Siswa dapat mengulang kuis.

### Kategori Kuis
1. Konsep dasar laju reaksi.
2. Teori tumbukan dan energi aktivasi.
3. Faktor-faktor yang memengaruhi laju reaksi.
4. Persamaan dan perhitungan laju reaksi.
5. Interpretasi data dan grafik eksperimen.

### Format Data Pertanyaan
Setiap pertanyaan sekurang-kurangnya memiliki:
- ID pertanyaan.
- Kategori.
- Teks pertanyaan.
- Pilihan jawaban.
- Indeks atau ID jawaban benar.
- Penjelasan jawaban.
- Tingkat kesulitan.

### Perhitungan Skor
Skor persentase dihitung menggunakan:

Skor = (Jumlah jawaban benar / Jumlah seluruh soal) × 100

Hasil harus ditampilkan sebagai skor dari 0 hingga 100.

---

## 11. Model Data

Gunakan struktur data JavaScript yang konsisten agar materi, eksperimen, kuis, dan progres dapat dikelola secara terpisah.

### Modul
Setiap objek modul memiliki:
- `id`
- `title`
- `description`
- `order`
- `objectives`
- `sections`
- `workedExamples`
- `summary`
- `relatedExperimentIds`
- `quizCategoryIds`

### Eksperimen
Setiap objek eksperimen memiliki:
- `id`
- `title`
- `description`
- `factor`
- `variables`
- `defaultParameters`
- `parameterRanges`
- `controls`
- `learningObjectives`

### Pertanyaan Kuis
Setiap objek pertanyaan memiliki:
- `id`
- `category`
- `question`
- `options`
- `correctAnswer`
- `explanation`
- `difficulty`

### Progres Siswa
Data progres memiliki:
- `completedModules`
- `completedExperiments`
- `quizAttempts`
- `lastUpdated`

### Riwayat Kuis
Setiap percobaan kuis memiliki:
- `id`
- `category`
- `score`
- `totalQuestions`
- `correctAnswers`
- `completedAt`

Gunakan ID yang unik dan stabil. Hindari menggunakan judul sebagai satu-satunya identitas data.

---

## 12. Struktur Folder yang Direkomendasikan

```text
src/
├── assets/
│   ├── images/
│   └── icons/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── MainLayout.jsx
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── ProgressBar.jsx
│   │   └── Modal.jsx
│   ├── learning/
│   │   ├── ModuleCard.jsx
│   │   ├── LessonContent.jsx
│   │   └── WorkedExample.jsx
│   ├── laboratory/
│   │   ├── ExperimentCard.jsx
│   │   ├── ParameterControls.jsx
│   │   ├── ParticleSimulation.jsx
│   │   └── ExperimentResults.jsx
│   └── quiz/
│       ├── QuizQuestion.jsx
│       ├── QuizFeedback.jsx
│       └── QuizResult.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── ModulesPage.jsx
│   ├── ModuleDetailPage.jsx
│   ├── LaboratoryPage.jsx
│   ├── ExperimentPage.jsx
│   ├── QuizPage.jsx
│   └── ProgressPage.jsx
├── data/
│   ├── modules.js
│   ├── experiments.js
│   ├── quizQuestions.js
│   └── index.js
├── services/
│   ├── simulationService.js
│   └── progressService.js
├── hooks/
│   └── useProgress.js
├── utils/
│   ├── calculations.js
│   └── formatters.js
├── styles/
│   ├── global.css
│   └── variables.css
├── App.jsx
└── main.jsx
```

Struktur tersebut merupakan panduan. Jika proyek sudah memiliki struktur folder yang berbeda, pertahankan struktur yang berfungsi dan sesuaikan secara konsisten.

---

## 13. Teknologi dan Arsitektur

### Frontend
- React untuk antarmuka dan komponen.
- Vite untuk pengembangan dan build.
- JavaScript ES Modules.
- CSS responsif.
- React Router jika diperlukan untuk navigasi ant halaman.

### Pengelolaan Data
- Data materi, eksperimen, dan soal disimpan dalam modul JavaScript.
- Logika simulasi ditempatkan pada `simulationService.js`.
- Logika penyimpanan progres ditempatkan pada `progressService.js`.
- Komponen UI tidak boleh memuat seluruh logika perhitungan simulasi.

### Penyimpanan
Gunakan LocalStorage untuk menyimpan:
- Modul yang selesai.
- Eksperimen yang diselesaikan.
- Riwayat percobaan kuis.
- Waktu pembaruan terakhir.

Gunakan satu kunci penyimpanan yang konsisten, misalnya:

`reaksi-lab-progress`

Tangani data penyimpanan yang tidak valid, data lama, atau kegagalan akses LocalStorage dengan aman.

---

## 14. Persyaratan Desain UI/UX

### Identitas Visual
Gunakan desain laboratorium digital yang modern, bersih, dan akademis.

### Prinsip Desain
- Hierarki informasi yang jelas.
- Navigasi konsisten.
- Tata letak tidak terlalu padat.
- Kontras warna yang memadai.
- Tipografi yang mudah dibaca.
- Ikon yang konsisten.
- Animasi ringan dan fungsional.
- Umpan balik visual pada interaksi pengguna.

### Responsivitas
Aplikasi harus dapat digunakan pada:
- Desktop.
- Laptop.
- Tablet.
- Ponsel.

Pada layar kecil, navigasi dan panel kontrol harus menyesuaikan tanpa menyebabkan konten terpotong atau gulir horizontal yang tidak diperlukan.

### Aksesibilitas
- Gunakan elemen HTML semantik.
- Sediakan label untuk input.
- Pastikan kontrol dapat digunakan dengan keyboard.
- Jangan hanya menggunakan warna untuk menyampaikan informasi.
- Berikan teks alternatif untuk gambar yang bermakna.
- Gunakan ukuran teks yang nyaman dibaca.
- Pastikan grafik memiliki deskripsi atau ringkasan tekstual.

---

## 15. Persyaratan Fungsional

### FR-01 — Dashboard
Sistem menampilkan pengenalan aplikasi, akses fitur utama, dan ringkasan progres siswa.

### FR-02 — Daftar Modul
Sistem menampilkan seluruh modul materi beserta deskripsi dan status penyelesaian.

### FR-03 — Detail Materi
Siswa dapat membuka modul, membaca materi, mempelajari contoh soal, dan melihat ringkasan.

### FR-04 — Penyelesaian Materi
Siswa dapat menandai modul sebagai selesai. Status disimpan pada LocalStorage.

### FR-05 — Daftar Eksperimen
Sistem menampilkan daftar eksperimen dan faktor yang dipelajari.

### FR-06 — Pengaturan Variabel
Siswa dapat mengubah parameter eksperimen dalam rentang yang valid.

### FR-07 — Simulasi
Sistem menghasilkan visualisasi dan data berdasarkan parameter eksperimen.

### FR-08 — Hasil Eksperimen
Sistem menampilkan hasil simulasi, grafik, dan penjelasan ilmiah.

### FR-09 — Reset Eksperimen
Siswa dapat mengembalikan parameter ke nilai awal dan menjalankan eksperimen kembali.

### FR-10 — Kuis
Siswa dapat menjawab pertanyaan dan memperoleh umpan balik.

### FR-11 — Hasil Kuis
Sistem menampilkan skor, jumlah jawaban benar, dan pembahasan.

### FR-12 — Riwayat Kuis
Sistem menyimpan hasil kuis ke LocalStorage.

### FR-13 — Progres Belajar
Sistem menampilkan status penyelesaian materi dan eksperimen serta ringkasan hasil kuis.

### FR-14 — Persistensi Data
Data progres tetap tersedia setelah halaman dimuat ulang pada browser dan perangkat yang sama, selama data browser tidak dihapus.

### FR-15 — Penanganan Kesalahan
Sistem menampilkan pesan yang jelas apabila terjadi kesalahan input, data tidak valid, atau kegagalan penyimpanan.

---

## 16. Persyaratan Nonfungsional

### Kinerja
- Antarmuka harus terasa responsif.
- Perubahan parameter simulasi tidak boleh menyebabkan pembekuan halaman.
- Animasi harus dibatasi agar tidak mengganggu interaksi.
- Hindari perhitungan berulang yang tidak diperlukan.

### Keandalan
- Navigasi tidak boleh mengarah ke halaman kosong.
- Tombol harus menjalankan fungsi yang sesuai.
- Data yang tidak tersedia harus ditangani dengan aman.
- Kegagalan LocalStorage tidak boleh menyebabkan seluruh aplikasi berhenti.

### Pemeliharaan
- Pisahkan komponen UI, data, logika simulasi, dan penyimpanan.
- Gunakan penamaan fungsi dan variabel yang jelas.
- Hindari duplikasi logika.
- Gunakan komponen yang dapat digunakan kembali.

### Keamanan dan Privasi
- Jangan meminta data pribadi yang tidak diperlukan.
- Jangan menyimpan informasi sensitif.
- Jangan mengirim data siswa ke layanan eksternal tanpa kebutuhan dan persetujuan yang jelas.

---

## 17. Aturan Implementasi untuk Coding Agent

1. Periksa struktur proyek dan `package.json` sebelum mengubah kode.
2. Pertahankan teknologi dan dependensi yang sudah berfungsi.
3. Jangan membuat ulang proyek dari awal jika proyek yang ada dapat dikembangkan.
4. Implementasikan fitur secara bertahap dan terintegrasi.
5. Gunakan data dari file sumber yang telah ditentukan, bukan menyalin data yang sama ke banyak komponen.
6. Pisahkan fungsi perhitungan dari komponen antarmuka.
7. Pastikan seluruh tombol dan kontrol interaktif berfungsi.
8. Hindari penggunaan data palsu yang ditampilkan seolah-olah merupakan hasil eksperimen nyata.
9. Jangan menambahkan backend, autentikasi, atau dependensi besar tanpa kebutuhan.
10. Tangani kondisi kosong, input tidak valid, dan kegagalan penyimpanan.
11. Pastikan navigasi dan tampilan berfungsi di desktop serta perangkat seluler.
12. Jalankan pemeriksaan build dan perbaiki kesalahan yang muncul.
13. Jangan menghapus fitur proyek yang sudah ada tanpa alasan yang jelas.
14. Jangan hanya membuat mockup statis; implementasikan perilaku interaktif yang dijelaskan dalam PRD.
15. Jika ada detail yang belum ditentukan, pilih solusi sederhana yang konsisten dengan tujuan pembelajaran dan dokumentasikan asumsi penting.

---

## 18. Tahapan Pengembangan

### Tahap 1 — Fondasi Aplikasi
- Menyiapkan struktur proyek.
- Membuat layout dan navigasi.
- Menyiapkan desain responsif.
- Menyusun sistem data.

### Tahap 2 — Modul Materi
- Membuat daftar modul.
- Membuat halaman detail materi.
- Menambahkan contoh soal dan ringkasan.
- Menyimpan status penyelesaian.

### Tahap 3 — Laboratorium Virtual
- Membuat kontrol parameter.
- Membuat mesin simulasi.
- Menampilkan visualisasi partikel.
- Menampilkan data hasil dan grafik.

### Tahap 4 — Kuis
- Membuat komponen pertanyaan.
- Mengimplementasikan penilaian.
- Menampilkan pembahasan.
- Menyimpan riwayat kuis.

### Tahap 5 — Progres dan Integrasi
- Menghubungkan seluruh fitur.
- Menghitung progres belajar.
- Menangani data kosong dan data tidak valid.
- Memastikan seluruh navigasi berfungsi.

### Tahap 6 — Pengujian dan Penyempurnaan
- Menguji seluruh tombol.
- Menguji perhitungan.
- Menguji penyimpanan dan pemuatan progres.
- Menguji tampilan responsif.
- Memperbaiki kesalahan build.
- Memastikan konten ilmiah benar.

---

## 19. Kriteria Penerimaan

Produk dinyatakan memenuhi kebutuhan minimum apabila:

- [ ] Aplikasi dapat dijalankan tanpa kesalahan build.
- [ ] Dashboard dapat dibuka dan menampilkan informasi yang relevan.
- [ ] Seluruh modul materi dapat diakses.
- [ ] Materi memiliki penjelasan, contoh soal, dan ringkasan.
- [ ] Status penyelesaian modul dapat disimpan.
- [ ] Seluruh eksperimen dapat dijalankan.
- [ ] Perubahan parameter menghasilkan perubahan simulasi yang konsisten.
- [ ] Variabel kontrol dijelaskan dengan benar.
- [ ] Grafik memiliki label yang sesuai.
- [ ] Kuis dapat dikerjakan hingga selesai.
- [ ] Skor kuis dihitung dengan benar.
- [ ] Pembahasan muncul sesuai jawaban.
- [ ] Riwayat kuis tersimpan dan dapat dimuat kembali.
- [ ] Progres belajar diperbarui setelah aktivitas selesai.
- [ ] Data progres tetap tersedia setelah halaman dimuat ulang.
- [ ] Aplikasi dapat digunakan pada desktop dan ponsel.
- [ ] Tidak ada tombol utama yang tidak berfungsi.
- [ ] Tidak ada hasil simulasi yang diklaim sebagai data eksperimen nyata.

---

## 20. Prioritas Pengembangan

### P0 — Wajib
- Navigasi.
- Modul materi.
- Laboratorium virtual dasar.
- Kuis.
- Penyimpanan progres.
- Desain responsif.

### P1 — Penting
- Visualisasi partikel yang lebih informatif.
- Grafik hasil simulasi.
- Riwayat kuis.
- Ringkasan progres.
- Aksesibilitas yang lebih baik.

### P2 — Pengembangan Berikutnya
- Penambahan eksperimen.
- Analisis hasil belajar lebih lanjut.
- Fitur refleksi siswa.
- Pengayaan visualisasi.
- Integrasi penyimpanan daring apabila dibutuhkan.

---

## 21. Prinsip Keberhasilan Produk

REAKSI LAB harus menjadi media pembelajaran yang:

1. Benar secara ilmiah.
2. Mudah digunakan oleh siswa SMA/MA.
3. Mengutamakan pemahaman konsep.
4. Menghubungkan teori dengan hasil simulasi.
5. Memberikan umpan balik yang bermakna.
6. Menyimpan progres secara konsisten.
7. Memiliki antarmuka responsif dan mudah diakses.
8. Dapat dikembangkan tanpa merombak seluruh arsitektur.

**Instruksi akhir:** Bangun REAKSI LAB sebagai aplikasi pembelajaran interaktif yang benar-benar berfungsi. Prioritaskan ketepatan konsep kimia, keterpaduan antarf fitur, kemudahan penggunaan, dan stabilitas aplikasi. Jangan berhenti pada desain visual atau halaman statis.
