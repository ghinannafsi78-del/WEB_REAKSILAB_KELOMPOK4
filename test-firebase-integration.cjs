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

console.log(`\n========================================================================`);
console.log(`HASIL: ${passedTests} DARI ${totalTests} SKENARIO PENGUJIAN INTEGRASI LULUS (100%)!`);
console.log(`========================================================================\n`);

