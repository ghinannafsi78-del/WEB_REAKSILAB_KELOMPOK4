import { useState, useEffect } from 'react';
import { EXPERIMENTS_DATA } from '../data/experiments.js';
import { SimulationEngine } from '../services/simulationService.js';
import { getObservationsByExperiment } from '../services/observationService.js';
import { markObservationCompleted } from '../services/progressService.js';

// Komponen Laboratorium
import ParticleSimulation from '../components/laboratory/ParticleSimulation.jsx';
import ReactionParameterControls from '../components/laboratory/ReactionParameterControls.jsx';
import CollisionMetrics from '../components/laboratory/CollisionMetrics.jsx';
import SimulationChart from '../components/laboratory/SimulationChart.jsx';
import ObservationForm from '../components/laboratory/ObservationForm.jsx';
import ObservationSummary from '../components/laboratory/ObservationSummary.jsx';
import LaboratoryQuiz from '../components/laboratory/LaboratoryQuiz.jsx';
import ExperimentSummaryReport from '../components/laboratory/ExperimentSummaryReport.jsx';

import './LaboratoryPage.css';

/**
 * LaboratoryPage.jsx
 * Laboratorium Virtual Interaktif Materi Laju Reaksi (Model Konseptual A + B -> Produk)
 * Sesuai spesifikasi PRD Bab 8, Bab 9, & AGENT.md Bab 5, 6, 7, 8
 */
export default function LaboratoryPage({
  onNavigate,
  isExperimentCompleted,
  markExperiment,
  initialExperimentId = '',
}) {
  // 1. Pemilihan Eksperimen Aktif
  const [selectedExpId, setSelectedExpId] = useState(
    initialExperimentId || EXPERIMENTS_DATA[0].id
  );

  const activeExp =
    EXPERIMENTS_DATA.find((e) => e.id === selectedExpId) || EXPERIMENTS_DATA[0];

  // 2. Tahap Alur Belajar: 'simulation' | 'observation' | 'quiz' | 'report'
  const [activeStage, setActiveStage] = useState('simulation');

  // 3. State Parameter Eksperimen
  const [concA, setConcA] = useState(activeExp.defaultParameters.concA);
  const [concB, setConcB] = useState(activeExp.defaultParameters.concB);
  const [temperature, setTemperature] = useState(activeExp.defaultParameters.temperature);
  const [hasCatalyst, setHasCatalyst] = useState(activeExp.defaultParameters.hasCatalyst);

  // 4. Engine Simulasi dan State Metrik
  const [simulationState, setSimulationState] = useState(() => ({
    status: 'idle',
    elapsedTime: 0,
    maxDuration: 30,
    collisionCount: 0,
    collisionFrequency: 0,
    effectiveCollisionCount: 0,
    productCount: 0,
    reactionRate: 0,
    remainingA: Math.round(activeExp.defaultParameters.concA * 15),
    remainingB: Math.round(activeExp.defaultParameters.concB * 15),
    currentProductCount: 0,
    parameters: {
      concA: activeExp.defaultParameters.concA,
      concB: activeExp.defaultParameters.concB,
      temperature: activeExp.defaultParameters.temperature,
      hasCatalyst: activeExp.defaultParameters.hasCatalyst,
    },
    timeSeries: [],
  }));

  const [engine] = useState(() => {
    return new SimulationEngine({
      width: 600,
      height: 360,
      concA: activeExp.defaultParameters.concA,
      concB: activeExp.defaultParameters.concB,
      temperature: activeExp.defaultParameters.temperature,
      hasCatalyst: activeExp.defaultParameters.hasCatalyst,
      maxDuration: 30,
    });
  });

  // 5. State Data Pengamatan Siswa & Kuis
  const [savedObservation, setSavedObservation] = useState(() => {
    const existing = getObservationsByExperiment(activeExp.id);
    return existing.length > 0 ? existing[0] : null;
  });
  const [isEditingObservation, setIsEditingObservation] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Pasang listener onMetricsUpdate dan cleanup saat unmount
  useEffect(() => {
    engine.setOnMetricsUpdate((metrics) => {
      setSimulationState(metrics);
    });

    return () => {
      engine.destroy();
    };
  }, [engine]);

  // Handler pemilihan tab eksperimen
  const handleSelectExperiment = (exp) => {
    setSelectedExpId(exp.id);
    setActiveStage('simulation');
    setConcA(exp.defaultParameters.concA);
    setConcB(exp.defaultParameters.concB);
    setTemperature(exp.defaultParameters.temperature);
    setHasCatalyst(exp.defaultParameters.hasCatalyst);

    const existingObs = getObservationsByExperiment(exp.id);
    setSavedObservation(existingObs.length > 0 ? existingObs[0] : null);
    setIsEditingObservation(false);
    setQuizResult(null);

    engine.resetToDefaults(exp.defaultParameters);
    setSimulationState(engine.getMetrics());
  };

  // Perbarui parameter di engine ketika state slider berubah
  const handleUpdateConcA = (val) => {
    setConcA(val);
    engine.updateParameters({ concA: val });
  };

  const handleUpdateConcB = (val) => {
    setConcB(val);
    engine.updateParameters({ concB: val });
  };

  const handleUpdateTemperature = (val) => {
    setTemperature(val);
    engine.updateParameters({ temperature: val });
  };

  const handleUpdateCatalyst = (val) => {
    setHasCatalyst(val);
    engine.updateParameters({ hasCatalyst: val });
  };

  // Kontrol Eksekusi Simulasi
  const handleStart = () => {
    engine.startReaction();
  };

  const handlePause = () => {
    engine.pause();
  };

  const handleResume = () => {
    engine.resume();
  };

  const handleRestart = () => {
    engine.restart();
  };

  const handleReset = () => {
    engine.resetToDefaults(activeExp.defaultParameters);
    setConcA(activeExp.defaultParameters.concA);
    setConcB(activeExp.defaultParameters.concB);
    setTemperature(activeExp.defaultParameters.temperature);
    setHasCatalyst(activeExp.defaultParameters.hasCatalyst);
  };

  // Callback saat pengamatan disimpan
  const handleObservationSaved = (obs) => {
    setSavedObservation(obs);
    setIsEditingObservation(false);
    markObservationCompleted(activeExp.id);
  };

  // Callback saat kuis laboratorium selesai
  const handleQuizCompleted = (result) => {
    setQuizResult(result);
    // Jika simulasi pernah dijalankan dan pengamatan disimpan, tandai eksperimen selesai!
    if (markExperiment) {
      markExperiment(activeExp.id);
    }
    setActiveStage('report');
  };

  const isExpDone = isExperimentCompleted(activeExp.id);

  return (
    <div className="lab-page-container">
      {/* 1. Header Utama Halaman Lab */}
      <header className="lab-page-header">
        <button className="back-btn" onClick={() => onNavigate('beranda')}>
          &larr; Kembali ke Beranda
        </button>
        <span className="page-category-badge">LABORATORIUM VIRTUAL INTERAKTIF</span>
        <h1 className="lab-main-title">Eksperimen Mikroskopik: Teori Tumbukan Laju Reaksi</h1>
        <p className="lab-main-subtitle">
          Eksplorasi visual reaksi konseptual <strong>A + B → Produk</strong>. Amati bagaimana konsentrasi dan suhu
          memengaruhi kerapatan partikel, frekuensi tumbukan, tumbukan efektif, dan laju reaksi model secara real-time.
        </p>
      </header>

      {/* 2. Navigasi Pilihan Eksperimen */}
      <nav className="lab-exp-nav-tabs" aria-label="Daftar Percobaan Laboratorium">
        {EXPERIMENTS_DATA.map((exp) => {
          const active = exp.id === selectedExpId;
          const done = isExperimentCompleted(exp.id);

          return (
            <button
              key={exp.id}
              className={`exp-tab-item ${active ? 'active' : ''}`}
              onClick={() => handleSelectExperiment(exp)}
            >
              <div className="tab-pill-row">
                <span className="exp-code-pill">{exp.code}</span>
                {done && <span className="tab-check">✓ Selesai</span>}
              </div>
              <strong className="exp-tab-factor">{exp.factor}</strong>
              <span className="exp-tab-badge">{exp.badge}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. Stepper Alur Belajar Laboratorium */}
      <div className="lab-learning-stepper" role="navigation" aria-label="Alur Belajar Eksperimen">
        <button
          className={`step-btn ${activeStage === 'simulation' ? 'active' : ''}`}
          onClick={() => setActiveStage('simulation')}
        >
          <span className="step-num">1</span>
          <span className="step-title">Simulasi & Data Live</span>
        </button>

        <span className="step-arrow">&rarr;</span>

        <button
          className={`step-btn ${activeStage === 'observation' ? 'active' : ''} ${savedObservation ? 'has-data' : ''}`}
          onClick={() => setActiveStage('observation')}
        >
          <span className="step-num">2</span>
          <span className="step-title">Lembar Pengamatan {savedObservation ? '✓' : ''}</span>
        </button>

        <span className="step-arrow">&rarr;</span>

        <button
          className={`step-btn ${activeStage === 'quiz' ? 'active' : ''} ${quizResult ? 'has-data' : ''}`}
          onClick={() => setActiveStage('quiz')}
        >
          <span className="step-num">3</span>
          <span className="step-title">Kuis Pemahaman Lab {quizResult ? '✓' : ''}</span>
        </button>

        <span className="step-arrow">&rarr;</span>

        <button
          className={`step-btn ${activeStage === 'report' ? 'active' : ''} ${isExpDone ? 'is-complete' : ''}`}
          onClick={() => setActiveStage('report')}
        >
          <span className="step-num">4</span>
          <span className="step-title">Laporan Capaian {isExpDone ? '✓' : ''}</span>
        </button>
      </div>

      {/* 4. Konten Utama Berdasarkan Tahap Aktif */}
      <main className="lab-stage-content" role="region" aria-live="polite">
        {/* TAHAP 1: SIMULASI MIKROSKOPIK & DATA LIVE */}
        {activeStage === 'simulation' && (
          <div className="simulation-stage-layout">
            {/* Kolom Kiri: Panel Kontrol Parameter */}
            <div className="stage-controls-col">
              <ReactionParameterControls
                experiment={activeExp}
                concA={concA}
                setConcA={handleUpdateConcA}
                concB={concB}
                setConcB={handleUpdateConcB}
                temperature={temperature}
                setTemperature={handleUpdateTemperature}
                hasCatalyst={hasCatalyst}
                setHasCatalyst={handleUpdateCatalyst}
                status={simulationState.status}
                onStart={handleStart}
                onPause={handlePause}
                onResume={handleResume}
                onRestart={handleRestart}
                onReset={handleReset}
              />
            </div>

            {/* Kolom Kanan: Kanvas Mikroskopik, Metrik Kuantitatif, & Grafik */}
            <div className="stage-visuals-col">
              {/* Kanvas Simulasi Partikel */}
              <ParticleSimulation
                engine={engine}
                status={simulationState.status}
                temperature={temperature}
                concA={concA}
                concB={concB}
                remainingA={simulationState.remainingA}
                remainingB={simulationState.remainingB}
                productCount={simulationState.productCount}
              />

              {/* Indikator Metrik Kuantitatif Terpisah */}
              <CollisionMetrics
                collisionCount={simulationState.collisionCount}
                collisionFrequency={simulationState.collisionFrequency}
                effectiveCollisionCount={simulationState.effectiveCollisionCount}
                productCount={simulationState.productCount}
                reactionRate={simulationState.reactionRate}
                elapsedTime={simulationState.elapsedTime}
              />

              {/* Grafik Real-Time Partikel vs Waktu */}
              <SimulationChart
                timeSeries={simulationState.timeSeries}
                maxDuration={simulationState.maxDuration}
              />

              {/* Tombol Lanjut ke Tahap Pengamatan */}
              <div className="stage-next-action-bar">
                <div className="action-hint">
                  {simulationState.collisionCount > 0
                    ? '✓ Data pengamatan telah diperoleh. Lanjutkan ke Lembar Pengamatan untuk mencatat dan menganalisis.'
                    : 'Jalankan simulasi minimal beberapa detik untuk mengumpulkan data pengamatan.'}
                </div>
                <button
                  className="btn btn-primary btn-proceed-next"
                  onClick={() => setActiveStage('observation')}
                >
                  Lanjut ke Lembar Pengamatan Siswa &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAHAP 2: LEMBAR DATA PENGAMATAN SISWA */}
        {activeStage === 'observation' && (
          <div className="observation-stage-layout">
            {savedObservation && !isEditingObservation ? (
              <ObservationSummary
                observation={savedObservation}
                experiment={activeExp}
                onEdit={() => setIsEditingObservation(true)}
                onProceedToQuiz={() => setActiveStage('quiz')}
              />
            ) : (
              <ObservationForm
                experiment={activeExp}
                metrics={simulationState}
                parameters={{ concA, concB, temperature, hasCatalyst }}
                onObservationSaved={handleObservationSaved}
                initialData={savedObservation}
              />
            )}
          </div>
        )}

        {/* TAHAP 3: KUIS PEMAHAMAN LABORATORIUM */}
        {activeStage === 'quiz' && (
          <div className="quiz-stage-layout">
            <LaboratoryQuiz
              experiment={activeExp}
              onQuizCompleted={handleQuizCompleted}
            />
          </div>
        )}

        {/* TAHAP 4: LAPORAN CAPAIAN AKHIR PRAKTIKUM */}
        {activeStage === 'report' && (
          <div className="report-stage-layout">
            <ExperimentSummaryReport
              experiment={activeExp}
              metrics={simulationState}
              observation={savedObservation}
              quizResult={quizResult}
              onRestartLab={() => {
                handleRestart();
                setActiveStage('simulation');
              }}
              onNavigate={onNavigate}
            />
          </div>
        )}
      </main>
    </div>
  );
}
