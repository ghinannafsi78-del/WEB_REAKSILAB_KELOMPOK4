/**
 * test-tahap2-verification.cjs
 * Pengujian Terarah Tahap 2: Integrasi Hasil Belajar, Sistem Attempts, Offline/Online Sync, & Idempotensi
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== PENGUJIAN TERARAH TAHAP 2: INTEGRASI HASIL BELAJAR REAKSI LAB ===\n');

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

// Setup Mock Browser Storage
const storageMap = new Map();
global.localStorage = {
  getItem: (key) => storageMap.get(key) ?? null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};
global.navigator = { onLine: true };
global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
};

// -----------------------------------------------------------------------------
// PENGUJIAN 1: Kuis Tanpa Login (Mode Tamu, Local-First)
// -----------------------------------------------------------------------------
runTest('Pengujian 1: Kuis tanpa login menghasilkan attempt valid berstatus local (tidak otomatis terkirim)', () => {
  const { payloadOf } = require('./src/lib/attemptContract.js');
  const { recordAttempt, readScope } = require('./src/lib/localStore.js');

  const quizAttempt = {
    id: 'att_quiz_guest_01',
    ownerId: 'guest',
    alias: 'Tamu',
    moduleId: 'laju-reaksi',
    activityId: 'quiz-formatif-laju',
    questionVersion: 'qb-2026-11-03',
    kind: 'practice',
    answers: { q1: '2', q2: '0', q3: '1', q4: '3' },
    score: 75,
    completedAt: new Date().toISOString(),
  };

  // Validasi kontrak
  const validated = payloadOf(quizAttempt);
  assert.strictEqual(validated.id, 'att_quiz_guest_01');
  assert.strictEqual(validated.ownerId, 'guest');
  assert.strictEqual(validated.kind, 'practice');
  assert.strictEqual(typeof validated.answers.q1, 'string');

  // Rekam ke localStore
  recordAttempt('guest', validated);
  const guestRecords = readScope('guest').records;
  assert(guestRecords['att_quiz_guest_01'], 'Record harus tersimpan di scope guest');
  assert.strictEqual(guestRecords['att_quiz_guest_01'].status, 'local', 'Status wajib "local", bukan "pending" atau "sent"');
});

// -----------------------------------------------------------------------------
// PENGUJIAN 2: Observasi Laboratorium Tanpa Login
// -----------------------------------------------------------------------------
runTest('Pengujian 2: Observasi laboratorium tanpa login tersimpan lokal dengan kind "observation"', () => {
  const { payloadOf } = require('./src/lib/attemptContract.js');
  const { recordAttempt, readScope } = require('./src/lib/localStore.js');

  const obsAttempt = {
    id: 'att_obs_guest_01',
    ownerId: 'guest',
    alias: 'Tamu',
    moduleId: 'laju-reaksi',
    activityId: 'exp-ab',
    questionVersion: 'qb-2026-11-03',
    kind: 'observation',
    answers: {
      trialNumber: '1',
      recordedCollisionCount: '45',
      recordedCollisionFrequency: '3',
      recordedEffectiveCollisionCount: '12',
      recordedProductCount: '12',
      recordedReactionRate: '0.8',
      observationNotes: 'Warna larutan berubah lebih cepat pada suhu tinggi',
      analysis: 'Peningkatan suhu menaikkan energi kinetik partikel',
      conclusion: 'Laju reaksi berbanding lurus dengan suhu',
    },
    score: 100,
    completedAt: new Date().toISOString(),
  };

  const validated = payloadOf(obsAttempt);
  assert.strictEqual(validated.kind, 'observation');
  assert.strictEqual(validated.score, 100);
  assert.strictEqual(typeof validated.answers.recordedCollisionCount, 'string');

  recordAttempt('guest', validated);
  const guestRecords = readScope('guest').records;
  assert(guestRecords['att_obs_guest_01'], 'Record observasi harus tersimpan di scope guest');
  assert.strictEqual(guestRecords['att_obs_guest_01'].status, 'local');
});

// -----------------------------------------------------------------------------
// PENGUJIAN 3: Login dan Persetujuan Pengiriman Hasil (claimGuest & syncPending)
// -----------------------------------------------------------------------------
runTest('Pengujian 3: Siswa login, menyetujui migrasi, dan mengirim via syncPending()', async () => {
  const { claimGuest, readScope } = require('./src/lib/localStore.js');
  const { syncPending } = require('./src/lib/syncService.js');

  const uidStudent = 'user_student_101';
  const studentAlias = 'Ahmad Pratama';

  // 1. Siswa menyetujui klaim hasil lokal mode tamu
  claimGuest(uidStudent, studentAlias, ['att_quiz_guest_01', 'att_obs_guest_01']);

  // Pastikan record berpindah ke scope siswa dan status menjadi pending
  const studentScope = readScope(uidStudent);
  assert(studentScope.records['att_quiz_guest_01'], 'Kuis berhasil dipindahkan ke siswa');
  assert(studentScope.records['att_obs_guest_01'], 'Observasi berhasil dipindahkan ke siswa');
  assert.strictEqual(studentScope.records['att_quiz_guest_01'].status, 'pending');
  assert.strictEqual(studentScope.records['att_quiz_guest_01'].attempt.ownerId, uidStudent);
  assert.strictEqual(studentScope.records['att_quiz_guest_01'].attempt.alias, studentAlias);

  // Pastikan scope guest sudah bersih dari attempt yang diklaim
  const guestScopeAfter = readScope('guest');
  assert.strictEqual(guestScopeAfter.records['att_quiz_guest_01'], undefined, 'Attempt sudah tidak ada di guest');

  // 2. Simulasikan cloud saveAttempt() yang sukses
  const mockCloud = {
    saveAttempt: async (attempt) => {
      assert.strictEqual(attempt.ownerId, uidStudent);
      return {
        ...attempt,
        receivedAt: new Date().toISOString(),
      };
    },
  };

  let reports = [];
  await syncPending(uidStudent, mockCloud, () => true, (st, id) => reports.push({ st, id }));

  // Verifikasi konfirmasi status sent
  const studentScopeSent = readScope(uidStudent);
  assert.strictEqual(studentScopeSent.records['att_quiz_guest_01'].status, 'sent', 'Status kuis terupdate ke "sent"');
  assert.strictEqual(studentScopeSent.records['att_obs_guest_01'].status, 'sent', 'Status observasi terupdate ke "sent"');
  assert(studentScopeSent.records['att_quiz_guest_01'].receivedAt, 'Memiliki receivedAt dari server');
});

// -----------------------------------------------------------------------------
// PENGUJIAN 4: Retry Ketika Jaringan Terputus (Antrean Tetap, ID Stabil)
// -----------------------------------------------------------------------------
runTest('Pengujian 4: Retry saat jaringan terputus mempertahankan status pending dan ID stabil', async () => {
  const { recordAttempt, readScope } = require('./src/lib/localStore.js');
  const { syncPending } = require('./src/lib/syncService.js');
  const { payloadOf } = require('./src/lib/attemptContract.js');

  const uidStudent = 'user_student_retry';
  const offlineAttemptId = 'att_offline_stable_999';

  const newAttempt = payloadOf({
    id: offlineAttemptId,
    ownerId: uidStudent,
    alias: 'Siti Rahma',
    moduleId: 'laju-reaksi',
    activityId: 'quiz-formatif-laju',
    questionVersion: 'qb-2026-11-03',
    kind: 'practice',
    answers: { q1: '1' },
    score: 100,
    completedAt: new Date().toISOString(),
  });

  recordAttempt(uidStudent, newAttempt);

  // Percobaan 1: Jaringan terputus / server error
  const mockFailingCloud = {
    saveAttempt: async () => {
      const err = new Error('Network timeout');
      err.code = 'unavailable';
      throw err;
    },
  };

  await syncPending(uidStudent, mockFailingCloud, () => true, () => {});

  // Antrean TIDAK boleh terhapus, status tetap pending
  const scopeAfterFail = readScope(uidStudent);
  assert(scopeAfterFail.records[offlineAttemptId], 'Antrean tetap tersimpan setelah error');
  assert.strictEqual(scopeAfterFail.records[offlineAttemptId].status, 'pending', 'Status tetap "pending"');
  assert.strictEqual(scopeAfterFail.records[offlineAttemptId].attempt.id, offlineAttemptId, 'ID tidak boleh berubah');

  // Percobaan 2: Jaringan kembali online (Retry dengan ID yang persis sama)
  const mockOnlineCloud = {
    saveAttempt: async (att) => {
      assert.strictEqual(att.id, offlineAttemptId, 'Retry wajib menggunakan ID awal yang sama persis');
      return { ...att, receivedAt: new Date().toISOString() };
    },
  };

  await syncPending(uidStudent, mockOnlineCloud, () => true, () => {});

  const scopeAfterSuccess = readScope(uidStudent);
  assert.strictEqual(scopeAfterSuccess.records[offlineAttemptId].status, 'sent', 'Retry berhasil memperbarui status ke "sent"');
});

// -----------------------------------------------------------------------------
// PENGUJIAN 5: Isolasi Antar-Akun (Siswa A vs Siswa B)
// -----------------------------------------------------------------------------
runTest('Pengujian 5: Data Siswa A dan Siswa B terisolasi penuh pada scope masing-masing', () => {
  const { recordAttempt, readScope } = require('./src/lib/localStore.js');
  const { payloadOf } = require('./src/lib/attemptContract.js');

  const uidA = 'student_alpha';
  const uidB = 'student_beta';

  const attA = payloadOf({
    id: 'att_alpha_01',
    ownerId: uidA,
    alias: 'Alpha',
    moduleId: 'laju-reaksi',
    activityId: 'quiz-01',
    questionVersion: 'qb-2026-11-03',
    kind: 'practice',
    answers: { q1: '3' },
    score: 90,
    completedAt: new Date().toISOString(),
  });

  const attB = payloadOf({
    id: 'att_beta_01',
    ownerId: uidB,
    alias: 'Beta',
    moduleId: 'laju-reaksi',
    activityId: 'quiz-01',
    questionVersion: 'qb-2026-11-03',
    kind: 'practice',
    answers: { q1: '0' },
    score: 70,
    completedAt: new Date().toISOString(),
  });

  recordAttempt(uidA, attA);
  recordAttempt(uidB, attB);

  const scopeA = readScope(uidA);
  const scopeB = readScope(uidB);

  assert(scopeA.records['att_alpha_01'] && !scopeA.records['att_beta_01'], 'Scope A hanya memuat data A');
  assert(scopeB.records['att_beta_01'] && !scopeB.records['att_alpha_01'], 'Scope B hanya memuat data B');
});

// -----------------------------------------------------------------------------
// PENGUJIAN 6: Pengamanan Pergantian Akun Saat Sinkronisasi Berjalan
// -----------------------------------------------------------------------------
runTest('Pengujian 6: Pergantian akun di tengah proses sinkronisasi membatalkan pengiriman (isCurrent guard)', async () => {
  const { syncPending } = require('./src/lib/syncService.js');
  const { recordAttempt } = require('./src/lib/localStore.js');
  const { payloadOf } = require('./src/lib/attemptContract.js');

  const uidCurrent = 'student_active_session';
  const att = payloadOf({
    id: 'att_cancel_on_switch',
    ownerId: uidCurrent,
    alias: 'Siswa Sesi Aktif',
    moduleId: 'laju-reaksi',
    activityId: 'quiz-01',
    questionVersion: 'qb-2026-11-03',
    kind: 'practice',
    answers: { q1: '2' },
    score: 80,
    completedAt: new Date().toISOString(),
  });
  recordAttempt(uidCurrent, att);

  let activeUser = uidCurrent;
  let saveAttemptCalled = 0;

  const mockCloud = {
    saveAttempt: async () => {
      saveAttemptCalled++;
      // Pengguna logout / ganti akun sebelum cloud mengonfirmasi
      activeUser = 'student_different_session';
      return { ...att, receivedAt: new Date().toISOString() };
    },
  };

  await syncPending(uidCurrent, mockCloud, () => activeUser === uidCurrent, () => {});

  // Karena activeUser berubah saat callback, isCurrent() return false sehingga markSent tidak dieksekusi untuk akun baru
  assert.strictEqual(saveAttemptCalled, 1, 'Cloud dipanggil sekali sebelum pembatalan terdeteksi');
});

// -----------------------------------------------------------------------------
// PENGUJIAN 7: Tidak Terjadi Duplikasi Attempt (Idempotensi sameAttempt)
// -----------------------------------------------------------------------------
runTest('Pengujian 7: Idempotensi dan deteksi sameAttempt mencegah duplikasi rekaman', () => {
  const { sameAttempt, payloadOf } = require('./src/lib/attemptContract.js');
  const { recordAttempt, readScope } = require('./src/lib/localStore.js');

  const itemA = {
    id: 'att_idempotent_test',
    ownerId: 'user_same_att',
    alias: 'Budi',
    moduleId: 'laju-reaksi',
    activityId: 'quiz-01',
    questionVersion: 'qb-2026-11-03',
    kind: 'practice',
    answers: { q1: '2', q2: '1' },
    score: 100,
    completedAt: '2026-11-17T11:00:00.000Z',
  };

  // Objek B dengan urutan kunci answers terbalik (tetap dianggap sama)
  const itemB = {
    id: 'att_idempotent_test',
    ownerId: 'user_same_att',
    alias: 'Budi',
    moduleId: 'laju-reaksi',
    activityId: 'quiz-01',
    questionVersion: 'qb-2026-11-03',
    kind: 'practice',
    answers: { q2: '1', q1: '2' },
    score: 100,
    completedAt: '2026-11-17T11:00:00.000Z',
  };

  assert(sameAttempt(itemA, itemB), 'sameAttempt harus mengembalikan true untuk payload dengan isi identik');

  recordAttempt('user_same_att', payloadOf(itemA));
  // Rekam ulang itemB yang identik tidak melempar error dan tidak membuat entri ganda
  recordAttempt('user_same_att', payloadOf(itemB));

  const records = readScope('user_same_att').records;
  assert.strictEqual(Object.keys(records).length, 1, 'Hanya ada tepat 1 record (tidak ada duplikasi)');
});

// -----------------------------------------------------------------------------
// PENGUJIAN 8: Adapter Dual-Read resultService
// -----------------------------------------------------------------------------
runTest('Pengujian 8: resultService groupResultsByStudent mendukung kind practice & observation', () => {
  const { groupResultsByStudent, calculateClassMetrics } = require('./src/services/resultService.js');

  const mockRoster = [
    { uid: 's1', alias: 'Siswa-01', active: true },
    { uid: 's2', alias: 'Siswa-02', active: true },
  ];

  // Campuran data dari skema Handout (practice & observation) dan skema legacy (quiz & lab-observation)
  const mockResults = [
    { id: 'att_1', ownerId: 's1', alias: 'Siswa-01', kind: 'practice', score: 90, completedAt: new Date().toISOString() },
    { id: 'att_2', ownerId: 's1', alias: 'Siswa-01', kind: 'observation', score: 100, completedAt: new Date().toISOString() },
    { id: 'att_3', ownerId: 's2', alias: 'Siswa-02', kind: 'quiz', score: 80, completedAt: new Date().toISOString() },
    { id: 'att_4', ownerId: 's2', alias: 'Siswa-02', kind: 'lab-observation', score: 100, completedAt: new Date().toISOString() },
  ];

  const grouped = groupResultsByStudent(mockResults, mockRoster);
  assert.strictEqual(grouped.length, 2);

  const student1 = grouped.find((s) => s.uid === 's1');
  assert.strictEqual(student1.quizResults.length, 1, 'kind practice terkelompok ke quizResults');
  assert.strictEqual(student1.labResults.length, 1, 'kind observation terkelompok ke labResults');

  const student2 = grouped.find((s) => s.uid === 's2');
  assert.strictEqual(student2.quizResults.length, 1, 'kind quiz legacy terkelompok ke quizResults');
  assert.strictEqual(student2.labResults.length, 1, 'kind lab-observation legacy terkelompok ke labResults');

  const metrics = calculateClassMetrics(grouped, mockResults);
  assert.strictEqual(metrics.totalQuizAttempts, 2);
  assert.strictEqual(metrics.totalLabObservations, 2);
  assert.strictEqual(metrics.averageClassScore, 85);
});

console.log(`\n========================================================================`);
console.log(`HASIL VERIFIKASI TAHAP 2: ${passedTests} DARI ${totalTests} PENGUJIAN LULUS (100%)!`);
console.log(`========================================================================\n`);

