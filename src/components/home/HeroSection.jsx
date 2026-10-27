import { useState, useEffect } from 'react';
import './HeroSection.css';

/**
 * HeroSection.jsx
 * Bagian hero pengenalan REAKSI LAB
 * Menghubungkan fenomena makroskopik, mikroskopik (tumbukan), dan simbolik
 */
export default function HeroSection({ onStartLearning, onExploreLab }) {
  // Simulasi interaktif mini partikel tumbukan pada hero visual
  const [particles, setParticles] = useState([
    { id: 1, x: 22, y: 35, vx: 0.8, vy: 0.5, type: 'reaktan-a', size: 16 },
    { id: 2, x: 75, y: 40, vx: -0.7, vy: -0.4, type: 'reaktan-b', size: 14 },
    { id: 3, x: 45, y: 70, vx: 0.5, vy: -0.6, type: 'reaktan-a', size: 16 },
    { id: 4, x: 60, y: 25, vx: -0.6, vy: 0.7, type: 'reaktan-b', size: 14 },
    { id: 5, x: 30, y: 65, vx: 0.7, vy: 0.4, type: 'reaktan-b', size: 14 },
    { id: 6, x: 80, y: 75, vx: -0.5, vy: -0.5, type: 'reaktan-a', size: 16 },
  ]);

  const [collisionCount, setCollisionCount] = useState(0);

  // Animasi pergerakan partikel dalam wadah mikroskopik
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          let newX = p.x + p.vx;
          let newY = p.y + p.vy;
          let newVx = p.vx;
          let newVy = p.vy;

          // Batas dinding wadah
          if (newX <= 8 || newX >= 92) {
            newVx = -newVx;
            newX = Math.max(8, Math.min(92, newX));
          }
          if (newY <= 10 || newY >= 90) {
            newVy = -newVy;
            newY = Math.max(10, Math.min(90, newY));
          }

          return { ...p, x: newX, y: newY, vx: newVx, vy: newVy };
        })
      );
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const handleSimulateCollision = () => {
    setCollisionCount((prev) => prev + 1);
  };

  return (
    <section className="hero-container" aria-labelledby="hero-main-title">
      <div className="hero-grid">
        {/* Kolom Teks Pengantar */}
        <div className="hero-text-col">
          <div className="hero-eyebrow-badge">
            <span className="hero-pulse-dot" aria-hidden="true"></span>
            <span className="hero-eyebrow-text">LABORATORIUM KIMIA DIGITAL</span>
          </div>

          <h1 id="hero-main-title" className="hero-title">
            Jelajahi Reaksi, <br />
            <span className="hero-title-gradient">Pahami Prosesnya.</span>
          </h1>

          <p className="hero-description">
            Pelajari laju reaksi melalui materi interaktif, simulasi eksperimen virtual,
            visualisasi tumbukan partikel, dan latihan soal yang membantu kamu memahami kimia secara
            lebih mendalam.
          </p>

          {/* Action Buttons */}
          <div className="hero-actions-row">
            <button
              id="hero-btn-start"
              className="btn btn-primary hero-btn-main"
              onClick={onStartLearning}
              aria-label="Mulai Belajar Materi Laju Reaksi"
            >
              <span>Mulai Belajar</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>

            <button
              id="hero-btn-lab"
              className="btn btn-secondary hero-btn-lab"
              onClick={onExploreLab}
              aria-label="Jelajahi Laboratorium Virtual"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2v7.31L4.69 19.3A2 2 0 0 0 6.44 22h11.12a2 2 0 0 0 1.75-2.7L14 9.31V2" />
                <path d="M8.5 2h7" />
              </svg>
              <span>Jelajahi Laboratorium</span>
            </button>
          </div>

          {/* Core Chemistry Pillars / Cues */}
          <div className="hero-pillars-list">
            <div className="pillar-item">
              <span className="pillar-icon">🔬</span>
              <div className="pillar-info">
                <strong>Representasi Mikroskopik</strong>
                <span>Teori Tumbukan & Ea</span>
              </div>
            </div>
            <div className="pillar-item">
              <span className="pillar-icon">🧪</span>
              <div className="pillar-info">
                <strong>Simulasi Virtual</strong>
                <span>4 Faktor Laju Reaksi</span>
              </div>
            </div>
            <div className="pillar-item">
              <span className="pillar-icon">📐</span>
              <div className="pillar-info">
                <strong>Perhitungan Simbolik</strong>
                <span>Persamaan Laju & Orde</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Visual Sains / Digital Lab Chamber */}
        <div className="hero-visual-col" aria-label="Simulasi Visual Partikel Kimia">
          <div className="lab-chamber-card">
            {/* Header Chamber */}
            <div className="chamber-header">
              <div className="chamber-title-box">
                <span className="chamber-indicator" aria-hidden="true"></span>
                <span className="chamber-title">Visualisasi Tumbukan Partikel</span>
              </div>
              <span className="chamber-tag">Model Mikroskopik</span>
            </div>

            {/* Arena Reaksi Partikel */}
            <div className="particle-arena" onClick={handleSimulateCollision} title="Klik untuk memicu interaksi partikel">
              {/* Partikel Gerak */}
              {particles.map((p) => (
                <div
                  key={p.id}
                  className={`particle-node ${p.type}`}
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                  }}
                  aria-hidden="true"
                >
                  <span className="particle-symbol">{p.type === 'reaktan-a' ? 'A' : 'B'}</span>
                </div>
              ))}

              {/* Garis Pusat Keadaan Transisi / Energi Aktivasi */}
              <div className="ea-barrier-line" aria-hidden="true">
                <span className="ea-label">Ambang Energi Aktivasi (Ea)</span>
              </div>

              {/* Status Info Overlay */}
              <div className="arena-caption-overlay">
                <span>Tumbukan Partikel Reaktan: <strong>{particles.length} Partikel Aktif</strong></span>
                {collisionCount > 0 && <span className="collision-badge">Tumbukan Tercatat: {collisionCount}</span>}
              </div>
            </div>

            {/* Chamber Footer: Representasi Kimia & Legenda */}
            <div className="chamber-footer">
              <div className="particle-legend">
                <div className="legend-item">
                  <span className="legend-dot reaktan-a-dot"></span>
                  <span>Partikel A (Pereaksi)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot reaktan-b-dot"></span>
                  <span>Partikel B (Pereaksi)</span>
                </div>
              </div>
              <div className="formula-preview">
                <code>v = k [A]ᵐ [B]ⁿ</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
