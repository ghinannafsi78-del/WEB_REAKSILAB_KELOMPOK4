# PRD.md --- REAKSI LAB

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

## 2. Latar Belakang

Materi laju reaksi mencakup konsep abstrak dan perhitungan matematis,

seperti teori tumbukan, faktor-faktor yang memengaruhi laju reaksi,

energi aktivasi, serta persamaan laju reaksi. Siswa sering mengalami

kesulitan menghubungkan teori dengan fenomena nyata.

REAKSI LAB dikembangkan sebagai media pembelajaran interaktif yang

menggabungkan materi terstruktur, visualisasi konsep, simulasi praktikum

virtual, latihan soal, dan pemantauan progres belajar.

Aplikasi harus membantu siswa memahami konsep melalui eksplorasi, bukan

hanya membaca materi dan menghafal rumus.

## 3. Tujuan Produk

1. Membantu siswa memahami konsep laju reaksi secara bertahap.

2. Menjelaskan pengaruh konsentrasi, suhu, luas permukaan, dan katalis

terhadap laju reaksi.

3. Menyediakan simulasi praktikum virtual yang dapat dimanipulasi oleh

siswa.

4. Menghubungkan fenomena makroskopik, representasi mikroskopik, dan

persamaan simbolik.

5. Memberikan latihan soal dengan umpan balik dan pembahasan.

6. Menyimpan progres belajar siswa secara lokal pada perangkat.

7. Menyediakan pengalaman belajar yang responsif, menarik, dan mudah

digunakan.

## 4. Target Pengguna

### Pengguna Utama

Siswa SMA/MA kelas XI yang sedang mempelajari materi laju reaksi.

### Karakteristik Pengguna

- Memerlukan penjelasan konsep secara sederhana dan sistematis.

- Membutuhkan visualisasi untuk memahami proses tumbukan partikel.

- Memerlukan latihan soal dengan pembahasan.

- Membutuhkan pengalaman praktikum tanpa harus selalu menggunakan

laboratorium fisik.

- Mengakses aplikasi melalui laptop, tablet, atau ponsel.

### Kebutuhan Pengguna

- Mengetahui materi yang harus dipelajari.

- Membaca penjelasan dan contoh soal.

- Melakukan eksperimen virtual.

- Mengamati perubahan hasil simulasi ketika variabel diubah.

- Mengerjakan kuis.

- Mengetahui materi dan eksperimen yang sudah diselesaikan.

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

- Klaim bahwa simulasi merupakan pengganti sepenuhnya bagi eksperimen

laboratorium nyata.

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

## 7. Spesifikasi Modul Materi

Materi disusun secara bertahap dari konsep dasar hingga penerapan.

### Modul 1 --- Konsep Dasar Laju Reaksi

- Pengertian laju reaksi.

- Perubahan konsentrasi terhadap waktu.

- Laju reaksi rata-rata dan sesaat.

- Teori tumbukan.

- Tumbukan efektif.

- Energi aktivasi.

- Contoh penerapan dalam kehidupan sehari-hari.

### Modul 2 --- Faktor-Faktor yang Memengaruhi Laju Reaksi

- Konsentrasi pereaksi.

- Suhu.

- Luas permukaan.

- Katalis.

- Hubungan setiap faktor dengan frekuensi dan efektivitas tumbukan.

- Contoh fenomena nyata.

- Perbandingan hasil percobaan.

### Modul 3 --- Persamaan dan Perhitungan Laju Reaksi

- Persamaan laju reaksi.

- Orde reaksi.

- Tetapan laju reaksi.

- Penentuan orde reaksi dari data eksperimen.

- Pengaruh suhu terhadap laju reaksi.

- Energi aktivasi dan persamaan Arrhenius sebagai materi pendukung

sesuai kebutuhan kurikulum.

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

Materi harus menggunakan bahasa Indonesia yang jelas, akurat, dan sesuai

tingkat pemahaman siswa SMA/MA.

8. Spesifikasi Laboratorium Virtual

Laboratorium virtual merupakan fitur inti REAKSI LAB. Pada versi ini,

laboratorium difokuskan pada satu model reaksi umum yang melibatkan dua

reaktan, yaitu A dan B:

\(A + B `\rightarrow `{=tex}Produk\)

Simbol A dan B digunakan sebagai model partikel reaktan agar siswa dapat

memusatkan perhatian pada hubungan antara kondisi reaksi, frekuensi

tumbukan, tumbukan efektif, dan laju reaksi. Model ini merupakan

simulasi konseptual, bukan representasi mekanisme reaksi kimia spesifik.

8.1 Tujuan Pembelajaran Laboratorium

Setelah menggunakan laboratorium virtual, siswa diharapkan mampu:

- Mengidentifikasi reaktan A dan B dalam model reaksi.

- Menjelaskan bahwa reaksi memerlukan tumbukan antara partikel

  reaktan.

- Menghubungkan perubahan konsentrasi A dan/atau B dengan frekuensi

  tumbukan.

- Menjelaskan perbedaan antara frekuensi tumbukan total dan tumbukan

  efektif.

- Menghubungkan jumlah tumbukan efektif per satuan waktu dengan laju

  reaksi dalam model simulasi.

- Membandingkan hasil simulasi ketika satu variabel diubah dan

  variabel lainnya dikendalikan.

- Mengumpulkan, membaca, dan menafsirkan data hasil pengamatan.

- Menyusun kesimpulan berdasarkan bukti dari simulasi.

8.2 Model Reaksi dan Aturan Simulasi

- Reaksi yang ditampilkan adalah A + B → Produk.

- Partikel A dan B harus memiliki bentuk atau warna berbeda secara

  konsisten agar dapat dibedakan.

- Partikel produk ditampilkan dengan representasi visual berbeda dari

  partikel reaktan.

- Reaksi hanya dapat terjadi ketika partikel A dan B mengalami

  tumbukan yang memenuhi kriteria tumbukan efektif pada model.

- Ketika reaksi terjadi, partikel A dan B yang bereaksi tidak boleh

  tetap dihitung sebagai reaktan; keduanya dikonversi menjadi satu

  unit produk sesuai penyederhanaan model.

- Jumlah partikel dan hasil reaksi harus diperbarui secara konsisten

  selama simulasi.

- Simulasi menggunakan model sederhana untuk tujuan pembelajaran.

  Model tidak dimaksudkan untuk memprediksi konstanta laju atau

  mekanisme reaksi kimia nyata secara kuantitatif.

8.3 Variabel yang Dapat Dimanipulasi

Siswa dapat mengubah variabel berikut melalui kontrol interaktif.

A. Konsentrasi reaktan A

- Kontrol berupa slider atau input angka dengan rentang yang

  ditetapkan pengembang.

- Nilai awal ditampilkan secara jelas.

- Peningkatan konsentrasi A direpresentasikan dengan peningkatan

  jumlah/kepadatan partikel A dalam volume simulasi yang sama.

- Penurunan konsentrasi A direpresentasikan dengan penurunan

  jumlah/kepadatan partikel A.

- Perubahan konsentrasi A harus memengaruhi peluang pertemuan A dengan

  B dan frekuensi tumbukan A--B dalam model.

B. Konsentrasi reaktan B

- Kontrol berupa slider atau input angka dengan rentang yang

  ditetapkan pengembang.

- Nilai awal ditampilkan secara jelas.

- Peningkatan konsentrasi B direpresentasikan dengan peningkatan

  jumlah/kepadatan partikel B dalam volume simulasi yang sama.

- Penurunan konsentrasi B direpresentasikan dengan penurunan

  jumlah/kepadatan partikel B.

- Perubahan konsentrasi B harus memengaruhi peluang pertemuan A dengan

  B dan frekuensi tumbukan A--B dalam model.

C. Suhu sistem reaksi

- Kontrol berupa slider atau input angka dengan satuan °C atau K yang

  ditampilkan konsisten.

- Perubahan suhu memengaruhi kecepatan gerak partikel A dan B.

- Suhu yang lebih tinggi direpresentasikan dengan gerakan partikel

  yang lebih cepat dan energi kinetik rata-rata yang lebih tinggi.

- Suhu yang lebih rendah direpresentasikan dengan gerakan partikel

  yang lebih lambat.

- Sistem harus menjelaskan bahwa kenaikan suhu dapat meningkatkan

  frekuensi tumbukan dan, terutama, proporsi tumbukan yang memiliki

  energi cukup untuk melampaui energi aktivasi.

D. Katalis (opsional sebagai variabel sistem)

- Sediakan pilihan tanpa katalis dan dengan katalis jika fitur katalis

  diimplementasikan.

- Katalis diperlakukan sebagai faktor yang memengaruhi jalur reaksi

  atau kriteria energi aktivasi, bukan sebagai reaktan A atau B.

- Katalis tidak boleh digambarkan habis atau berubah menjadi produk.

- Jika katalis tidak dimodelkan secara memadai, jangan tampilkan

  kontrol ini. Jangan membuat kontrol yang hanya bersifat dekoratif.

8.4 Variabel yang Dikendalikan

Ketika siswa menguji pengaruh konsentrasi A, konsentrasi B, atau suhu,

variabel lain harus dipertahankan pada nilai yang sama agar perbandingan

adil.

Variabel kontrol meliputi:

- Volume atau ukuran area simulasi.

- Jumlah awal reaktan yang tidak sedang diuji.

- Suhu ketika konsentrasi sedang diuji.

- Konsentrasi A dan B ketika suhu sedang diuji, kecuali variabel yang

  sengaja dimanipulasi.

- Kondisi katalis, jika fitur katalis digunakan.

- Durasi pengamatan.

- Aturan gerak partikel dan aturan deteksi tumbukan.

Antarmuka harus menunjukkan variabel yang sedang diubah dan variabel

yang sedang dikendalikan.

8.5 Visualisasi Mikroskopik

Area utama laboratorium harus menampilkan simulasi partikel A dan B

secara dinamis.

Visualisasi sekurang-kurangnya menampilkan:

- Partikel A dan B dengan identitas visual yang berbeda dan konsisten.

- Gerak partikel di dalam ruang simulasi.

- Peristiwa tumbukan antara A dan B.

- Indikator tumbukan yang memenuhi kriteria efektif.

- Perubahan jumlah partikel reaktan dan produk selama reaksi.

- Representasi perubahan kepadatan partikel ketika konsentrasi diubah.

- Perubahan kecepatan gerak partikel ketika suhu diubah.

Animasi harus memiliki makna ilmiah. Jangan menampilkan partikel

bergerak secara acak tanpa hubungan dengan parameter simulasi. Kecepatan

gerak, peluang tumbukan, dan pembentukan produk harus dikendalikan oleh

logika simulasi.

8.6 Data yang Ditampilkan Secara Langsung

Selama simulasi berjalan, tampilkan panel data yang diperbarui

berdasarkan kondisi simulasi, sekurang-kurangnya:

1. Konsentrasi atau nilai pengaturan reaktan A.

2. Konsentrasi atau nilai pengaturan reaktan B.

3. Suhu sistem.

4. Jumlah tumbukan A--B dalam interval pengamatan.

5. Frekuensi tumbukan A--B per satuan waktu.

6. Jumlah tumbukan efektif dalam interval pengamatan.

7. Jumlah produk yang terbentuk.

8. Laju reaksi model atau indikator laju reaksi yang dihitung secara

   konsisten.

Definisi operasional yang harus digunakan:

- Frekuensi tumbukan: jumlah peristiwa tumbukan A--B yang

  terdeteksi dalam interval waktu tertentu, atau jumlah tumbukan per

  satuan waktu.

- Tumbukan efektif: tumbukan yang memenuhi kriteria model untuk

  menghasilkan reaksi.

- Laju reaksi model: perubahan jumlah produk atau perubahan jumlah

  reaktan per satuan waktu sesuai definisi yang digunakan oleh

  simulasi.

Tampilkan satuan atau keterangan "nilai relatif/model" jika data bukan

besaran eksperimen nyata. Jangan menyebut nilai relatif sebagai satuan

fisik yang terukur.

8.7 Grafik Hasil Simulasi

Sediakan grafik yang mendukung interpretasi siswa, dengan ketentuan:

- Grafik jumlah produk terhadap waktu atau perubahan jumlah reaktan

  terhadap waktu.

- Sumbu horizontal menunjukkan waktu simulasi.

- Sumbu vertikal menunjukkan jumlah partikel atau konsentrasi model,

  sesuai data yang diplot.

- Label, satuan atau keterangan nilai relatif, dan legenda harus

  jelas.

- Grafik harus diperbarui berdasarkan parameter dan hasil simulasi

  aktual.

- Siswa dapat membandingkan hasil dua atau lebih kondisi eksperimen

  jika fitur perbandingan diimplementasikan.

- Jangan menampilkan grafik statis yang tidak terhubung dengan hasil

  simulasi.

8.8 Alur Penggunaan Laboratorium

1. Siswa membuka halaman Laboratorium Virtual.

2. Sistem menampilkan pengantar singkat, tujuan kegiatan, model reaksi

   A + B → Produk, dan petunjuk penggunaan.

3. Siswa melihat nilai awal konsentrasi A, konsentrasi B, suhu, dan

   variabel lain yang tersedia.

4. Siswa mengubah satu variabel yang ingin diuji.

5. Siswa menekan tombol Mulai Simulasi.

6. Visualisasi mikroskopik berjalan dan panel data diperbarui.

7. Siswa mengamati frekuensi tumbukan, tumbukan efektif, perubahan

   jumlah partikel, dan pembentukan produk.

8. Siswa dapat menjeda simulasi, melanjutkan, atau mengulang simulasi.

9. Setelah pengamatan selesai, siswa mengisi formulir data pengamatan.

10. Sistem memvalidasi kelengkapan isian dan menyimpan hasil pengamatan

    lokal.

11. Siswa melanjutkan ke kuis interaktif yang berkaitan dengan hasil

    simulasi.

12. Sistem memberikan umpan balik untuk setiap jawaban dan menampilkan

    hasil akhir kuis.

8.9 Kontrol Laboratorium

Sediakan kontrol berikut:

- Mulai: menjalankan simulasi dengan parameter yang sedang

  dipilih.

- Jeda: menghentikan sementara animasi dan pembaruan waktu

  simulasi.

- Lanjutkan: meneruskan simulasi dari kondisi jeda.

- Ulangi: menjalankan ulang simulasi dengan parameter yang sama

  dari kondisi awal.

- Reset Parameter: mengembalikan semua variabel ke nilai default.

- Simpan Pengamatan: menyimpan data pengamatan siswa setelah

  formulir valid.

- Lihat Hasil: menampilkan ringkasan hasil simulasi dan

  pengamatan.

Tombol harus memiliki status aktif/nonaktif yang sesuai. Misalnya,

tombol Lanjutkan hanya aktif ketika simulasi sedang dijeda.

8.10 Ketentuan Ilmiah

- Konsentrasi A dan konsentrasi B harus dapat diubah secara terpisah.

- Peningkatan konsentrasi salah satu reaktan, dengan kondisi lain

  tetap, secara umum meningkatkan peluang tumbukan A--B pada model.

- Peningkatan suhu meningkatkan energi kinetik rata-rata partikel dan

  dapat meningkatkan frekuensi tumbukan serta fraksi tumbukan yang

  efektif.

- Frekuensi tumbukan tidak boleh disamakan dengan jumlah tumbukan

  efektif.

- Tidak setiap tumbukan menghasilkan reaksi.

- Tumbukan efektif harus memenuhi kriteria energi yang cukup dan

  orientasi yang sesuai. Jika orientasi tidak dimodelkan, keterbatasan

  tersebut harus dijelaskan.

- Hubungan matematis yang digunakan harus dinyatakan sebagai model

  konseptual/sederhana, bukan hukum laju universal untuk semua reaksi

  A + B.

- Hasil simulasi harus konsisten dengan parameter yang dipilih dan

  tidak boleh ditampilkan sebagai data eksperimen laboratorium nyata.

- Jika jumlah partikel simulasi digunakan sebagai pendekatan

  konsentrasi, jelaskan bahwa jumlah partikel merupakan representasi

  model.

8.11 Formulir Data Pengamatan

Setelah simulasi dijalankan, siswa harus mengisi formulir pengamatan.

Formulir bukan sekadar tampilan hasil otomatis; siswa perlu mencatat

atau memilih data yang diamati dan menyusun interpretasi.

Formulir sekurang-kurangnya memuat:

Identitas percobaan - Nama/judul percobaan. - Nomor atau ID

percobaan. - Variabel yang diuji. - Nilai konsentrasi A. - Nilai

konsentrasi B. - Nilai suhu. - Durasi simulasi.

Data kuantitatif - Jumlah tumbukan A--B. - Frekuensi tumbukan

A--B. - Jumlah tumbukan efektif. - Jumlah produk yang terbentuk. - Nilai

laju reaksi model yang ditampilkan simulasi.

Interpretasi siswa - Deskripsi pola tumbukan yang diamati. -

Perbandingan frekuensi tumbukan dan tumbukan efektif. - Hubungan

perubahan variabel dengan hasil simulasi. - Kesimpulan berdasarkan data.

Ketentuan interaksi formulir:

- Gunakan label yang jelas untuk setiap kolom.

- Gunakan input angka untuk data numerik dan textarea untuk

  interpretasi.

- Tampilkan satuan atau keterangan nilai relatif.

- Validasi kolom wajib sebelum data dapat disimpan.

- Berikan pesan spesifik untuk kolom yang belum diisi atau memiliki

  format tidak valid.

- Siswa dapat mengedit jawaban sebelum menyimpan.

- Setelah disimpan, tampilkan ringkasan data pengamatan.

- Sediakan pilihan untuk mengubah atau mengulang pengamatan.

- Simpan data pengamatan di LocalStorage pada perangkat dan browser

  yang sama.

- Jangan mengisi jawaban interpretasi siswa secara otomatis.

8.12 Kuis Interaktif Berbasis Pengamatan

Setelah formulir pengamatan disimpan, siswa dapat melanjutkan ke kuis

yang menguji pemahaman atas simulasi yang telah dilakukan.

Kuis harus mengacu pada konsep dan data yang relevan dengan percobaan,

bukan hanya mengulang definisi dari modul.

Jenis pertanyaan dapat meliputi:

- Mengidentifikasi perubahan frekuensi tumbukan ketika konsentrasi A

  dinaikkan.

- Menganalisis pengaruh perubahan konsentrasi B.

- Menjelaskan perubahan gerak partikel ketika suhu meningkat.

- Membedakan frekuensi tumbukan dengan tumbukan efektif.

- Menafsirkan hubungan tumbukan efektif dengan laju reaksi model.

- Membandingkan dua kondisi percobaan.

- Menarik kesimpulan dari tabel atau grafik hasil simulasi.

Ketentuan kuis:

- Gunakan pilihan ganda dengan satu jawaban benar untuk setiap soal

  pada versi pertama.

- Pertanyaan harus jelas, tidak ambigu, dan sesuai tingkat SMA/MA

  kelas XI.

- Soal dapat menggunakan data hasil simulasi atau skenario perubahan

  variabel.

- Setiap soal memiliki kunci jawaban dan penjelasan.

- Jawaban diperiksa setelah siswa menekan tombol Periksa Jawaban

  atau Kirim Jawaban.

- Setelah dikirim, sistem langsung menampilkan status benar atau belum

  tepat.

- Umpan balik harus menjelaskan alasan ilmiah, bukan hanya menampilkan

  tanda benar/salah.

- Jawaban yang salah harus disertai penjelasan konsep yang benar agar

  siswa dapat memperbaiki pemahamannya.

- Siswa dapat berpindah ke soal berikutnya setelah umpan balik

  ditampilkan.

- Sediakan ringkasan skor dan pembahasan setelah kuis selesai.

- Sediakan tombol untuk mengulang kuis.

Perilaku umpan balik:

- Jika benar: tampilkan indikator "Benar", apresiasi singkat, dan

  alasan mengapa jawaban sesuai konsep.

- Jika salah: tampilkan indikator "Belum tepat", penjelasan letak

  kekeliruan konseptual, dan alasan jawaban yang benar.

- Gunakan teks dan ikon selain warna agar informasi dapat dipahami

  oleh semua siswa.

- Jangan hanya mengubah warna tombol tanpa memberikan penjelasan.

- Jangan menampilkan kunci jawaban sebelum siswa mengirimkan

  jawabannya.

8.13 Ringkasan Hasil Kegiatan

Setelah siswa menyelesaikan pengamatan dan kuis, tampilkan ringkasan

yang memuat:

- Parameter eksperimen yang digunakan.

- Data hasil simulasi.

- Data pengamatan yang diisi siswa.

- Kesimpulan atau interpretasi siswa.

- Skor kuis.

- Jumlah jawaban benar dan salah.

- Umpan balik atau pembahasan.

- Status penyelesaian kegiatan.

Ringkasan harus membedakan data yang dihasilkan simulasi dengan jawaban

atau interpretasi yang ditulis siswa.

8.14 Ketentuan Teknis dan Batasan

- Simulasi harus berjalan di sisi frontend tanpa backend.

- Gunakan logika simulasi yang terpisah dari komponen antarmuka.

- Animasi harus tetap responsif ketika parameter diubah.

- Simulasi harus dapat dihentikan, dilanjutkan, dan diulang.

- Data hasil simulasi, formulir pengamatan, dan hasil kuis harus

  memiliki struktur yang konsisten.

- Gunakan LocalStorage untuk menyimpan status dan riwayat kegiatan.

- Jika browser tidak mendukung penyimpanan atau terjadi kegagalan,

  tampilkan pesan yang jelas.

- Simulasi tidak boleh mengklaim menggantikan praktikum laboratorium

  nyata.

9. Spesifikasi Visualisasi

Visualisasi pada laboratorium virtual difokuskan pada representasi

mikroskopik reaksi A + B → Produk. Tujuan utamanya adalah membantu siswa

menghubungkan perubahan kondisi reaksi dengan gerak partikel, frekuensi

tumbukan, tumbukan efektif, dan laju reaksi model.

9.1 Representasi Mikroskopik

Visualisasi utama harus memperlihatkan:

- Partikel A dan B dengan bentuk atau warna berbeda.

- Pergerakan partikel di dalam area simulasi.

- Tumbukan antara partikel A dan B.

- Pembedaan peristiwa tumbukan biasa dan tumbukan efektif.

- Pembentukan produk setelah tumbukan efektif.

- Perubahan jumlah reaktan dan produk selama simulasi.

- Perubahan kepadatan partikel sesuai konsentrasi yang dipilih.

- Perubahan kecepatan gerak partikel sesuai suhu yang dipilih.

9.2 Representasi Data yang Terhubung dengan Animasi

Visualisasi mikroskopik tidak boleh berdiri sendiri. Setiap perubahan

yang terlihat harus terhubung dengan data simulasi.

- Ketika konsentrasi A dinaikkan, jumlah/kepadatan partikel A

  bertambah dan data peluang/frekuensi tumbukan A--B dihitung ulang.

- Ketika konsentrasi B dinaikkan, jumlah/kepadatan partikel B

  bertambah dan data peluang/frekuensi tumbukan A--B dihitung ulang.

- Ketika suhu dinaikkan, gerak partikel menjadi lebih cepat dan

  parameter energi kinetik model berubah.

- Ketika terjadi tumbukan, penghitung tumbukan diperbarui.

- Ketika tumbukan memenuhi kriteria efektif, penghitung tumbukan

  efektif dan jumlah produk diperbarui.

- Laju reaksi model dihitung dari perubahan jumlah produk atau

  berkurangnya reaktan per satuan waktu sesuai definisi yang

  konsisten.

9.3 Representasi Simbolik dan Numerik

Tampilkan informasi pendukung berupa:

- Persamaan model A + B → Produk.

- Nilai konsentrasi A dan B.

- Nilai suhu.

- Frekuensi tumbukan.

- Jumlah tumbukan efektif.

- Jumlah produk terbentuk.

- Laju reaksi model.

- Grafik perubahan jumlah produk atau reaktan terhadap waktu.

Gunakan label dan satuan secara konsisten. Jika nilai merupakan hasil

model relatif, beri label "nilai relatif" atau "hasil model" dan jangan

menambahkan satuan fisik yang tidak didukung.

9.4 Keterpaduan Visualisasi

Panel visualisasi, kontrol parameter, dan panel data harus saling

terhubung. Ketika siswa mengubah parameter, tampilan partikel dan hasil

simulasi harus mengikuti perubahan tersebut setelah simulasi dijalankan

atau diperbarui.

Sediakan legenda yang membedakan partikel A, partikel B, produk,

tumbukan, dan tumbukan efektif. Berikan keterangan singkat yang dapat

dibuka atau dibaca siswa untuk membantu interpretasi.

9.5 Prinsip Akurasi Visual

- Gerak partikel harus memiliki hubungan dengan suhu model.

- Kepadatan partikel harus memiliki hubungan dengan konsentrasi model.

- Peristiwa tumbukan harus terdeteksi melalui logika simulasi, bukan

  animasi dekoratif.

- Pembentukan produk hanya terjadi pada tumbukan yang diklasifikasikan

  efektif.

- Frekuensi tumbukan, jumlah tumbukan efektif, dan laju reaksi harus

  ditampilkan sebagai indikator berbeda.

- Jika orientasi tumbukan tidak dimodelkan, tampilkan sebagai

  keterbatasan model.

- Visualisasi harus disertai penjelasan bahwa partikel merupakan

  representasi konseptual, bukan gambaran ukuran dan lintasan molekul

  yang sebenarnya.

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

11. Model Data

Gunakan struktur data JavaScript yang konsisten agar materi, simulasi,

formulir pengamatan, kuis, dan progres dapat dikelola secara terpisah.

Modul

Setiap objek modul memiliki:

- id

- title

- description

- order

- objectives

- sections

- workedExamples

- summary

- relatedExperimentIds

- quizCategoryIds

Eksperimen

Setiap objek eksperimen memiliki:

- id

- title

- description

- reaction --- persamaan model, yaitu A + B → Produk.

- factor --- faktor yang sedang dipelajari.

- variables --- daftar variabel yang dapat diubah dan variabel

  kontrol.

- defaultParameters --- nilai awal konsentrasi A, konsentrasi B,

  suhu, dan variabel opsional yang benar-benar didukung.

- parameterRanges --- batas minimum, maksimum, dan langkah perubahan

  setiap parameter.

- controls --- konfigurasi tombol mulai, jeda, lanjutkan, ulangi,

  dan reset.

- learningObjectives

- simulationSettings --- durasi, ukuran area, dan pengaturan model.

- dataDefinitions --- definisi frekuensi tumbukan, tumbukan efektif,

  dan laju reaksi model.

Hasil Simulasi

Setiap hasil simulasi sekurang-kurangnya memiliki:

- id

- experimentId

- parameters --- nilai konsentrasi A, konsentrasi B, suhu, dan

  variabel lain yang digunakan.

- duration

- collisionCount

- collisionFrequency

- effectiveCollisionCount

- productCount

- reactionRate

- timeSeries --- data untuk grafik perubahan jumlah produk atau

  reaktan terhadap waktu.

- createdAt

- modelVersion --- versi logika simulasi yang menghasilkan data.

Data Pengamatan Siswa

Setiap data pengamatan sekurang-kurangnya memiliki:

- id

- experimentId

- simulationResultId

- trialNumber

- observedParameters

- recordedCollisionCount

- recordedCollisionFrequency

- recordedEffectiveCollisionCount

- recordedProductCount

- recordedReactionRate

- observationNotes

- analysis

- conclusion

- completedAt

Simpan data hasil simulasi dan jawaban pengamatan siswa secara terpisah

agar sistem dapat membedakan data yang dihasilkan mesin simulasi dengan

data yang dicatat atau ditafsirkan siswa.

Pertanyaan Kuis

Setiap objek pertanyaan memiliki:

- id

- category

- experimentId atau relatedExperimentId

- question

- options

- correctAnswer

- explanation

- correctFeedback

- incorrectFeedback

- difficulty

- relatedConcept

Riwayat Kuis

Setiap percobaan kuis memiliki:

- id

- category

- experimentId

- score

- totalQuestions

- correctAnswers

- incorrectAnswers

- answers --- jawaban yang dipilih dan status benar/salah.

- completedAt

Progres Siswa

Data progres memiliki:

- completedModules

- completedExperiments

- completedObservations

- quizAttempts

- lastUpdated

Gunakan ID yang unik dan stabil. Hindari menggunakan judul sebagai

satu-satunya identitas data.

12. Struktur Folder yang Direkomendasikan

src/

├── assets/

│   ├── images/

│   └── icons/

├── components/

│   ├── layout/

│   │   ├── Header.jsx

│   │   ├── Sidebar.jsx

│   │   └── MainLayout.jsx

│   ├── common/

│   │   ├── Button.jsx

│   │   ├── Card.jsx

│   │   ├── ProgressBar.jsx

│   │   └── Modal.jsx

│   ├── learning/

│   │   ├── ModuleCard.jsx

│   │   ├── LessonContent.jsx

│   │   └── WorkedExample.jsx

│   ├── laboratory/

│   │   ├── ExperimentCard.jsx

│   │   ├── ReactionParameterControls.jsx

│   │   ├── ParticleSimulation.jsx

│   │   ├── CollisionMetrics.jsx

│   │   ├── SimulationChart.jsx

│   │   ├── ObservationForm.jsx

│   │   ├── ObservationSummary.jsx

│   │   └── ExperimentResults.jsx

│   └── quiz/

│       ├── QuizQuestion.jsx

│       ├── QuizFeedback.jsx

│       └── QuizResult.jsx

├── pages/

│   ├── HomePage.jsx

│   ├── ModulesPage.jsx

│   ├── ModuleDetailPage.jsx

│   ├── LaboratoryPage.jsx

│   ├── ExperimentPage.jsx

│   ├── QuizPage.jsx

│   └── ProgressPage.jsx

├── data/

│   ├── modules.js

│   ├── experiments.js

│   ├── quizQuestions.js

│   └── index.js

├── services/

│   ├── simulationService.js

│   ├── observationService.js

│   └── progressService.js

├── hooks/

│   └── useProgress.js

├── utils/

│   ├── calculations.js

│   └── formatters.js

├── styles/

│   ├── global.css

│   └── variables.css

├── App.jsx

└── main.jsx

Struktur tersebut merupakan panduan. Jika proyek sudah memiliki struktur

folder yang berbeda, pertahankan struktur yang berfungsi dan sesuaikan

secara konsisten. Jangan membuat ulang proyek hanya untuk mengikuti

struktur contoh ini.

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

Tangani data penyimpanan yang tidak valid, data lama, atau kegagalan

akses LocalStorage dengan aman.

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

Pada layar kecil, navigasi dan panel kontrol harus menyesuaikan tanpa

menyebabkan konten terpotong atau gulir horizontal yang tidak

diperlukan.

### Aksesibilitas

- Gunakan elemen HTML semantik.

- Sediakan label untuk input.

- Pastikan kontrol dapat digunakan dengan keyboard.

- Jangan hanya menggunakan warna untuk menyampaikan informasi.

- Berikan teks alternatif untuk gambar yang bermakna.

- Gunakan ukuran teks yang nyaman dibaca.

- Pastikan grafik memiliki deskripsi atau ringkasan tekstual.

15. Persyaratan Fungsional

FR-01 --- Dashboard

Sistem menampilkan pengenalan aplikasi, akses fitur utama, dan ringkasan

progres siswa.

FR-02 --- Daftar Modul

Sistem menampilkan seluruh modul materi beserta deskripsi dan status

penyelesaian.

FR-03 --- Detail Materi

Siswa dapat membuka modul, membaca materi, mempelajari contoh soal, dan

melihat ringkasan.

FR-04 --- Penyelesaian Materi

Siswa dapat menandai modul sebagai selesai. Status disimpan pada

LocalStorage.

FR-05 --- Laboratorium Reaksi A + B

Sistem menyediakan laboratorium virtual yang memodelkan reaksi A + B →

Produk dengan visualisasi mikroskopik partikel A dan B.

FR-06 --- Pengaturan Konsentrasi Reaktan

Siswa dapat mengubah konsentrasi A dan konsentrasi B secara terpisah

melalui kontrol yang memiliki rentang dan nilai yang jelas.

FR-07 --- Pengaturan Suhu

Siswa dapat mengubah suhu sistem dan mengamati dampaknya terhadap gerak

partikel serta indikator tumbukan.

FR-08 --- Variabel Kontrol

Sistem menampilkan variabel yang sedang dikendalikan. Ketika satu faktor

diuji, variabel lain yang relevan harus dipertahankan.

FR-09 --- Simulasi Mikroskopik

Sistem menampilkan gerak partikel, tumbukan A--B, tumbukan efektif, dan

pembentukan produk sesuai logika simulasi.

FR-10 --- Data Tumbukan dan Laju Reaksi

Sistem menampilkan jumlah tumbukan, frekuensi tumbukan per satuan waktu,

jumlah tumbukan efektif, jumlah produk, dan laju reaksi model sebagai

indikator terpisah.

FR-11 --- Grafik Simulasi

Sistem menampilkan grafik yang bersumber dari data simulasi aktual

dengan label, legenda, dan satuan atau keterangan nilai relatif yang

sesuai.

FR-12 --- Kontrol Simulasi

Siswa dapat memulai, menjeda, melanjutkan, mengulangi, dan mereset

simulasi. Setiap kontrol harus menjalankan fungsi yang sesuai.

FR-13 --- Formulir Pengamatan

Setelah simulasi dijalankan, siswa dapat mengisi formulir pengamatan

yang mencakup parameter, data kuantitatif, analisis, dan kesimpulan.

FR-14 --- Validasi dan Penyimpanan Pengamatan

Sistem memvalidasi kolom wajib, menampilkan pesan kesalahan yang

spesifik, dan menyimpan pengamatan yang valid ke LocalStorage.

FR-15 --- Kuis Berbasis Pengamatan

Siswa dapat mengerjakan kuis yang menguji pemahaman konsep serta

interpretasi data simulasi.

FR-16 --- Umpan Balik Jawaban

Setelah siswa mengirimkan jawaban, sistem menampilkan status benar atau

belum tepat beserta penjelasan konseptual yang sesuai.

FR-17 --- Hasil Kuis

Sistem menampilkan skor, jumlah jawaban benar dan salah, serta

pembahasan setelah kuis selesai.

FR-18 --- Riwayat Kuis

Sistem menyimpan hasil kuis ke LocalStorage.

FR-19 --- Progres Belajar

Sistem menampilkan status penyelesaian materi, eksperimen, formulir

pengamatan, serta ringkasan hasil kuis.

FR-20 --- Persistensi Data

Data progres tetap tersedia setelah halaman dimuat ulang pada browser

dan perangkat yang sama, selama data browser tidak dihapus.

FR-21 --- Penanganan Kesalahan

Sistem menampilkan pesan yang jelas apabila terjadi kesalahan input,

data tidak valid, atau kegagalan penyimpanan.

## 16. Persyaratan Nonfungsional

### Kinerja

- Antarmuka harus terasa responsif.

- Perubahan parameter simulasi tidak boleh menyebabkan pembekuan

halaman.

- Animasi harus dibatasi agar tidak mengganggu interaksi.

- Hindari perhitungan berulang yang tidak diperlukan.

### Keandalan

- Navigasi tidak boleh mengarah ke halaman kosong.

- Tombol harus menjalankan fungsi yang sesuai.

- Data yang tidak tersedia harus ditangani dengan aman.

- Kegagalan LocalStorage tidak boleh menyebabkan seluruh aplikasi

berhenti.

### Pemeliharaan

- Pisahkan komponen UI, data, logika simulasi, dan penyimpanan.

- Gunakan penamaan fungsi dan variabel yang jelas.

- Hindari duplikasi logika.

- Gunakan komponen yang dapat digunakan kembali.

### Keamanan dan Privasi

- Jangan meminta data pribadi yang tidak diperlukan.

- Jangan menyimpan informasi sensitif.

- Jangan mengirim data siswa ke layanan eksternal tanpa kebutuhan dan

persetujuan yang jelas.

## 17. Aturan Implementasi untuk Coding Agent

1. Periksa struktur proyek dan `package.json` sebelum mengubah kode.

2. Pertahankan teknologi dan dependensi yang sudah berfungsi.

3. Jangan membuat ulang proyek dari awal jika proyek yang ada dapat

dikembangkan.

4. Implementasikan fitur secara bertahap dan terintegrasi.

5. Gunakan data dari file sumber yang telah ditentukan, bukan menyalin

data yang sama ke banyak komponen.

6. Pisahkan fungsi perhitungan dari komponen antarmuka.

7. Pastikan seluruh tombol dan kontrol interaktif berfungsi.

8. Hindari penggunaan data palsu yang ditampilkan seolah-olah merupakan

hasil eksperimen nyata.

9. Jangan menambahkan backend, autentikasi, atau dependensi besar tanpa

kebutuhan.

10. Tangani kondisi kosong, input tidak valid, dan kegagalan

penyimpanan.

11. Pastikan navigasi dan tampilan berfungsi di desktop serta perangkat

seluler.

12. Jalankan pemeriksaan build dan perbaiki kesalahan yang muncul.

13. Jangan menghapus fitur proyek yang sudah ada tanpa alasan yang

jelas.

14. Jangan hanya membuat mockup statis; implementasikan perilaku

interaktif yang dijelaskan dalam PRD.

15. Jika ada detail yang belum ditentukan, pilih solusi sederhana yang

konsisten dengan tujuan pembelajaran dan dokumentasikan asumsi penting.

18. Tahapan Pengembangan

Tahap 1 --- Fondasi Aplikasi

- Menyiapkan struktur proyek.

- Membuat layout dan navigasi.

- Menyiapkan desain responsif.

- Menyusun sistem data.

Tahap 2 --- Modul Materi

- Membuat daftar modul.

- Membuat halaman detail materi.

- Menambahkan contoh soal dan ringkasan.

- Menyimpan status penyelesaian.

Tahap 3 --- Laboratorium Virtual Reaksi A + B

- Menetapkan model simulasi konseptual A + B → Produk dan definisi

  indikatornya.

- Membuat kontrol konsentrasi A dan konsentrasi B secara terpisah.

- Membuat kontrol suhu dan variabel opsional hanya jika dapat

  dimodelkan secara ilmiah.

- Mengimplementasikan mesin simulasi dan deteksi tumbukan.

- Membuat visualisasi mikroskopik partikel A, B, dan produk.

- Menampilkan jumlah tumbukan, frekuensi tumbukan, tumbukan efektif,

  jumlah produk, dan laju reaksi model.

- Menampilkan grafik berdasarkan data simulasi.

- Mengimplementasikan mulai, jeda, lanjutkan, ulangi, dan reset.

Tahap 4 --- Formulir Pengamatan

- Membuat formulir data pengamatan.

- Menghubungkan formulir dengan hasil simulasi yang telah dijalankan.

- Menambahkan validasi kolom wajib dan format data.

- Menyimpan hasil pengamatan ke LocalStorage.

- Menampilkan ringkasan pengamatan.

Tahap 5 --- Kuis Interaktif

- Menyusun pertanyaan berdasarkan konsep dan data simulasi.

- Mengimplementasikan pemeriksaan jawaban.

- Menampilkan umpan balik benar dan belum tepat beserta penjelasan.

- Menampilkan skor dan pembahasan.

- Menyimpan riwayat kuis.

Tahap 6 --- Progres dan Integrasi

- Menghubungkan seluruh fitur.

- Menghitung progres belajar.

- Menghubungkan status eksperimen, pengamatan, dan kuis.

- Menangani data kosong dan data tidak valid.

- Memastikan seluruh navigasi berfungsi.

Tahap 7 --- Pengujian dan Penyempurnaan

- Menguji seluruh tombol.

- Menguji perhitungan dan konsistensi data simulasi.

- Menguji perubahan parameter A, B, dan suhu secara terpisah.

- Menguji validasi formulir pengamatan.

- Menguji umpan balik kuis untuk jawaban benar maupun salah.

- Menguji penyimpanan dan pemuatan progres.

- Menguji tampilan responsif.

- Memperbaiki kesalahan build.

- Memastikan konten ilmiah benar.

19. Kriteria Penerimaan

Produk dinyatakan memenuhi kebutuhan minimum apabila:

- [ ] Aplikasi dapat dijalankan tanpa kesalahan build.

- [ ] Dashboard dapat dibuka dan menampilkan informasi yang relevan.

- [ ] Seluruh modul materi dapat diakses.

- [ ] Materi memiliki penjelasan, contoh soal, dan ringkasan.

- [ ] Status penyelesaian modul dapat disimpan.

- [ ] Laboratorium menampilkan model reaksi A + B → Produk.

- [ ] Partikel A dan B dapat dibedakan secara visual.

- [ ] Siswa dapat mengubah konsentrasi A dan B secara terpisah.

- [ ] Siswa dapat mengubah suhu sistem.

- [ ] Perubahan parameter menghasilkan perubahan simulasi yang

  konsisten.

- [ ] Variabel kontrol ditampilkan dan dijelaskan.

- [ ] Visualisasi menunjukkan gerak partikel dan peristiwa tumbukan

  A--B.

- [ ] Tumbukan biasa dan tumbukan efektif dibedakan.

- [ ] Produk hanya terbentuk ketika kriteria tumbukan efektif model

  terpenuhi.

- [ ] Frekuensi tumbukan, tumbukan efektif, dan laju reaksi

  ditampilkan sebagai indikator berbeda.

- [ ] Data simulasi diperbarui sesuai parameter yang digunakan.

- [ ] Grafik berasal dari data simulasi dan memiliki label yang

  sesuai.

- [ ] Tombol mulai, jeda, lanjutkan, ulangi, dan reset berfungsi.

- [ ] Formulir pengamatan dapat diisi dan divalidasi.

- [ ] Formulir membedakan data simulasi dengan analisis siswa.

- [ ] Data pengamatan yang valid dapat disimpan dan ditampilkan

  kembali.

- [ ] Kuis dapat dikerjakan setelah kegiatan pengamatan.

- [ ] Sistem memberikan umpan balik yang berbeda untuk jawaban benar

  dan salah.

- [ ] Setiap umpan balik menyertakan penjelasan konseptual.

- [ ] Skor kuis dihitung dengan benar.

- [ ] Riwayat kuis tersimpan dan dapat dimuat kembali.

- [ ] Progres belajar diperbarui setelah aktivitas selesai.

- [ ] Data progres tetap tersedia setelah halaman dimuat ulang.

- [ ] Aplikasi dapat digunakan pada desktop dan ponsel.

- [ ] Tidak ada tombol utama yang tidak berfungsi.

- [ ] Tidak ada hasil simulasi yang diklaim sebagai data eksperimen

  nyata.

20. Prioritas Pengembangan

P0 --- Wajib

- Navigasi.

- Modul materi.

- Laboratorium virtual reaksi A + B.

- Kontrol konsentrasi A dan B serta suhu.

- Visualisasi mikroskopik partikel dan tumbukan.

- Indikator frekuensi tumbukan, tumbukan efektif, dan laju reaksi

  model.

- Formulir data pengamatan dan penyimpanan lokal.

- Kuis interaktif dengan umpan balik benar/salah dan penjelasan.

- Penyimpanan progres.

- Desain responsif.

P1 --- Penting

- Grafik hasil simulasi.

- Perbandingan hasil beberapa kondisi percobaan.

- Riwayat pengamatan.

- Riwayat kuis.

- Ringkasan progres.

- Aksesibilitas yang lebih baik.

P2 --- Pengembangan Berikutnya

- Pengayaan visualisasi.

- Variabel katalis jika model ilmiahnya dapat diterapkan dengan benar.

- Analisis hasil belajar lebih lanjut.

- Fitur refleksi siswa.

- Integrasi penyimpanan daring apabila dibutuhkan.

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

**Instruksi akhir:** Bangun REAKSI LAB sebagai aplikasi

pembelajaran interaktif yang benar-benar berfungsi. Prioritaskan

ketepatan konsep kimia, keterpaduan antarf fitur, kemudahan penggunaan,

dan stabilitas aplikasi. Jangan berhenti pada desain visual atau halaman
statis.
22. Persyaratan Tambahan: Dinamika dan Kendali Animasi Partikel
Bagian ini melengkapi spesifikasi pada Bagian 8 (Laboratorium Virtual) dan Bagian 9 (Visualisasi). Ketentuan yang sudah ada tetap berlaku. Jika terdapat perbedaan teknis, bagian ini memperjelas perilaku minimum yang harus dapat diuji, tanpa mengubah ruang lingkup produk.
22.1 Model keadaan partikel
Setiap partikel reaktan A dan B sekurang-kurangnya memiliki data runtime:
- ID unik yang stabil selama satu sesi simulasi.
- Jenis partikel (A atau B).
- Posisi dua dimensi (x, y) dalam koordinat area simulasi.
- Komponen kecepatan (vx, vy) atau representasi arah dan besar kecepatan yang ekuivalen.
- Radius/ukuran visual yang digunakan untuk batas area dan deteksi tumbukan.
- Status partikel, misalnya reaktan aktif atau telah dikonversi menjadi produk.
Posisi tidak boleh ditentukan ulang secara acak pada setiap render. Posisi diperbarui dari keadaan sebelumnya berdasarkan kecepatan dan selang waktu simulasi. Perubahan posisi harus menghasilkan perubahan visual yang nyata dan kontinu selama status simulasi berjalan.
22.2 Pergerakan dan batas area
1. Partikel A dan B bergerak secara kontinu selama simulasi berstatus berjalan.
2. Arah dan kecepatan awal ditetapkan ketika partikel diinisialisasi; partikel tidak boleh hanya berpindah secara dekoratif atau berkedip.
3. Pembaruan posisi menggunakan selang waktu antar-frame (delta time) sehingga kecepatan tidak bergantung langsung pada frame rate perangkat.
4. Partikel harus tetap berada di dalam batas area simulasi. Ketika menyentuh batas, komponen kecepatan pada sumbu yang bersangkutan dibalik sehingga partikel memantul kembali ke area.
5. Perhitungan batas memperhitungkan radius partikel, bukan hanya titik pusatnya.
6. Pergerakan harus tetap cukup ringan agar kontrol, panel data, dan interaksi pengguna tidak terhambat.
22.3 Hubungan parameter dengan keadaan partikel
- Konsentrasi A dan B menentukan jumlah partikel masing-masing jenis dalam volume/area simulasi yang sama. Peningkatan konsentrasi A hanya menambah kepadatan A; peningkatan B hanya menambah kepadatan B.
- Pemetaan nilai konsentrasi ke jumlah partikel harus konsisten, memiliki batas minimum/maksimum yang jelas, dan tidak menghasilkan jumlah partikel di luar batas performa yang ditetapkan implementasi.
- Suhu menentukan skala besar kecepatan partikel. Pada parameter lain yang sama, kenaikan suhu harus menghasilkan kenaikan kecepatan rata-rata gerak partikel A dan B; penurunan suhu menurunkannya.
- Perubahan parameter harus mengubah keadaan simulasi, bukan hanya label/angka antarmuka. Perubahan parameter ketika simulasi belum berjalan diterapkan pada inisialisasi berikutnya. Jika kontrol dapat diubah ketika simulasi berjalan, perubahan harus diterapkan secara konsisten tanpa membuat loop baru atau mereset penghitung yang tidak diminta.
- Penerapan perubahan konsentrasi saat simulasi berlangsung harus mempertahankan partikel yang masih valid sejauh mungkin, menambah atau menghapus partikel sesuai selisih jumlah, dan menjaga ID unik. Jika implementasi memilih menerapkan parameter hanya setelah Ulangi/Mulai ulang, antarmuka harus menyatakannya secara jelas.
22.4 Deteksi tumbukan dan pembentukan produk
1. Tumbukan A–B dideteksi dari kedekatan geometris aktual partikel pada koordinat simulasi, misalnya jarak pusat tidak lebih besar daripada jumlah radius.
2. Satu kontak berkelanjutan tidak boleh dihitung sebagai banyak tumbukan pada setiap frame. Gunakan status kontak, pemisahan minimum, atau mekanisme pencegah hitung ganda yang sesuai.
3. Setelah tumbukan terdeteksi, klasifikasikan sebagai tumbukan biasa atau efektif menggunakan aturan model yang telah ditetapkan. Kriteria energi/kecepatan harus terhubung dengan suhu; jangan mengklaim orientasi molekuler dimodelkan jika belum ada mekanismenya.
4. Hanya tumbukan efektif yang mengonversi satu A dan satu B menjadi satu unit produk. Partikel reaktan yang dikonsumsi harus dikeluarkan dari daftar reaktan aktif dan penghitung diperbarui secara konsisten.
5. Efek visual tumbukan boleh digunakan sebagai umpan balik, tetapi tidak boleh menjadi satu-satunya dasar pembentukan produk atau penghitungan data.
22.5 Status dan perilaku kontrol
Status simulasi sekurang-kurangnya dibedakan menjadi siap/berhenti, berjalan, dan dijeda.
- Mulai: membuat keadaan awal partikel berdasarkan parameter saat ini, menginisialisasi penghitung dan waktu sesi, lalu memulai tepat satu loop animasi.
- Jeda: menghentikan penjadwalan frame dan membekukan posisi, waktu simulasi, penghitung berbasis waktu, serta data yang hanya berubah karena simulasi berjalan. Tidak boleh ada perhitungan simulasi yang terus berjalan di latar belakang.
- Lanjutkan: meneruskan dari posisi, arah, jumlah partikel, penghitung, dan waktu terakhir; tidak menginisialisasi ulang partikel.
- Ulangi: menghentikan loop aktif, menginisialisasi ulang posisi dan arah partikel serta seluruh penghitung/waktu ke keadaan awal, lalu menjalankan kembali dengan parameter yang sama. Jika perilaku UI saat ini mengembalikan ke status siap dan menunggu tombol Mulai, pertahankan perilaku itu hanya jika dinyatakan jelas pada antarmuka; jangan membuat perilaku ambigu.
- Reset Parameter: menghentikan simulasi, mengembalikan seluruh parameter ke nilai default, menginisialisasi tampilan awal sesuai parameter default, dan membersihkan penghitung sesi. Reset parameter berbeda dari Ulangi.
Tombol yang tidak sesuai dengan status saat ini harus nonaktif atau memberikan perilaku yang konsisten dan aman. Menekan Mulai berulang kali tidak boleh membuat loop animasi ganda.
22.6 Rendering dan lifecycle
- Implementasi boleh menggunakan requestAnimationFrame atau mekanisme setara yang sudah sesuai dengan arsitektur proyek.
- Logika pembaruan posisi, deteksi tumbukan, dan aturan reaksi harus dipisahkan dari komponen presentasi dan ditempatkan pada service/modul simulasi yang relevan.
- Komponen visual bertugas merender snapshot keadaan terbaru. Jika menggunakan Canvas, gambar ulang dilakukan setelah keadaan simulasi diperbarui; jika menggunakan elemen DOM/SVG, posisi visual harus terikat pada data posisi aktual.
- Referensi frame ID dan timestamp frame sebelumnya dikelola secara eksplisit. Hanya boleh ada satu loop aktif untuk satu instance simulasi.
- Ketika dijeda, di-reset, atau komponen dilepas (unmount), frame terjadwal harus dibatalkan dan referensi loop dibersihkan.
- Hindari setState React untuk setiap partikel pada setiap frame apabila hal itu menimbulkan render berlebihan. Gunakan referensi mutable untuk keadaan frame bila sesuai, lalu render melalui Canvas atau strategi yang efisien. State React tetap digunakan untuk status dan ringkasan UI yang memang perlu diperbarui.
- Perubahan dependency useEffect tidak boleh secara tidak sengaja membuat loop baru setiap render atau menghentikan loop ketika status masih berjalan.
22.7 Kriteria penerimaan yang dapat diuji
Implementasi dinyatakan memenuhi persyaratan animasi apabila seluruh pemeriksaan berikut lulus:
1. Sebelum Mulai, partikel A dan B terlihat pada area simulasi.
2. Setelah Mulai, posisi setidaknya partikel aktif berubah pada beberapa frame berturut-turut tanpa klik tambahan.
3. Partikel bergerak kontinu dan memantul di batas area tanpa keluar dari area.
4. Pada parameter konsentrasi lain yang sama, menaikkan suhu meningkatkan kecepatan gerak rata-rata yang teramati.
5. Menaikkan konsentrasi A menambah jumlah/kepadatan A tanpa secara tidak sengaja mengubah B; hal yang sama berlaku untuk B.
6. Tumbukan terdeteksi dari interaksi posisi partikel, dan satu kontak tidak dihitung berulang-ulang pada setiap frame.
7. Produk hanya terbentuk setelah tumbukan yang lolos kriteria efektif; jumlah A, B, dan produk konsisten.
8. Jeda membekukan posisi, waktu, dan seluruh indikator yang bergantung pada waktu.
9. Lanjutkan meneruskan dari kondisi terakhir, bukan dari kondisi awal.
10. Ulangi mengembalikan posisi, arah, jumlah partikel, waktu, dan penghitung ke kondisi awal menggunakan parameter yang sama.
11. Reset Parameter mengembalikan parameter default dan kondisi sesi sesuai spesifikasi kontrol.
12. Menekan Mulai berulang kali tidak meningkatkan jumlah loop aktif; setelah unmount tidak ada frame callback yang terus berjalan.
13. Tidak ada error baru pada console selama skenario pengujian.
Catat hasil setiap pengujian sebagai lulus/gagal dan jelaskan bila ada kriteria yang belum dapat diuji. Jangan menyatakan lulus berdasarkan inspeksi visual saja jika perubahan koordinat atau status internal dapat diperiksa.
22.8 Batasan interpretasi ilmiah
Model gerak partikel adalah representasi konseptual untuk pembelajaran teori tumbukan, bukan dinamika molekuler atau simulasi numerik reaksi nyata. Pemetaan suhu ke kecepatan dan klasifikasi tumbukan efektif harus dijelaskan sebagai aturan model. Jumlah partikel merupakan proksi konsentrasi dalam area simulasi, bukan konsentrasi molar eksperimen.
