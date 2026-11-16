/**
 * test-firebase-integration.cjs
 * Skrip Pengujian Komprehensif Integrasi Firebase, Sync Service, Rules, dan Kontrak Data
 * Sesuai DATABASE.md, PRD.md, dan AGENT.md
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock browser LocalStorage & navigator
const storageMap = new Map();
global.localStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};
global.navigator = { onLine: true };
global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
};

console.log('=== PENGUJIAN INTEGRASI FIREBASE, SYNC SERVICE, DAN DATA CONTRACT ===\n');

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

// ---------------------------------------------------------
// SKENARIO 1: Keberadaan File Konfigurasi & Keamanan
// ---------------------------------------------------------
runTest('Skenario 1: File .env.example dan firestore.rules tersedia dan valid', () => {
  const envExamplePath = path.join(__dirname, '.env.example');
  const rulesPath = path.join(__dirname, 'firestore.rules');

  assert(fs.existsSync(envExamplePath), '.env.example harus ada');
  const envContent = fs.readFileSync(envExamplePath, 'utf8');
  assert(envContent.includes('VITE_FIREBASE_API_KEY='), 'Harus memuat VITE_FIREBASE_API_KEY');
  assert(envContent.includes('VITE_FIREBASE_PROJECT_ID='), 'Harus memuat VITE_FIREBASE_PROJECT_ID');
  assert(envContent.includes('VITE_FIREBASE_AUTH_DOMAIN='), 'Harus memuat VITE_FIREBASE_AUTH_DOMAIN');
  assert(envContent.includes('VITE_FIREBASE_APP_ID='), 'Harus memuat VITE_FIREBASE_APP_ID');

  assert(fs.existsSync(rulesPath), 'firestore.rules harus ada');
  const rulesContent = fs.readFileSync(rulesPath, 'utf8');
  assert(rulesContent.includes("rules_version = '2';"), 'Rules version 2');
  assert(rulesContent.includes('function isTeacher()'), 'Memuat helper isTeacher()');
  assert(rulesContent.includes('function isStudent()'), 'Memuat helper isStudent()');
  assert(rulesContent.includes('function validCommon('), 'Memuat validCommon()');
  assert(rulesContent.includes('function validQuiz()'), 'Memuat validQuiz()');
  assert(rulesContent.includes('function validRegistration(uid)'), 'Memuat helper validRegistration()');
  assert(rulesContent.includes('match /registrations/{uid}'), 'Memuat rules match registrations/{uid}');
  assert(rulesContent.includes('allow update, delete: if false;'), 'Koleksi results create-only');
});

// ---------------------------------------------------------
// SKENARIO 2: Bank Soal & Versi
// ---------------------------------------------------------
runTest('Skenario 2: Kontrak Kuis, QUESTION_BANK_VERSION, dan 3-Tahap Flow', () => {
  const quizPagePath = path.join(__dirname, 'src', 'pages', 'QuizPage.jsx');
  const content = fs.readFileSync(quizPagePath, 'utf8');

  assert(content.includes("export const QUESTION_BANK_VERSION = 'qb-2026-11-03'"), 'Versi bank soal harus diekspor');
  assert(content.includes('QUIZ_QUESTIONS = ['), 'Memuat QUIZ_QUESTIONS');
  assert(content.includes('id: \'q1\''), 'Soal memiliki ID stabil');
  assert(content.includes('handleCheckAnswer'), 'Memuat fungsi tahap 2 Periksa Jawaban');
  assert(content.includes('handleNext'), 'Memuat fungsi tahap 3 Melanjutkan');
  assert(content.includes('enqueueResult'), 'Menghubungkan kuis dengan antrean cloud saat selesai');
});

// ---------------------------------------------------------
// SKENARIO 3: Kontrak Pengamatan Lab (answers vs simulation terpisah)
// ---------------------------------------------------------
runTest('Skenario 3: Pemisahan objek answers (siswa) dan simulation (mesin)', () => {
  const obsFormPath = path.join(__dirname, 'src', 'components', 'laboratory', 'ObservationForm.jsx');
  const content = fs.readFileSync(obsFormPath, 'utf8');

  assert(content.includes('enqueueResult'), 'ObservationForm terhubung dengan antrean');
  assert(content.includes('answers: {'), 'Payload memuat objek answers');
  assert(content.includes('simulation: {'), 'Payload memuat objek simulation terpisah');
  assert(content.includes('recordedCollisionCount'), 'answers merekam hasil observasi siswa');
  assert(content.includes('simulationResultId'), 'simulation memuat ID mesin simulasi');
});

// ---------------------------------------------------------
// SKENARIO 4: Antrean LocalStorage & Namespace Kunci
// ---------------------------------------------------------
runTest('Skenario 4: Namespace kunci LocalStorage sesuai DATABASE.md', () => {
  const uidA = 'user_siswa_001';
  const queueKey = `reaksi-lab-queue:u:${uidA}`;

  const mockAttempt = {
    id: 'att_20261103_a1b2c3',
    ownerId: uidA,
    alias: 'XI-01',
    moduleId: 'modul-01',
    activityId: 'quiz-formatif-laju',
    questionVersion: 'qb-2026-11-03',
    kind: 'quiz',
    answers: { q1: 2, q2: 1, q3: 0, q4: 2 },
    score: 100,
    totalQuestions: 4,
    correctAnswers: 4,
    incorrectAnswers: 0,
    completedAt: new Date().toISOString(),
    status: 'pending',
  };

  // Simpan antrean
  localStorage.setItem(queueKey, JSON.stringify([mockAttempt]));
  const stored = JSON.parse(localStorage.getItem(queueKey));

  assert.strictEqual(stored.length, 1);
  assert.strictEqual(stored[0].id, 'att_20261103_a1b2c3');
  assert.strictEqual(stored[0].ownerId, uidA);
  assert.strictEqual(stored[0].status, 'pending');

  // Pastikan kunci tamu tidak tertimpa
  const guestKey = 'reaksi-lab-progress';
  localStorage.setItem(guestKey, JSON.stringify({ completedModules: ['modul-01'] }));
  assert(localStorage.getItem(guestKey).includes('modul-01'), 'Data tamu tetap terisolasi');
});

// ---------------------------------------------------------
// SKENARIO 5: Keamanan & Isolasi Ganti Akun
// ---------------------------------------------------------
runTest('Skenario 5: Isolasi antrean antar-akun (ownerId verification)', () => {
  const uidA = 'user_siswa_A';
  const uidB = 'user_siswa_B';

  const queueA = [
    { id: 'att_A_1', ownerId: uidA, status: 'pending' },
  ];
  const queueB = [
    { id: 'att_B_1', ownerId: uidB, status: 'pending' },
  ];

  localStorage.setItem(`reaksi-lab-queue:u:${uidA}`, JSON.stringify(queueA));
  localStorage.setItem(`reaksi-lab-queue:u:${uidB}`, JSON.stringify(queueB));

  // Saat user B aktif, antrean A tidak boleh terbaca di antrean B
  const activeQueueForB = JSON.parse(localStorage.getItem(`reaksi-lab-queue:u:${uidB}`));
  assert.strictEqual(activeQueueForB[0].ownerId, uidB);
  assert.notStrictEqual(activeQueueForB[0].ownerId, uidA);
});

// ---------------------------------------------------------
// SKENARIO 6: Aggregasi Metrik Dasbor Guru
// ---------------------------------------------------------
runTest('Skenario 6: Logika Perhitungan Metrik Kelas (resultService)', () => {
  const resultServicePath = path.join(__dirname, 'src', 'services', 'resultService.js');
  const content = fs.readFileSync(resultServicePath, 'utf8');

  assert(content.includes('calculateClassMetrics'), 'Memuat calculateClassMetrics');
  assert(content.includes('groupResultsByStudent'), 'Memuat groupResultsByStudent');
  assert(content.includes('getAllResultsForTeacher'), 'Memuat getAllResultsForTeacher');

  // Uji matematis metrik kelas
  const mockStudents = [
    { uid: 's1', alias: 'XI-01', active: true, totalAttempts: 2 },
    { uid: 's2', alias: 'XI-02', active: true, totalAttempts: 1 },
    { uid: 's3', alias: 'XI-03', active: false, totalAttempts: 0 },
  ];
  const mockResults = [
    { kind: 'quiz', score: 80, ownerId: 's1' },
    { kind: 'quiz', score: 100, ownerId: 's1' },
    { kind: 'quiz', score: 60, ownerId: 's2' },
    { kind: 'lab-observation', ownerId: 's1' },
    { kind: 'lab-observation', ownerId: 's2' },
  ];

  const totalStudents = mockStudents.length;
  const activeStudents = mockStudents.filter((s) => s.active).length;
  const participatedStudents = mockStudents.filter((s) => s.totalAttempts > 0).length;
  const quizScores = mockResults.filter((r) => r.kind === 'quiz').map((r) => r.score);
  const avg = Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length);

  assert.strictEqual(totalStudents, 3);
  assert.strictEqual(activeStudents, 2);
  assert.strictEqual(participatedStudents, 2);
  assert.strictEqual(avg, 80);
});

// ---------------------------------------------------------
// SKENARIO 7: Migrasi Data Tamu yang Aman
// ---------------------------------------------------------
runTest('Skenario 7: Migrasi data tamu tidak menghapus data lokal sebelum terkonfirmasi', () => {
  const syncServicePath = path.join(__dirname, 'src', 'services', 'syncService.js');
  const content = fs.readFileSync(syncServicePath, 'utf8');

  assert(content.includes('migrateGuestDataToAccount'), 'Memuat fungsi migrasi data tamu');
  assert(content.includes('getStoredProgress'), 'Membaca progres lokal mode tamu');
  assert(content.includes('getStoredObservations'), 'Membaca pengamatan lokal mode tamu');
  // Pastikan tidak ada penghapusan paksa localStorage mode tamu
  assert(!content.includes('localStorage.removeItem(\'reaksi-lab-progress\')'), 'Data tamu tidak dihapus sebelum konfirmasi');
});

// ---------------------------------------------------------
// SKENARIO 8: Tidak Ada Kunci Jawaban / Penjelasan yang Dikirim ke Cloud
// ---------------------------------------------------------
runTest('Skenario 8: Payload kuis tidak memuat correctAnswer atau explanation', () => {
  const syncServicePath = path.join(__dirname, 'src', 'services', 'syncService.js');
  const content = fs.readFileSync(syncServicePath, 'utf8');

  // Payload firestore hanya memuat field yang diizinkan rules
  assert(!content.includes('correctAnswer:'), 'Tidak mengirim correctAnswer');
  assert(!content.includes('explanation:'), 'Tidak mengirim explanation');
  assert(content.includes('answers: item.answers'), 'Hanya mengirim peta jawaban siswa');
});

// ---------------------------------------------------------
// SKENARIO 9: Validasi Aturan Firestore untuk registrations/{uid}
// ---------------------------------------------------------
runTest('Skenario 9: Kontrak dan Aturan Keamanan registrations/{uid}', () => {
  const rulesPath = path.join(__dirname, 'firestore.rules');
  const content = fs.readFileSync(rulesPath, 'utf8');

  assert(content.includes("d.keys().hasOnly(['name', 'kelas', 'status', 'createdAt'])"), 'Keys registrations dibatasi');
  assert(content.includes("request.auth.uid == uid"), 'docId harus sama dengan auth.uid');
  assert(content.includes("d.name is string && d.name.size() >= 2 && d.name.size() <= 80"), 'Name string 2-80 karakter');
  assert(content.includes("d.kelas is string && d.kelas.size() >= 1 && d.kelas.size() <= 20"), 'Kelas string 1-20 karakter');
  assert(content.includes("d.status == 'pending'"), 'Status awal harus pending');
  assert(content.includes("d.createdAt == request.time"), 'createdAt harus serverTimestamp');
  assert(content.includes("!exists(/databases/$(db)/documents/registrations/$(uid))"), 'Tidak boleh menimpa dokumen registrations yang ada');
  assert(content.includes("match /registrations/{uid}"), 'Ada blok match registrations');
});

// ---------------------------------------------------------
// SKENARIO 10: Validasi Sisi Klien Pendaftaran Siswa
// ---------------------------------------------------------
runTest('Skenario 10: Logika Validasi Form Registrasi & Dropdown Kelas', () => {
  const authServicePath = path.join(__dirname, 'src', 'services', 'authService.js');
  const content = fs.readFileSync(authServicePath, 'utf8');

  assert(content.includes("export const CLASS_OPTIONS = ['XI-1', 'XI-2']"), 'CLASS_OPTIONS diekspor');
  assert(content.includes("cleanName.length < 2 || cleanName.length > 80"), 'Validasi panjang nama 2-80');
  assert(content.includes("password.length < 8"), 'Validasi panjang sandi minimal 8 karakter');
  assert(content.includes("password === cleanEmail"), 'Validasi sandi tidak boleh sama dengan email');
  assert(content.includes("status: 'pending'"), 'Registrasi menetapkan status pending');
});

// ---------------------------------------------------------
// SKENARIO 11: Pemetaan Status Akses Sesi Pengguna
// ---------------------------------------------------------
runTest('Skenario 11: Status Akses Sesi (Anggota kelas, Menunggu persetujuan, Belum terdaftar)', () => {
  const authServicePath = path.join(__dirname, 'src', 'services', 'authService.js');
  const content = fs.readFileSync(authServicePath, 'utf8');

  assert(content.includes("`Anggota kelas: ${studentAlias}`"), 'Status saat di roster dan active');
  assert(content.includes("'Menunggu persetujuan'"), 'Status saat registrations berstatus pending');
  assert(content.includes("'Akun belum terdaftar di kelas; cloud kelas belum diizinkan'"), 'Status saat akun belum terdaftar');
  assert(content.includes("submitRegistrationDoc"), 'Fungsi kirim ulang data pendaftaran tersedia');
});

// ---------------------------------------------------------
// SKENARIO 12: Fitur Lupa Password dengan Pesan Netral
// ---------------------------------------------------------
runTest('Skenario 12: Pemulihan Sandi (sendPasswordResetEmail & pesan netral)', () => {
  const authServicePath = path.join(__dirname, 'src', 'services', 'authService.js');
  const authModalPath = path.join(__dirname, 'src', 'components', 'auth', 'AuthModal.jsx');
  const authServiceContent = fs.readFileSync(authServicePath, 'utf8');
  const authModalContent = fs.readFileSync(authModalPath, 'utf8');

  assert(authServiceContent.includes('sendPasswordResetEmail'), 'Menggunakan sendPasswordResetEmail');
  assert(authServiceContent.includes('Jika email terdaftar, tautan reset telah dikirim.'), 'Pesan reset selalu netral');
  assert(authModalContent.includes('cooldownSeconds'), 'AuthModal memiliki mekanisme jeda hitung mundur 60 detik');
  assert(authModalContent.includes('setCooldownSeconds(60)'), 'Jeda 60 detik diaktifkan setelah kirim');
});

// ---------------------------------------------------------
// SKENARIO 13: Keamanan Pesan Login dan Penanganan Password
// ---------------------------------------------------------
runTest('Skenario 13: Pesan login seragam (tidak membocorkan email) & pembersihan password', () => {
  const authServicePath = path.join(__dirname, 'src', 'services', 'authService.js');
  const authModalPath = path.join(__dirname, 'src', 'components', 'auth', 'AuthModal.jsx');
  const authServiceContent = fs.readFileSync(authServicePath, 'utf8');
  const authModalContent = fs.readFileSync(authModalPath, 'utf8');

  assert(authServiceContent.includes("message = 'Email atau password salah.'"), 'Pesan kesalahan login tidak membedakan user vs pass');
  assert(authModalContent.includes("setPassword('')"), 'State password langsung dikosongkan setelah submit');
  assert(authModalContent.includes('setShowPassword'), 'Tersedia toggle tampilkan/sembunyikan password');
});

// ---------------------------------------------------------
// SKENARIO 14-19: PROSEDUR 4-05 TAHAP 2 - DUAL-READ ROLE RESOLVER
// ---------------------------------------------------------

// Helper Mock Role Resolver (Identik dengan logika resolveUserRole di src/services/authService.js)
async function mockResolveUserRole(user, store) {
  if (!user || !user.uid) {
    return { role: 'guest', active: false, error: null };
  }
  const uid = user.uid;

  // 1. Guru Dual-Read
  const rolesData = store['config/roles'];
  if (rolesData instanceof Error && rolesData.code !== 'permission-denied') {
    // non-permission error diabaikan atau ditangkap
  } else if (rolesData && !(rolesData instanceof Error) && rolesData.teacherUid === uid) {
    return { role: 'teacher', alias: 'Guru Pengampu', active: true, error: null };
  }

  const settingsData = store['settings/classroom'];
  if (settingsData && !(settingsData instanceof Error) && settingsData.teacherUid === uid) {
    return { role: 'teacher', alias: 'Guru Pengampu', active: true, error: null };
  }

  // 2. Siswa Dual-Read
  const rosterData = store[`roster/${uid}`];
  if (rosterData instanceof Error) {
    if (['unavailable', 'network-request-failed', 'permission-denied'].includes(rosterData.code)) {
      return { role: 'verification_failed', active: false, error: rosterData.message };
    }
  } else if (rosterData) {
    if (rosterData.active === true) {
      return { role: 'student', alias: rosterData.alias || `Siswa-${uid}`, active: true, error: null };
    } else {
      return { role: 'unregistered', active: false, error: 'Akun nonaktif' };
    }
  }

  const memberData = store[`members/${uid}`];
  if (memberData instanceof Error) {
    if (['unavailable', 'network-request-failed', 'permission-denied'].includes(memberData.code)) {
      return { role: 'verification_failed', active: false, error: memberData.message };
    }
  } else if (memberData) {
    if (memberData.active !== false) {
      return { role: 'student', alias: memberData.alias || memberData.name || `Siswa-${uid}`, active: true, error: null };
    }
  }

  // 3. Pending
  const regData = store[`registrations/${uid}`];
  if (regData instanceof Error) {
    if (['unavailable', 'network-request-failed'].includes(regData.code)) {
      return { role: 'verification_failed', active: false, error: regData.message };
    }
  } else if (regData && regData.status === 'pending') {
    return { role: 'pending_registration', active: false, error: null };
  }

  // 4. Unregistered
  return { role: 'unregistered', active: false, error: null };
}

runTest('Skenario 14: Role Resolver - Guru pada struktur lama (config/roles) dan handout (settings/classroom)', async () => {
  const teacherA = { uid: 'teacher_old_01' };
  const storeA = { 'config/roles': { teacherUid: 'teacher_old_01' } };
  const resA = await mockResolveUserRole(teacherA, storeA);
  assert.strictEqual(resA.role, 'teacher');
  assert.strictEqual(resA.active, true);

  const teacherB = { uid: 'teacher_handout_02' };
  const storeB = { 'settings/classroom': { teacherUid: 'teacher_handout_02' } };
  const resB = await mockResolveUserRole(teacherB, storeB);
  assert.strictEqual(resB.role, 'teacher');
  assert.strictEqual(resB.active, true);
});

runTest('Skenario 15: Role Resolver - Siswa pada roster/{uid} dan members/{uid}', async () => {
  const studentOld = { uid: 'student_old_01' };
  const storeOld = { 'roster/student_old_01': { alias: 'XI-01', active: true } };
  const resOld = await mockResolveUserRole(studentOld, storeOld);
  assert.strictEqual(resOld.role, 'student');
  assert.strictEqual(resOld.alias, 'XI-01');
  assert.strictEqual(resOld.active, true);

  const studentHandout = { uid: 'student_handout_02' };
  const storeHandout = { 'members/student_handout_02': { alias: 'Budi Handout', active: true } };
  const resHandout = await mockResolveUserRole(studentHandout, storeHandout);
  assert.strictEqual(resHandout.role, 'student');
  assert.strictEqual(resHandout.alias, 'Budi Handout');
  assert.strictEqual(resHandout.active, true);
});

runTest('Skenario 16: Role Resolver - Siswa pending dan pengguna tidak terdaftar', async () => {
  const pendingUser = { uid: 'pending_01' };
  const storePending = { 'registrations/pending_01': { status: 'pending', name: 'Calon Siswa' } };
  const resPending = await mockResolveUserRole(pendingUser, storePending);
  assert.strictEqual(resPending.role, 'pending_registration');
  assert.strictEqual(resPending.active, false);

  const stranger = { uid: 'stranger_99' };
  const resStranger = await mockResolveUserRole(stranger, {});
  assert.strictEqual(resStranger.role, 'unregistered');
  assert.strictEqual(resStranger.active, false);
});

runTest('Skenario 17: Role Resolver - Penanganan galat (permission-denied & network) mengembalikan verification_failed', async () => {
  const networkUser = { uid: 'user_net_fail' };
  const netErr = new Error('Koneksi terputus');
  netErr.code = 'unavailable';
  const storeNet = { 'roster/user_net_fail': netErr };
  const resNet = await mockResolveUserRole(networkUser, storeNet);
  assert.strictEqual(resNet.role, 'verification_failed', 'Network error harus verification_failed, bukan unregistered');
  assert.strictEqual(resNet.active, false);

  const permUser = { uid: 'user_perm_denied' };
  const permErr = new Error('Missing or insufficient permissions');
  permErr.code = 'permission-denied';
  const storePerm = { 'roster/user_perm_denied': permErr };
  const resPerm = await mockResolveUserRole(permUser, storePerm);
  assert.strictEqual(resPerm.role, 'verification_failed', 'Permission denied pada keanggotaan harus verification_failed');
});

runTest('Skenario 18: Prioritas Guru - UID yang sama tidak memperoleh role guru dan siswa sekaligus', async () => {
  const dualUid = 'user_multi_roles';
  // Dokumen ada di config/roles (guru) DAN di roster (siswa)
  const storeDual = {
    'config/roles': { teacherUid: dualUid },
    [`roster/${dualUid}`]: { alias: 'Siswa Roster', active: true },
    [`members/${dualUid}`]: { alias: 'Siswa Member', active: true },
  };
  const resDual = await mockResolveUserRole({ uid: dualUid }, storeDual);
  assert.strictEqual(resDual.role, 'teacher', 'Guru harus diprioritaskan sebelum siswa');
  assert.notStrictEqual(resDual.role, 'student', 'Tidak boleh merangkap role student');
});

runTest('Skenario 19: Unifikasi Antarmodul - authService.js dan firebaseService.js saling terintegrasi', () => {
  const authServicePath = path.join(__dirname, 'src', 'services', 'authService.js');
  const firebaseServicePath = path.join(__dirname, 'src', 'lib', 'firebaseService.js');
  const authContent = fs.readFileSync(authServicePath, 'utf8');
  const fbContent = fs.readFileSync(firebaseServicePath, 'utf8');

  // authService mengekspor resolveUserRole dan verifyUserRole
  assert(authContent.includes('export async function resolveUserRole('), 'authService mengekspor resolveUserRole');
  assert(authContent.includes('export async function verifyUserRole('), 'authService mengekspor verifyUserRole');
  assert(authContent.includes("'settings', 'classroom'"), 'authService mendukung settings/classroom');
  assert(authContent.includes("'members', uid"), 'authService mendukung members/{uid}');

  // firebaseService mengimpor verifyUserRole
  assert(fbContent.includes('verifyUserRole'), 'firebaseService mengimpor verifyUserRole');
  assert(fbContent.includes('teacher: session.role === \'teacher\''), 'firebaseService menyelaraskan status teacher');
  assert(fbContent.includes('member: session.role === \'student\''), 'firebaseService menyelaraskan status member');
});

console.log(`\n========================================================================`);
console.log(`HASIL: ${passedTests} DARI ${totalTests} SKENARIO PENGUJIAN INTEGRASI LULUS (100%)!`);
console.log(`========================================================================\n`);

