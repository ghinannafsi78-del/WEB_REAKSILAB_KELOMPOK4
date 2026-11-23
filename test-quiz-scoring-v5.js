/**
 * test-quiz-scoring-v5.js
 * Comprehensive automated verification for 5-Question Quizzes & Dynamic Scoring in REAKSI LAB
 * Tests:
 * 1. Question Inventory across all quizzes (each has exactly 5 questions)
 * 2. Question Schema & Quality (ID, category, prompt, options, correctAnswer, explanation)
 * 3. Deterministic 5-Question Scoring Scale (100, 80, 60, 40, 20, 0)
 * 4. Backward Compatibility with Legacy 4-Question & 3-Question attempts
 * 5. Dynamic Question Resolver (getQuizQuestionsForAttempt)
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { LAB_QUIZ_QUESTIONS, getQuestionsByExperiment } from './src/data/labQuizQuestions.js';
import { calculateQuizScore, getQuizQuestionsForAttempt } from './src/services/quizScoringService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read QuizPage.jsx to extract QUIZ_QUESTIONS
const quizPageContent = fs.readFileSync(path.join(__dirname, 'src/pages/QuizPage.jsx'), 'utf8');
const matchQuizQuestions = quizPageContent.match(/export const QUIZ_QUESTIONS = (\[[\s\S]*?\n\]);/);
assert(matchQuizQuestions, 'QUIZ_QUESTIONS harus dapat dibaca dari QuizPage.jsx');

// Parse QUIZ_QUESTIONS safely
let QUIZ_QUESTIONS;
try {
  QUIZ_QUESTIONS = new Function(`return ${matchQuizQuestions[1]}`)();
} catch (err) {
  throw new Error(`Gagal mem-parse QUIZ_QUESTIONS: ${err.message}`);
}

let totalTests = 0;
let passedTests = 0;

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

console.log('=== PENGUJIAN INVENTARISASI 5 SOAL & SISTEM PENILAIAN REAKSI LAB ===\n');

// -------------------------------------------------------------
// 1. INVENTARISASI SOAL PADA SETIAP KUIS (WAJIB TEPAT 5 SOAL)
// -------------------------------------------------------------
runTest('Inventarisasi: Kuis Formatif (QuizPage) memiliki tepat 5 soal', () => {
  assert.strictEqual(QUIZ_QUESTIONS.length, 5, `Harus 5 soal, ditemukan: ${QUIZ_QUESTIONS.length}`);
  const ids = QUIZ_QUESTIONS.map((q) => q.id);
  assert.deepStrictEqual(ids, ['q1', 'q2', 'q3', 'q4', 'q5']);
});

runTest('Inventarisasi: LAB-01 (exp-konsentrasi) memiliki tepat 5 soal', () => {
  const qs = getQuestionsByExperiment('exp-konsentrasi');
  assert.strictEqual(qs.length, 5, `Harus 5 soal, ditemukan: ${qs.length}`);
  const ids = qs.map((q) => q.id);
  assert.deepStrictEqual(ids, [
    'lab-q1-concA-1',
    'lab-q1-concA-2',
    'lab-q1-concA-3',
    'lab-q1-concA-4',
    'lab-q1-concA-5',
  ]);
});

runTest('Inventarisasi: LAB-02 (exp-konsentrasi-b) memiliki tepat 5 soal', () => {
  const qs = getQuestionsByExperiment('exp-konsentrasi-b');
  assert.strictEqual(qs.length, 5, `Harus 5 soal, ditemukan: ${qs.length}`);
  const ids = qs.map((q) => q.id);
  assert.deepStrictEqual(ids, [
    'lab-q2-concB-1',
    'lab-q2-concB-2',
    'lab-q2-concB-3',
    'lab-q2-concB-4',
    'lab-q2-concB-5',
  ]);
});

runTest('Inventarisasi: LAB-03 (exp-suhu) memiliki tepat 5 soal', () => {
  const qs = getQuestionsByExperiment('exp-suhu');
  assert.strictEqual(qs.length, 5, `Harus 5 soal, ditemukan: ${qs.length}`);
  const ids = qs.map((q) => q.id);
  assert.deepStrictEqual(ids, [
    'lab-q3-temp-1',
    'lab-q3-temp-2',
    'lab-q3-temp-3',
    'lab-q3-temp-4',
    'lab-q3-temp-5',
  ]);
});

runTest('Inventarisasi: LAB-04 (exp-katalis) memiliki tepat 5 soal', () => {
  const qs = getQuestionsByExperiment('exp-katalis');
  assert.strictEqual(qs.length, 5, `Harus 5 soal, ditemukan: ${qs.length}`);
  const ids = qs.map((q) => q.id);
  assert.deepStrictEqual(ids, [
    'lab-q4-cat-1',
    'lab-q4-cat-2',
    'lab-q4-cat-3',
    'lab-q4-cat-4',
    'lab-q4-cat-5',
  ]);
});

runTest('Inventarisasi Total: Bank soal laboratorium memuat total 20 soal (4 kuis × 5 soal)', () => {
  assert.strictEqual(LAB_QUIZ_QUESTIONS.length, 20);
});

// -------------------------------------------------------------
// 2. INTEGRITAS STRUKTUR & KUALITAS SOAL KELIMA
// -------------------------------------------------------------
runTest('Integritas Soal: Seluruh 25 soal memiliki ID unik, opsi valid, dan satu kunci jawaban benar', () => {
  const allQuestions = [...QUIZ_QUESTIONS, ...LAB_QUIZ_QUESTIONS];
  assert.strictEqual(allQuestions.length, 25, 'Total seluruh soal di aplikasi harus 25');

  const seenIds = new Set();
  allQuestions.forEach((q, idx) => {
    // Unique ID
    assert(q.id && typeof q.id === 'string', `Soal index ${idx} harus memiliki ID string`);
    assert(!seenIds.has(q.id), `ID soal '${q.id}' terduplikasi`);
    seenIds.add(q.id);

    // Kategori & Teks Soal
    assert(q.category && typeof q.category === 'string', `Soal '${q.id}' harus memiliki kategori`);
    assert(q.question && typeof q.question === 'string' && q.question.length > 10, `Teks soal '${q.id}' harus valid`);

    // Opsi Pilihan Ganda
    assert(Array.isArray(q.options) && q.options.length >= 4, `Soal '${q.id}' harus memiliki minimal 4 opsi`);
    q.options.forEach((opt, optIdx) => {
      assert(typeof opt === 'string' && opt.trim().length > 0, `Opsi ${optIdx} pada soal '${q.id}' tidak boleh kosong`);
    });

    // Kunci Jawaban
    assert(
      typeof q.correctAnswer === 'number' &&
      Number.isInteger(q.correctAnswer) &&
      q.correctAnswer >= 0 &&
      q.correctAnswer < q.options.length,
      `Soal '${q.id}' harus memiliki correctAnswer integer yang menunjuk ke indeks opsi valid`
    );

    // Pembahasan
    assert(q.explanation && typeof q.explanation === 'string', `Soal '${q.id}' harus memiliki explanation`);
  });
});

// -------------------------------------------------------------
// 3. PENGUJIAN SKALA PENILAIAN DETERMINISTIK 5 SOAL
// -------------------------------------------------------------
runTest('Skala Nilai 5 Soal: Memverifikasi tabel skor persis (5=100, 4=80, 3=60, 2=40, 1=20, 0=0)', () => {
  const questions = QUIZ_QUESTIONS; // 5 questions

  // 5 Benar (100%)
  const ans5 = {
    q1: String(questions[0].correctAnswer),
    q2: String(questions[1].correctAnswer),
    q3: String(questions[2].correctAnswer),
    q4: String(questions[3].correctAnswer),
    q5: String(questions[4].correctAnswer),
  };
  const res5 = calculateQuizScore(questions, ans5);
  assert.strictEqual(res5.totalCorrect, 5);
  assert.strictEqual(res5.totalQuestions, 5);
  assert.strictEqual(res5.score, 100);

  // 4 Benar, 1 Salah (80%)
  const ans4 = {
    ...ans5,
    q5: String((questions[4].correctAnswer + 1) % 4), // salah
  };
  const res4 = calculateQuizScore(questions, ans4);
  assert.strictEqual(res4.totalCorrect, 4);
  assert.strictEqual(res4.score, 80);

  // 3 Benar, 2 Salah (60%)
  const ans3 = {
    ...ans4,
    q4: String((questions[3].correctAnswer + 1) % 4), // salah
  };
  const res3 = calculateQuizScore(questions, ans3);
  assert.strictEqual(res3.totalCorrect, 3);
  assert.strictEqual(res3.score, 60);

  // 2 Benar, 3 Salah (40%)
  const ans2 = {
    ...ans3,
    q3: String((questions[2].correctAnswer + 1) % 4), // salah
  };
  const res2 = calculateQuizScore(questions, ans2);
  assert.strictEqual(res2.totalCorrect, 2);
  assert.strictEqual(res2.score, 40);

  // 1 Benar, 4 Salah (20%)
  const ans1 = {
    ...ans2,
    q2: String((questions[1].correctAnswer + 1) % 4), // salah
  };
  const res1 = calculateQuizScore(questions, ans1);
  assert.strictEqual(res1.totalCorrect, 1);
  assert.strictEqual(res1.score, 20);

  // 0 Benar, 5 Salah (0%)
  const ans0 = {
    ...ans1,
    q1: String((questions[0].correctAnswer + 1) % 4), // salah
  };
  const res0 = calculateQuizScore(questions, ans0);
  assert.strictEqual(res0.totalCorrect, 0);
  assert.strictEqual(res0.score, 0);
});

runTest('Penilaian Jawaban Kosong: Jawaban tidak diisi atau undefined bernilai 0 dan tidak menambah skor', () => {
  const questions = QUIZ_QUESTIONS; // 5 questions

  // Hanya menjawab 2 soal dengan benar, sisanya kosong
  const partialAnswers = {
    q1: String(questions[0].correctAnswer),
    q2: String(questions[1].correctAnswer),
    // q3, q4, q5 tidak diisi
  };

  const res = calculateQuizScore(questions, partialAnswers);
  assert.strictEqual(res.totalCorrect, 2);
  assert.strictEqual(res.totalQuestions, 5);
  assert.strictEqual(res.score, 40); // 2/5 * 100 = 40
  assert.strictEqual(res.incorrectAnswers, 3);

  // Analisis butir soal
  assert.strictEqual(res.answersAnalysis[0].isCorrect, true);
  assert.strictEqual(res.answersAnalysis[1].isCorrect, true);
  assert.strictEqual(res.answersAnalysis[2].isAnswered, false);
  assert.strictEqual(res.answersAnalysis[2].isCorrect, false);
  assert.strictEqual(res.answersAnalysis[2].selectedText, 'Tidak dijawab');
  assert.strictEqual(res.answersAnalysis[3].isAnswered, false);
  assert.strictEqual(res.answersAnalysis[4].isAnswered, false);
});

// -------------------------------------------------------------
// 4. PENGUJIAN PENYELESAI SOAL DINAMIS (RESOLVER) & KOMPATIBILITAS KUIS LAMA
// -------------------------------------------------------------
runTest('Resolver Kuis Baru: Attempt kuis formatif baru dengan 5 soal me-resolve 5 soal', () => {
  const newAttempt = {
    activityId: 'quiz-formatif-laju',
    totalQuestions: 5,
    answers: { q1: '2', q2: '1', q3: '0', q4: '2', q5: '1' },
  };
  const resolved = getQuizQuestionsForAttempt(newAttempt, QUIZ_QUESTIONS);
  assert.strictEqual(resolved.length, 5);
  assert.strictEqual(resolved[4].id, 'q5');
});

runTest('Resolver Kuis Baru: Attempt lab exp-suhu baru dengan 5 soal me-resolve 5 soal', () => {
  const newLabAttempt = {
    activityId: 'quiz-exp-suhu',
    totalQuestions: 5,
    answers: {
      'lab-q3-temp-1': '1',
      'lab-q3-temp-2': '1',
      'lab-q3-temp-3': '1',
      'lab-q3-temp-4': '0',
      'lab-q3-temp-5': '1',
    },
  };
  const resolved = getQuizQuestionsForAttempt(newLabAttempt, QUIZ_QUESTIONS);
  assert.strictEqual(resolved.length, 5);
  assert.strictEqual(resolved[4].id, 'lab-q3-temp-5');
});

runTest('Kompatibilitas Kuis Lama: Attempt formatif lama (4 soal) tetap di-resolve sebagai 4 soal tanpa soal ke-5 palsu', () => {
  const legacyAttempt = {
    activityId: 'quiz-formatif-laju',
    totalQuestions: 4,
    score: 75,
    answers: { q1: '2', q2: '1', q3: '0', q4: '1' }, // 3 benar, 1 salah
  };
  const resolved = getQuizQuestionsForAttempt(legacyAttempt, QUIZ_QUESTIONS);
  assert.strictEqual(resolved.length, 4, 'Attempt lama harus tetap 4 soal');
  assert.deepStrictEqual(resolved.map((q) => q.id), ['q1', 'q2', 'q3', 'q4']);

  // Hitung skor pada 4 soal tetap 75%
  const scoring = calculateQuizScore(resolved, legacyAttempt.answers);
  assert.strictEqual(scoring.totalQuestions, 4);
  assert.strictEqual(scoring.totalCorrect, 3);
  assert.strictEqual(scoring.score, 75);
});

runTest('Kompatibilitas Kuis Lama: Attempt lab lama (3 soal) tetap di-resolve sebagai 3 soal', () => {
  const legacyLabAttempt = {
    activityId: 'quiz-exp-suhu',
    totalQuestions: 3,
    score: 67,
    answers: {
      'lab-q3-temp-1': '1',
      'lab-q3-temp-2': '1',
      'lab-q3-temp-3': '0',
    },
  };
  const resolved = getQuizQuestionsForAttempt(legacyLabAttempt, QUIZ_QUESTIONS);
  assert.strictEqual(resolved.length, 3, 'Attempt lab lama harus tetap 3 soal');
  assert.deepStrictEqual(resolved.map((q) => q.id), [
    'lab-q3-temp-1',
    'lab-q3-temp-2',
    'lab-q3-temp-3',
  ]);

  const scoring = calculateQuizScore(resolved, legacyLabAttempt.answers);
  assert.strictEqual(scoring.totalQuestions, 3);
  assert.strictEqual(scoring.totalCorrect, 2);
  assert.strictEqual(scoring.score, 67); // Math.round((2/3)*100) = 67
});

// -------------------------------------------------------------
// 5. RINGKASAN HASIL
// -------------------------------------------------------------
console.log(`\n========================================`);
console.log(`Total Pengujian : ${totalTests}`);
console.log(`Lolos (PASS)    : ${passedTests}`);
console.log(`Gagal (FAIL)    : ${totalTests - passedTests}`);
console.log(`Persentase      : ${Math.round((passedTests / totalTests) * 100)}%`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
