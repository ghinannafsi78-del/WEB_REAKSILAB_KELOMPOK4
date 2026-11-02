import { useEffect, useRef } from 'react';
import './ParticleSimulation.css';

/**
 * ParticleSimulation.jsx
 * Kanvas Visualisasi Mikroskopik Partikel A, B, dan Produk
 * Sesuai spesifikasi PRD Bab 8.5, Bab 9, Bab 22 & AGENT.md Bab 5, 10, 16
 */
export default function ParticleSimulation({
  engine,
  status = 'idle',
  temperature = 25,
  concA = 1.0,
  concB = 1.0,
  remainingA = 0,
  remainingB = 0,
  productCount = 0,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !engine) return;

    // Hubungkan kanvas langsung ke engine loop
    engine.attachCanvas(canvas);
    engine.ensureRunningLoop();

    // Adaptasi layar responsif
    const handleResize = () => {
      if (engine && canvas) {
        engine.drawCanvas();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.detachCanvas();
    };
  }, [engine]);

  return (
    <div className="particle-simulation-wrapper" ref={containerRef}>
      {/* Header Info Status Simulasi */}
      <div className="canvas-header-bar">
        <div className="system-state-tag">
          <span className="live-dot" data-status={status} />
          <span className="status-label">
            {status === 'running' && 'Reaksi Aktif (60 FPS)'}
            {status === 'paused' && 'Simulasi Dijeda'}
            {status === 'idle' && 'Partikel Bergerak Termal (Siap Direaksikan)'}
            {status === 'completed' && 'Waktu Pengamatan Selesai'}
          </span>
        </div>
        <div className="condition-indicator">
          <span>T: <strong>{temperature}°C</strong></span>
          <span className="divider">•</span>
          <span>[A]: <strong>{concA} M</strong> ({remainingA} partikel)</span>
          <span className="divider">•</span>
          <span>[B]: <strong>{concB} M</strong> ({remainingB} partikel)</span>
          <span className="divider">•</span>
          <span>Produk: <strong>{productCount}</strong></span>
        </div>
      </div>

      {/* Area Kanvas Partikel */}
      <div className="canvas-viewport">
        <canvas
          ref={canvasRef}
          className="particle-canvas"
          aria-label={`Visualisasi mikroskopik reaksi A + B menjadi Produk. Terdiri dari ${remainingA} partikel A, ${remainingB} partikel B, dan ${productCount} produk pada suhu ${temperature} derajat Celsius.`}
        />

        {/* Petunjuk Status */}
        {status === 'idle' && (
          <div className="canvas-banner-hint idle-hint">
            <span className="hint-pill">🔬 Gerak Partikel Aktif</span>
            <span className="hint-text">
              Partikel A dan B sedang bergerak termal. Tekan <strong>▶ Mulai Simulasi</strong> untuk mengaktifkan tumbukan pembentukan produk.
            </span>
          </div>
        )}

        {status === 'paused' && (
          <div className="canvas-overlay paused-overlay">
            <span className="pause-icon">⏸️</span>
            <p>Simulasi Sedang Dijeda</p>
            <span className="pause-subtext">Posisi dan seluruh metrik waktu dibekukan sementara.</span>
          </div>
        )}

        {status === 'completed' && (
          <div className="canvas-overlay completed-overlay">
            <span className="completed-icon">✓</span>
            <p>Waktu Pengamatan Selesai</p>
            <span className="completed-hint">Seluruh data kuantitatif tercatat. Silakan lengkapi formulir pengamatan di bawah.</span>
          </div>
        )}
      </div>

      {/* Legenda Representasi Visual */}
      <div className="particle-legend-row" aria-label="Legenda identitas partikel">
        <div className="legend-item">
          <span className="legend-swatch swatch-a">A</span>
          <span className="legend-text">Partikel Reaktan A ([A])</span>
        </div>
        <div className="legend-item">
          <span className="legend-swatch swatch-b">B</span>
          <span className="legend-text">Partikel Reaktan B ([B])</span>
        </div>
        <div className="legend-item">
          <span className="legend-swatch swatch-product">AB</span>
          <span className="legend-text">Partikel Produk (Hasil Tumbukan Efektif)</span>
        </div>
        <div className="legend-item">
          <span className="legend-swatch swatch-flash">💥</span>
          <span className="legend-text">Tumbukan Efektif (E ≥ Ea)</span>
        </div>
      </div>

      {/* Catatan Keterbatasan Model Ilmiah (PRD 8.10, 9.5 & AGENT.md 11) */}
      <div className="model-simplification-note">
        <span className="note-icon">💡</span>
        <span className="note-text">
          <strong>Penyederhanaan Model:</strong> Simulasi ini memodelkan reaksi konseptual <code>A + B → AB</code> untuk mempelajari Teori Tumbukan. Kepadatan partikel mewakili konsentrasi zat pada volume tetap; kecepatan gerak mewakili energi kinetik rata-rata akibat suhu mutlak. Orientasi molekuler disederhanakan.
        </span>
      </div>
    </div>
  );
}
