/**
 * services/observationService.js
 * Manajemen formulir data pengamatan siswa, validasi, dan persistensi LocalStorage
 * Sesuai spesifikasi PRD Bab 8.11, Bab 11, & AGENT.md Bab 6
 */

const OBSERVATIONS_STORAGE_KEY = 'reaksi-lab-observations';

/**
 * Membaca seluruh data pengamatan dari LocalStorage secara aman
 */
export function getStoredObservations() {
  try {
    const raw = localStorage.getItem(OBSERVATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[REAKSI LAB] Gagal membaca data pengamatan:', err);
    return [];
  }
}

/**
 * Mengambil daftar pengamatan berdasarkan ID eksperimen
 */
export function getObservationsByExperiment(experimentId) {
  const all = getStoredObservations();
  return all.filter((obs) => obs.experimentId === experimentId);
}

/**
 * Validasi isian formulir pengamatan siswa
 * Memastikan kolom kuantitatif terisi dan kolom interpretasi diisi siswa sendiri
 */
export function validateObservationData(formData) {
  const errors = {};

  if (!formData.experimentId) {
    errors.experimentId = 'Eksperimen harus dipilih.';
  }

  if (formData.recordedCollisionCount === undefined || formData.recordedCollisionCount === null || formData.recordedCollisionCount === '') {
    errors.recordedCollisionCount = 'Jumlah tumbukan A-B harus tercatat dari hasil simulasi.';
  }

  if (formData.recordedCollisionFrequency === undefined || formData.recordedCollisionFrequency === null || formData.recordedCollisionFrequency === '') {
    errors.recordedCollisionFrequency = 'Frekuensi tumbukan harus tercatat.';
  }

  if (formData.recordedEffectiveCollisionCount === undefined || formData.recordedEffectiveCollisionCount === null || formData.recordedEffectiveCollisionCount === '') {
    errors.recordedEffectiveCollisionCount = 'Jumlah tumbukan efektif harus tercatat.';
  }

  if (formData.recordedProductCount === undefined || formData.recordedProductCount === null || formData.recordedProductCount === '') {
    errors.recordedProductCount = 'Jumlah produk yang terbentuk harus tercatat.';
  }

  if (!formData.observationNotes || formData.observationNotes.trim().length < 10) {
    errors.observationNotes = 'Catatan pengamatan harus diisi minimal 10 karakter.';
  }

  if (!formData.analysis || formData.analysis.trim().length < 15) {
    errors.analysis = 'Analisis hubungan variabel harus diisi minimal 15 karakter.';
  }

  if (!formData.conclusion || formData.conclusion.trim().length < 15) {
    errors.conclusion = 'Kesimpulan berdasarkan data harus diisi minimal 15 karakter.';
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
}

/**
 * Menyimpan data pengamatan siswa yang valid ke LocalStorage
 */
export function saveObservation(formData) {
  const validation = validateObservationData(formData);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const all = getStoredObservations();

  const newObservation = {
    id: formData.id || `obs-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    experimentId: formData.experimentId,
    trialNumber: formData.trialNumber || (all.filter((o) => o.experimentId === formData.experimentId).length + 1),
    observedParameters: {
      concA: Number(formData.observedParameters?.concA ?? formData.concA ?? 1.0),
      concB: Number(formData.observedParameters?.concB ?? formData.concB ?? 1.0),
      temperature: Number(formData.observedParameters?.temperature ?? formData.temperature ?? 25),
      hasCatalyst: Boolean(formData.observedParameters?.hasCatalyst ?? formData.hasCatalyst ?? false),
      duration: Number(formData.observedParameters?.duration ?? formData.duration ?? 0),
    },
    // Data hasil mesin simulasi
    machineData: {
      collisionCount: Number(formData.recordedCollisionCount),
      collisionFrequency: Number(formData.recordedCollisionFrequency),
      effectiveCollisionCount: Number(formData.recordedEffectiveCollisionCount),
      productCount: Number(formData.recordedProductCount),
      reactionRate: Number(formData.recordedReactionRate ?? 0),
    },
    // Catatan dan interpretasi mandiri siswa
    studentInterpretation: {
      observationNotes: formData.observationNotes.trim(),
      analysis: formData.analysis.trim(),
      conclusion: formData.conclusion.trim(),
    },
    savedAt: new Date().toISOString(),
  };

  try {
    // Jika update data yang ada atau tambah baru
    const existingIndex = all.findIndex((o) => o.id === newObservation.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = newObservation;
    } else {
      updated = [newObservation, ...all];
    }

    localStorage.setItem(OBSERVATIONS_STORAGE_KEY, JSON.stringify(updated));
    return { success: true, observation: newObservation };
  } catch (err) {
    console.error('[REAKSI LAB] Gagal menyimpan data pengamatan:', err);
    return {
      success: false,
      errors: { storage: 'Gagal menyimpan ke penyimpanan lokal browser.' },
    };
  }
}

/**
 * Menghapus pengamatan berdasarkan ID
 */
export function deleteObservation(observationId) {
  const all = getStoredObservations();
  const filtered = all.filter((o) => o.id !== observationId);
  try {
    localStorage.setItem(OBSERVATIONS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('[REAKSI LAB] Gagal menghapus pengamatan:', err);
    return false;
  }
}
