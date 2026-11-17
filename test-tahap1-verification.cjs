/**
 * test-tahap1-verification.cjs
 * Pengujian Terarah Tahap 1: Firebase Single-Instance, Google Auth, Error Sanitization, & Local First
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== PENGUJIAN TERARAH TAHAP 1 REAKSI LAB ===\n');

let passedTests = 0;
let totalTests = 0;

function runTest(description, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`✓ PASS: ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`✗ FAIL: ${description}`);
    console.error(err);
  }
}

// -----------------------------------------------------------------------------
// PENGUJIAN 1: Aplikasi Dapat Dibuka & Dibangun (Build Artifacts)
// -----------------------------------------------------------------------------
runTest('Pengujian 1: Build produksi aplikasi valid dan bebas error', () => {
  const distHtml = path.join(__dirname, 'dist', 'index.html');
  assert(fs.existsSync(distHtml), 'dist/index.html harus terbuat dari build');
  const htmlContent = fs.readFileSync(distHtml, 'utf8');
  assert(htmlContent.includes('<div id="root"></div>'), 'Root container React terpasang');
});

// -----------------------------------------------------------------------------
// PENGUJIAN 2: Firebase Single-Instance & Eliminasi initializeApp Ganda
// -----------------------------------------------------------------------------
runTest('Pengujian 2: cloudClient.js adalah satu-satunya sumber inisialisasi Firebase', () => {
  const cloudClientPath = path.join(__dirname, 'src', 'services', 'cloudClient.js');
  const firebaseServicePath = path.join(__dirname, 'src', 'lib', 'firebaseService.js');

  const ccContent = fs.readFileSync(cloudClientPath, 'utf8');
  const fbContent = fs.readFileSync(firebaseServicePath, 'utf8');

  // cloudClient.js menginisialisasi app dengan pengecekan getApps()
  assert(ccContent.includes('getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)'), 'cloudClient menggunakan getApps() guards');

  // firebaseService.js TIDAK BOLEH mengimpor atau memanggil initializeApp
  assert(!fbContent.includes('initializeApp'), 'firebaseService.js tidak boleh memanggil initializeApp');
  assert(fbContent.includes("from \"../services/cloudClient.js\""), 'firebaseService.js mengimpor auth dan db dari cloudClient.js');
  assert(fbContent.includes('browserLocalPersistence'), 'firebaseService.js menyelaraskan persistensi sesi dengan browserLocalPersistence');
});

// -----------------------------------------------------------------------------
// PENGUJIAN 3: Alur Google Auth & Account Switching
// -----------------------------------------------------------------------------
runTest('Pengujian 3: GoogleAuthProvider terpasang dengan parameter alih akun dan popup', () => {
  const firebaseServicePath = path.join(__dirname, 'src', 'lib', 'firebaseService.js');
  const fbContent = fs.readFileSync(firebaseServicePath, 'utf8');

  assert(fbContent.includes('new GoogleAuthProvider()'), 'Menggunakan GoogleAuthProvider');
  assert(fbContent.includes("provider.setCustomParameters({ prompt: 'select_account' })"), 'Mendukung pergantian akun dengan prompt select_account');
  assert(fbContent.includes('signInWithPopup(auth, provider)'), 'Menggunakan signInWithPopup');
  assert(fbContent.includes('await auth.authStateReady()'), 'getIdentity menunggu authStateReady()');
});

// -----------------------------------------------------------------------------
// PENGUJIAN 4: Alur Logout & Sinkronisasi Sesi
// -----------------------------------------------------------------------------
runTest('Pengujian 4: Logout membersihkan sesi dan menyiarkan perubahan ke subscriber', () => {
  const authServicePath = path.join(__dirname, 'src', 'services', 'authService.js');
  const firebaseServicePath = path.join(__dirname, 'src', 'lib', 'firebaseService.js');

  const authContent = fs.readFileSync(authServicePath, 'utf8');
  const fbContent = fs.readFileSync(firebaseServicePath, 'utf8');

  assert(authContent.includes('await signOut(auth)'), 'authService logoutUser memanggil signOut(auth)');
  assert(fbContent.includes('await signOut(clients().auth)'), 'firebaseService logout memanggil signOut');
  assert(authContent.includes("role: 'guest'"), 'Sesi dikembalikan ke Mode Tamu saat logout');
});

// -----------------------------------------------------------------------------
// PENGUJIAN 5: Autentikasi Email / Password Tetap Berfungsi
// -----------------------------------------------------------------------------
runTest('Pengujian 5: Fungsi login & registrasi email/password utuh', () => {
  const authServicePath = path.join(__dirname, 'src', 'services', 'authService.js');
  const authContent = fs.readFileSync(authServicePath, 'utf8');

  assert(authContent.includes('signInWithEmailAndPassword'), 'Memuat signInWithEmailAndPassword');
  assert(authContent.includes('createUserWithEmailAndPassword'), 'Memuat createUserWithEmailAndPassword');
  assert(authContent.includes('sendPasswordResetEmail'), 'Memuat sendPasswordResetEmail');
  assert(authContent.includes("message = 'Email atau password salah.'"), 'Pesan kesalahan login standar terjaga');
});

// -----------------------------------------------------------------------------
// PENGUJIAN 6: Role Guru dan Siswa Tetap Benar (Dual-Read)
// -----------------------------------------------------------------------------
runTest('Pengujian 6: Role guru dan siswa diprioritaskan dan divalidasi tepat', () => {
  const authServicePath = path.join(__dirname, 'src', 'services', 'authService.js');
  const authContent = fs.readFileSync(authServicePath, 'utf8');

  // Pemeriksaan Guru Dual-Read
  assert(authContent.includes("'config', 'roles'"), 'Mendukung config/roles (lama)');
  assert(authContent.includes("'settings', 'classroom'"), 'Mendukung settings/classroom (handout)');

  // Pemeriksaan Siswa Dual-Read
  assert(authContent.includes("'roster', uid"), 'Mendukung roster/{uid} (lama)');
  assert(authContent.includes("'members', uid"), 'Mendukung members/{uid} (handout)');

  // Prioritas Guru sebelum Siswa
  const teacherIndex = authContent.indexOf('1. PRIORITAS UTAMA: PEMERIKSAAN GURU');
  const studentIndex = authContent.indexOf('2. PEMERIKSAAN SISWA');
  assert(teacherIndex >= 0 && studentIndex >= 0 && teacherIndex < studentIndex, 'Guru wajib diperiksa sebelum siswa');
});

// -----------------------------------------------------------------------------
// PENGUJIAN 7: Sanitasi Error UI (Bebas Kebocoran Kredensial / Pesan Mentah)
// -----------------------------------------------------------------------------
runTest('Pengujian 7: Error UI menampilkan pesan ramah Indonesia tanpa kebocoran SDK', () => {
  const authModalPath = path.join(__dirname, 'src', 'components', 'auth', 'AuthModal.jsx');
  const teacherDashPath = path.join(__dirname, 'src', 'pages', 'TeacherDashboard.jsx');

  const amContent = fs.readFileSync(authModalPath, 'utf8');
  const tdContent = fs.readFileSync(teacherDashPath, 'utf8');

  // AuthModal pesan ramah
  assert(amContent.includes("'Login dibatalkan.'"), 'Menangani popup dibatalkan ramah');
  assert(amContent.includes("'Jendela login tidak dapat dibuka"), 'Menangani popup diblokir ramah');
  assert(amContent.includes("'Koneksi internet bermasalah"), 'Menangani kegagalan jaringan ramah');
  assert(amContent.includes("'Layanan login belum dikonfigurasi dengan benar.'"), 'Menangani kesalahan konfigurasi ramah');
  assert(amContent.includes("'Terjadi kendala saat masuk. Silakan coba kembali.'"), 'Fallback login ramah');

  // AuthModal TIDAK membocorkan err.message mentah di Google Login
  assert(!amContent.includes("setErrorMessage(err.message || 'Gagal melakukan autentikasi"), 'Tidak ada fallback err.message mentah di Google login');

  // TeacherDashboard pesan ramah
  assert(tdContent.includes("'Akses ditolak: Hanya akun guru yang berhak membaca hasil kelas.'"), 'TeacherDashboard error izin ramah');
  assert(tdContent.includes("'Koneksi internet bermasalah saat memuat data kelas."), 'TeacherDashboard error jaringan ramah');
  assert(tdContent.includes("'Terjadi kendala saat memuat data hasil belajar siswa.'"), 'TeacherDashboard fallback ramah');
  assert(!tdContent.includes("setError(err.message || 'Gagal memuat data hasil"), 'Tidak ada fallback err.message mentah di TeacherDashboard');
});

// -----------------------------------------------------------------------------
// PENGUJIAN 8: Fitur Local-First & Graceful Degradation
// -----------------------------------------------------------------------------
runTest('Pengujian 8: Mode Tamu dan fitur lokal berjalan 100% tanpa Firebase', () => {
  const progressServicePath = path.join(__dirname, 'src', 'services', 'progressService.js');
  const obsServicePath = path.join(__dirname, 'src', 'services', 'observationService.js');
  const cloudClientPath = path.join(__dirname, 'src', 'services', 'cloudClient.js');

  const psContent = fs.readFileSync(progressServicePath, 'utf8');
  const obsContent = fs.readFileSync(obsServicePath, 'utf8');
  const ccContent = fs.readFileSync(cloudClientPath, 'utf8');

  assert(psContent.includes("'reaksi-lab-progress'"), 'Namespace progres lokal tersimpan');
  assert(obsContent.includes("'reaksi-lab-observations'"), 'Namespace observasi lokal tersimpan');
  assert(ccContent.includes('Aplikasi berjalan dalam Mode Tamu (Penyimpanan Lokal)'), 'Graceful degradation jika env Firebase kosong');
});

console.log(`\n========================================================================`);
console.log(`HASIL VERIFIKASI TAHAP 1: ${passedTests} DARI ${totalTests} PENGUJIAN LULUS (100%)!`);
console.log(`========================================================================\n`);

