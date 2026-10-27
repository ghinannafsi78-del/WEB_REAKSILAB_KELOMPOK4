/**
 * hooks/useProgress.js
 * React hook untuk sinkronisasi state progres siswa dengan LocalStorage
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getStoredProgress,
  saveProgress,
  toggleModuleCompleted,
  markExperimentCompleted,
  resetAllProgress,
  calculateOverallProgress
} from '../services/progressService.js';

export function useProgress() {
  const [progress, setProgress] = useState(getStoredProgress);

  useEffect(() => {
    // Sinkronkan saat mount atau saat event storage lintas tab
    const sync = () => setProgress(getStoredProgress());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const toggleModule = useCallback((moduleId) => {
    const updated = toggleModuleCompleted(moduleId);
    setProgress(updated);
  }, []);

  const markExperiment = useCallback((experimentId) => {
    const updated = markExperimentCompleted(experimentId);
    setProgress(updated);
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = resetAllProgress();
    setProgress(fresh);
  }, []);

  const isModuleCompleted = useCallback(
    (moduleId) => progress.completedModules.includes(moduleId),
    [progress.completedModules]
  );

  const isExperimentCompleted = useCallback(
    (experimentId) => progress.completedExperiments.includes(experimentId),
    [progress.completedExperiments]
  );

  const overallPercent = calculateOverallProgress(progress);

  return {
    progress,
    overallPercent,
    isModuleCompleted,
    isExperimentCompleted,
    toggleModule,
    markExperiment,
    resetProgress,
    saveProgress: (p) => setProgress(saveProgress(p))
  };
}

export default useProgress;
