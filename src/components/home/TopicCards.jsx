import { MODULES_DATA } from '../../data/modules.js';
import './TopicCards.css';

/**
 * TopicCards.jsx
 * Menampilkan 3 kartu modul pembelajaran Laju Reaksi
 * Mengambil data secara dinamis dari src/data/modules.js
 */
export default function TopicCards({ onSelectModule, isModuleCompleted }) {
  // Render icon SVG berbasis kategori modul
  const renderModuleIcon = (iconType) => {
    switch (iconType) {
      case 'collision':
        return (
          <svg className="topic-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="7" cy="12" r="4" />
            <circle cx="17" cy="12" r="4" />
            <path d="m11 9 2 6" strokeDasharray="2 2" />
            <path d="M12 3v3M12 18v3" />
          </svg>
        );
      case 'factors':
        return (
          <svg className="topic-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2v6h6" />
            <path d="M4 12a8 8 0 0 1 14.9-4" />
            <path d="M20 12a8 8 0 0 1-14.9 4" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        );
      case 'math':
      default:
        return (
          <svg className="topic-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 8h10" />
            <path d="M7 12h10" />
            <path d="M7 16h4" />
            <path d="m14 15 3 3M17 15l-3 3" />
          </svg>
        );
    }
  };

  return (
    <section className="topics-section" id="modul-pembelajaran" aria-labelledby="topics-header-title">
      <div className="section-header">
        <span className="section-eyebrow">KURIKULUM KIMIA KELAS XI</span>
        <h2 id="topics-header-title" className="section-title">
          Modul Pembelajaran Laju Reaksi
        </h2>
        <p className="section-desc">
          Disusun terstruktur dari konsep dasar tumbukan partikel hingga analisis kuantitatif
          dan penentuan persamaan laju reaksi.
        </p>
      </div>

      <div className="topics-grid">
        {MODULES_DATA.map((module) => {
          const completed = isModuleCompleted ? isModuleCompleted(module.id) : false;

          return (
            <article
              key={module.id}
              className={`topic-card ${completed ? 'is-completed' : ''}`}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectModule(module.id)}
            >
              {/* Card Header: Label & Status */}
              <div className="card-top-row">
                <span className="module-label-badge">{module.label}</span>
                {completed ? (
                  <span className="module-status-badge completed" title="Modul ini telah kamu selesaikan">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Selesai
                  </span>
                ) : (
                  <span className="module-badge-tag">{module.badge}</span>
                )}
              </div>

              {/* Icon & Title */}
              <div className="card-identity-box">
                <div className={`topic-icon-wrapper ${module.iconType}`}>
                  {renderModuleIcon(module.iconType)}
                </div>
                <h3 className="topic-card-title">{module.title}</h3>
              </div>

              {/* Description */}
              <p className="topic-card-description">{module.description}</p>

              {/* Key Objectives Preview */}
              <div className="card-objectives-preview">
                <span className="preview-label">Fokus Bahasan:</span>
                <ul className="objectives-mini-list">
                  {module.objectives.slice(0, 2).map((obj, idx) => (
                    <li key={idx}>
                      <span className="bullet-dot">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Action */}
              <div className="card-footer-row">
                <span className="duration-info">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {module.duration}
                </span>

                <button
                  id={`btn-pelajari-${module.id}`}
                  className="btn-topic-action"
                  onClick={() => onSelectModule(module.id)}
                  aria-label={`Pelajari materi ${module.title}`}
                >
                  <span>Pelajari Materi</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
