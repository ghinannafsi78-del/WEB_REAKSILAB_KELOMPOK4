/**
 * services/progressService.js
 * Manajemen persistensi progres belajar REAKSI LAB via LocalStorage
 * Sesuai spesifikasi PRD Bab 11, 13, & 15
 */

const STORAGE_KEY = 'reaksi-lab-progress';

const DEFAULT_PROGRESS = {
  completedModules: [],
  completedExperiments: [],
  quizAttempts: [],
  lastUpdated: new Date().toISOString()
};

/**
 * Membaca data progres dari LocalStorage secara aman
 */
export function getStoredProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    
    const parsed = JSON.parse(raw);
    return {
      completedModules: Array.isArray(parsed?.completedModules) ? parsed.completedModules : [],
      completedExperiments: Array.isArray(parsed?.completedExperiments) ? parsed.completedExperiments : [],
      quizAttempts: Array.isArray(parsed?.quizAttempts) ? parsed.quizAttempts : [],
      lastUpdated: parsed?.lastUpdated || new Date().toISOString()
    };
  } catch (error) {
    console.warn('[REAKSI LAB] Gagal membaca LocalStorage progress:', error);
    return { ...DEFAULT_PROGRESS };
  }
}

/**
 * Menyimpan data progres ke LocalStorage
 */
export function saveProgress(progressData) {
  try {
    const updated = {
      ...progressData,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('[REAKSI LAB] Gagal menyimpan ke LocalStorage:', error);
    return progressData;
  }
}

/**
 * Menandai modul sebagai selesai/belum selesai
 */
export function toggleModuleCompleted(moduleId) {
  const current = getStoredProgress();
  const exists = current.completedModules.includes(moduleId);
  const updatedModules = exists
    ? current.completedModules.filter((id) => id !== moduleId)
    : [...current.completedModules, moduleId];
  
  return saveProgress({
    ...current,
    completedModules: updatedModules
  });
}

/**
 * Menandai eksperimen sebagai selesai
 */
export function markExperimentCompleted(experimentId) {
  const current = getStoredProgress();
  if (current.completedExperiments.includes(experimentId)) {
    return current;
  }
  return saveProgress({
    ...current,
    completedExperiments: [...current.completedExperiments, experimentId]
  });
}

/**
 * Menambahkan riwayat percobaan kuis
 */
export function addQuizAttempt(attemptData) {
  const current = getStoredProgress();
  const newAttempt = {
    id: `quiz-attempt-${Date.now()}`,
    category: attemptData.category || 'Umum',
    score: Number(attemptData.score) || 0,
    totalQuestions: Number(attemptData.totalQuestions) || 5,
    correctAnswers: Number(attemptData.correctAnswers) || 0,
    completedAt: new Date().toISOString()
  };

  return saveProgress({
    ...current,
    quizAttempts: [newAttempt, ...current.quizAttempts]
  });
}

/**
 * Reset seluruh progres siswa ke nilai awal
 */
export function resetAllProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[REAKSI LAB] Gagal membersihkan LocalStorage:', err);
  }
  return { ...DEFAULT_PROGRESS, lastUpdated: new Date().toISOString() };
}

/**
 * Menghitung persentase progres keseluruhan
 * (3 Modul + 4 Eksperimen = 7 target capaian)
 */
export function calculateOverallProgress(progress, totalModules = 3, totalExperiments = 4) {
  if (!progress) return 0;
  const modCount = progress.completedModules?.length || 0;
  const expCount = progress.completedExperiments?.length || 0;
  const totalItems = totalModules + totalExperiments;
  if (totalItems === 0) return 0;
  
  const percentage = Math.round(((modCount + expCount) / totalItems) * 100);
  return Math.min(100, Math.max(0, percentage));
}
