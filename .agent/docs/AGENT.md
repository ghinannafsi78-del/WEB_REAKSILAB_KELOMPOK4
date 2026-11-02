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
3. Batasan Perubahan Proyek
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

Ketentuan: - Versi pertama menggunakan pilihan ganda dengan satu jawaban
benar. - Setiap soal memiliki opsi, kunci, penjelasan, dan tingkat
kesulitan. - Siswa harus mengirim jawaban sebelum kunci ditampilkan. -
Setelah dikirim, tampilkan umpan balik langsung. - Jawaban benar
menampilkan status "Benar", apresiasi singkat, dan alasan ilmiah. -
Jawaban salah menampilkan status "Belum tepat", penjelasan kekeliruan,
dan konsep yang benar. - Umpan balik tidak boleh hanya berupa perubahan
warna atau ikon. - Siswa dapat melanjutkan ke soal berikutnya setelah
feedback muncul. - Setelah kuis selesai, tampilkan skor, jumlah
benar/salah, dan pembahasan. - Sediakan opsi mengulang kuis. - Simpan
riwayat kuis pada LocalStorage.
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
9. Siswa mengerjakan kuis berdasarkan konsep dan hasil pengamatan.
10. Sistem memberikan feedback untuk setiap jawaban.
11. Sistem menampilkan ringkasan kegiatan dan memperbarui progres siswa.
Jangan mengizinkan status kegiatan dinyatakan selesai hanya karena
halaman dibuka. Tentukan penyelesaian berdasarkan aktivitas yang
benar-benar dilakukan, misalnya simulasi dijalankan, pengamatan
disimpan, dan kuis diselesaikan.
9. Penyimpanan dan Model Data
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

Pengujian kuis - Jawaban benar memperoleh feedback benar. - Jawaban
salah memperoleh feedback salah dan penjelasan. - Skor dihitung dengan
benar. - Kuis dapat diselesaikan dan diulang. - Riwayat tersimpan dan
dapat dibaca kembali.

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
15. Format Laporan Penyelesaian
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