/**
 * services/resultService.js
 * Pembacaan dan aggregasi hasil belajar siswa dari Cloud Firestore
 * untuk kebutuhan portal Guru (Teacher Dashboard) dan riwayat siswa.
 * Mengimplementasikan Adapter Dual-Read untuk mendukung skema attempts (Handout Bab 4-7)
 * dan skema results (Legacy DATABASE.md).
 */

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, isConfigured } from './cloudClient.js';
import { getCurrentSession } from './authService.js';

/**
 * Mengambil hasil belajar milik siswa sendiri dari Cloud Firestore (Dual-Read)
 */
export async function getStudentResults(uid) {
  if (!isConfigured || !db || !uid) return [];

  const results = [];
  const seenIds = new Set();

  // 1. Koleksi utama Handout: attempts
  try {
    const qAttempts = query(
      collection(db, 'attempts'),
      where('ownerId', '==', uid)
    );
    const snapAttempts = await getDocs(qAttempts);
    snapAttempts.forEach((doc) => {
      seenIds.add(doc.id);
      results.push({ id: doc.id, ...doc.data() });
    });
  } catch (err) {
    console.warn('[resultService] Gagal membaca attempts:', err);
  }

  // 2. Koleksi legacy: results (kompatibilitas backward)
  try {
    const qLegacy = query(
      collection(db, 'results'),
      where('ownerId', '==', uid)
    );
    const snapLegacy = await getDocs(qLegacy);
    snapLegacy.forEach((doc) => {
      if (!seenIds.has(doc.id)) {
        seenIds.add(doc.id);
        results.push({ id: doc.id, ...doc.data() });
      }
    });
  } catch {
    // Abaikan jika koleksi legacy tidak ada atau akses dibatasi
  }

  // Urutkan dari yang terbaru berdasarkan completedAt
  return results.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
}

/**
 * Mengambil daftar seluruh anggota roster kelas khusus Guru (Dual-Read)
 */
export async function getClassRoster() {
  if (!isConfigured || !db) return [];

  const roster = [];
  const seenUids = new Set();

  // 1. Baca dari members/{uid} (Handout)
  try {
    const snapMembers = await getDocs(collection(db, 'members'));
    snapMembers.forEach((doc) => {
      seenUids.add(doc.id);
      const data = doc.data();
      roster.push({
        ...data,
        uid: doc.id,
        alias: data.alias || data.name || (typeof doc.id === 'string' && doc.id.length >= 4 ? `Siswa-${doc.id.substring(0, 4)}` : `Siswa-${doc.id}`),
        active: data.active !== false,
      });
    });
  } catch (err) {
    console.warn('[resultService] Gagal membaca members:', err);
  }

  // 2. Baca dari roster/{uid} (Legacy)
  try {
    const snapRoster = await getDocs(collection(db, 'roster'));
    snapRoster.forEach((doc) => {
      if (!seenUids.has(doc.id)) {
        seenUids.add(doc.id);
        const data = doc.data();
        roster.push({
          ...data,
          uid: doc.id,
          alias: data.alias || (typeof doc.id === 'string' && doc.id.length >= 4 ? `Siswa-${doc.id.substring(0, 4)}` : `Siswa-${doc.id}`),
          active: data.active !== false,
        });
      }
    });
  } catch (err) {
    if (err?.code === 'permission-denied') {
      console.info('[resultService] Koleksi legacy roster tidak dapat diakses (menggunakan data anggota members):', err.message || err);
    } else {
      console.warn('[resultService] Gagal membaca roster legacy:', err);
    }
  }

  return roster.sort((a, b) => (a.alias || '').localeCompare(b.alias || ''));
}

/**
 * Mengambil seluruh hasil belajar kelas dari Cloud Firestore khusus Guru (Dual-Read)
 */
export async function getAllResultsForTeacher() {
  const session = getCurrentSession();
  if (!isConfigured || !db || session.role !== 'teacher') {
    throw new Error('Akses ditolak: Hanya guru yang berhak membaca seluruh hasil kelas.');
  }

  const results = [];
  const seenIds = new Set();

  // 1. Baca dari koleksi utama Handout: attempts
  try {
    const snapAttempts = await getDocs(collection(db, 'attempts'));
    snapAttempts.forEach((doc) => {
      seenIds.add(doc.id);
      results.push({ id: doc.id, ...doc.data() });
    });
  } catch (err) {
    console.warn('[resultService] Gagal membaca koleksi attempts:', err);
  }

  // 2. Baca dari koleksi legacy: results (kompatibilitas backward)
  try {
    const snapLegacy = await getDocs(collection(db, 'results'));
    snapLegacy.forEach((doc) => {
      if (!seenIds.has(doc.id)) {
        seenIds.add(doc.id);
        results.push({ id: doc.id, ...doc.data() });
      }
    });
  } catch {
    // Abaikan jika tidak ada
  }

  // Urutkan dari yang terbaru
  return results.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
}

/**
 * Mengelompokkan hasil belajar berdasarkan siswa
 * Mendukung variasi kind kuis (quiz, practice, diagnostic, pretest, posttest)
 * dan observasi lab (lab-observation, observation)
 */
export function groupResultsByStudent(results, roster = []) {
  const studentMap = {};

  // Inisialisasi peta siswa dari roster
  roster.forEach((r) => {
    const rUid = typeof r?.uid === 'string' && r.uid.trim().length > 0 ? r.uid.trim() : null;
    if (!rUid) return;

    studentMap[rUid] = {
      uid: rUid,
      alias: r.alias || (rUid.length >= 4 ? `Siswa-${rUid.substring(0, 4)}` : `Siswa-${rUid}`),
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
    // Validasi UID kepemilikan hasil belajar sesuai kontrak (ownerId)
    const rawUid = res?.ownerId;
    const uid = typeof rawUid === 'string' && rawUid.trim().length > 0 ? rawUid.trim() : null;

    // Jangan membuat entri siswa tanpa identitas atau menggunakan UID sintetis
    if (!uid) return;

    if (!studentMap[uid]) {
      studentMap[uid] = {
        uid,
        alias: res.alias || (uid.length >= 4 ? `Siswa-${uid.substring(0, 4)}` : `Siswa-${uid}`),
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

    const kind = res.kind;
    if (['quiz', 'practice', 'diagnostic', 'pretest', 'posttest'].includes(kind)) {
      s.quizResults.push(res);
    } else if (['lab-observation', 'observation'].includes(kind)) {
      s.labResults.push(res);
    } else if (kind === 'module-complete') {
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

  const quizResults = allResults.filter((r) =>
    ['quiz', 'practice', 'diagnostic', 'pretest', 'posttest'].includes(r.kind)
  );
  const labResults = allResults.filter((r) =>
    ['lab-observation', 'observation'].includes(r.kind)
  );

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
