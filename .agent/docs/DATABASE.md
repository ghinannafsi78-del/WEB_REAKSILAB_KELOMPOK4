# DATABASE.md: kontrak jawaban dan akses

# Database Hasil Belajar REAKSI LAB

## Kedudukan dokumen dan rujukan

- Dokumen ini adalah kontrak penyimpanan hasil belajar ke cloud. Berlaku bersama PRD.md dan AGENT.md.
- Urutan prioritas mengikuti AGENT §2: instruksi pengguna terbaru, PRD.md, AGENT.md, DATABASE.md, pola proyek yang sudah berjalan.
- **Perubahan ruang lingkup:** PRD §5 menyatakan login, database/backend, dan sinkronisasi antarperangkat di luar ruang lingkup versi pertama. AGENT §4 melarang backend, autentikasi, dan layanan eksternal kecuali pengguna memintanya. Dokumen ini adalah permintaan eksplisit tersebut. **Sebelum implementasi, tambahkan bagian "Hasil Belajar Cloud" ke PRD.md** yang merujuk dokumen ini, dan perbarui daftar "Di Luar Ruang Lingkup" PRD §5.
- Yang tidak berubah (PRD §13, AGENT §3 dan §9): LocalStorage tetap penyimpanan utama; kunci `reaksi-lab-progress` dan skemanya dipertahankan; mode tamu berjalan penuh tanpa akun; Dashboard, Materi, navigasi, dan desain global tidak diubah.

| Hal | Rujukan |
| :--- | :--- |
| Model data hasil simulasi, pengamatan, kuis, progres | PRD §11 |
| Formulir dan validasi pengamatan | PRD §8.11, FR-13, FR-14; AGENT §6 |
| Alur kuis (pilih, periksa, lanjut), skor, riwayat | PRD §8.12, §10, FR-15 sampai FR-18; AGENT §7.1 sampai §7.4 |
| Aturan penyelesaian kegiatan | AGENT §8 |
| LocalStorage, penanganan data rusak | PRD §13, FR-20, FR-21; AGENT §9 |
| Privasi dan data sensitif | PRD §16; AGENT §9, §12 |
| Pengujian dan laporan | AGENT §13, §15 |

## Lingkup dan pengelola

- Satu materi / label kelas / ID produk: Laju Reaksi / Kimia kelas XI SMA/MA / `reaksi-lab` (PRD §1)
- Provider: **Firebase Auth + Firestore (utama)**; Supabase Auth + Postgres RLS (alternatif, aturan akses sama).
- Nama/ID project dan pengelola:
  - Project ID: `[isi]` (boleh dicatat untuk penelusuran)
  - Pengelola: `[isi]`
- Akun guru tunggal dan cara penetapan ID pada rules/konfigurasi terlindungi:
  - Satu akun guru. UID guru disimpan di dokumen `config/roles` (field `teacherUid`), hanya dapat diubah lewat Console provider.
  - Klien tidak dapat menulis `config/*`. UID tidak ditulis di source code.
- Daftar ID siswa melalui dashboard; tidak ada administrasi banyak kelas:
  - Pengelola menambah `roster/{uid}` berisi `{ alias, active }` lewat Console. `alias` berupa kode siswa (contoh `XI-01`), bukan nama lengkap (PRD §16).
  - Satu kelas, satu guru. Tidak ada koleksi kelas.

## Sumber data

- Materi, soal, tag konsep, kunci, dan pembahasan: **`src/data`** (`modules.js`, `experiments.js`, `quizQuestions.js`; PRD §12 dan §13). Kunci dan pembahasan tidak disimpan di cloud.
- Versi bank soal yang dipertahankan untuk riwayat lama:
  - `quizQuestions.js` memuat konstanta `QUESTION_BANK_VERSION` (contoh `"qb-2026-11-03"`). Naikkan versi setiap soal, opsi, atau kunci berubah.
  - Versi lama diarsipkan di `src/data/archive/qb-<versi>.js` agar guru dapat mencocokkan jawaban lama dengan kunci saat itu.
  - Hasil simulasi membawa `modelVersion` dari `simulationService.js` (PRD §11, "Hasil Simulasi").
  - Soal memakai ID stabil (PRD §11 "Pertanyaan Kuis"); judul bukan identitas.
- Draf/jawaban/progres/antrean lokal, namespace per akun/tamu:

  | Data | Kunci LocalStorage |
  | :--- | :--- |
  | Progres tamu (kunci lama, tidak diubah) | `reaksi-lab-progress` |
  | Progres akun | `reaksi-lab-progress:u:<uid>` |
  | Draf formulir pengamatan | `reaksi-lab-draft:<uid atau guest>:<experimentId>` |
  | Keadaan kuis yang sedang berjalan (opsional, AGENT §7.4) | `reaksi-lab-quizstate:<uid atau guest>:<activityId>` |
  | Antrean kirim | `reaksi-lab-queue:u:<uid>` |

  Keadaan kuis yang sedang berjalan hanya lokal dan **tidak pernah dikirim ke cloud**. Pilihan yang belum dikirim dengan "Periksa Jawaban" tidak disimpan sebagai jawaban (AGENT §7.4).
- Profil minimum: ID provider (`uid`) dan `alias` dari `roster`. Tidak ada email, nomor telepon, atau data pribadi lain di dokumen hasil (PRD §16).
- Riwayat, koleksi `results/{attemptId}`: `id`, `ownerId`, `alias`, `moduleId`, `activityId`, `questionVersion`, `kind`, `answers` (peta ID soal ke pilihan/isian), `score`, `completedAt`, `receivedAt`.
  - `kind`: `quiz` | `lab-observation` | `module-complete`.
  - `activityId`: ID kategori kuis, atau `experimentId` untuk lab.
  - `quiz` menambah `totalQuestions`, `correctAnswers`, `incorrectAnswers` (PRD §11 "Riwayat Kuis"). Dokumen hanya dibuat saat kuis selesai (semua soal sudah dikirim dan siswa menekan "Lihat Hasil"; AGENT §7.4). Karena itu `answers` selalu berisi satu entri per soal.
  - `lab-observation` menambah field `simulation` (data mesin), **terpisah** dari `answers` (isian siswa) sesuai PRD §11 dan AGENT §6/§9.
- Progres cloud diturunkan dari riwayat, bukan satu skor yang saling menimpa. `completedModules`, `completedExperiments`, `completedObservations`, `quizAttempts` (PRD §11 "Progres Siswa") dihitung dari `results` milik `ownerId`. Tidak ada dokumen progres tunggal di cloud.
- Penyelesaian kegiatan ditentukan oleh aktivitas nyata (AGENT §8): simulasi dijalankan, pengamatan tersimpan valid, kuis diselesaikan. Membuka halaman tidak menghasilkan dokumen hasil.

### Pemetaan ke model data PRD §11

| Field `results` | Sumber di PRD §11 |
| :--- | :--- |
| `kind=quiz`, `answers`, `score`, `totalQuestions`, `correctAnswers`, `incorrectAnswers`, `activityId` (kategori) | Riwayat Kuis: `category`, `answers`, `score`, `totalQuestions`, `correctAnswers`, `incorrectAnswers` |
| `kind=lab-observation`, `answers.*` | Data Pengamatan Siswa: `trialNumber`, `recorded*`, `observationNotes`, `analysis`, `conclusion` |
| `simulation.*` | Hasil Simulasi: `parameters`, `duration`, `collisionCount`, `collisionFrequency`, `effectiveCollisionCount`, `productCount`, `reactionRate`, `modelVersion` |
| `kind=module-complete` | Progres: `completedModules` |

### Contoh: kuis

`results/att_20261103_8f3a2c`

```json
{
  "id": "att_20261103_8f3a2c",
  "ownerId": "uid_siswaA",
  "alias": "XI-01",
  "moduleId": "mod-2-faktor",
  "activityId": "quiz-faktor-laju",
  "questionVersion": "qb-2026-11-03",
  "kind": "quiz",
  "answers": { "q-faktor-001": 2, "q-faktor-002": 0, "q-faktor-003": 3 },
  "totalQuestions": 3,
  "correctAnswers": 2,
  "incorrectAnswers": 1,
  "score": 66.7,
  "completedAt": "2026-11-03T08:14:22.000Z",
  "receivedAt": "<serverTimestamp>"
}
```

`answers` berisi indeks opsi yang dikirim siswa per ID soal. Kunci jawaban tidak disimpan; guru mencocokkannya dengan `questionVersion`. `score` = (jawaban benar / seluruh soal) × 100, rentang 0 sampai 100 (PRD §10).

### Contoh: pengamatan lab

`results/att_20261103_c91b77`

```json
{
  "id": "att_20261103_c91b77",
  "ownerId": "uid_siswaA",
  "alias": "XI-01",
  "moduleId": "mod-2-faktor",
  "activityId": "exp-ab-temperature",
  "questionVersion": "qb-2026-11-03",
  "kind": "lab-observation",
  "answers": {
    "trialNumber": 2,
    "recordedCollisionCount": 148,
    "recordedCollisionFrequency": 9.9,
    "recordedEffectiveCollisionCount": 21,
    "recordedProductCount": 21,
    "recordedReactionRate": 1.4,
    "observationNotes": "Partikel bergerak lebih cepat pada 60 °C.",
    "analysis": "Frekuensi tumbukan naik sedikit, tumbukan efektif naik lebih banyak.",
    "conclusion": "Kenaikan suhu menaikkan fraksi tumbukan efektif."
  },
  "simulation": {
    "simulationResultId": "sim_20261103_1d40e5",
    "modelVersion": "sim-1.0",
    "parameters": { "concA": 20, "concB": 20, "tempC": 60 },
    "duration": 15,
    "collisionCount": 148,
    "collisionFrequency": 9.9,
    "effectiveCollisionCount": 21,
    "productCount": 21,
    "reactionRate": 1.4
  },
  "score": null,
  "completedAt": "2026-11-03T08:31:05.000Z",
  "receivedAt": "<serverTimestamp>"
}
```

Semua nilai simulasi adalah nilai relatif/hasil model, bukan data eksperimen nyata (PRD §8.6, AGENT §5.5). Isian siswa tidak diisi otomatis dan tidak ditimpa data mesin (PRD §8.11).

## Akses dan aturan

- Tamu/akun di luar daftar: belajar lokal, tidak membaca/menulis hasil cloud. Tanpa `roster/{uid}` aktif, semua akses `results` ditolak.
- Siswa kelas: buat hasil sendiri dan baca riwayat sendiri.
- Guru tunggal: baca hasil kelas; jawaban asli dipertahankan. Guru tidak menulis ke `results`.
- Pengelola dashboard: menetapkan guru/daftar siswa dan prosedur penghapusan (lewat Console, bukan klien).
- Aturan memvalidasi pemilik, alias anggota, field/tipe data, dan waktu terima.
- ID percobaan tetap; kirim ulang tidak menduplikasi; hasil diterima tidak ditimpa. ID dibuat klien satu kali saat kegiatan selesai, disimpan di antrean, dan dipakai sebagai ID dokumen. Hanya `create` yang diizinkan.
- Tidak menyimpan password, kredensial admin, atau hasil siswa dalam repo (PRD §16, AGENT §12).

### Sketsa Firestore rules (belum diterbitkan; uji di emulator dulu)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function signedIn() { return request.auth != null; }
    function isTeacher() {
      return signedIn() &&
        request.auth.uid == get(/databases/$(db)/documents/config/roles).data.teacherUid;
    }
    function rosterEntry() {
      return get(/databases/$(db)/documents/roster/$(request.auth.uid)).data;
    }
    function isStudent() {
      return signedIn() &&
        exists(/databases/$(db)/documents/roster/$(request.auth.uid)) &&
        rosterEntry().active == true;
    }
    function validCommon(attemptId) {
      let d = request.resource.data;
      return d.keys().hasOnly([
          'id','ownerId','alias','moduleId','activityId','questionVersion','kind',
          'answers','score','completedAt','receivedAt','simulation',
          'totalQuestions','correctAnswers','incorrectAnswers'
        ])
        && d.id == attemptId
        && d.ownerId == request.auth.uid
        && d.alias == rosterEntry().alias
        && d.kind in ['quiz','lab-observation','module-complete']
        && d.moduleId is string
        && d.activityId is string
        && d.questionVersion is string
        && d.answers is map
        && (d.score == null || (d.score is number && d.score >= 0 && d.score <= 100))
        && d.completedAt is string
        && d.receivedAt == request.time;
    }
    function validQuiz() {
      let d = request.resource.data;
      return d.kind != 'quiz' || (
        d.totalQuestions is int && d.totalQuestions > 0
        && d.correctAnswers is int && d.incorrectAnswers is int
        && d.correctAnswers + d.incorrectAnswers == d.totalQuestions
        && d.answers.size() == d.totalQuestions
        && d.score is number
      );
    }

    match /config/{doc} { allow read, write: if false; }
    match /roster/{uid} {
      allow read: if signedIn() && (request.auth.uid == uid || isTeacher());
      allow write: if false;
    }
    match /results/{attemptId} {
      allow read: if isTeacher() ||
                     (isStudent() && resource.data.ownerId == request.auth.uid);
      allow create: if isStudent() && validCommon(attemptId) && validQuiz();
      allow update, delete: if false;
    }
  }
}
```

## Sinkronisasi

- Kapan hasil tamu ditawarkan untuk dimasukkan ke akun: setelah login berhasil dan UID ada di `roster`, jika `reaksi-lab-progress` berisi riwayat kuis/pengamatan. Siswa memilih "Masukkan ke akun saya" atau "Biarkan lokal". Tidak otomatis. Salinan tamu tidak dihapus sebelum semua item berstatus Terkirim.
- Kapan antrean dicoba dan cara menjaga pemilik saat akun berganti:
  - Dicoba saat aplikasi dibuka dengan sesi aktif, setelah login, pada event `online`, dan setelah item baru masuk antrean. Tanpa polling terus-menerus.
  - Item masuk antrean hanya saat kegiatan selesai: kuis setelah "Lihat Hasil" (AGENT §7.4), pengamatan setelah "Simpan Pengamatan" valid (PRD §8.9).
  - Tiap item menyimpan `ownerId` saat dibuat dan hanya dikirim bila `auth.uid === ownerId`. Item akun lain tidak dikirim dan tidak dihapus.
- Arti status dan bukti konfirmasi server:

  | Status | Arti | Bukti |
  | :--- | :--- | :--- |
  | Lokal | Di perangkat; tamu atau belum diantrekan | Tidak ada |
  | Menunggu kirim | Di antrean akun, belum dikonfirmasi | Tidak ada |
  | Terkirim | Server menerima dan dokumen terbaca ulang | `receivedAt` dari server terisi dan `ownerId` sama |
  | Gagal | Ditolak aturan, data tidak valid, atau jaringan gagal berulang | Kode error terakhir pada item antrean |

  Jika kirim ulang menghasilkan "sudah ada", klien membaca dokumen; bila `ownerId` sama, item dianggap Terkirim tanpa dokumen kedua.
- Penanganan refresh, logout, storage gagal, reset lokal, dan data cloud:
  - Refresh: antrean dan draf dimuat dari LocalStorage, item menunggu dilanjutkan. Kuis di tengah jalan mengikuti perilaku yang dipilih di AGENT §7.4 (pulihkan jawaban yang sudah dikirim, atau mulai ulang dengan pemberitahuan).
  - Logout: namespace akun dibiarkan; sesi tamu tidak membaca namespace akun.
  - Storage gagal atau data rusak: tampilkan pesan jelas dan aplikasi tetap berjalan (PRD FR-21, AGENT §9).
  - Reset lokal ("Atur ulang progres", PRD §5): hanya menghapus data lokal; beri peringatan jika ada item belum terkirim. Data cloud tidak terhapus.
  - Data cloud diubah/dihapus hanya oleh pengelola.

## Konfigurasi dan hasil uji

- Nama variabel tanpa nilai (`.env.example` hanya berisi nama; `.env.local` tidak masuk repo):

  ```
  VITE_FIREBASE_API_KEY=
  VITE_FIREBASE_AUTH_DOMAIN=
  VITE_FIREBASE_PROJECT_ID=
  VITE_FIREBASE_APP_ID=
  ```

- Domain login/redirect: lokal `localhost:[isi port Vite]`; produksi `[isi domain]`. Keduanya didaftarkan di Authorized domains.
- Identitas aturan/policy yang benar-benar diterbitkan: `[isi ID rilis/commit/tanggal]` (belum diterbitkan)

| Lingkungan/commit/penguji | Skenario | Aktual/bukti | Status/issue |
| :--- | :--- | :--- | :--- |
| Node/Vite/CI/Agent | Siswa A kirim/baca hasil sendiri | Hasil disimpan di antrean reaksi-lab-queue:u:uid dan terkirim ke results/{id} dengan ownerId = uid siswa | LULUS (test-firebase-integration.cjs Skenario 4) |
| Node/Vite/CI/Agent | Siswa A mengakses hasil B | Ditolak oleh firestore.rules (ownerId == request.auth.uid) dan isolasi namespace antrean | LULUS (test-firebase-integration.cjs Skenario 1, 5) |
| Node/Vite/CI/Agent | Guru membaca per butir dan ringkasan | Dasbor guru mengambil hasil kelas dan mencocokkan jawaban per butir soal via resultService & TeacherDashboard | LULUS (test-firebase-integration.cjs Skenario 6) |
| Node/Vite/CI/Agent | Tamu/akun di luar daftar ditolak | Akun tanpa roster/{uid} aktif ditolak rules dan dialihkan ke mode lokal oleh authService | LULUS (test-firebase-integration.cjs Skenario 1) |
| Node/Vite/CI/Agent | Putus koneksi, refresh, pulih, kirim ulang | Antrean disimpan di LocalStorage; diproses otomatis pada event online | LULUS (test-firebase-integration.cjs Skenario 4) |
| Node/Vite/CI/Agent | Kirim ulang ID sama tidak menduplikasi | syncService memeriksa dokumen sebelum menulis ulang; rules melarang update | LULUS (test-firebase-integration.cjs Skenario 4) |
| Node/Vite/CI/Agent | Update/hapus hasil yang sudah diterima ditolak | firestore.rules menetapkan allow update, delete: if false (create-only) | LULUS (test-firebase-integration.cjs Skenario 1) |
| Node/Vite/CI/Agent | Ganti akun: antrean akun lama tidak terkirim sebagai akun baru | syncService hanya mengirim item yang ownerId-nya cocok dengan current auth.uid | LULUS (test-firebase-integration.cjs Skenario 5) |
| Node/Vite/CI/Agent | Kuis: dokumen hanya dibuat setelah "Lihat Hasil"; pilihan yang belum dikirim tidak tersimpan | QuizPage 3-stage flow hanya memicu enqueueResult saat tombol Lihat Hasil ditekan pada soal terakhir | LULUS (test-firebase-integration.cjs Skenario 2) |
| Node/Vite/CI/Agent | Kuis: `answers.size() == totalQuestions` dan skor sesuai rumus; data tidak konsisten ditolak | validQuiz() pada rules dan QuizPage memastikan size = 4 dan skor = (benar/total)*100 | LULUS (test-firebase-integration.cjs Skenario 2) |
| Node/Vite/CI/Agent | Pengamatan: `answers` tidak tertimpa `simulation` | ObservationForm dan syncService memisahkan objek answers dan simulation secara independen | LULUS (test-firebase-integration.cjs Skenario 3) |
| Node/Vite/CI/Agent | Mode tamu tetap berfungsi; progres lama `reaksi-lab-progress` tetap terbaca | Mode tamu beroperasi 100% tanpa Firebase env; kunci reaksi-lab-progress dipertahankan | LULUS (test-firebase-integration.cjs Skenario 4, 7) |
| Node/Vite/CI/Agent | Build lulus; Dashboard, Materi, Progres tidak rusak | tsc -b && vite build sukses (0 error), oxlint 0 warnings/errors | LULUS (Vite build dist: 83 modules, 549ms) |

Jangan menandai LULUS tanpa bukti (log emulator, hasil terbaca, atau ID commit). Laporan akhir mengikuti AGENT §15.

## Aturan untuk coding agent

- Tambahkan `src/services/syncService.js` untuk antrean dan kirim (logika terpisah dari komponen UI; PRD §13, AGENT §4). `progressService.js` dan `observationService.js` tidak diubah skemanya, hanya dipanggil.
- Jangan mengubah skema LocalStorage yang sudah berjalan; data baru memakai kunci ber-namespace di atas.
- Jangan mengubah alur kuis (pilih, periksa, lanjut) di AGENT §7. Sinkronisasi hanya dipicu setelah kuis selesai.
- Impor SDK provider hanya di satu modul (contoh `src/services/cloudClient.js`) agar mudah diganti ke alternatif. Jangan menambah dependensi lain.
- Fitur cloud nonaktif secara aman bila variabel konfigurasi kosong; aplikasi kembali ke mode lokal penuh.
- Jangan menaruh key, token, atau data siswa nyata di source code, dokumen, atau log.

## Batas dan tindak lanjut

- Skor client dapat diperiksa/diubah; guru mencocokkan jawaban dengan versi soal. `answers` adalah sumber kebenaran, `score` hanya ringkasan. Angka `simulation` dari mesin klien juga dapat diubah, sehingga data ini adalah catatan belajar, bukan alat penilaian resmi.
- Pembukaan pertama offline, sinkron draf lintas perangkat, dan ujian khusus: lanjut.
- Pilihan perangkat bersama, waktu penyimpanan, serta prosedur penghapusan data: **belum diputuskan**. Pengelola perlu menetapkan (1) apakah perangkat bersama diizinkan (jika ya, logout membersihkan namespace akun di perangkat itu), (2) lama penyimpanan hasil, dan (3) prosedur penghapusan data siswa atas permintaan.
- Project ID boleh dicatat untuk penelusuran. Jangan menyalin nilai key, token sesi, password, service account, data siswa nyata, atau header autentikasi ke dokumen.
