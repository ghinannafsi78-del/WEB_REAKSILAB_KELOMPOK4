import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Footer.jsx
 * Footer akademik & identitas REAKSI LAB
 */
export default function Footer({ onNavigate }) {
  return (
    <footer className="footer-root" role="contentinfo">
      <div className="footer-container">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <span className="brand-dot"></span>
              <strong>REAKSI LAB</strong>
            </div>
            <p className="footer-tagline">
              Media pembelajaran sains interaktif untuk memahami konsep laju reaksi kimia
              siswa SMA/MA kelas XI melalui representasi makroskopik, mikroskopik, dan simbolik.
            </p>
          </div>

          <div className="footer-links-col">
            <span className="footer-heading">Navigasi Utama</span>
            <ul className="footer-nav-links">
              <li>
                <button onClick={() => onNavigate('beranda')}>Beranda</button>
              </li>
              <li>
                <button onClick={() => onNavigate('materi')}>Modul Pembelajaran</button>
              </li>
              <li>
                <button onClick={() => onNavigate('lab')}>Laboratorium Virtual</button>
              </li>
              <li>
                <button onClick={() => onNavigate('kuis')}>Kuis Interaktif</button>
              </li>
              <li>
                <button onClick={() => onNavigate('progres')}>Progres Belajar</button>
              </li>
            </ul>
          </div>

          <div className="footer-info-col">
            <span className="footer-heading">Materi Laju Reaksi</span>
            <ul className="footer-topics-list">
              <li>Teori Tumbukan & Tumbukan Efektif</li>
              <li>Energi Aktivasi (Ea)</li>
              <li>4 Faktor Penentu Laju Reaksi</li>
              <li>Hukum Laju & Penentuan Orde</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-row">
          <p>&copy; {CURRENT_YEAR} REAKSI LAB &bull; Kimia SMA/MA Kelas XI. Penyimpanan lokal aktif.</p>
          <span className="version-tag">Versi 1.0.0 &bull; Pembelajaran Berbasis Web</span>
        </div>
      </div>
    </footer>
  );
}
