import './ReactionParameterControls.css';

/**
 * ReactionParameterControls.jsx
 * Panel Kontrol Parameter Eksperimen & Tombol Simulasi
 * Sesuai spesifikasi PRD Bab 8.3, 8.4, 8.9 & AGENT.md Bab 5.2, 5.3, 5.7
 */
export default function ReactionParameterControls({
  experiment,
  concA,
  setConcA,
  concB,
  setConcB,
  temperature,
  setTemperature,
  hasCatalyst,
  setHasCatalyst,
  status,
  onStart,
  onPause,
  onResume,
  onRestart,
  onReset,
}) {
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isCompleted = status === 'completed';

  // Penentuan peran variabel berdasarkan eksperimen aktif
  const manipulated = experiment?.manipulatedVariable || 'concA';

  return (
    <section className="reaction-controls-card" aria-labelledby="controls-heading">
      <div className="controls-card-header">
        <div className="header-titles">
          <span className="factor-tag">Eksperimen: {experiment?.factor || 'Laju Reaksi'}</span>
          <h2 id="controls-heading" className="controls-title">Pengaturan Parameter Reaksi</h2>
        </div>
        <button
          className="btn-text-reset"
          onClick={onReset}
          title="Kembalikan semua variabel ke nilai acuan default"
          disabled={isRunning}
        >
          ↺ Reset Default
        </button>
      </div>

      <div className="variables-guide-badge">
        <div className="guide-row">
          <span className="dot dot-manipulated" />
          <span><strong>Variabel Bebas (Diuji):</strong> {experiment?.variables?.independent || 'Konsentrasi A'}</span>
        </div>
        <div className="guide-row">
          <span className="dot dot-controlled" />
          <span><strong>Variabel Terkontrol (Dijaga):</strong> {experiment?.variables?.controlled || 'Konsentrasi B, Suhu'}</span>
        </div>
      </div>

      <div className="controls-form-body">
        {/* 1. Konsentrasi Pereaksi A */}
        <div className={`control-group ${manipulated === 'concA' ? 'is-manipulated' : 'is-controlled'}`}>
          <div className="control-label-line">
            <label htmlFor="param-conc-a">
              Konsentrasi Pereaksi [A]
              {manipulated === 'concA' && <span className="status-badge bebas">Variabel Diuji</span>}
              {manipulated !== 'concA' && <span className="status-badge tetap">Terkontrol</span>}
            </label>
            <span className="value-chip cyan-chip">{concA} M</span>
          </div>
          <div className="slider-wrapper">
            <input
              id="param-conc-a"
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={concA}
              onChange={(e) => setConcA(parseFloat(e.target.value))}
              disabled={isRunning}
              aria-valuemin={0.1}
              aria-valuemax={2.0}
              aria-valuenow={concA}
            />
          </div>
          <div className="control-limits">
            <span>0.1 M (Encer)</span>
            <span>Jumlah Partikel A: ~{Math.round(concA * 15)}</span>
            <span>2.0 M (Pekat)</span>
          </div>
        </div>

        {/* 2. Konsentrasi Pereaksi B */}
        <div className={`control-group ${manipulated === 'concB' ? 'is-manipulated' : 'is-controlled'}`}>
          <div className="control-label-line">
            <label htmlFor="param-conc-b">
              Konsentrasi Pereaksi [B]
              {manipulated === 'concB' && <span className="status-badge bebas">Variabel Diuji</span>}
              {manipulated !== 'concB' && <span className="status-badge tetap">Terkontrol</span>}
            </label>
            <span className="value-chip amber-chip">{concB} M</span>
          </div>
          <div className="slider-wrapper">
            <input
              id="param-conc-b"
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={concB}
              onChange={(e) => setConcB(parseFloat(e.target.value))}
              disabled={isRunning}
              aria-valuemin={0.1}
              aria-valuemax={2.0}
              aria-valuenow={concB}
            />
          </div>
          <div className="control-limits">
            <span>0.1 M (Encer)</span>
            <span>Jumlah Partikel B: ~{Math.round(concB * 15)}</span>
            <span>2.0 M (Pekat)</span>
          </div>
        </div>

        {/* 3. Suhu Sistem */}
        <div className={`control-group ${manipulated === 'temperature' ? 'is-manipulated' : 'is-controlled'}`}>
          <div className="control-label-line">
            <label htmlFor="param-temperature">
              Suhu Sistem (°C)
              {manipulated === 'temperature' && <span className="status-badge bebas">Variabel Diuji</span>}
              {manipulated !== 'temperature' && <span className="status-badge tetap">Terkontrol</span>}
            </label>
            <span className="value-chip red-chip">{temperature} °C</span>
          </div>
          <div className="slider-wrapper">
            <input
              id="param-temperature"
              type="range"
              min="10"
              max="80"
              step="5"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value, 10))}
              aria-valuemin={10}
              aria-valuemax={80}
              aria-valuenow={temperature}
            />
          </div>
          <div className="control-limits">
            <span>10°C (Lambat)</span>
            <span>Energi Kinetik T ~ {temperature + 273} K</span>
            <span>80°C (Cepat)</span>
          </div>
        </div>

        {/* 4. Katalis Reaksi (Opsional) */}
        <div className={`control-group ${manipulated === 'hasCatalyst' ? 'is-manipulated' : 'is-controlled'}`}>
          <div className="control-label-line">
            <label htmlFor="param-catalyst">
              Katalis Reaksi
              {manipulated === 'hasCatalyst' && <span className="status-badge bebas">Variabel Diuji</span>}
            </label>
            <button
              id="param-catalyst"
              type="button"
              className={`toggle-catalyst-btn ${hasCatalyst ? 'active' : ''}`}
              onClick={() => setHasCatalyst(!hasCatalyst)}
              disabled={isRunning}
              aria-pressed={hasCatalyst}
            >
              {hasCatalyst ? '✓ DENGAN KATALIS' : '✕ TANPA KATALIS'}
            </button>
          </div>
          <span className="catalyst-note">
            {hasCatalyst
              ? '⚡ Katalis aktif: Menurunkan energi aktivasi (Ea) sehingga fraksi tumbukan efektif meningkat.'
              : 'Katalis non-aktif: Partikel memerlukan energi aktivasi standar reaksi.'}
          </span>
        </div>
      </div>

      {/* Toolbar Kontrol Eksekusi Simulasi */}
      <div className="simulation-toolbar" role="toolbar" aria-label="Kontrol Waktu Nyata Simulasi">
        {status === 'idle' && (
          <button
            id="btn-start-sim"
            className="btn btn-primary btn-run-large"
            onClick={onStart}
          >
            ▶ Mulai Simulasi
          </button>
        )}

        {isRunning && (
          <button
            id="btn-pause-sim"
            className="btn btn-warning btn-run-large"
            onClick={onPause}
          >
            ⏸ Jeda Simulasi
          </button>
        )}

        {isPaused && (
          <button
            id="btn-resume-sim"
            className="btn btn-primary btn-run-large"
            onClick={onResume}
          >
            ▶ Lanjutkan Simulasi
          </button>
        )}

        {isCompleted && (
          <button
            id="btn-restart-completed"
            className="btn btn-primary btn-run-large"
            onClick={onRestart}
          >
            ↻ Ulangi Percobaan
          </button>
        )}

        {/* Tombol Ulangi Kondisi yang Sama */}
        {(isRunning || isPaused) && (
          <button
            id="btn-restart-sim"
            className="btn btn-secondary"
            onClick={onRestart}
            title="Mulai ulang dari detik ke-0 dengan parameter saat ini"
          >
            ↻ Ulangi
          </button>
        )}
      </div>
    </section>
  );
}
