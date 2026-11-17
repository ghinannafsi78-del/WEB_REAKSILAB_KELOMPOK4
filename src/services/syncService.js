/**
 * services/syncService.js
 * Manajemen antrean hasil belajar, sinkronisasi offline-first ke Cloud Firestore,
 * dan migrasi progres mode tamu ke akun siswa terdaftar.
 * Sesuai spesifikasi DATABASE.md, PRD Bab 11, 13, & 16, serta kontrak Handout Bab 4-7.
 */

import { payloadOf } from '../lib/attemptContract.js';
import { readScope, recordAttempt, claimGuest } from '../lib/localStore.js';
import { syncPending } from '../lib/syncService.js';
import { saveAttempt } from '../lib/firebaseService.js';
import { isConfigured } from './cloudClient.js';
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
 * Membaca antrean dari LocalStore / LocalStorage untuk UID tertentu
 */
export function getQueue(uid) {
  if (!uid) return [];
  try {
    const scope = readScope(uid);
    const scopeRecords = Object.values(scope.records || {}).map((r) => ({
      ...r.attempt,
      status: r.status,
      receivedAt: r.receivedAt || null,
    }));
    if (scopeRecords.length > 0) return scopeRecords;

    // Fallback kompatibilitas jika ada data lama di key prefix
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
 * Menyimpan antrean ke LocalStorage (kompatibilitas backward)
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
 * Sesuai kontrak attemptContract.js:
 * fields: ["id", "ownerId", "alias", "moduleId", "activityId", "questionVersion", "kind", "answers", "score", "completedAt"]
 */
export async function enqueueResult(item) {
  const session = getCurrentSession();
  const isStudentActive = session.active && session.user?.uid;
  const uid = item.ownerId || (isStudentActive ? session.user.uid : 'guest');
  const alias = item.alias || (isStudentActive ? (session.alias || 'Siswa') : 'Tamu');

  // Buat ID stabil jika belum ada
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randStr = Math.random().toString(36).substring(2, 8);
  const attemptId = item.id || `att_${dateStr}_${randStr}`;

  // Normalisasi kind sesuai attemptContract.js
  let normalizedKind = item.kind;
  if (item.kind === 'quiz') normalizedKind = 'practice';
  if (item.kind === 'lab-observation') normalizedKind = 'observation';
  if (!['diagnostic', 'practice', 'pretest', 'posttest', 'observation'].includes(normalizedKind)) {
    normalizedKind = 'practice';
  }

  // Normalisasi answers: nilai map wajib string dan panjang <= 2000
  // Payload memuat answers: item.answers yang dipetakan nilainya ke string
  const rawAnswers = item.answers || {};
  const stringAnswers = {};
  for (const [k, v] of Object.entries(rawAnswers)) {
    stringAnswers[String(k)] = typeof v === 'string' ? v.slice(0, 2000) : String(v ?? '').slice(0, 2000);
  }
  if (Object.keys(stringAnswers).length === 0) {
    stringAnswers['ans_1'] = 'completed';
  }

  // Normalisasi score: number 0..100
  let normalizedScore = Number(item.score);
  if (!Number.isFinite(normalizedScore) || normalizedScore < 0) {
    normalizedScore = normalizedKind === 'observation' ? 100 : 0;
  }
  if (normalizedScore > 100) normalizedScore = 100;

  const attemptData = {
    id: attemptId.slice(0, 64),
    ownerId: uid.slice(0, 128),
    alias: String(alias).slice(0, 80),
    moduleId: String(item.moduleId || 'laju-reaksi').slice(0, 64),
    activityId: String(item.activityId || 'umum').slice(0, 64),
    questionVersion: String(item.questionVersion || 'qb-2026-11-03').slice(0, 32),
    kind: normalizedKind,
    answers: stringAnswers,
    score: normalizedScore,
    completedAt: item.completedAt || new Date().toISOString(),
  };

  // Validasi ketat terhadap kontrak attemptContract.js
  const validatedAttempt = payloadOf(attemptData);

  // Rekam ke localStore (jika uid === 'guest' status: 'local'; jika login status: 'pending')
  recordAttempt(uid, validatedAttempt);

  // Update backup queue untuk kompatibilitas backward
  const currentQ = getQueue(uid);
  const qIdx = currentQ.findIndex((q) => q.id === attemptId);
  const queueItem = {
    ...validatedAttempt,
    totalQuestions: item.totalQuestions,
    correctAnswers: item.correctAnswers,
    incorrectAnswers: item.incorrectAnswers,
    simulation: item.simulation,
    status: uid === 'guest' ? 'local' : 'pending',
    enqueuedAt: new Date().toISOString(),
  };
  if (qIdx >= 0) {
    currentQ[qIdx] = queueItem;
  } else {
    currentQ.push(queueItem);
  }
  saveQueue(uid, currentQ);

  notifySyncListeners();

  // Jika online, terkonfigurasi, dan dalam mode akun aktif, segera proses antrean
  if (uid !== 'guest' && navigator.onLine && isConfigured) {
    processQueue(uid).catch((err) => {
      console.warn('[syncService] Pemrosesan antrean otomatis tertunda:', err);
    });
  }

  return { success: true, item: queueItem };
}

/**
 * Memproses pengiriman antrean ke Cloud Firestore menggunakan syncPending() dan saveAttempt()
 */
let isProcessing = false;

export async function processQueue(targetUid) {
  if (isProcessing) return;
  const session = getCurrentSession();
  const uid = targetUid || session.user?.uid;

  if (!uid || uid === 'guest' || !isConfigured || !session.user || session.user.uid !== uid) {
    return;
  }

  if (!navigator.onLine) {
    return;
  }

  isProcessing = true;
  notifySyncListeners();

  try {
    await syncPending(
      uid,
      { saveAttempt },
      () => getCurrentSession().user?.uid === uid,
      (status, attemptId) => {
        if (status === 'sent') {
          const rec = readScope(uid).records[attemptId];
          if (rec?.attempt) {
            updateLocalAccountProgress(uid, rec.attempt);
          }
        }
        notifySyncListeners();
      }
    );

    // Sinkronkan status pada legacy queue
    const scope = readScope(uid);
    const legacyQueue = getQueue(uid);
    let changed = false;
    for (const item of legacyQueue) {
      const scopeRec = scope.records[item.id];
      if (scopeRec && item.status !== scopeRec.status) {
        item.status = scopeRec.status;
        item.syncedAt = scopeRec.receivedAt || new Date().toISOString();
        changed = true;
      }
    }
    if (changed) {
      saveQueue(uid, legacyQueue);
    }
  } catch (err) {
    console.warn('[syncService] Error saat memproses antrean:', err);
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

  if (['quiz', 'practice', 'diagnostic', 'pretest', 'posttest'].includes(syncedItem.kind)) {
    const exists = current.quizAttempts.some((q) => q.id === syncedItem.id);
    if (!exists) {
      current.quizAttempts.unshift({
        id: syncedItem.id,
        category: syncedItem.activityId,
        score: syncedItem.score,
        totalQuestions: Object.keys(syncedItem.answers || {}).length,
        correctAnswers: syncedItem.score >= 50 ? Object.keys(syncedItem.answers || {}).length : 0,
        completedAt: syncedItem.completedAt,
      });
    }
  } else if (['lab-observation', 'observation'].includes(syncedItem.kind)) {
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
 * Migrasi hasil belajar mode tamu (LocalStorage) ke akun siswa dengan persetujuan pengguna
 * PENTING: Sesuai DATABASE.md, data tamu di reaksi-lab-progress TIDAK DIHAPUS
 * sampai seluruh item berhasil terkonfirmasi terkirim.
 */
export async function migrateGuestDataToAccount(uid, alias) {
  if (!uid || uid === 'guest') {
    throw new Error('Hanya akun terdaftar yang dapat memindahkan data.');
  }

  const studentAlias = alias || getCurrentSession().alias || 'Siswa';
  const guestScope = readScope('guest');
  const guestRecords = Object.values(guestScope.records || {}).filter((r) => r.status === 'local');
  const guestIds = guestRecords.map((r) => r.attempt.id);

  let migratedCount = 0;

  // 1. Klaim seluruh rekaman guest yang ada di localStore
  if (guestIds.length > 0) {
    claimGuest(uid, studentAlias, guestIds);
    migratedCount += guestIds.length;
  }

  // 2. Baca progres lokal mode tamu (reaksi-lab-progress) jika ada attempt kuis lama
  const guestProgress = getStoredProgress();
  if (Array.isArray(guestProgress.quizAttempts) && guestProgress.quizAttempts.length > 0) {
    guestProgress.quizAttempts.forEach((attempt) => {
      const attId = attempt.id || `att_mig_quiz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const existing = readScope(uid).records[attId];
      if (!existing) {
        try {
          const valid = payloadOf({
            id: attId,
            ownerId: uid,
            alias: studentAlias,
            moduleId: 'laju-reaksi',
            activityId: attempt.category || 'quiz-formatif-laju',
            questionVersion: 'qb-2026-11-03',
            kind: 'practice',
            answers: { q_migrated: 'true' },
            score: Number(attempt.score) || 0,
            completedAt: attempt.completedAt || new Date().toISOString(),
          });
          recordAttempt(uid, valid);
          migratedCount++;
        } catch {
          // Abaikan jika tidak valid
        }
      }
    });
  }

  // 3. Baca pengamatan lokal mode tamu (reaksi-lab-observations) jika belum masuk ke localStore
  const guestObservations = getStoredObservations();
  if (Array.isArray(guestObservations) && guestObservations.length > 0) {
    guestObservations.forEach((obs) => {
      const attId = `att_mig_obs_${obs.id || Date.now()}`;
      const existing = readScope(uid).records[attId];
      if (!existing) {
        try {
          const valid = payloadOf({
            id: attId,
            ownerId: uid,
            alias: studentAlias,
            moduleId: 'laju-reaksi',
            activityId: obs.experimentId || 'exp-ab',
            questionVersion: 'qb-2026-11-03',
            kind: 'observation',
            answers: {
              trialNumber: String(obs.trialNumber || 1),
              recordedCollisionCount: String(obs.machineData?.collisionCount ?? 0),
              recordedCollisionFrequency: String(obs.machineData?.collisionFrequency ?? 0),
              recordedEffectiveCollisionCount: String(obs.machineData?.effectiveCollisionCount ?? 0),
              recordedProductCount: String(obs.machineData?.productCount ?? 0),
              recordedReactionRate: String(obs.machineData?.reactionRate ?? 0),
              observationNotes: String(obs.studentInterpretation?.observationNotes || ''),
              analysis: String(obs.studentInterpretation?.analysis || ''),
              conclusion: String(obs.studentInterpretation?.conclusion || ''),
            },
            score: 100,
            completedAt: obs.savedAt || new Date().toISOString(),
          });
          recordAttempt(uid, valid);
          migratedCount++;
        } catch {
          // Abaikan jika tidak valid
        }
      }
    });
  }

  notifySyncListeners();

  // 4. Segera proses pengiriman jika online dan terkonfigurasi
  if (navigator.onLine && isConfigured) {
    await processQueue(uid);
  }

  return { migratedCount };
}

/**
 * Hitung statistik antrean untuk indikator UI
 */
export function getSyncStats(uid) {
  const currentUid = uid || getCurrentSession().user?.uid || 'guest';
  const scope = readScope(currentUid);
  const records = Object.values(scope.records || {});

  const pending = records.filter((r) => r.status === 'pending').length;
  const synced = records.filter((r) => r.status === 'sent').length;
  const local = records.filter((r) => r.status === 'local').length;
  const total = records.length;

  const guestScope = readScope('guest');
  const guestLocal = Object.values(guestScope.records || {}).filter((r) => r.status === 'local').length;

  return {
    total,
    pending,
    synced,
    local,
    error: 0,
    guestLocal,
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
