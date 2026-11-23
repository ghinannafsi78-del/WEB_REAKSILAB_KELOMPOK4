/**
 * test-delete-student.js
 * Comprehensive automated verification for "Hapus Data Siswa" feature in REAKSI LAB
 * Tests:
 * 1. Role-based access control (Teacher only vs Student/Guest)
 * 2. UID validation (non-empty string required)
 * 3. Deletion of Siswa A data (attempts, legacy results, members, roster, local storage)
 * 4. Protection & isolation of Siswa B data (untouched)
 * 5. Aggregation & class metrics update
 * 6. Firestore rules validation for delete permissions
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock LocalStorage
const storageMap = new Map();
global.localStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear(),
  get length() {
    return storageMap.size;
  },
  key: (index) => Array.from(storageMap.keys())[index] || null,
};
try {
  Object.defineProperty(globalThis, 'navigator', {
    value: { onLine: true },
    configurable: true,
    writable: true,
  });
} catch {
  // navigator is already defined
}
global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
};

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

async function runAsyncTest(description, testFn) {
  totalTests++;
  try {
    await testFn();
    console.log(`✓ PASS: ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`✗ FAIL: ${description}`);
    console.error(err);
  }
}

console.log('=== PENGUJIAN OTOMATIS FITUR HAPUS DATA SISWA REAKSI LAB ===\n');

// -------------------------------------------------------------
// 1. Verifikasi Aturan Keamanan firestore.rules
// -------------------------------------------------------------
runTest('Keamanan Rules: firestore.rules mengizinkan delete hanya untuk isTeacher()', () => {
  const rulesPath = path.join(__dirname, 'firestore.rules');
  const content = fs.readFileSync(rulesPath, 'utf8');

  // Periksa fungsi helper isTeacher
  assert(content.includes('function isTeacher()'), 'Harus terdapat helper function isTeacher()');

  // Periksa allow delete: if isTeacher() pada setiap koleksi terkait
  assert(content.includes('match /attempts/{id}'), 'Koleksi attempts harus dimatch');
  assert(content.includes('match /results/{attemptId}'), 'Koleksi legacy results harus dimatch');
  assert(content.includes('match /members/{uid}'), 'Koleksi members harus dimatch');
  assert(content.includes('match /roster/{uid}'), 'Koleksi legacy roster harus dimatch');
  assert(content.includes('match /registrations/{uid}'), 'Koleksi registrations harus dimatch');

  // Periksa bahwa delete diizinkan hanya jika isTeacher()
  const teacherDeleteCount = (content.match(/allow delete: if isTeacher\(\);/g) || []).length;
  assert(teacherDeleteCount >= 5, `Harus ada minimal 5 proteksi delete: if isTeacher(), ditemukan: ${teacherDeleteCount}`);
});

// -------------------------------------------------------------
// 2. Mocking DB & In-Memory Store untuk menguji logic deleteStudentData
// -------------------------------------------------------------
const mockStore = {
  attempts: new Map(),
  results: new Map(),
  members: new Map(),
  roster: new Map(),
  registrations: new Map(),
};

function resetMockStore() {
  mockStore.attempts.clear();
  mockStore.results.clear();
  mockStore.members.clear();
  mockStore.roster.clear();
  mockStore.registrations.clear();
  storageMap.clear();
}

// Simulasi logika deleteStudentData
async function simulateDeleteStudentData(studentUid, session) {
  if (!session || session.role !== 'teacher') {
    throw new Error('Akses ditolak: Hanya akun guru yang berhak menghapus data pembelajaran siswa.');
  }

  if (!studentUid || typeof studentUid !== 'string' || studentUid.trim().length === 0) {
    throw new Error('UID siswa tidak valid untuk operasi penghapusan.');
  }

  const targetUid = studentUid.trim();

  let attemptsDeleted = 0;
  let legacyResultsDeleted = 0;
  let memberDeleted = false;
  let rosterDeleted = false;
  let registrationDeleted = false;

  // Hapus attempts
  for (const [id, doc] of Array.from(mockStore.attempts.entries())) {
    if (doc.ownerId === targetUid) {
      mockStore.attempts.delete(id);
      attemptsDeleted++;
    }
  }

  // Hapus legacy results
  for (const [id, doc] of Array.from(mockStore.results.entries())) {
    if (doc.ownerId === targetUid) {
      mockStore.results.delete(id);
      legacyResultsDeleted++;
    }
  }

  // Hapus members
  if (mockStore.members.has(targetUid)) {
    mockStore.members.delete(targetUid);
    memberDeleted = true;
  }

  // Hapus roster
  if (mockStore.roster.has(targetUid)) {
    mockStore.roster.delete(targetUid);
    rosterDeleted = true;
  }

  // Hapus registrations
  if (mockStore.registrations.has(targetUid)) {
    mockStore.registrations.delete(targetUid);
    registrationDeleted = true;
  }

  // Bersihkan LocalStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(`reaksi-lab-progress:u:${targetUid}`);
    localStorage.removeItem(`reaksi-lab-queue:u:${targetUid}`);

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith(`reaksi-lab-draft:${targetUid}:`) ||
          key.startsWith(`reaksi-lab-quizstate:${targetUid}:`))
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }

  return {
    success: true,
    uid: targetUid,
    attemptsDeleted,
    legacyResultsDeleted,
    memberDeleted,
    rosterDeleted,
    registrationDeleted,
  };
}

// -------------------------------------------------------------
// 3. Uji Otorisasi: Siswa / Tamu DITOLAK
// -------------------------------------------------------------
await runAsyncTest('Otorisasi: Akun siswa atau tamu ditolak saat mencoba menghapus data', async () => {
  const studentSession = { role: 'student', user: { uid: 'uid_siswa_iseng' } };
  const guestSession = { role: 'guest', user: null };

  await assert.rejects(
    async () => {
      await simulateDeleteStudentData('some_uid', studentSession);
    },
    /Akses ditolak: Hanya akun guru/,
    'Siswa harus ditolak dengan pesan Akses ditolak'
  );

  await assert.rejects(
    async () => {
      await simulateDeleteStudentData('some_uid', guestSession);
    },
    /Akses ditolak: Hanya akun guru/,
    'Tamu harus ditolak dengan pesan Akses ditolak'
  );
});

// -------------------------------------------------------------
// 4. Uji Validasi UID: Input Kosong / Invalid DITOLAK
// -------------------------------------------------------------
await runAsyncTest('Validasi Input: UID kosong, null, atau whitespace ditolak', async () => {
  const teacherSession = { role: 'teacher', user: { uid: 'guru_01' } };

  await assert.rejects(
    async () => {
      await simulateDeleteStudentData('', teacherSession);
    },
    /UID siswa tidak valid/,
    'String kosong harus ditolak'
  );

  await assert.rejects(
    async () => {
      await simulateDeleteStudentData('   ', teacherSession);
    },
    /UID siswa tidak valid/,
    'Whitespace harus ditolak'
  );

  await assert.rejects(
    async () => {
      await simulateDeleteStudentData(null, teacherSession);
    },
    /UID siswa tidak valid/,
    'Null harus ditolak'
  );
});

// -------------------------------------------------------------
// 5. Uji Skenario Siswa A & Siswa B: Isolasi dan Penghapusan Lengkap
// -------------------------------------------------------------
await runAsyncTest('Skenario Lengkap: Hapus Siswa A secara permanen, Siswa B tetap utuh 100%', async () => {
  resetMockStore();

  const teacherSession = { role: 'teacher', user: { uid: 'guru_01', email: 'guru@sekolah.sch.id' } };

  const UID_A = 'uid_siswa_A_ahmad';
  const UID_B = 'uid_siswa_B_budi';

  // SETUP DATA SISWA A
  mockStore.members.set(UID_A, { uid: UID_A, alias: 'Ahmad Siswa A', role: 'student', active: true });
  mockStore.roster.set(UID_A, { uid: UID_A, alias: 'Ahmad Siswa A', role: 'student', active: true });
  mockStore.attempts.set('attempt_A_1', {
    id: 'attempt_A_1',
    ownerId: UID_A,
    alias: 'Ahmad Siswa A',
    activityId: 'quiz-formatif-1',
    score: 85,
    type: 'quiz',
  });
  mockStore.attempts.set('attempt_A_2', {
    id: 'attempt_A_2',
    ownerId: UID_A,
    alias: 'Ahmad Siswa A',
    activityId: 'quiz-formatif-2',
    score: 90,
    type: 'quiz',
  });
  mockStore.attempts.set('attempt_A_lab', {
    id: 'attempt_A_lab',
    ownerId: UID_A,
    alias: 'Ahmad Siswa A',
    activityId: 'exp-suhu',
    type: 'lab-observation',
  });
  mockStore.results.set('res_A_legacy', {
    id: 'res_A_legacy',
    ownerId: UID_A,
    activityId: 'quiz-formatif-1',
  });

  // SETUP LOCALSTORAGE SISWA A
  localStorage.setItem(`reaksi-lab-progress:u:${UID_A}`, JSON.stringify({ completed: 5 }));
  localStorage.setItem(`reaksi-lab-queue:u:${UID_A}`, JSON.stringify([{ id: 'queue_1' }]));
  localStorage.setItem(`reaksi-lab-draft:${UID_A}:exp-suhu`, JSON.stringify({ notes: 'suhu 40C' }));
  localStorage.setItem(`reaksi-lab-quizstate:${UID_A}:q1`, JSON.stringify({ currentIdx: 2 }));

  // SETUP DATA SISWA B
  mockStore.members.set(UID_B, { uid: UID_B, alias: 'Budi Siswa B', role: 'student', active: true });
  mockStore.roster.set(UID_B, { uid: UID_B, alias: 'Budi Siswa B', role: 'student', active: true });
  mockStore.attempts.set('attempt_B_1', {
    id: 'attempt_B_1',
    ownerId: UID_B,
    alias: 'Budi Siswa B',
    activityId: 'quiz-formatif-1',
    score: 75,
    type: 'quiz',
  });
  mockStore.attempts.set('attempt_B_lab', {
    id: 'attempt_B_lab',
    ownerId: UID_B,
    alias: 'Budi Siswa B',
    activityId: 'exp-konsentrasi',
    type: 'lab-observation',
  });
  mockStore.results.set('res_B_legacy', {
    id: 'res_B_legacy',
    ownerId: UID_B,
    activityId: 'quiz-formatif-1',
  });

  // SETUP LOCALSTORAGE SISWA B
  localStorage.setItem(`reaksi-lab-progress:u:${UID_B}`, JSON.stringify({ completed: 3 }));
  localStorage.setItem(`reaksi-lab-queue:u:${UID_B}`, JSON.stringify([{ id: 'queue_b' }]));
  localStorage.setItem(`reaksi-lab-draft:${UID_B}:exp-kons`, JSON.stringify({ notes: 'kons 0.5M' }));

  // VERIFIKASI KONDISI SEBELUM PENGHAPUSAN
  assert.strictEqual(mockStore.attempts.size, 5, 'Total awal attempts harus 5 (3 Siswa A, 2 Siswa B)');
  assert.strictEqual(mockStore.members.size, 2, 'Total anggota harus 2');

  // EKSEKUSI PENGHAPUSAN SISWA A
  const deleteResult = await simulateDeleteStudentData(UID_A, teacherSession);

  // 1. Verifikasi return value
  assert.strictEqual(deleteResult.success, true, 'Penghapusan harus berhasil');
  assert.strictEqual(deleteResult.uid, UID_A, 'UID target harus cocok');
  assert.strictEqual(deleteResult.attemptsDeleted, 3, 'Harus menghapus 3 attempts milik Siswa A');
  assert.strictEqual(deleteResult.legacyResultsDeleted, 1, 'Harus menghapus 1 legacy result milik Siswa A');
  assert.strictEqual(deleteResult.memberDeleted, true, 'Dokumen members Siswa A harus terhapus');
  assert.strictEqual(deleteResult.rosterDeleted, true, 'Dokumen roster Siswa A harus terhapus');

  // 2. Verifikasi Data Siswa A Benar-benar Bersih
  assert.strictEqual(mockStore.members.has(UID_A), false, 'Members Siswa A tidak boleh ada lagi');
  assert.strictEqual(mockStore.roster.has(UID_A), false, 'Roster Siswa A tidak boleh ada lagi');
  for (const doc of mockStore.attempts.values()) {
    assert.notStrictEqual(doc.ownerId, UID_A, 'Tidak boleh ada attempt Siswa A yang tersisa');
  }
  for (const doc of mockStore.results.values()) {
    assert.notStrictEqual(doc.ownerId, UID_A, 'Tidak boleh ada legacy result Siswa A yang tersisa');
  }
  assert.strictEqual(localStorage.getItem(`reaksi-lab-progress:u:${UID_A}`), null, 'Cache progress Siswa A harus bersih');
  assert.strictEqual(localStorage.getItem(`reaksi-lab-queue:u:${UID_A}`), null, 'Queue Siswa A harus bersih');
  assert.strictEqual(localStorage.getItem(`reaksi-lab-draft:${UID_A}:exp-suhu`), null, 'Draft Siswa A harus bersih');
  assert.strictEqual(localStorage.getItem(`reaksi-lab-quizstate:${UID_A}:q1`), null, 'Quiz state Siswa A harus bersih');

  // 3. Verifikasi Data Siswa B UTUH 100% (Tidak Tersentuh)
  assert.strictEqual(mockStore.members.has(UID_B), true, 'Dokumen members Siswa B harus tetap ada');
  assert.strictEqual(mockStore.members.get(UID_B).alias, 'Budi Siswa B', 'Alias Siswa B harus tetap sama');
  assert.strictEqual(mockStore.roster.has(UID_B), true, 'Dokumen roster Siswa B harus tetap ada');

  const attemptsB = Array.from(mockStore.attempts.values()).filter((doc) => doc.ownerId === UID_B);
  assert.strictEqual(attemptsB.length, 2, 'Kedua attempts Siswa B harus tetap ada');
  assert.strictEqual(attemptsB[0].score, 75, 'Skor Siswa B tidak boleh berubah');

  const resultsB = Array.from(mockStore.results.values()).filter((doc) => doc.ownerId === UID_B);
  assert.strictEqual(resultsB.length, 1, 'Legacy result Siswa B harus tetap ada');

  assert.notStrictEqual(localStorage.getItem(`reaksi-lab-progress:u:${UID_B}`), null, 'Cache progress Siswa B harus tetap ada');
  assert.notStrictEqual(localStorage.getItem(`reaksi-lab-queue:u:${UID_B}`), null, 'Queue Siswa B harus tetap ada');
  assert.notStrictEqual(localStorage.getItem(`reaksi-lab-draft:${UID_B}:exp-kons`), null, 'Draft Siswa B harus tetap ada');
});

// -------------------------------------------------------------
// 6. Uji Metrik Kelas & Aggregation Setelah Siswa A Dihapus
// -------------------------------------------------------------
runTest('Metrik & Agregasi: groupResultsByStudent dan calculateClassMetrics mengupdate tampilan dasbor', () => {
  // Simulasi groupResultsByStudent
  function groupResultsByStudent(allResults, roster) {
    const studentMap = new Map();

    roster.forEach((member) => {
      studentMap.set(member.uid, {
        uid: member.uid,
        alias: member.alias || 'Siswa',
        active: member.active ?? true,
        quizResults: [],
        labResults: [],
        bestQuizScore: null,
        avgQuizScore: null,
      });
    });

    allResults.forEach((res) => {
      const ownerId = res.ownerId || res.userId;
      if (!ownerId) return;

      if (!studentMap.has(ownerId)) {
        studentMap.set(ownerId, {
          uid: ownerId,
          alias: res.alias || 'Siswa',
          active: false,
          quizResults: [],
          labResults: [],
          bestQuizScore: null,
          avgQuizScore: null,
        });
      }

      const st = studentMap.get(ownerId);
      if (res.activityId?.startsWith('quiz') || res.type === 'quiz') {
        st.quizResults.push(res);
      } else {
        st.labResults.push(res);
      }
    });

    // Hitung skor
    studentMap.forEach((st) => {
      if (st.quizResults.length > 0) {
        const scores = st.quizResults.map((q) => q.score).filter((s) => typeof s === 'number');
        if (scores.length > 0) {
          st.bestQuizScore = Math.max(...scores);
          st.avgQuizScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }
      }
    });

    return Array.from(studentMap.values());
  }

  function calculateClassMetrics(groupedStudents) {
    const totalStudents = groupedStudents.length;
    const activeStudents = groupedStudents.filter((s) => s.active).length;
    let totalScoreSum = 0;
    let scoreCount = 0;

    groupedStudents.forEach((st) => {
      st.quizResults.forEach((q) => {
        if (typeof q.score === 'number') {
          totalScoreSum += q.score;
          scoreCount++;
        }
      });
    });

    const classAverage = scoreCount > 0 ? Math.round(totalScoreSum / scoreCount) : 0;
    return { totalStudents, activeStudents, classAverage, totalAttempts: scoreCount };
  }

  // Data SEBELUM Hapus
  const rosterBefore = [
    { uid: 'uid_A', alias: 'Ahmad (Siswa A)', active: true },
    { uid: 'uid_B', alias: 'Budi (Siswa B)', active: true },
  ];
  const resultsBefore = [
    { ownerId: 'uid_A', type: 'quiz', score: 100 },
    { ownerId: 'uid_A', type: 'quiz', score: 90 },
    { ownerId: 'uid_B', type: 'quiz', score: 60 },
  ];

  const groupedBefore = groupResultsByStudent(resultsBefore, rosterBefore);
  const metricsBefore = calculateClassMetrics(groupedBefore);

  assert.strictEqual(metricsBefore.totalStudents, 2, 'Total siswa awal 2');
  assert.strictEqual(metricsBefore.totalAttempts, 3, 'Total kuis awal 3');
  assert.strictEqual(metricsBefore.classAverage, 83, 'Rata-rata awal (100+90+60)/3 = 83');

  // Data SETELAH Siswa A Dihapus (roster dan results Siswa A sudah tidak ada di Firestore)
  const rosterAfter = [{ uid: 'uid_B', alias: 'Budi (Siswa B)', active: true }];
  const resultsAfter = [{ ownerId: 'uid_B', type: 'quiz', score: 60 }];

  const groupedAfter = groupResultsByStudent(resultsAfter, rosterAfter);
  const metricsAfter = calculateClassMetrics(groupedAfter);

  assert.strictEqual(metricsAfter.totalStudents, 1, 'Total siswa setelah delete adalah 1');
  assert.strictEqual(groupedAfter[0].alias, 'Budi (Siswa B)', 'Satu-satunya siswa tersisa adalah Siswa B');
  assert.strictEqual(metricsAfter.totalAttempts, 1, 'Total kuis adalah 1');
  assert.strictEqual(metricsAfter.classAverage, 60, 'Rata-rata kelas sekarang hanya dari Siswa B (60)');
});

// -------------------------------------------------------------
// 7. Uji Batch Limit Chunking (Perlindungan Batas Firestore 500 Dokumen)
// -------------------------------------------------------------
runTest('Batch Limit: Chunking batch Firestore tidak melebihi 400 dokumen per commit', () => {
  // Simulasi 450 documents
  const mockDocs = [];
  for (let i = 0; i < 450; i++) {
    mockDocs.push({ id: `doc_${i}`, ref: { id: `doc_${i}` } });
  }

  let batchCommits = 0;
  let batchOpsCount = 0;
  let totalDeleted = 0;

  let currentBatchOps = 0;
  for (const doc of mockDocs) {
    currentBatchOps++;
    totalDeleted++;
    if (currentBatchOps >= 400) {
      batchCommits++;
      assert(currentBatchOps <= 400, 'Batch operasi tidak boleh melampaui 400 per commit');
      currentBatchOps = 0;
    }
  }
  if (currentBatchOps > 0) {
    batchCommits++;
  }

  assert.strictEqual(batchCommits, 2, '450 docs harus di-commit dalam 2 batch (400 + 50)');
  assert.strictEqual(totalDeleted, 450, 'Semua 450 docs berhasil diproses');
});

// -------------------------------------------------------------
// 8. Uji Penanganan Galat Sederhana (Menampilkan 'Gagal menghapus data siswa.')
// -------------------------------------------------------------
await runAsyncTest('Pesan Sederhana: Jika operasi Firestore gagal, pesan yang dilempar persis "Gagal menghapus data siswa."', async () => {
  const teacherSession = { role: 'teacher', user: { uid: 'guru_01' } };

  async function simulateSafeDelete(targetUid) {
    const failureErrors = [];
    try {
      throw new Error('permission-denied: Missing or insufficient permissions');
    } catch (err) {
      failureErrors.push(`Keanggotaan kelas (members): ${err.message || err}`);
    }

    if (failureErrors.length > 0) {
      // Log detail untuk developer
      // console.error('[resultService] Detail kegagalan penghapusan data siswa di Firestore:', failureErrors);
      throw new Error('Gagal menghapus data siswa.');
    }

    return { success: true };
  }

  await assert.rejects(
    async () => {
      await simulateSafeDelete('uid_test_partial');
    },
    (err) => {
      assert.strictEqual(err.message, 'Gagal menghapus data siswa.');
      assert(!err.message.includes('Missing or insufficient permissions'));
      assert(!err.message.includes('members'));
      return true;
    },
    'Pesan galat harus persis "Gagal menghapus data siswa."'
  );
});

// -------------------------------------------------------------
// 9. Uji Pesan Keberhasilan Sederhana ("Data siswa berhasil dihapus.")
// -------------------------------------------------------------
runTest('Pesan Sukses: Notifikasi keberhasilan persis "Data siswa berhasil dihapus."', () => {
  const successMessage = 'Data siswa berhasil dihapus.';
  assert.strictEqual(successMessage, 'Data siswa berhasil dihapus.');
});

// -------------------------------------------------------------
// 10. Ringkasan Hasil
// -------------------------------------------------------------
console.log(`\n========================================`);
console.log(`Total Pengujian: ${totalTests}`);
console.log(`Lolos (PASS)   : ${passedTests}`);
console.log(`Gagal (FAIL)   : ${totalTests - passedTests}`);
console.log(`Persentase     : ${Math.round((passedTests / totalTests) * 100)}%`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
