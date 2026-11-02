import './CollisionMetrics.css';

/**
 * CollisionMetrics.jsx
 * Menampilkan 5 Indikator Ilmiah Terpisah Hasil Simulasi
 * Sesuai spesifikasi PRD Bab 8.6, 9.3, & AGENT.md Bab 5.5
 */
export default function CollisionMetrics({
  collisionCount = 0,
  collisionFrequency = 0,
  effectiveCollisionCount = 0,
  productCount = 0,
  reactionRate = 0,
  elapsedTime = 0,
}) {
  // Persentase efektivitas tumbukan (efektif / total * 100)
  const effectiveRatio =
    collisionCount > 0
      ? ((effectiveCollisionCount / collisionCount) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="collision-metrics-container" aria-label="Indikator Data Hasil Simulasi Aktual">
      <div className="metrics-header-line">
        <div className="title-with-pill">
          <span className="live-pill">DATA MODEL NYATA</span>
          <h3 className="metrics-heading">Indikator Kuantitatif Simulasi</h3>
        </div>
        <div className="elapsed-time-badge">
          <span>Waktu Pengamatan:</span>
          <strong>{elapsedTime} s</strong>
        </div>
      </div>

      <div className="metrics-grid-layout">
        {/* 1. Jumlah Tumbukan A-B Total */}
        <div className="metric-box box-cyan">
          <div className="box-top">
            <span className="metric-title">Jumlah Tumbukan A-B</span>
            <span className="metric-badge">Total Peristiwa</span>
          </div>
          <div className="box-val-row">
            <span className="main-metric-val">{collisionCount}</span>
            <span className="metric-unit">kali</span>
          </div>
          <p className="box-description">
            Total peristiwa kontak fisik antara partikel A dan B selama simulasi berlangsung.
          </p>
        </div>

        {/* 2. Frekuensi Tumbukan */}
        <div className="metric-box box-blue">
          <div className="box-top">
            <span className="metric-title">Frekuensi Tumbukan</span>
            <span className="metric-badge">Per Detik</span>
          </div>
          <div className="box-val-row">
            <span className="main-metric-val">{collisionFrequency}</span>
            <span className="metric-unit">tumbukan/s</span>
          </div>
          <p className="box-description">
            Intensitas tumbukan rata-rata A-B per satuan waktu (makin rapat partikel, makin tinggi frekuensinya).
          </p>
        </div>

        {/* 3. Tumbukan Efektif */}
        <div className="metric-box box-amber">
          <div className="box-top">
            <span className="metric-title">Tumbukan Efektif (E ≥ Ea)</span>
            <span className="metric-badge">{effectiveRatio}% Efektif</span>
          </div>
          <div className="box-val-row">
            <span className="main-metric-val">{effectiveCollisionCount}</span>
            <span className="metric-unit">tumbukan</span>
          </div>
          <p className="box-description">
            Tumbukan yang memenuhi energi ambang kinetik untuk melampaui energi aktivasi dan membentuk produk.
          </p>
        </div>

        {/* 4. Jumlah Produk Terbentuk */}
        <div className="metric-box box-emerald">
          <div className="box-top">
            <span className="metric-title">Produk Terbentuk [AB]</span>
            <span className="metric-badge">Hasil Reaksi</span>
          </div>
          <div className="box-val-row">
            <span className="main-metric-val">{productCount}</span>
            <span className="metric-unit">partikel</span>
          </div>
          <p className="box-description">
            Akumulasi partikel produk baru yang dihasilkan dari konversi reaktan A dan B.
          </p>
        </div>

        {/* 5. Laju Reaksi Model */}
        <div className="metric-box box-purple">
          <div className="box-top">
            <span className="metric-title">Laju Reaksi Model (v)</span>
            <span className="metric-badge">Δ[Produk] / Δt</span>
          </div>
          <div className="box-val-row">
            <span className="main-metric-val">{reactionRate}</span>
            <span className="metric-unit">produk/s</span>
          </div>
          <p className="box-description">
            Pertambahan kuantitas produk per satuan waktu pengamatan model konseptual.
          </p>
        </div>
      </div>

      <div className="metrics-footer-note">
        <span className="info-icon">ℹ️</span>
        <span className="note-text">
          <strong>Catatan Ilmiah Model:</strong> Nilai di atas merupakan hasil model konseptual simulasi partikel
          berdasarkan Teori Tumbukan, bukan nilai besaran eksperimen fisik nyata bersatuan laboratorium fisik.
        </span>
      </div>
    </div>
  );
}
