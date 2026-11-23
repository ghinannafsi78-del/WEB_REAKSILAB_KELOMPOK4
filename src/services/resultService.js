/**
 * services/resultService.js
 * Pembacaan dan aggregasi hasil belajar siswa dari Cloud Firestore
 * untuk kebutuhan portal Guru (Teacher Dashboard) dan riwayat siswa.
 * Mengimplementasikan Adapter Dual-Read untuk mendukung skema attempts (Handout Bab 4-7)
 * dan skema results (Legacy DATABASE.md).
 */

import { collection, query, where, getDocs, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db, isConfigured } from './cloudClient.js';
import { getCurrentSession } from './authService.js';
import { forgetAccount } from '../lib/localStore.js';

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

/**
 * Menghapus seluruh data pembelajaran siswa berdasarkan UID secara aman
 * Hanya dapat dijalankan oleh akun Guru yang terverifikasi (PRD §11, §16 & DATABASE.md)
 *
 * Cakupan data yang dihapus:
 * 1. Seluruh dokumen hasil belajar di koleksi 'attempts' milik siswa (ownerId == uid)
 * 2. Seluruh dokumen hasil belajar di koleksi legacy 'results' milik siswa (ownerId == uid)
 * 3. Dokumen keanggotaan kelas 'members/{uid}'
 * 4. Dokumen keanggotaan legacy 'roster/{uid}'
 * 5. Dokumen registrasi mandiri 'registrations/{uid}' (jika ada)
 * 6. Cache dan antrean lokal yang terikat dengan UID siswa di perangkat ini
 *
 * @param {string} studentUid - UID unik siswa yang akan dihapus
 * @returns {Promise<Object>} Ringkasan hasil penghapusan data
 */
export async function deleteStudentData(studentUid) {
  const session = getCurrentSession();
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
  const failureErrors = [];

  // 1. Eksekusi penghapusan pada Cloud Firestore jika terkonfigurasi
  if (isConfigured && db) {
    // 1a. Hapus seluruh attempts milik siswa (chunk batch aman <= 400 docs per commit)
    try {
      const qAttempts = query(
        collection(db, 'attempts'),
        where('ownerId', '==', targetUid)
      );
      const snapAttempts = await getDocs(qAttempts);
      if (!snapAttempts.empty) {
        let batch = writeBatch(db);
        let count = 0;
        for (const docSnap of snapAttempts.docs) {
          batch.delete(docSnap.ref);
          attemptsDeleted++;
          count++;
          if (count >= 400) {
            await batch.commit();
            batch = writeBatch(db);
            count = 0;
          }
        }
        if (count > 0) {
          await batch.commit();
        }
      }
    } catch (err) {
      console.warn('[resultService] Gagal menghapus dokumen attempts:', err);
      failureErrors.push(`Riwayat kuis & lab (attempts): ${err.message || err}`);
    }

    // 1b. Hapus seluruh hasil legacy results milik siswa
    try {
      const qLegacy = query(
        collection(db, 'results'),
        where('ownerId', '==', targetUid)
      );
      const snapLegacy = await getDocs(qLegacy);
      if (!snapLegacy.empty) {
        let batch = writeBatch(db);
        let count = 0;
        for (const docSnap of snapLegacy.docs) {
          batch.delete(docSnap.ref);
          legacyResultsDeleted++;
          count++;
          if (count >= 400) {
            await batch.commit();
            batch = writeBatch(db);
            count = 0;
          }
        }
        if (count > 0) {
          await batch.commit();
        }
      }
    } catch (err) {
      console.warn('[resultService] Gagal menghapus dokumen legacy results:', err);
      failureErrors.push(`Hasil legacy (results): ${err.message || err}`);
    }

    // 1c. Hapus dokumen keanggotaan members/{uid}
    try {
      const memberRef = doc(db, 'members', targetUid);
      await deleteDoc(memberRef);
      memberDeleted = true;
    } catch (err) {
      console.warn('[resultService] Gagal menghapus dokumen members:', err);
      failureErrors.push(`Keanggotaan kelas (members): ${err.message || err}`);
    }

    // 1d. Hapus dokumen legacy roster/{uid}
    try {
      const rosterRef = doc(db, 'roster', targetUid);
      await deleteDoc(rosterRef);
      rosterDeleted = true;
    } catch (err) {
      console.warn('[resultService] Gagal menghapus dokumen roster:', err);
      failureErrors.push(`Roster kelas (roster): ${err.message || err}`);
    }

    // 1e. Hapus dokumen pendaftaran registrations/{uid} jika ada
    try {
      const regRef = doc(db, 'registrations', targetUid);
      await deleteDoc(regRef);
      registrationDeleted = true;
    } catch (err) {
      console.warn('[resultService] Gagal menghapus dokumen registrations:', err);
      failureErrors.push(`Pendaftaran mandiri (registrations): ${err.message || err}`);
    }
  }

  // 2. Bersihkan cache dan antrean sinkronisasi lokal pada perangkat ini (jika ada)
  try {
    forgetAccount(targetUid, true);
  } catch {
    // Abaikan jika tidak ada entri di localStore
  }

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`reaksi-lab-progress:u:${targetUid}`);
      localStorage.removeItem(`reaksi-lab-queue:u:${targetUid}`);

      // Hapus draft dan state kuis yang berawalan targetUid
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith(`reaksi-lab-draft:${targetUid}:`) ||
          key.startsWith(`reaksi-lab-quizstate:${targetUid}:`)
        )) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    }
  } catch {
    // Abaikan error pada env non-browser
  }

  if (failureErrors.length > 0) {
    console.error('[resultService] Detail kegagalan penghapusan data siswa di Firestore:', failureErrors);
    throw new Error('Gagal menghapus data siswa.');
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
