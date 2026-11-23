/**
 * services/quizScoringService.js
 * Layanan terpadu untuk kalkulasi skor kuis dan resolusi bank soal
 * Sesuai PRD §8.12, §10, §11, DATABASE.md, dan AGENT.md
 */

import { LAB_QUIZ_QUESTIONS, getQuestionsByExperiment } from '../data/labQuizQuestions.js';

/**
 * Menghitung skor kuis secara deterministik dan dinamis
 * Rumus: Skor = (Jumlah jawaban benar / Jumlah seluruh soal) × 100
 *
 * Ketentuan:
 * - Setiap soal memiliki bobot yang sama.
 * - Jawaban benar mendapatkan skor sesuai bobot soal (100 / totalQuestions).
 * - Jawaban salah mendapatkan skor 0.
 * - Jawaban kosong / tidak dijawab mendapatkan skor 0 (tidak dianggap benar).
 * - Penyebut selalu jumlah seluruh soal yang digunakan (bukan jumlah yang dijawab).
 * - Tidak ada soal yang dihitung lebih dari satu kali.
 * - Pembulatan konsisten dengan Math.round().
 *
 * @param {Array} questions - Daftar soal kuis aktual yang digunakan
 * @param {Object} answers - Peta jawaban siswa: { [questionId]: optionIndex | optionText }
 * @returns {Object} Hasil kalkulasi { score, totalCorrect, totalQuestions, incorrectAnswers, answersAnalysis }
 */
export function calculateQuizScore(questions, answers = {}) {
  if (!Array.isArray(questions) || questions.length === 0) {
    return {
      score: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      incorrectAnswers: 0,
      answersAnalysis: [],
    };
  }

  const totalQuestions = questions.length;
  let totalCorrect = 0;
  const answersAnalysis = [];

  for (let i = 0; i < totalQuestions; i++) {
    const q = questions[i];
    const rawAns = answers?.[q.id];

    // Cek apakah soal dijawab oleh siswa
    const isAnswered = rawAns !== undefined && rawAns !== null && String(rawAns).trim() !== '';

    let studentAnswerIndex = -1;
    if (isAnswered) {
      const num = Number(rawAns);
      if (!isNaN(num) && num >= 0 && Array.isArray(q.options) && num < q.options.length) {
        studentAnswerIndex = num;
      } else if (Array.isArray(q.options)) {
        studentAnswerIndex = q.options.indexOf(rawAns);
      }
    }

    // Jawaban kosong (unanswered) TIDAK BOLEH dianggap benar
    const isCorrect = isAnswered && (
      (studentAnswerIndex >= 0 && studentAnswerIndex === q.correctAnswer) ||
      (Array.isArray(q.options) && rawAns === q.options[q.correctAnswer])
    );

    if (isCorrect) {
      totalCorrect++;
    }

    const selectedText = isAnswered
      ? (studentAnswerIndex >= 0 && q.options?.[studentAnswerIndex]
          ? q.options[studentAnswerIndex]
          : String(rawAns))
      : 'Tidak dijawab';

    answersAnalysis.push({
      questionId: q.id,
      questionIndex: i,
      question: q,
      studentAnswer: rawAns,
      studentAnswerIndex,
      isAnswered,
      isCorrect,
      selectedText,
    });
  }

  // Rumus: Skor = (Jumlah jawaban benar / Jumlah seluruh soal) × 100
  const rawScore = (totalCorrect / totalQuestions) * 100;
  const score = Math.round(rawScore);

  return {
    score,
    totalCorrect,
    totalQuestions,
    incorrectAnswers: totalQuestions - totalCorrect,
    answersAnalysis,
  };
}

/**
 * Menyelesaikan bank soal yang tepat untuk suatu attempt kuis secara dinamis
 * Mendukung kuis formatif materi (QUIZ_QUESTIONS) dan kuis laboratorium (LAB_QUIZ_QUESTIONS)
 *
 * @param {Object} attempt - Dokumen percobaan kuis { activityId, answers, ... }
 * @param {Array} fallbackQuestions - Soal bawaan jika tidak dapat dideteksi (default QUIZ_QUESTIONS)
 * @returns {Array} Daftar soal yang sesuai untuk attempt tersebut
 */
export function getQuizQuestionsForAttempt(attempt, fallbackQuestions = []) {
  if (!attempt) return fallbackQuestions;

  const activityId = String(attempt.activityId || '');
  const answers = attempt.answers || {};
  const answerKeys = Object.keys(answers);

  let resolvedQuestions = fallbackQuestions;

  // 1. Cek apakah activityId merujuk ke eksperimen laboratorium (misal: 'quiz-exp-suhu' -> 'exp-suhu')
  let expId = null;
  if (activityId.startsWith('quiz-exp-')) {
    expId = activityId.replace(/^quiz-/, '');
  } else if (activityId.startsWith('exp-')) {
    expId = activityId;
  }

  if (expId) {
    const expQuestions = getQuestionsByExperiment(expId);
    if (expQuestions && expQuestions.length > 0 && expQuestions !== LAB_QUIZ_QUESTIONS) {
      resolvedQuestions = expQuestions;
    }
  } else if (answerKeys.some((k) => k.startsWith('lab-q'))) {
    // 2. Deteksi berdasarkan pola questionId di dalam answers (misal: 'lab-q3-temp-1')
    const matching = LAB_QUIZ_QUESTIONS.filter((q) => answerKeys.includes(q.id));
    if (matching.length > 0) {
      const expCounts = {};
      matching.forEach((q) => {
        expCounts[q.relatedExperimentId] = (expCounts[q.relatedExperimentId] || 0) + 1;
      });
      const topExp = Object.keys(expCounts).sort((a, b) => expCounts[b] - expCounts[a])[0];
      if (topExp) {
        resolvedQuestions = getQuestionsByExperiment(topExp);
      } else {
        resolvedQuestions = matching;
      }
    }
  } else {
    // 3. Deteksi apakah memuat ID soal formatif umum ('q1', 'q2', 'q3', 'q4', 'q5')
    resolvedQuestions = fallbackQuestions;
  }

  // Kompatibilitas Hasil Kuis Lama (PRD & Kontrak Hasil Belajar):
  // Jika attempt lawas tercatat memiliki jumlah soal lebih sedikit (misal 4 atau 3 soal),
  // sesuaikan daftar soal agar detail hasil belajar tidak menganggap soal baru belum dijawab.
  if (attempt.totalQuestions && attempt.totalQuestions > 0 && attempt.totalQuestions < resolvedQuestions.length) {
    return resolvedQuestions.slice(0, attempt.totalQuestions);
  }

  // Jika attempt lawas tidak menyimpan field totalQuestions di Firestore,
  // deteksi apakah jawaban siswa hanya mencakup ID soal lawas dan jumlahnya kurang dari bank soal baru:
  const newQuestionIds = [
    'q5',
    'lab-q1-concA-5',
    'lab-q2-concB-4', 'lab-q2-concB-5',
    'lab-q3-temp-4', 'lab-q3-temp-5',
    'lab-q4-cat-4', 'lab-q4-cat-5',
  ];
  const hasAnyNewQuestion = answerKeys.some((k) => newQuestionIds.includes(k));
  if (!hasAnyNewQuestion && answerKeys.length > 0 && answerKeys.length < resolvedQuestions.length) {
    const legacyAttemptedQuestions = resolvedQuestions.filter((q) => answerKeys.includes(q.id));
    if (legacyAttemptedQuestions.length === answerKeys.length) {
      return legacyAttemptedQuestions;
    }
  }

  return resolvedQuestions;
}
