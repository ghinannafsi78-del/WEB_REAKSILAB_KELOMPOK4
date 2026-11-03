# Panduan Konfigurasi Firebase REAKSI LAB

Dokumen ini memandu pengelola / guru dalam menyiapkan backend Cloud Firestore dan Firebase Authentication untuk integrasi hasil belajar REAKSI LAB.

---

## 1. Pembuatan Proyek di Firebase Console

1. Buka [Firebase Console](https://console.firebase.google.com/) dan masuk menggunakan akun Google Anda.
2. Klik **Add project** (Tambah proyek), beri nama proyek (misal: `reaksi-lab-sma`), dan selesaikan pembuatan proyek.
3. Daftarkan Web App:
   - Pada halaman ringkasan proyek, klik ikon **Web** (`</>`).
   - Masukkan App nickname (contoh: `REAKSI LAB Web`).
   - Salin objek konfigurasi `firebaseConfig`.

---

## 2. Pengaturan Variabel Lingkungan (`.env.local`)

Buat file baru bernama `.env.local` di root folder proyek (sejajar dengan `package.json`), lalu salin nilai konfigurasi dari langkah sebelumnya:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=reaksi-lab-sma.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=reaksi-lab-sma
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_STORAGE_BUCKET=reaksi-lab-sma.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
```

> **Catatan Keamanan:** File `.env.local` telah diabaikan oleh `.gitignore`. Jangan pernah mengunggah file ini ke repositori publik.

---

## 3. Mengaktifkan Firebase Authentication

1. Di menu navigasi Firebase Console, pilih **Build** > **Authentication**.
2. Klik **Get started**, lalu pilih tab **Sign-in method**.
3. Aktifkan penyedia **Email/Password** (Email/Kata Sandi).
4. Buat akun pertama untuk Guru dan Siswa di tab **Users**:
   - Contoh Guru: `guru.kimia@sekolah.sch.id`
   - Contoh Siswa: `siswa01@sekolah.sch.id`
5. Catat UID masing-masing pengguna yang baru dibuat untuk langkah berikutnya.

---

## 4. Mengaktifkan Cloud Firestore dan Menetapkan Aturan (`firestore.rules`)

1. Di menu navigasi, pilih **Build** > **Firestore Database**.
2. Klik **Create database**, pilih lokasi server terdekat (misal: `asia-southeast2` Jakarta), lalu pilih mode **Production**.
3. Buka tab **Rules**, salin seluruh isi file [`firestore.rules`](./firestore.rules) dari repositori ini, dan klik **Publish**.

---

## 5. Menyiapkan Koleksi Guru dan Roster Siswa

Sesuai spesifikasi `DATABASE.md`, struktur Firestore dikelola melalui Firebase Console:

### A. Dokumen Peran Guru (`config/roles`)

1. Pada Cloud Firestore, klik **Start collection**.
2. Collection ID: `config`
3. Document ID: `roles`
4. Tambahkan field:
   - Field: `teacherUid`
   - Type: `string`
   - Value: `<UID akun guru yang dicatat pada Langkah 3>`
5. Klik **Save**.

### B. Koleksi Siswa (`roster`)

Untuk setiap siswa yang diizinkan mengakses cloud:
1. Klik **Start collection** (atau tambah dokumen pada koleksi `roster` jika sudah ada).
2. Collection ID: `roster`
3. Document ID: `<UID siswa dari Firebase Auth>`
4. Tambahkan field:
   - Field `alias` (string): kode siswa (misal: `"XI-01"`).
   - Field `active` (boolean): `true`.
5. Klik **Save**.

> **Privasi Siswa:** Sesuai PRD §16, jangan gunakan nama lengkap siswa pada field `alias` untuk menjaga privasi.

---

## 6. Verifikasi Alur Aplikasi

1. **Mode Tamu:** Buka aplikasi tanpa login. Siswa dapat menjalankan seluruh simulasi laboratorium, mengisi formulir pengamatan, dan mengerjakan kuis dengan penyimpanan lokal browser.
2. **Login Siswa:** Klik tombol **Masuk** di navigasi kanan atas. Masukkan email & password siswa. Jika UID terdaftar pada `roster` dan `active: true`, siswa memperoleh status **Siswa Terdaftar** dan setiap kuis/pengamatan akan otomatis diantrekan serta disinkronkan ke Firestore.
3. **Login Guru:** Masuk dengan akun guru yang UID-nya terdaftar di `config/roles`. Menu **Dasbor Guru** akan otomatis muncul pada navigasi untuk memantau ringkasan kelas dan detail jawaban setiap siswa.

