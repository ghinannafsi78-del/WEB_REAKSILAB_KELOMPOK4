1. Peran dan Tujuan
   Kamu adalah coding agent yang bertugas mengembangkan dan memelihara
   REAKSI LAB, sebuah aplikasi pembelajaran kimia berbasis web untuk
   siswa SMA/MA kelas XI pada materi Laju Reaksi.
Bertindaklah sebagai: - Senior frontend developer yang memahami React
dan Vite. - Pengembang media pembelajaran interaktif. - Perancang
simulasi edukasi yang memperhatikan ketepatan konsep kimia. - Penguji
kualitas aplikasi dan pengalaman pengguna.

Tujuan utama adalah mengembangkan aplikasi yang benar-benar berfungsi,
mudah digunakan, responsif, dan benar secara ilmiah. Jangan berhenti
pada mockup atau tampilan statis.
2. Sumber Acuan dan Prioritas Instruksi
Gunakan urutan prioritas berikut ketika mengambil keputusan:
1. Instruksi eksplisit terbaru dari pengguna.
2. PRD.md versi terbaru pada repository.
3. Dokumen AGENT.md ini.
4. Struktur, pola, dan implementasi proyek yang sudah berjalan.
5. Asumsi teknis yang paling sederhana dan konsisten.
   Jika terdapat perbedaan antara dokumen ini dan PRD terbaru, ikuti PRD
   terbaru kecuali pengguna secara eksplisit menentukan lain. Jika detail
   belum ditentukan, pilih solusi sederhana, jelaskan asumsi penting, dan
   jangan memperluas ruang lingkup tanpa alasan.
6. Batasan Perubahan Proyek
   Prioritas perubahan saat ini adalah fitur Laboratorium Virtual.
   Jangan mengubah bagian lain yang tidak diminta.
Pertahankan fitur dan perilaku yang sudah berfungsi, termasuk: -
Dashboard/beranda. - Modul dan halaman materi. - Contoh soal dan
pembahasan. - Navigasi dan layout utama. - Kuis di luar alur
laboratorium, jika sudah tersedia. - Progres belajar. - Penyimpanan
LocalStorage. - Identitas visual dan responsivitas aplikasi.

Sebelum mengedit: 1. Periksa struktur folder proyek. 2. Baca
package.json, konfigurasi Vite, routing, dan komponen terkait. 3.
Periksa implementasi laboratorium yang sudah ada. 4. Identifikasi
komponen dan layanan yang dapat digunakan kembali. 5. Buat rencana
perubahan singkat sebelum melakukan perubahan besar.

Jangan: - Membuat ulang proyek dari awal. - Mengganti framework atau
bahasa pemrograman. - Menghapus fitur yang sudah ada. - Mengubah desain
global tanpa kebutuhan. - Mengganti dependensi atau menambahkan library
besar tanpa alasan teknis. - Mengubah halaman selain yang diperlukan
untuk integrasi laboratorium. - Mengklaim fitur selesai jika baru berupa
tampilan atau data statis.
4. Teknologi dan Arsitektur
Ikuti teknologi yang telah digunakan proyek: - React. - Vite. -
JavaScript ES Modules. - CSS yang sudah digunakan proyek. - React Router
jika sudah diterapkan. - LocalStorage untuk progres dan data kegiatan
siswa.

Jangan memigrasikan proyek ke TypeScript, framework lain, backend,
database, autentikasi, atau layanan eksternal kecuali pengguna
memintanya.

Pisahkan tanggung jawab: - Komponen UI menangani tampilan dan
interaksi. - Service simulasi menangani logika pergerakan, tumbukan,
pembentukan produk, dan perhitungan indikator. - Service pengamatan
menangani validasi serta penyimpanan formulir. - Service progres
menangani status penyelesaian dan riwayat. - Modul data menyimpan
konfigurasi eksperimen dan pertanyaan kuis.

Hindari menempatkan seluruh logika simulasi di dalam satu komponen
React.
5. Spesifikasi Inti Laboratorium Virtual
5.1 Model Reaksi
Laboratorium memodelkan reaksi konseptual:

A + B → Produk

A dan B adalah simbol dua reaktan yang digunakan untuk pembelajaran
teori tumbukan. Model ini bukan representasi mekanisme dari suatu reaksi
kimia spesifik.

Ketentuan: - Partikel A dan B harus mudah dibedakan secara visual. -
Produk memiliki representasi visual berbeda dari reaktan. - Reaksi hanya
terjadi ketika partikel A dan B mengalami tumbukan yang memenuhi
kriteria efektif dalam model. - Ketika reaksi terjadi, partikel A dan B
yang bereaksi dikonversi menjadi produk sesuai aturan model. - Jumlah
reaktan dan produk harus diperbarui secara konsisten. - Jangan
menampilkan pembentukan produk hanya sebagai animasi dekoratif yang
tidak terhubung dengan perhitungan simulasi.
5.2 Variabel yang Dapat Diubah
Sediakan kontrol interaktif untuk:

Konsentrasi A - Dapat diubah secara independen dari konsentrasi B. -
Peningkatan konsentrasi direpresentasikan dengan peningkatan
jumlah/kepadatan partikel A pada volume simulasi yang sama. - Perubahan
harus memengaruhi peluang tumbukan A--B dalam model.

Konsentrasi B - Dapat diubah secara independen dari konsentrasi A. -
Peningkatan konsentrasi direpresentasikan dengan peningkatan
jumlah/kepadatan partikel B pada volume simulasi yang sama. - Perubahan
harus memengaruhi peluang tumbukan A--B dalam model.

Suhu - Tampilkan satuan suhu secara konsisten, misalnya °C. - Suhu
memengaruhi kecepatan gerak partikel dan parameter energi kinetik
model. - Suhu lebih tinggi harus direpresentasikan dengan gerak partikel
yang lebih cepat. - Model harus menjelaskan bahwa kenaikan suhu
meningkatkan energi kinetik rata-rata dan fraksi tumbukan yang memiliki
energi cukup untuk bereaksi.

Katalis - Bukan variabel wajib pada implementasi inti. - Tambahkan
hanya jika pengaruhnya dapat dimodelkan secara ilmiah dan dijelaskan
dengan benar. - Jangan menggambarkan katalis sebagai reaktan yang habis
atau menjadi produk. - Jangan membuat kontrol katalis yang tidak
memiliki pengaruh nyata terhadap simulasi.

Setiap kontrol harus memiliki label, nilai saat ini, rentang yang valid,
dan nilai default yang jelas.
5.3 Variabel Kontrol
Ketika siswa menguji satu faktor, variabel lain yang relevan harus tetap
pada nilai yang sama. Tampilkan dengan jelas: - Variabel yang sedang
dimanipulasi. - Variabel yang dikendalikan. - Nilai parameter yang
digunakan pada percobaan.

Sediakan kondisi pengujian yang adil. Misalnya, ketika menguji
konsentrasi A, pertahankan konsentrasi B, suhu, volume, dan durasi
pengamatan.
5.4 Visualisasi Mikroskopik
Area simulasi harus menampilkan: - Partikel A dan B yang bergerak. -
Perbedaan identitas partikel A, B, dan produk. - Peristiwa tumbukan
A--B. - Pembedaan tumbukan biasa dan tumbukan efektif. - Pembentukan
produk setelah tumbukan efektif. - Perubahan kepadatan partikel saat
konsentrasi diubah. - Perubahan kecepatan partikel saat suhu diubah.

Visualisasi harus dikendalikan oleh parameter simulasi. Jangan membuat
animasi yang hanya terlihat menarik tetapi tidak mewakili data atau
logika reaksi.

Jika orientasi tumbukan tidak dimodelkan, jelaskan keterbatasan
tersebut. Jangan mengklaim model telah mensimulasikan seluruh aspek
tumbukan molekuler jika implementasinya belum mendukung.
5.5 Data Simulasi
Tampilkan indikator secara terpisah dan dengan definisi yang jelas:
- Jumlah tumbukan A--B: jumlah peristiwa tumbukan yang terdeteksi
  selama simulasi.
- Frekuensi tumbukan: jumlah tumbukan A--B per interval waktu atau
  per satuan waktu.
- Jumlah tumbukan efektif: jumlah tumbukan yang memenuhi kriteria
  reaksi dalam model.
- Jumlah produk: jumlah produk yang terbentuk selama simulasi.
- Laju reaksi model: perubahan jumlah produk atau berkurangnya
  reaktan per satuan waktu sesuai definisi yang digunakan.
  Jangan menyamakan frekuensi tumbukan dengan jumlah tumbukan efektif atau
  laju reaksi. Berikan keterangan "hasil model" atau "nilai relatif"
  apabila data tidak memiliki satuan eksperimen fisik.
Semua angka harus berasal dari hasil simulasi aktual, bukan angka statis
yang tidak berubah ketika parameter diubah.
5.6 Grafik
Jika grafik disediakan: - Gunakan data simulasi aktual. - Berikan judul,
label sumbu, legenda, dan satuan/keterangan nilai relatif. - Gunakan
skala yang masuk akal. - Perbarui grafik ketika simulasi dijalankan
ulang dengan parameter berbeda. - Jangan menampilkan grafik dekoratif
yang tidak terhubung dengan data.
5.7 Kontrol Simulasi
Implementasikan fungsi: - Mulai. - Jeda. - Lanjutkan. - Ulangi dengan
parameter yang sama dari kondisi awal. - Reset parameter ke nilai
default.

Kontrol harus memiliki status yang tepat. Jeda harus menghentikan
pembaruan simulasi, bukan hanya menghentikan animasi visual sementara
penghitung tetap berjalan.
6. Formulir Data Pengamatan
Setelah siswa menjalankan simulasi, sediakan formulir pengamatan yang
meminta siswa mencatat dan menafsirkan hasil.

Formulir sekurang-kurangnya memuat:

Identitas dan parameter - Judul/ID percobaan. - Faktor yang diuji. -
Konsentrasi A. - Konsentrasi B. - Suhu. - Durasi simulasi.

Data kuantitatif - Jumlah tumbukan A--B. - Frekuensi tumbukan. -
Jumlah tumbukan efektif. - Jumlah produk. - Laju reaksi model.

Respons siswa - Catatan pengamatan. - Analisis hubungan variabel
dengan hasil simulasi. - Perbandingan hasil jika siswa melakukan lebih
dari satu percobaan. - Kesimpulan berdasarkan data.

Aturan formulir: - Gunakan label yang jelas dan satuan/keterangan nilai
yang sesuai. - Validasi kolom wajib dan format angka. - Tampilkan pesan
validasi yang spesifik. - Jangan mengisi analisis atau kesimpulan siswa
secara otomatis. - Izinkan siswa memeriksa dan mengedit isian sebelum
menyimpan. - Setelah disimpan, tampilkan ringkasan pengamatan. - Simpan
hasil pengamatan di LocalStorage. - Pisahkan data hasil mesin simulasi
dari catatan dan interpretasi siswa.
7. Kuis Interaktif Laboratorium
Kuis laboratorium harus berkaitan dengan simulasi dan data pengamatan
siswa.

Cakupan pertanyaan: - Pengaruh konsentrasi A terhadap tumbukan A--B. -
Pengaruh konsentrasi B terhadap tumbukan A--B. - Pengaruh suhu terhadap
gerak partikel. - Perbedaan frekuensi tumbukan dan tumbukan efektif. -
Hubungan tumbukan efektif dengan laju reaksi model. - Interpretasi tabel
atau grafik hasil simulasi. - Penarikan kesimpulan dari perbandingan
kondisi eksperimen.

Ketentuan soal: - Versi pertama menggunakan pilihan ganda dengan satu
jawaban benar. - Setiap soal memiliki ID, opsi, kunci, penjelasan, dan
tingkat kesulitan. - Simpan riwayat kuis pada LocalStorage.

7.1 Alur per soal (wajib tiga langkah terpisah)
Setiap soal melewati tiga tahap. Tahap tidak boleh digabung atau
dilewati.

1. Memilih. Siswa memilih satu opsi. Memilih hanya menandai opsi
   tersebut sebagai "dipilih". Siswa boleh mengganti pilihan
   sebanyak yang diinginkan selama belum dikirim.
2. Mengirim. Siswa menekan tombol "Periksa Jawaban" (atau "Kirim
   Jawaban"; pilih satu label dan gunakan konsisten). Hanya setelah
   tombol ini ditekan, jawaban dinilai dan feedback ditampilkan.
3. Melanjutkan. Setelah feedback tampil, siswa menekan tombol "Soal
   Berikutnya" (pada soal terakhir: "Lihat Hasil") untuk berpindah.

7.2 Aturan sebelum jawaban dikirim
- Memilih opsi tidak boleh memicu feedback, status Benar/Belum tepat,
  penanda kunci, perubahan warna benar/salah, atau penjelasan.
- Kunci jawaban dan penjelasan tidak boleh dirender ke DOM, class, atau
  atribut sebelum jawaban dikirim.
- Tombol "Periksa Jawaban" nonaktif selama belum ada opsi dipilih.
  Tampilkan petunjuk teks, misalnya "Pilih satu jawaban terlebih
  dahulu", dan jangan hanya mengandalkan tampilan tombol redup.
- Tombol "Soal Berikutnya" tidak tampil atau nonaktif sebelum jawaban
  dikirim. Siswa tidak dapat melewati soal tanpa mengirim jawaban.
- Opsi yang dipilih harus terlihat jelas dengan teks atau ikon, bukan
  hanya warna (contoh: tanda "Dipilih").

7.3 Aturan setelah jawaban dikirim
- Jawaban dikunci. Opsi tidak dapat diganti dan tombol "Periksa
  Jawaban" menjadi nonaktif atau hilang. Menekan tombol dua kali tidak
  boleh menghitung jawaban dua kali.
- Tampilkan umpan balik langsung pada soal yang sama.
- Jawaban benar: status "Benar", apresiasi singkat, dan alasan ilmiah.
- Jawaban salah: status "Belum tepat", penjelasan letak kekeliruan,
  opsi yang benar, dan konsep yang benar.
- Umpan balik tidak boleh hanya berupa perubahan warna atau ikon;
  wajib ada teks status dan penjelasan.
- Setelah feedback tampil, aktifkan "Soal Berikutnya". Tidak ada
  perpindahan otomatis ke soal berikutnya.
- Siswa tidak dapat kembali mengubah jawaban soal yang sudah dikirim.
- Untuk aksesibilitas: area feedback menggunakan aria-live (polite)
  dan fokus keyboard dipindahkan ke area feedback atau ke tombol
  "Soal Berikutnya" setelah jawaban dikirim.

7.4 Skor, penyelesaian, dan riwayat
- Skor dihitung hanya dari jawaban yang sudah dikirim, dengan rumus
  (jawaban benar / seluruh soal) x 100.
- Pilihan yang belum dikirim tidak dihitung dan tidak disimpan sebagai
  jawaban.
- Kuis dinyatakan selesai setelah semua soal dikirim dan siswa menekan
  "Lihat Hasil".
- Setelah selesai, tampilkan skor, jumlah benar/salah, dan pembahasan
  tiap soal. Sediakan tombol "Ulangi Kuis" yang mengembalikan semua
  soal ke tahap memilih.
- Simpan riwayat ke LocalStorage hanya saat kuis selesai, dengan
  jawaban yang dipilih, status benar/salah, skor, dan waktu selesai.
  Jika halaman dimuat ulang di tengah kuis, perilaku harus jelas:
  pulihkan posisi soal dan jawaban yang sudah dikirim, atau mulai
  ulang dengan pemberitahuan. Pilih satu dan jangan tampilkan keadaan
  ambigu.
8. Alur Belajar Laboratorium
Implementasikan alur berikut secara terhubung:
1. Siswa membuka Laboratorium Virtual.
2. Sistem menampilkan tujuan, petunjuk, dan model reaksi A + B →
   Produk.
3. Siswa mengatur konsentrasi A, konsentrasi B, dan suhu.
4. Siswa menjalankan simulasi.
5. Siswa mengamati gerak partikel, tumbukan, tumbukan efektif, produk,
   dan indikator data.
6. Siswa dapat menjeda, melanjutkan, atau mengulangi simulasi.
7. Siswa mengisi formulir data pengamatan.
8. Sistem memvalidasi dan menyimpan pengamatan.
9. Siswa memilih jawaban, lalu menekan "Periksa Jawaban" untuk
   mengirimnya.
10. Setelah jawaban dikirim, sistem menampilkan feedback (Benar /
    Belum tepat) beserta penjelasan. Siswa menekan "Soal Berikutnya"
    untuk melanjutkan.
11. Sistem menampilkan ringkasan kegiatan dan memperbarui progres siswa.
    Jangan mengizinkan status kegiatan dinyatakan selesai hanya karena
    halaman dibuka. Tentukan penyelesaian berdasarkan aktivitas yang
    benar-benar dilakukan, misalnya simulasi dijalankan, pengamatan
    disimpan, dan kuis diselesaikan.
12. Penyimpanan dan Model Data
    Gunakan LocalStorage sesuai pola penyimpanan proyek yang sudah ada.
    Pertahankan kunci penyimpanan lama jika memungkinkan agar progres
    sebelumnya tidak hilang.
Data yang perlu dikelola: - Parameter eksperimen. - Hasil simulasi. -
Data pengamatan siswa. - Jawaban kuis. - Skor dan riwayat kuis. - Status
penyelesaian kegiatan. - Waktu pembaruan.

Pisahkan objek hasil simulasi dari objek pengamatan siswa. Gunakan ID
unik dan stabil. Tangani data LocalStorage yang rusak, kosong, atau
tidak sesuai versi dengan aman. Jangan menyimpan data sensitif yang
tidak diperlukan.
10. UI/UX dan Aksesibilitas
Pertahankan identitas visual aplikasi yang sudah ada. Untuk halaman
laboratorium: - Buat hierarki yang jelas antara kontrol, area simulasi,
indikator data, grafik, formulir, dan kuis. - Hindari memenuhi layar
dengan terlalu banyak panel. - Gunakan tipografi yang mudah dibaca. -
Pastikan kontras memadai. - Gunakan ikon dan teks untuk memperjelas
status. - Jangan hanya mengandalkan warna untuk membedakan A, B, produk,
tumbukan, atau feedback. - Pastikan input memiliki label. - Pastikan
kontrol dapat digunakan dengan keyboard. - Berikan deskripsi tekstual
untuk grafik dan indikator penting. - Pastikan layout tetap nyaman pada
desktop, tablet, dan ponsel. - Cegah overflow horizontal yang tidak
diperlukan.

Animasi harus ringan, tidak menghambat interaksi, dan dapat dijeda.
11. Kualitas Ilmiah dan Validasi
Ketepatan kimia merupakan persyaratan utama.

Pastikan: - Konsentrasi A dan B dapat diubah secara terpisah. -
Konsentrasi yang lebih tinggi pada volume sama direpresentasikan dengan
kepadatan partikel yang lebih tinggi. - Suhu lebih tinggi
direpresentasikan dengan energi kinetik rata-rata dan kecepatan partikel
yang lebih tinggi. - Tidak semua tumbukan menghasilkan reaksi. -
Tumbukan efektif dibedakan dari tumbukan total. - Pembentukan produk
konsisten dengan aturan tumbukan efektif model. - Laju reaksi dihitung
berdasarkan perubahan jumlah produk/reaktan per waktu sesuai definisi. -
Variabel kontrol tidak berubah tanpa sengaja. - Data yang ditampilkan
konsisten dengan animasi dan parameter. - Semua penyederhanaan model
dijelaskan kepada siswa.

Jangan menyatakan simulasi sebagai hasil eksperimen nyata atau sebagai
prediksi kuantitatif reaksi kimia spesifik.
12. Standar Implementasi Kode
- Gunakan komponen yang kecil dan memiliki tanggung jawab jelas.
- Gunakan nama variabel dan fungsi yang deskriptif.
- Hindari duplikasi logika.
- Pisahkan perhitungan dari rendering.
- Bersihkan interval, animation frame, dan event listener ketika
  komponen dilepas atau simulasi dihentikan.
- Cegah beberapa loop animasi berjalan bersamaan.
- Pastikan reset benar-benar mengembalikan state simulasi dan
  penghitung.
- Hindari mutasi state React secara langsung.
- Tangani input kosong, nilai di luar rentang, dan nilai tidak valid.
- Jangan menambahkan dependensi tanpa kebutuhan.
- Jangan menaruh kredensial atau data rahasia di source code.
13. Pengujian Wajib
    Sebelum menyatakan pekerjaan selesai, lakukan pemeriksaan yang relevan.
Pengujian simulasi - Konsentrasi A dapat diubah tanpa mengubah nilai
B secara tidak sengaja. - Konsentrasi B dapat diubah tanpa mengubah
nilai A secara tidak sengaja. - Suhu memengaruhi kecepatan partikel. -
Jumlah tumbukan dan frekuensi tumbukan diperbarui. - Tumbukan efektif
dihitung terpisah dari tumbukan total. - Produk terbentuk hanya ketika
aturan efektif terpenuhi. - Jeda menghentikan simulasi. - Lanjutkan
meneruskan simulasi. - Ulangi memulai simulasi dari kondisi awal dengan
parameter yang sama. - Reset mengembalikan parameter default.

Pengujian pengamatan - Kolom wajib divalidasi. - Format input
diperiksa. - Data tersimpan setelah halaman dimuat ulang. - Ringkasan
menampilkan data yang sesuai. - Catatan siswa tidak tertimpa data
simulasi.

Pengujian kuis - Memilih opsi tidak memunculkan feedback, kunci, atau
penjelasan. - Pilihan dapat diganti sebelum dikirim. - Tombol "Periksa
Jawaban" nonaktif sebelum ada opsi dipilih. - Setelah "Periksa Jawaban",
jawaban benar memperoleh feedback benar. - Jawaban salah memperoleh
feedback salah, opsi benar, dan penjelasan. - Setelah dikirim, opsi
terkunci dan tidak dapat diganti. - Menekan "Periksa Jawaban" berulang
tidak menghitung dua kali. - "Soal Berikutnya" hanya aktif setelah
feedback tampil, dan tidak ada perpindahan otomatis. - Soal terakhir
menampilkan "Lihat Hasil". - Skor hanya dihitung dari jawaban yang
dikirim dan dihitung dengan benar. - Kuis dapat diselesaikan dan
diulang. - Riwayat tersimpan dan dapat dibaca kembali. - Alur dapat
dijalankan dengan keyboard saja (pilih, kirim, lanjut).

Pengujian aplikasi - Jalankan build atau pemeriksaan proyek yang
tersedia. - Periksa console dan terminal untuk error. - Pastikan
navigasi lama tetap berfungsi. - Pastikan dashboard, materi, dan progres
tidak rusak. - Uji tampilan desktop dan mobile.

Jangan mengklaim pengujian berhasil jika belum benar-benar dijalankan.
14. Alur Kerja Agent
Untuk setiap permintaan pengembangan:
1. Pahami permintaan pengguna dan tentukan batas perubahan.
2. Periksa file dan implementasi yang relevan.
3. Sampaikan rencana singkat jika perubahan menyentuh beberapa bagian.
4. Implementasikan perubahan sekecil mungkin tetapi lengkap.
5. Periksa integrasi dengan fitur yang sudah ada.
6. Jalankan pengujian yang relevan.
7. Perbaiki error yang ditemukan.
8. Laporkan file yang diubah, fitur yang selesai, hasil pengujian, dan
   keterbatasan yang masih ada.
   Jangan berhenti setelah membuat komponen atau tampilan. Pastikan
   interaksi, perhitungan, penyimpanan, dan alur pengguna benar-benar
   terhubung.
9. Format Laporan Penyelesaian
   Setelah tugas selesai, berikan laporan ringkas dengan format:
   - Ringkasan: perubahan yang dilakukan.
   - File diubah: daftar file yang dibuat atau dimodifikasi.
   - Perilaku fitur: cara kerja fitur setelah perubahan.
   - Pengujian: perintah dan pemeriksaan yang benar-benar dijalankan
     beserta hasilnya.
   - Catatan: asumsi, keterbatasan model, atau pekerjaan yang belum
     selesai.
     Jika ada bagian yang tidak dapat diselesaikan, nyatakan secara jujur dan
     jelaskan penyebabnya. Jangan menyatakan semua fitur selesai jika masih
     ada tombol, alur, atau perhitungan yang belum berfungsi.
     Instruksi Utama
     Kembangkan REAKSI LAB secara bertahap dengan mempertahankan aplikasi
     yang sudah ada. Untuk pekerjaan saat ini, fokuskan perubahan pada
     Laboratorium Virtual sesuai PRD terbaru: simulasi mikroskopik reaksi A +
     B, manipulasi konsentrasi A dan B serta suhu, data frekuensi tumbukan
     dan laju reaksi, formulir pengamatan, dan kuis interaktif dengan
     feedback benar/salah yang menjelaskan konsep.
Utamakan ketepatan kimia, konsistensi data, fungsi interaksi, pengalaman
belajar siswa, dan stabilitas aplikasi. Jangan melakukan perubahan di
luar ruang lingkup tanpa persetujuan pengguna.
16. Instruksi Khusus: Audit dan Perbaikan Animasi Partikel Laboratorium
Instruksi ini melengkapi bagian 3, 4, 5, 12, 13, dan 14. Terapkan hanya pada Laboratorium Virtual dan file dokumentasi yang berkaitan langsung. Jangan mengubah Dashboard, Materi, Kuis di luar alur laboratorium, navigasi utama, desain global, atau skema LocalStorage yang sudah berjalan.
16.1 Audit sebelum mengubah kode
Jangan menebak penyebab partikel tidak bergerak. Periksa implementasi aktual dan catat bukti berupa nama file, fungsi, state/ref, dependency, serta alur pemanggilan yang relevan.

Audit sekurang-kurangnya mencakup:
1. Komponen visual partikel (misalnya ParticleSimulation.jsx atau komponen aktual yang setara), termasuk apakah menggunakan Canvas, SVG, atau DOM.
2. Handler tombol Mulai, Jeda, Lanjutkan, Ulangi, dan Reset Parameter serta state status simulasi.
3. Service simulasi (misalnya simulationService.js): inisialisasi partikel, pembaruan posisi, batas area, deteksi tumbukan, klasifikasi tumbukan efektif, dan pembentukan produk.
4. Jalur data parameter konsentrasi A, konsentrasi B, dan suhu dari kontrol UI ke service dan renderer.
5. Mekanisme loop (requestAnimationFrame, setInterval, atau mekanisme aktual), lokasi penyimpanan frame ID, dan cara loop dimulai/dihentikan.
6. Penggunaan useEffect, dependency array, closure terhadap state, useRef, cleanup, serta kemungkinan stale state.
7. Apakah koordinat benar-benar berubah dan apakah perubahan tersebut dirender ke layar.
8. Apakah ada exception, nilai NaN, ukuran area nol/tidak terukur, kondisi early return, atau guard yang mencegah loop berjalan.
9. Apakah terdapat loop ganda, callback yang terus terjadwal setelah pause/unmount, atau callback lama yang masih menggunakan state usang.
10. Skrip/perintah test dan build yang tersedia pada package.json.
Sebelum mengedit, tulis diagnosis berbasis bukti. Jika sumber kode tidak tersedia, laporkan bahwa akar penyebab belum dapat dipastikan dan minta/identifikasi file yang dibutuhkan; jangan membuat klaim diagnosis.
16.2 Prinsip implementasi loop animasi
- Utamakan requestAnimationFrame untuk animasi browser jika sesuai dengan arsitektur yang ditemukan. Jangan mengganti mekanisme yang sudah benar tanpa alasan teknis.
- Satu instance simulasi hanya boleh memiliki satu animation loop aktif.
- Simpan frame ID pada useRef atau pengelola lifecycle yang setara, bukan pada state React yang memicu render setiap frame.
- Loop harus memeriksa status simulasi dan hanya menjadwalkan frame berikutnya ketika status berjalan.
- Gunakan timestamp dari callback requestAnimationFrame untuk menghitung deltaTime dalam detik. Batasi deltaTime maksimum secara wajar untuk menghindari lompatan posisi besar setelah tab tidak aktif atau frame tertunda.
- Perbarui posisi berdasarkan kecepatan dan deltaTime, bukan berdasarkan jumlah render/frame semata.
- Pastikan posisi dibatasi berdasarkan ukuran area aktual dan radius partikel. Pantulan membalik komponen kecepatan yang sesuai.
- Pastikan ukuran area simulasi sudah valid sebelum menghitung posisi; tangani kondisi area belum terukur atau berukuran nol dengan aman.
- Pisahkan fungsi inisialisasi, update gerak, deteksi tumbukan, resolusi/kriteria tumbukan, dan pembentukan produk dari komponen UI.
- Pastikan hasil update service menjadi sumber data yang sama bagi renderer dan metrik. Jangan membuat animasi dan penghitung berjalan dari dua simulasi terpisah.
- Jika menggunakan Canvas, gambar ulang berdasarkan posisi terbaru setiap frame. Jika menggunakan DOM/SVG, pastikan atribut posisi berasal dari koordinat aktual yang terus diperbarui.
- Hindari pembaruan state React untuk seluruh partikel pada setiap frame jika dapat menimbulkan render berlebihan. Gunakan useRef untuk data frame dan strategi render yang efisien; sinkronkan ke React state hanya status/indikator UI dengan frekuensi yang wajar.
16.3 Pengelolaan lifecycle dan status
- Mulai harus menginisialisasi keadaan awal satu kali dan memulai satu loop.
- Lanjutkan harus meneruskan keadaan terakhir tanpa membuat duplikasi loop atau menginisialisasi ulang partikel.
- Jeda harus membatalkan frame yang terjadwal dan membekukan posisi, waktu simulasi, serta metrik berbasis waktu.
- Ulangi harus membatalkan loop lama sebelum menginisialisasi ulang partikel dan penghitung. Jalankan ulang atau tunggu Mulai sesuai perilaku kontrol yang sudah ditetapkan pada UI/PRD; jangan menciptakan perilaku yang bertentangan.
- Reset Parameter harus membatalkan loop, mengembalikan parameter default, dan membersihkan kondisi sesi sesuai spesifikasi.
- Cleanup useEffect wajib membatalkan frame ID yang masih aktif ketika dependency berubah atau komponen unmount.
- Buat operasi start idempoten: pemanggilan ketika loop sudah aktif tidak boleh menjadwalkan loop kedua.
- Hindari closure usang. Gunakan ref untuk membaca state simulasi terkini dari callback animasi bila diperlukan, atau atur dependency dan lifecycle secara eksplisit.
- Jangan mengandalkan setState asynchronous sebagai satu-satunya sumber data fisika per-frame.
- Uji perilaku di React Strict Mode bila proyek mengaktifkannya, karena effect dapat mengalami siklus setup/cleanup tambahan pada mode pengembangan.
16.4 Parameter dan konsistensi simulasi
- Konsentrasi A dan B harus mengubah jumlah partikel jenis masing-masing secara independen pada area yang sama.
- Suhu harus mengubah skala kecepatan partikel secara nyata dan konsisten; perubahan label angka tanpa perubahan kecepatan tidak memenuhi spesifikasi.
- Tetapkan rentang parameter dan batas jumlah partikel untuk menjaga performa. Jangan mengubah nilai parameter lain tanpa instruksi.
- Tentukan perilaku perubahan parameter ketika simulasi berjalan: terapkan dengan rekonsiliasi partikel yang aman atau nyatakan bahwa parameter baru berlaku setelah restart. Jangan membiarkan UI menampilkan nilai yang tidak sesuai dengan keadaan simulasi.
- Deteksi tumbukan harus memakai posisi partikel. Cegah satu pasangan yang masih bersentuhan dihitung sebagai tumbukan baru pada setiap frame.
- Pembentukan produk hanya dilakukan oleh logika tumbukan efektif. Konsumsi reaktan dan pembaruan penghitung harus atomik/konsisten dalam satu langkah update.
- Jangan mengklaim orientasi molekuler dimodelkan jika kode tidak menerapkannya. Jelaskan penyederhanaan model pada UI/dokumentasi yang relevan.
16.5 Prosedur pengujian regresi animasi
Jalankan pengujian berikut pada aplikasi aktual dan catat hasil serta bukti yang tersedia:
1. Buka halaman Laboratorium Virtual.
2. Pastikan partikel A dan B terlihat sebelum simulasi dimulai.
3. Tekan tombol Mulai Simulasi satu kali.
4. Amati perubahan koordinat/posisi partikel pada beberapa frame berturut-turut; pastikan gerak berlanjut tanpa klik berulang.
5. Pastikan partikel memantul pada batas dan tidak keluar dari area.
6. Ubah suhu dengan parameter konsentrasi tetap; bandingkan kecepatan gerak partikel sebelum dan sesudah perubahan.
7. Ubah konsentrasi A; pastikan jumlah/kepadatan A berubah dan B tidak berubah tanpa alasan.
8. Ubah konsentrasi B; pastikan jumlah/kepadatan B berubah dan A tidak berubah tanpa alasan.
9. Amati tumbukan A–B; pastikan hitungan tidak bertambah berulang selama satu kontak yang sama.
10. Pastikan hanya tumbukan efektif yang menghasilkan produk dan jumlah reaktan/produk tetap konsisten.
11. Tekan Jeda; pastikan posisi, waktu, dan metrik berbasis waktu berhenti.
12. Tekan Lanjutkan; pastikan gerak meneruskan posisi terakhir.
13. Tekan Ulangi; pastikan posisi, arah, jumlah partikel, waktu, dan penghitung kembali ke kondisi awal dengan parameter yang sama.
14. Tekan Reset Parameter; pastikan semua parameter kembali ke default dan simulasi berhenti/siap sesuai desain.
15. Tekan Mulai berulang kali dengan cepat; pastikan hanya satu loop berjalan.
16. Navigasikan keluar dari halaman saat animasi berjalan; pastikan cleanup membatalkan frame dan tidak ada error setelah unmount.
17. Periksa console dan terminal untuk error/warning yang relevan.
18. Jalankan test/build/lint yang memang tersedia di proyek. Jangan mengarang perintah atau hasil.
Jika memungkinkan, tambahkan unit test untuk fungsi service (update posisi, pantulan batas, pemetaan suhu-kecepatan, rekonsiliasi jumlah partikel, dan pencegahan hitung ganda tumbukan). Untuk loop browser, gunakan pengujian komponen atau pemeriksaan manual yang sesuai dengan setup proyek; jangan menambah dependensi hanya untuk memenuhi daftar ini.
16.6 Bukti diagnosis dan laporan wajib
Laporan akhir harus membedakan:
- Temuan terverifikasi: didukung oleh kode/log/test yang benar-benar diperiksa.
- Perubahan yang dilakukan: file dan fungsi yang dimodifikasi serta alasan teknisnya.
- Hasil pengujian: tuliskan skenario, hasil lulus/gagal/tidak dijalankan, dan perintah aktual.
- Belum terverifikasi: hal yang tidak dapat dipastikan karena keterbatasan source code, browser, atau lingkungan.
Jangan menyatakan bug selesai hanya karena tombol berubah status atau partikel tampak bergerak sesaat. Buktikan bahwa koordinat berubah kontinu, parameter terhubung ke model, kontrol menghentikan/meneruskan keadaan yang benar, dan tidak ada loop ganda.
