import HeroSection from '../components/home/HeroSection.jsx';
import TopicCards from '../components/home/TopicCards.jsx';
import { EXPERIMENTS_DATA } from '../data/experiments.js';
import './HomePage.css';

/**
 * HomePage.jsx
 * Halaman Beranda REAKSI LAB
 * Sesuai urutan PRD dan arahan prompt:
 * 1. HeroSection
 * 2. Pengantar Konsep 3 Representasi Kimia
 * 3. TopicCards (Modul 01, 02, 03)
 * 4. Ajakan Eksplorasi Laboratorium Virtual
 * 5. Ringkasan Progres Belajar Siswa (data aktual dari LocalStorage)
 */
export default function HomePage({
  onNavigate,
  onSelectModule,
  onSelectExperiment,
  progress,
  overallPercent,
  isModuleCompleted,
}) {
  const completedModulesCount = progress?.completedModules?.length || 0;
  const completedExpCount = progress?.completedExperiments?.length || 0;

  return (
    <div className="home-page-container">
      {/* 1. Hero Section */}
      <HeroSection
        onStartLearning={() => onNavigate('materi')}
        onExploreLab={() => onNavigate('lab')}
      />

      {/* 2. Pengantar Konsep: 3 Representasi Kimia dalam Laju Reaksi */}
      <section className="representation-intro-section" aria-labelledby="intro-chem-title">
        <div className="section-header">
          <span className="section-eyebrow">PENDEKATAN PEMBELAJARAN</span>
          <h2 id="intro-chem-title" className="section-title">
            Tiga Sudut Pandang Memahami Reaksi Kimia
          </h2>
          <p className="section-desc">
            Kimia menjadi mudah dipahami ketika fenomena kasat mata dihubungkan langsung dengan
            gerakan partikel mikroskopik dan persamaan matematis.
          </p>
        </div>

        <div className="representation-grid">
          <div className="rep-card">
            <div className="rep-badge makro">01 &bull; Makroskopik</div>
            <h3>Fenomena Teramati</h3>
            <p>
              Mengamati laju perubahan zat secara visual: pembentukan endapan, volume gas yang timbul
              tiap detik, serta perubahan warna larutan selama reaksi berlangsung.
            </p>
            <div className="rep-example">
              <strong>Contoh:</strong> Gelas kimia dengan pembentukan gas H₂ dari pita Mg + HCl.
            </div>
          </div>

          <div className="rep-card highlight-card">
            <div className="rep-badge mikro">02 &bull; Mikroskopik</div>
            <h3>Tumbukan Partikel</h3>
            <p>
              Menyelami interaksi molekuler: bagaimana molekul bertumbukan dengan energi kinetik
              yang melampaui energi aktivasi (Ea) serta orientasi ruang yang tepat.
            </p>
            <div className="rep-example">
              <strong>Contoh:</strong> Gerakan partikel lebih cepat saat larutan dipanaskan.
            </div>
          </div>

          <div className="rep-card">
            <div className="rep-badge simbolik">03 &bull; Simbolik</div>
            <h3>Persamaan & Grafik</h3>
            <p>
              Merumuskan hukum laju reaksi <code>v = k[A]ᵐ[B]ⁿ</code>, menentukan orde reaksi dari
              tabel data eksperimen, serta menganalisis kurva laju terhadap waktu.
            </p>
            <div className="rep-example">
              <strong>Contoh:</strong> Penentuan orde reaksi melalui perbandingan data percobaan.
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tiga Kartu Modul Pembelajaran */}
      <TopicCards
        onSelectModule={onSelectModule}
        isModuleCompleted={isModuleCompleted}
      />

      {/* 4. Ajakan Mencoba Laboratorium Virtual */}
      <section className="lab-cta-section" aria-labelledby="lab-cta-title">
        <div className="lab-cta-wrapper">
          <div className="lab-cta-content">
            <div className="lab-cta-badge">
              <span className="cta-dot"></span>
              SIMULASI EKSPERIMEN VIRTUAL
            </div>
            <h2 id="lab-cta-title" className="lab-cta-title">
              Uji Coba 4 Faktor Laju Reaksi di Laboratorium Digital
            </h2>
            <p className="lab-cta-desc">
              Manipulasi variabel konsentrasi, suhu, ukuran partikel padatan, dan katalis secara
              langsung. Amati perubahan frekuensi tumbukan molekul dan kurva konsentrasi real-time.
            </p>

            <div className="lab-features-chips">
              {EXPERIMENTS_DATA.map((exp) => (
                <div
                  key={exp.id}
                  className="exp-chip"
                  onClick={() => onSelectExperiment ? onSelectExperiment(exp.id) : onNavigate('lab')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && (onSelectExperiment ? onSelectExperiment(exp.id) : onNavigate('lab'))}
                  title={`Jalankan eksperimen ${exp.factor}`}
                >
                  <span className="chip-code">{exp.code}</span>
                  <span className="chip-name">{exp.factor}</span>
                </div>
              ))}
            </div>

            <div className="lab-cta-action">
              <button
                id="btn-open-lab-cta"
                className="btn btn-primary"
                onClick={() => onNavigate('lab')}
                aria-label="Masuk ke Laboratorium Virtual"
              >
                <span>Masuk Laboratorium Virtual</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Ringkasan Progres Belajar Siswa (Data Aktual LocalStorage) */}
      <section className="progress-summary-section" aria-labelledby="progress-title">
        <div className="progress-summary-card">
          <div className="progress-card-info">
            <span className="summary-eyebrow">PANTAU KEMAJUAN BELAJAR</span>
            <h3 id="progress-title" className="summary-title">Ringkasan Aktivitas Kamu</h3>
            <p className="summary-subtitle">
              Setiap modul yang kamu pelajari dan eksperimen yang kamu jalankan tersimpan otomatis
              pada perangkat ini.
            </p>

            <div className="progress-stats-row">
              <div className="stat-box">
                <span className="stat-number">{completedModulesCount} / 3</span>
                <span className="stat-label">Modul Materi Selesai</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{completedExpCount} / 4</span>
                <span className="stat-label">Eksperimen Virtual</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{overallPercent}%</span>
                <span className="stat-label">Capaian Kurikulum</span>
              </div>
            </div>
          </div>

          <div className="progress-card-gauge">
            <div className="gauge-circular-container">
              <div className="gauge-value">{overallPercent}%</div>
              <div className="gauge-caption">Total Progres</div>
            </div>
            <button
              id="btn-view-progress-detail"
              className="btn btn-secondary"
              onClick={() => onNavigate('progres')}
            >
              Buka Halaman Progres
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
