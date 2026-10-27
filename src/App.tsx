import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ModulesPage from './pages/ModulesPage.jsx';
import LaboratoryPage from './pages/LaboratoryPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import ProgressPage from './pages/ProgressPage.jsx';
import { useProgress } from './hooks/useProgress.js';
import './App.css';

/**
 * App.tsx
 * Komponen root aplikasi REAKSI LAB
 * Mengelola navigasi aktif, tema, dan integrasi data progres siswa
 */
export default function App() {
  const [activePage, setActivePage] = useState<'beranda' | 'materi' | 'lab' | 'kuis' | 'progres'>('beranda');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedExperimentId, setSelectedExperimentId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = localStorage.getItem('reaksi-lab-theme') as 'dark' | 'light' | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const {
    progress,
    overallPercent,
    isModuleCompleted,
    isExperimentCompleted,
    toggleModule,
    markExperiment,
    resetProgress,
  } = useProgress();

  // Sinkronkan atribut DOM dengan tema aktif
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('reaksi-lab-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const handleNavigate = (pageId: 'beranda' | 'materi' | 'lab' | 'kuis' | 'progres') => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setActivePage('materi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectExperiment = (expId: string) => {
    setSelectedExperimentId(expId);
    setActivePage('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="reaksi-app-root">
      {/* 1. Navbar Utama */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        overallProgress={overallPercent}
        currentTheme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Main Content Routing */}
      <main className="reaksi-main-viewport" role="main">
        {activePage === 'beranda' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectModule={handleSelectModule}
            onSelectExperiment={handleSelectExperiment}
            progress={progress}
            overallPercent={overallPercent}
            isModuleCompleted={isModuleCompleted}
          />
        )}

        {activePage === 'materi' && (
          <ModulesPage
            onNavigate={handleNavigate}
            isModuleCompleted={isModuleCompleted}
            toggleModule={toggleModule}
            initialModuleId={selectedModuleId || undefined}
          />
        )}

        {activePage === 'lab' && (
          <LaboratoryPage
            onNavigate={handleNavigate}
            isExperimentCompleted={isExperimentCompleted}
            markExperiment={markExperiment}
            initialExperimentId={selectedExperimentId || undefined}
          />
        )}

        {activePage === 'kuis' && (
          <QuizPage
            onNavigate={handleNavigate}
            onQuizCompleted={() => {}}
          />
        )}

        {activePage === 'progres' && (
          <ProgressPage
            onNavigate={handleNavigate}
            progress={progress}
            overallPercent={overallPercent}
            isModuleCompleted={isModuleCompleted}
            isExperimentCompleted={isExperimentCompleted}
            toggleModule={toggleModule}
            resetProgress={resetProgress}
          />
        )}
      </main>

      {/* 3. Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
