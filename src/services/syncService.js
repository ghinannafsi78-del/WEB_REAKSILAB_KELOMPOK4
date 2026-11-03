/**
 * services/syncService.js
 * Manajemen antrean hasil belajar, sinkronisasi offline-first ke Cloud Firestore,
 * dan migrasi progres mode tamu ke akun siswa terdaftar.
 * Sesuai spesifikasi DATABASE.md dan PRD Bab 11, 13, & 16
 */

import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, isConfigured } from './cloudClient.js';
import { getCurrentSession } from './authService.js';
import { getStoredProgress } from './progressService.js';
import { getStoredObservations } from './observationService.js';

const QUEUE_KEY_PREFIX = 'reaksi-lab-queue:u:';
const ACCOUNT_PROGRESS_PREFIX = 'reaksi-lab-progress:u:';

// Event listeners untuk UI updates (sync status badge, dialog, etc.)
const syncListeners = new Set();

function notifySyncListeners() {
  syncListeners.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error('[syncService] Error in listener:', err);
    }
  });
}

export function subscribeSyncStatus(callback) {
  syncListeners.add(callback);
  callback();
  return () => syncListeners.delete(callback);
}

/**
 * Membaca antrean dari LocalStorage untuk UID tertentu
 */
export function getQueue(uid) {
  if (!uid) return [];
  try {
    const raw = localStorage.getItem(`${QUEUE_KEY_PREFIX}${uid}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[syncService] Gagal membaca antrean:', err);
    return [];
  }
}

/**
 * Menyimpan antrean ke LocalStorage untuk UID tertentu
 */
function saveQueue(uid, queue) {
  if (!uid) return;
  try {
    localStorage.setItem(`${QUEUE_KEY_PREFIX}${uid}`, JSON.stringify(queue));
    notifySyncListeners();
  } catch (err) {
    console.error('[syncService] Gagal menyimpan antrean:', err);
  }
}

/**
 * Membaca progres akun tersimpan
 */
export function getAccountProgress(uid) {
  if (!uid) return null;
  try {
    const raw = localStorage.getItem(`${ACCOUNT_PROGRESS_PREFIX}${uid}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Menyimpan progres akun tersimpan
 */
export function saveAccountProgress(uid, data) {
  if (!uid) return;
  try {
    localStorage.setItem(`${ACCOUNT_PROGRESS_PREFIX}${uid}`, JSON.stringify(data));
  } catch (err) {
    console.error('[syncService] Gagal menyimpan progres akun:', err);
  }
}

/**
 * Menambahkan item hasil belajar ke dalam antrean sinkronisasi
 * @param {Object} item - Payload hasil belajar (quiz | lab-observation | module-complete)
 */
export async function enqueueResult(item) {
  const session = getCurrentSession();
  const uid = item.ownerId || session.user?.uid;

  if (!uid) {
    console.info('[syncService] Mode Tamu aktif; item tidak diantrekan ke cloud.');
    return { success: false, reason: 'guest' };
  }

  // Buat ID percobaan acak tetap sesuai DATABASE.md (contoh: att_20261103_8f3a2c)
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randStr = Math.random().toString(36).substring(2, 8);
  const attemptId = item.id || `att_${dateStr}_${randStr}`;

  const queueItem = {
    id: attemptId,
    ownerId: uid,
    alias: item.alias || session.alias || 'Siswa',
    moduleId: item.moduleId || 'laju-reaksi',
    activityId: item.activityId || 'umum',
    questionVersion: item.questionVersion || 'qb-2026-11-03',
    kind: item.kind, // 'quiz' | 'lab-observation' | 'module-complete'
    answers: item.answers || {},
    score: item.score ?? null,
    totalQuestions: item.totalQuestions ?? undefined,
    correctAnswers: item.correctAnswers ?? undefined,
    incorrectAnswers: item.incorrectAnswers ?? undefined,
    simulation: item.simulation || undefined,
    completedAt: item.completedAt || new Date().toISOString(),
    // Status lokal dalam antrean
    status: 'pending', // 'pending' | 'syncing' | 'synced' | 'error'
    error: null,
    enqueuedAt: new Date().toISOString(),
    syncedAt: null,
  };

  const currentQueue = getQueue(uid);
  // Cegah duplikasi ID dalam antrean
  const existingIdx = currentQueue.findIndex((q) => q.id === attemptId);
  if (existingIdx >= 0) {
    currentQueue[existingIdx] = queueItem;
  } else {
    currentQueue.push(queueItem);
  }

  saveQueue(uid, currentQueue);

  // Jika online dan terautentikasi, segera proses antrean
  if (navigator.onLine && isConfigured) {
    processQueue(uid).catch((err) => {
      console.warn('[syncService] Pemrosesan antrean otomatis tertunda:', err);
    });
  }

  return { success: true, item: queueItem };
}

/**
 * Memproses pengiriman antrean ke Cloud Firestore
 */
let isProcessing = false;

export async function processQueue(targetUid) {
  if (isProcessing) return;
  const session = getCurrentSession();
  const uid = targetUid || session.user?.uid;

  if (!uid || !isConfigured || !db || !session.user || session.user.uid !== uid) {
    return;
  }

  if (!navigator.onLine) {
    return;
  }

  isProcessing = true;
  notifySyncListeners();

  try {
    const queue = getQueue(uid);
    let hasChanges = false;

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];

      // Hanya kirim item yang statusnya belum 'synced' dan pemiliknya cocok
      if (item.status === 'synced') continue;
      if (item.ownerId !== session.user.uid) continue;

      item.status = 'syncing';
      saveQueue(uid, queue);

      try {
        const docRef = doc(db, 'results', item.id);

        // Bentuk payload Firestore persis sesuai validCommon & validQuiz di DATABASE.md
        const firestorePayload = {
          id: item.id,
          ownerId: item.ownerId,
          alias: item.alias,
          moduleId: item.moduleId,
          activityId: item.activityId,
          questionVersion: item.questionVersion,
          kind: item.kind,
          answers: item.answers,
          score: item.score !== undefined ? item.score : null,
          completedAt: item.completedAt,
          receivedAt: serverTimestamp(),
        };

        if (item.kind === 'quiz') {
          firestorePayload.totalQuestions = Number(item.totalQuestions || 0);
          firestorePayload.correctAnswers = Number(item.correctAnswers || 0);
          firestorePayload.incorrectAnswers = Number(item.incorrectAnswers || 0);
        }

        if (item.kind === 'lab-observation' && item.simulation) {
          firestorePayload.simulation = item.simulation;
        }

        // Tulis dokumen ke Firestore (create-only)
        await setDoc(docRef, firestorePayload);

        // Verifikasi baca ulang dokumen untuk bukti konfirmasi server
        const verifySnap = await getDoc(docRef);
        if (verifySnap.exists() && verifySnap.data()?.ownerId === item.ownerId) {
          item.status = 'synced';
          item.syncedAt = new Date().toISOString();
          item.error = null;
          hasChanges = true;

          // Perbarui progres akun lokal
          updateLocalAccountProgress(uid, item);
        } else {
          item.status = 'error';
          item.error = 'Verifikasi dokumen setelah kirim gagal.';
          hasChanges = true;
        }
      } catch (writeErr) {
        console.warn(`[syncService] Gagal mengirim item ${item.id}:`, writeErr);

        // Jika error adalah izin ditolak atau sudah ada (deduplikasi)
        try {
          const checkDoc = await getDoc(doc(db, 'results', item.id));
          if (checkDoc.exists() && checkDoc.data()?.ownerId === item.ownerId) {
            item.status = 'synced';
            item.syncedAt = new Date().toISOString();
            item.error = null;
            hasChanges = true;
            updateLocalAccountProgress(uid, item);
            continue;
          }
        } catch {
          // Abaikan
        }

        item.status = 'error';
        item.error = writeErr.message || 'Gagal menyimpan ke Firestore';
        hasChanges = true;
      }
    }

    if (hasChanges) {
      saveQueue(uid, queue);
    }
  } catch (err) {
    console.error('[syncService] Error saat memproses antrean:', err);
  } finally {
    isProcessing = false;
    notifySyncListeners();
  }
}

/**
 * Sinkronkan progres lokal akun siswa setelah item berhasil tersimpan di Cloud
 */
function updateLocalAccountProgress(uid, syncedItem) {
  const current = getAccountProgress(uid) || {
    completedModules: [],
    completedExperiments: [],
    completedObservations: [],
    quizAttempts: [],
    lastUpdated: new Date().toISOString(),
  };

  if (syncedItem.kind === 'quiz') {
    const exists = current.quizAttempts.some((q) => q.id === syncedItem.id);
    if (!exists) {
      current.quizAttempts.unshift({
        id: syncedItem.id,
        category: syncedItem.activityId,
        score: syncedItem.score,
        totalQuestions: syncedItem.totalQuestions,
        correctAnswers: syncedItem.correctAnswers,
        completedAt: syncedItem.completedAt,
      });
    }
  } else if (syncedItem.kind === 'lab-observation') {
    if (!current.completedObservations.includes(syncedItem.activityId)) {
      current.completedObservations.push(syncedItem.activityId);
    }
    if (!current.completedExperiments.includes(syncedItem.activityId)) {
      current.completedExperiments.push(syncedItem.activityId);
    }
  } else if (syncedItem.kind === 'module-complete') {
    if (!current.completedModules.includes(syncedItem.moduleId)) {
      current.completedModules.push(syncedItem.moduleId);
    }
  }

  current.lastUpdated = new Date().toISOString();
  saveAccountProgress(uid, current);
}

/**
 * Migrasi hasil belajar mode tamu (LocalStorage) ke akun siswa
 * PENTING: Sesuai DATABASE.md, data tamu di reaksi-lab-progress TIDAK DIHAPUS
 * sampai seluruh item berhasil terkonfirmasi terkirim (status 'synced').
 */
export async function migrateGuestDataToAccount(uid, alias) {
  const guestProgress = getStoredProgress();
  const guestObservations = getStoredObservations();

  const itemsToEnqueue = [];

  // 1. Kuis Mode Tamu
  if (Array.isArray(guestProgress.quizAttempts) && guestProgress.quizAttempts.length > 0) {
    guestProgress.quizAttempts.forEach((attempt) => {
      itemsToEnqueue.push({
        id: `att_mig_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ownerId: uid,
        alias: alias || 'Siswa',
        moduleId: 'laju-reaksi',
        activityId: attempt.category || 'quiz-formatif',
        questionVersion: 'qb-2026-11-03',
        kind: 'quiz',
        answers: {}, // Guest history may not have raw answers; maintain map
        score: attempt.score,
        totalQuestions: attempt.totalQuestions || 4,
        correctAnswers: attempt.correctAnswers || 0,
        incorrectAnswers: (attempt.totalQuestions || 4) - (attempt.correctAnswers || 0),
        completedAt: attempt.completedAt || new Date().toISOString(),
      });
    });
  }

  // 2. Pengamatan Lab Mode Tamu
  if (Array.isArray(guestObservations) && guestObservations.length > 0) {
    guestObservations.forEach((obs) => {
      itemsToEnqueue.push({
        id: `att_mig_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ownerId: uid,
        alias: alias || 'Siswa',
        moduleId: 'laju-reaksi',
        activityId: obs.experimentId || 'exp-ab',
        questionVersion: 'qb-2026-11-03',
        kind: 'lab-observation',
        answers: {
          trialNumber: obs.trialNumber || 1,
          recordedCollisionCount: obs.machineData?.collisionCount || 0,
          recordedCollisionFrequency: obs.machineData?.collisionFrequency || 0,
          recordedEffectiveCollisionCount: obs.machineData?.effectiveCollisionCount || 0,
          recordedProductCount: obs.machineData?.productCount || 0,
          recordedReactionRate: obs.machineData?.reactionRate || 0,
          observationNotes: obs.studentInterpretation?.observationNotes || '',
          analysis: obs.studentInterpretation?.analysis || '',
          conclusion: obs.studentInterpretation?.conclusion || '',
        },
        simulation: {
          simulationResultId: obs.id,
          modelVersion: 'sim-1.0',
          parameters: obs.observedParameters || {},
          duration: obs.observedParameters?.duration || 15,
          collisionCount: obs.machineData?.collisionCount || 0,
          collisionFrequency: obs.machineData?.collisionFrequency || 0,
          effectiveCollisionCount: obs.machineData?.effectiveCollisionCount || 0,
          productCount: obs.machineData?.productCount || 0,
          reactionRate: obs.machineData?.reactionRate || 0,
        },
        score: null,
        completedAt: obs.savedAt || new Date().toISOString(),
      });
    });
  }

  // Masukkan semua ke antrean
  for (const item of itemsToEnqueue) {
    await enqueueResult(item);
  }

  // Segera proses pengiriman jika online
  if (navigator.onLine && isConfigured) {
    await processQueue(uid);
  }

  return { migratedCount: itemsToEnqueue.length };
}

/**
 * Hitung statistik antrean untuk indikator UI
 */
export function getSyncStats(uid) {
  const queue = getQueue(uid);
  const pending = queue.filter((q) => q.status === 'pending' || q.status === 'syncing').length;
  const synced = queue.filter((q) => q.status === 'synced').length;
  const error = queue.filter((q) => q.status === 'error').length;

  return {
    total: queue.length,
    pending,
    synced,
    error,
    isProcessing,
  };
}

// Pasang listener online otomatis
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    const session = getCurrentSession();
    if (session.user?.uid) {
      processQueue(session.user.uid);
    }
  });
}

