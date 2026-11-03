/**
 * services/resultService.js
 * Pembacaan dan aggregasi hasil belajar siswa dari Cloud Firestore
 * untuk kebutuhan portal Guru (Teacher Dashboard) dan riwayat siswa.
 * Sesuai spesifikasi DATABASE.md dan PRD Bab 11 & 16
 */

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, isConfigured } from './cloudClient.js';
import { getCurrentSession } from './authService.js';

/**
 * Mengambil hasil belajar milik siswa sendiri dari Cloud Firestore
 */
export async function getStudentResults(uid) {
  if (!isConfigured || !db || !uid) return [];

  try {
    const q = query(
      collection(db, 'results'),
      where('ownerId', '==', uid)
    );
    const snap = await getDocs(q);
    const results = [];
    snap.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    // Urutkan dari yang terbaru berdasarkan completedAt
    return results.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  } catch (err) {
    console.warn('[resultService] Gagal mengambil hasil siswa:', err);
    return [];
  }
}

/**
 * Mengambil daftar seluruh anggota roster kelas (khusus Guru)
 */
export async function getClassRoster() {
  if (!isConfigured || !db) return [];

  try {
    const snap = await getDocs(collection(db, 'roster'));
    const roster = [];
    snap.forEach((doc) => {
      roster.push({
        uid: doc.id,
        ...doc.data(),
      });
    });
    return roster.sort((a, b) => (a.alias || '').localeCompare(b.alias || ''));
  } catch (err) {
    console.warn('[resultService] Gagal membaca roster kelas:', err);
    return [];
  }
}

/**
 * Mengambil seluruh hasil belajar kelas dari Cloud Firestore (khusus Guru)
 */
export async function getAllResultsForTeacher() {
  const session = getCurrentSession();
  if (!isConfigured || !db || session.role !== 'teacher') {
    throw new Error('Akses ditolak: Hanya guru yang berhak membaca seluruh hasil kelas.');
  }

  try {
    const snap = await getDocs(collection(db, 'results'));
    const results = [];
    snap.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    // Urutkan dari yang terbaru
    return results.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
  } catch (err) {
    console.error('[resultService] Gagal mengambil hasil kelas untuk guru:', err);
    throw err;
  }
}

/**
 * Mengelompokkan hasil belajar berdasarkan siswa
 */
export function groupResultsByStudent(results, roster = []) {
  const studentMap = {};

  // Inisialisasi peta siswa dari roster
  roster.forEach((r) => {
    studentMap[r.uid] = {
      uid: r.uid,
      alias: r.alias || `Siswa-${r.uid.substring(0, 4)}`,
      active: r.active !== false,
      quizResults: [],
      labResults: [],
      moduleResults: [],
      totalAttempts: 0,
      bestQuizScore: null,
      avgQuizScore: null,
    };
  });

  // Petakan hasil ke masing-masing siswa
  results.forEach((res) => {
    const uid = res.ownerId;
    if (!studentMap[uid]) {
      studentMap[uid] = {
        uid,
        alias: res.alias || `Siswa-${uid.substring(0, 4)}`,
        active: true,
        quizResults: [],
        labResults: [],
        moduleResults: [],
        totalAttempts: 0,
        bestQuizScore: null,
        avgQuizScore: null,
      };
    }

    const s = studentMap[uid];
    s.totalAttempts++;

    if (res.kind === 'quiz') {
      s.quizResults.push(res);
    } else if (res.kind === 'lab-observation') {
      s.labResults.push(res);
    } else if (res.kind === 'module-complete') {
      s.moduleResults.push(res);
    }
  });

  // Hitung ringkasan per siswa
  Object.values(studentMap).forEach((s) => {
    if (s.quizResults.length > 0) {
      const scores = s.quizResults.map((q) => Number(q.score) || 0);
      s.bestQuizScore = Math.max(...scores);
      const sum = scores.reduce((acc, curr) => acc + curr, 0);
      s.avgQuizScore = Math.round(sum / scores.length);
    }
  });

  return Object.values(studentMap);
}

/**
 * Menghitung ringkasan statistik kelas untuk dashboard guru
 */
export function calculateClassMetrics(groupedStudents, allResults) {
  const totalStudents = groupedStudents.length;
  const activeStudents = groupedStudents.filter((s) => s.active).length;
  const participatedStudents = groupedStudents.filter((s) => s.totalAttempts > 0).length;

  const quizResults = allResults.filter((r) => r.kind === 'quiz');
  const labResults = allResults.filter((r) => r.kind === 'lab-observation');

  const quizScores = quizResults
    .map((q) => Number(q.score))
    .filter((s) => !isNaN(s));

  const averageClassScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
    : 0;

  const highestScore = quizScores.length > 0 ? Math.max(...quizScores) : 0;
  const lowestScore = quizScores.length > 0 ? Math.min(...quizScores) : 0;

  return {
    totalStudents,
    activeStudents,
    participatedStudents,
    participationRate: totalStudents > 0 ? Math.round((participatedStudents / totalStudents) * 100) : 0,
    totalQuizAttempts: quizResults.length,
    averageClassScore,
    highestScore,
    lowestScore,
    totalLabObservations: labResults.length,
  };
}
