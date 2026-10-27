import { useState } from 'react';
import { MODULES_DATA } from '../data/modules.js';
import './ModulesPage.css';

/**
 * ModulesPage.jsx
 * Halaman eksplorasi seluruh modul pembelajaran Laju Reaksi
 */
export default function ModulesPage({ onNavigate, isModuleCompleted, toggleModule, initialModuleId = '' }) {
  const [selectedModuleId, setSelectedModuleId] = useState(initialModuleId || MODULES_DATA[0].id);

  const currentModule = MODULES_DATA.find((m) => m.id === selectedModuleId) || MODULES_DATA[0];
  const isDone = isModuleCompleted(currentModule.id);

  return (
    <div className="modules-page-container">
      {/* Top Breadcrumb & Title */}
      <div className="modules-page-header">
        <button className="back-btn" onClick={() => onNavigate('beranda')}>
          &larr; Kembali ke Beranda
        </button>
        <span className="page-category-badge">MODUL PEMBELAJARAN KIMIA</span>
        <h1 className="modules-main-title">Materi Utama: Laju Reaksi</h1>
        <p className="modules-main-subtitle">
          Pelajari konsep teoritis, rumus laju reaksi, energi aktivasi, hingga analisis data eksperimen.
        </p>
      </div>

      <div className="modules-layout-grid">
        {/* Sidebar Navigasi Modul */}
        <aside className="modules-sidebar" aria-label="Daftar Modul">
          <span className="sidebar-heading">Daftar Modul</span>
          <div className="module-tabs-list">
            {MODULES_DATA.map((mod) => {
              const active = mod.id === selectedModuleId;
              const done = isModuleCompleted(mod.id);

              return (
                <button
                  key={mod.id}
                  className={`module-tab-btn ${active ? 'active' : ''} ${done ? 'done' : ''}`}
                  onClick={() => setSelectedModuleId(mod.id)}
                >
                  <div className="tab-left">
                    <span className="tab-label">{mod.label}</span>
                    <strong className="tab-title">{mod.title}</strong>
                  </div>
                  {done && <span className="tab-done-icon">✓</span>}
                </button>
              );
            })}
          </div>

          <div className="sidebar-quick-action">
            <button className="btn btn-secondary sidebar-lab-btn" onClick={() => onNavigate('lab')}>
              🧪 Buka Laboratorium
            </button>
          </div>
        </aside>

        {/* Konten Detail Modul */}
        <main className="module-content-area" aria-labelledby="current-module-title">
          <div className="module-detail-card">
            {/* Header Modul */}
            <div className="detail-header">
              <div className="header-meta-row">
                <span className="badge badge-cyan">{currentModule.label}</span>
                <span className="badge-duration">⏱️ {currentModule.duration}</span>
                {isDone ? (
                  <span className="badge badge-emerald">✓ Selesai Dipelajari</span>
                ) : (
                  <span className="badge badge-amber">Sedang Dipelajari</span>
                )}
              </div>
              <h2 id="current-module-title" className="detail-title">{currentModule.title}</h2>
              <p className="detail-tagline">{currentModule.tagline}</p>
            </div>

            {/* Tujuan Pembelajaran */}
            <div className="detail-section objectives-box">
              <h3>🎯 Tujuan Pembelajaran</h3>
              <ul>
                {currentModule.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            {/* Sub-Materi Inti */}
            <div className="detail-section content-sections">
              <h3>📖 Penjelasan Konsep Inti</h3>
              <div className="sections-list">
                {currentModule.sections.map((sec) => (
                  <article key={sec.id} className="sub-section-card">
                    <h4>{sec.title}</h4>
                    <p>{sec.content}</p>
                  </article>
                ))}
              </div>
            </div>

            {/* Contoh Soal dan Pembahasan */}
            <div className="detail-section worked-examples-box">
              <h3>📝 Contoh Soal & Pembahasan</h3>
              {currentModule.workedExamples.map((we) => (
                <div key={we.id} className="worked-example-card">
                  <div className="problem-box">
                    <strong>Soal:</strong>
                    <p>{we.problem}</p>
                  </div>
                  <div className="solution-box">
                    <strong>Pembahasan:</strong>
                    <p>{we.solution}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ringkasan Materi */}
            <div className="detail-section summary-box">
              <h3>📌 Ringkasan Penting</h3>
              <ul>
                {currentModule.summary.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Action Selesai Belajar */}
            <div className="detail-footer-actions">
              <button
                id="btn-toggle-completion"
                className={`btn ${isDone ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => toggleModule(currentModule.id)}
              >
                {isDone ? 'Tandai Belum Selesai' : '✓ Tandai Modul Selesai'}
              </button>

              <button className="btn btn-secondary" onClick={() => onNavigate('kuis')}>
                Uji Pemahaman di Kuis &rarr;
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
