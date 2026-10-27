import { useState, useMemo } from 'react';
import { EXPERIMENTS_DATA } from '../data/experiments.js';
import './LaboratoryPage.css';

/**
 * LaboratoryPage.jsx
 * Laboratorium Virtual Interaktif 4 Faktor Laju Reaksi
 */
export default function LaboratoryPage({ onNavigate, isExperimentCompleted, markExperiment, initialExperimentId = '' }) {
  const [selectedExpId, setSelectedExpId] = useState(initialExperimentId || EXPERIMENTS_DATA[0].id);

  // Parameter State
  const [concentration, setConcentration] = useState(1.0);
  const [temperature, setTemperature] = useState(25);
  const [surfaceArea, setSurfaceArea] = useState('medium');
  const [hasCatalyst, setHasCatalyst] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const activeExp = EXPERIMENTS_DATA.find((e) => e.id === selectedExpId) || EXPERIMENTS_DATA[0];
  const isDone = isExperimentCompleted(activeExp.id);

  // Perhitungan ilmiah kualitatif laju reaksi sederhana
  const simulationResults = useMemo(() => {
    // Pengaruh konsentrasi (orde 1 estimasi)
    const concFactor = concentration;
    // Pengaruh suhu (aturan Arrhenius sederhana: naik 2x tiap +10°C di atas 25°C)
    const tempFactor = Math.pow(2, (temperature - 25) / 10);
    // Pengaruh luas permukaan
    const surfaceFactor = surfaceArea === 'serbuk' ? 2.5 : surfaceArea === 'medium' ? 1.5 : 0.8;
    // Pengaruh katalis (penurunan Ea mempercepat 3x)
    const catalystFactor = hasCatalyst ? 3.0 : 1.0;

    const rateScore = concFactor * tempFactor * surfaceFactor * catalystFactor;
    const estTimeSeconds = Math.max(1.5, (120 / rateScore)).toFixed(1);
    const collisionFreq = Math.round(rateScore * 14);

    return {
      rateScore: rateScore.toFixed(2),
      estTimeSeconds,
      collisionFreq,
    };
  }, [concentration, temperature, surfaceArea, hasCatalyst]);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      markExperiment(activeExp.id);
    }, 1200);
  };

  const handleResetParameters = () => {
    setConcentration(activeExp.defaultParameters.concentration);
    setTemperature(activeExp.defaultParameters.temperature);
    setSurfaceArea(activeExp.defaultParameters.surfaceArea);
    setHasCatalyst(activeExp.defaultParameters.hasCatalyst);
  };

  return (
    <div className="lab-page-container">
      {/* Header */}
      <div className="lab-page-header">
        <button className="back-btn" onClick={() => onNavigate('beranda')}>
          &larr; Kembali ke Beranda
        </button>
        <span className="page-category-badge">LABORATORIUM VIRTUAL INTERAKTIF</span>
        <h1 className="lab-main-title">Simulasi Eksperimen Laju Reaksi</h1>
        <p className="lab-main-subtitle">
          Manipulasi variabel bebas dan amati dampaknya terhadap frekuensi tumbukan serta waktu reaksi secara real-time.
        </p>
      </div>

      {/* Tabs Eksperimen */}
      <div className="lab-exp-nav-tabs">
        {EXPERIMENTS_DATA.map((exp) => {
          const active = exp.id === selectedExpId;
          const done = isExperimentCompleted(exp.id);

          return (
            <button
              key={exp.id}
              className={`exp-tab-item ${active ? 'active' : ''}`}
              onClick={() => {
                setSelectedExpId(exp.id);
                setConcentration(exp.defaultParameters.concentration);
                setTemperature(exp.defaultParameters.temperature);
                setSurfaceArea(exp.defaultParameters.surfaceArea);
                setHasCatalyst(exp.defaultParameters.hasCatalyst);
              }}
            >
              <div className="tab-pill-row">
                <span className="exp-code-pill">{exp.code}</span>
                {done && <span className="tab-check">✓ Selesai</span>}
              </div>
              <strong className="exp-tab-factor">{exp.factor}</strong>
            </button>
          );
        })}
      </div>

      {/* Workspace Laboratorium */}
      <div className="lab-workspace-grid">
        {/* Panel Kontrol Variabel */}
        <section className="lab-controls-panel" aria-labelledby="panel-title">
          <div className="panel-header">
            <h2 id="panel-title" className="panel-title">Panel Pengaturan Variabel</h2>
            <button className="btn-reset-params" onClick={handleResetParameters}>
              Reset Nilai Awal
            </button>
          </div>

          <div className="controls-form">
            {/* 1. Konsentrasi */}
            <div className={`control-item ${activeExp.factor === 'Konsentrasi' ? 'highlight-control' : ''}`}>
              <div className="control-label-row">
                <label htmlFor="input-conc">Konsentrasi Pereaksi [A]</label>
                <span className="control-value-display">{concentration} M</span>
              </div>
              <input
                id="input-conc"
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={concentration}
                onChange={(e) => setConcentration(parseFloat(e.target.value))}
              />
              <span className="control-hint">Rentang: 0.1 M (encer) s.d. 2.0 M (pekat)</span>
            </div>

            {/* 2. Suhu */}
            <div className={`control-item ${activeExp.factor === 'Suhu' ? 'highlight-control' : ''}`}>
              <div className="control-label-row">
                <label htmlFor="input-temp">Suhu Lingkungan (°C)</label>
                <span className="control-value-display">{temperature} °C</span>
              </div>
              <input
                id="input-temp"
                type="range"
                min="10"
                max="80"
                step="5"
                value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value, 10))}
              />
              <span className="control-hint">Rentang: 10°C (dingin) s.d. 80°C (panas)</span>
            </div>

            {/* 3. Luas Permukaan */}
            <div className={`control-item ${activeExp.factor === 'Luas Permukaan' ? 'highlight-control' : ''}`}>
              <label className="control-label-row">Bentuk Fisik Padatan</label>
              <div className="surface-buttons-group">
                {[
                  { id: 'bongkahan', label: 'Bongkahan' },
                  { id: 'medium', label: 'Butiran' },
                  { id: 'serbuk', label: 'Serbuk Halus' },
                ].map((s) => (
                  <button
                    key={s.id}
                    className={`surface-btn ${surfaceArea === s.id ? 'active' : ''}`}
                    onClick={() => setSurfaceArea(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Katalis */}
            <div className={`control-item ${activeExp.factor === 'Katalis' ? 'highlight-control' : ''}`}>
              <div className="catalyst-toggle-row">
                <label htmlFor="toggle-catalyst">Gunakan Katalis Reaksi</label>
                <button
                  id="toggle-catalyst"
                  className={`toggle-switch ${hasCatalyst ? 'on' : 'off'}`}
                  onClick={() => setHasCatalyst(!hasCatalyst)}
                  aria-pressed={hasCatalyst}
                >
                  {hasCatalyst ? 'DENGAN KATALIS' : 'TANPA KATALIS'}
                </button>
              </div>
              <span className="control-hint">Katalis menurunkan energi aktivasi reaksi (Ea).</span>
            </div>
          </div>

          <div className="panel-actions">
            <button
              id="btn-run-simulation"
              className="btn btn-primary btn-run-sim"
              onClick={handleRunSimulation}
              disabled={isSimulating}
            >
              {isSimulating ? 'Memproses Simulasi...' : '▶ Jalankan Simulasi Eksperimen'}
            </button>
          </div>
        </section>

        {/* Panel Hasil & Visualisasi */}
        <section className="lab-results-panel" aria-labelledby="results-title">
          <div className="results-card">
            <div className="results-header">
              <span className="badge badge-cyan">{activeExp.code}</span>
              <h2 id="results-title" className="results-title">{activeExp.title}</h2>
              <p className="results-desc">{activeExp.description}</p>
            </div>

            {/* Variabel Kontrol Ilmiah */}
            <div className="variables-table-box">
              <span className="sub-heading">Desain Variabel Eksperimen:</span>
              <ul className="variables-list">
                <li><strong>Variabel Bebas:</strong> {activeExp.variables.independent}</li>
                <li><strong>Variabel Terikat:</strong> {activeExp.variables.dependent}</li>
                <li><strong>Variabel Terkontrol:</strong> {activeExp.variables.controlled}</li>
              </ul>
            </div>

            {/* Indikator Hasil Simulasi */}
            <div className="sim-output-box">
              <span className="sub-heading">Data Hasil Simulasi:</span>
              <div className="metrics-grid">
                <div className="metric-card">
                  <span className="metric-val">{simulationResults.estTimeSeconds} s</span>
                  <span className="metric-lbl">Waktu Selesai Reaksi</span>
                </div>
                <div className="metric-card">
                  <span className="metric-val">{simulationResults.collisionFreq} /detik</span>
                  <span className="metric-lbl">Frekuensi Tumbukan</span>
                </div>
                <div className="metric-card">
                  <span className="metric-val">{simulationResults.rateScore} x</span>
                  <span className="metric-lbl">Faktor Relatif Laju</span>
                </div>
              </div>
            </div>

            {/* Kesimpulan Eksperimen */}
            <div className="scientific-conclusion">
              <strong>Kesimpulan Ilmiah:</strong>
              <p>
                {activeExp.factor === 'Konsentrasi' &&
                  `Konsentrasi ${concentration} M memperbesar kerapatan partikel zat pereaksi, sehingga frekuensi tumbukan antarpartikel per satuan waktu meningkat dan reaksi selesai lebih cepat.`}
                {activeExp.factor === 'Suhu' &&
                  `Pada suhu ${temperature}°C, partikel memiliki energi kinetik lebih tinggi. Jumlah partikel yang mampu melampaui energi aktivasi (Ea) melonjak, meningkatkan fraksi tumbukan efektif.`}
                {activeExp.factor === 'Luas Permukaan' &&
                  `Bentuk fisik '${surfaceArea}' menentukan luas bidang sentuh total padatan. Luas bidang yang semakin besar membuka lebih banyak titik tumbukan langsung dengan larutan.`}
                {activeExp.factor === 'Katalis' &&
                  (hasCatalyst
                    ? 'Katalis aktif menyediakan rute mekanisme reaksi alternatif dengan energi aktivasi lebih rendah, melipatgandakan laju tanpa ikut habis terpakai.'
                    : 'Tanpa katalis, partikel harus melampaui energi aktivasi standar reaksi yang membutuhkan waktu lebih lama.')}
              </p>
            </div>

            <div className="results-footer">
              {isDone && <span className="done-badge">✓ Eksperimen ini telah tercatat dalam progres kamu.</span>}
              <button className="btn btn-secondary" onClick={() => onNavigate('materi')}>
                Pelajari Pembahasan Materi &rarr;
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
