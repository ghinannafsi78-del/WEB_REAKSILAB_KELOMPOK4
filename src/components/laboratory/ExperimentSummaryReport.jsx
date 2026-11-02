import './ExperimentSummaryReport.css';

/**
 * ExperimentSummaryReport.jsx
 * Ringkasan Hasil Kegiatan Lengkap Laboratorium Virtual
 * Sesuai spesifikasi PRD Bab 8.13 & AGENT.md Bab 8, 15
 */
export default function ExperimentSummaryReport({
  experiment,
  metrics,
  observation,
  quizResult,
  onRestartLab,
  onNavigate,
}) {
  const isAllComplete = Boolean(observation && quizResult);

  return (
    <div className="summary-report-card" aria-label="Laporan Akhir Capaian Kegiatan Laboratorium">
      <div className="report-header">
        <div className="report-badge-row">
          <span className="badge badge-cyan">{experiment.code}</span>
          <span className={`badge ${isAllComplete ? 'badge-emerald' : 'badge-amber'}`}>
            {isAllComplete ? '✓ PRAKTIKUM LENGKAP' : 'DALAM PROSES'}
          </span>
        </div>
        <h2 className="report-title">Laporan Capaian Laboratorium Virtual</h2>
        <p className="report-subtitle">
          Eksperimen: <strong>{experiment.title}</strong> (Model Reaksi: {experiment.reaction})
        </p>
      </div>

      <div className="report-status-banner">
        <div className="status-item done">
          <span className="status-icon">✓</span>
          <div>
            <strong>1. Simulasi Mikroskopik</strong>
            <span>{metrics.collisionCount} tumbukan, {metrics.productCount} produk</span>
          </div>
        </div>
        <div className="status-item done">
          <span className="status-icon">✓</span>
          <div>
            <strong>2. Formulir Pengamatan</strong>
            <span>Tersimpan di LocalStorage</span>
          </div>
        </div>
        <div className="status-item done">
          <span className="status-icon">✓</span>
          <div>
            <strong>3. Evaluasi Kuis</strong>
            <span>Skor: {quizResult?.score ?? 100}/100</span>
          </div>
        </div>
      </div>

      <div className="report-sections-grid">
        {/* Panel 1: Parameter & Data Simulasi */}
        <section className="report-panel">
          <h3 className="panel-subheading">Kondisi & Data Kuantitatif Simulasi (Mesin)</h3>
          <div className="data-keyvalue-list">
            <div className="kv-row">
              <span>Konsentrasi [A]</span>
              <strong>{metrics.parameters?.concA ?? 1.0} M</strong>
            </div>
            <div className="kv-row">
              <span>Konsentrasi [B]</span>
              <strong>{metrics.parameters?.concB ?? 1.0} M</strong>
            </div>
            <div className="kv-row">
              <span>Suhu Sistem</span>
              <strong>{metrics.parameters?.temperature ?? 25} °C</strong>
            </div>
            <div className="kv-row">
              <span>Total Tumbukan A-B</span>
              <strong className="text-cyan">{metrics.collisionCount} kali</strong>
            </div>
            <div className="kv-row">
              <span>Frekuensi Tumbukan</span>
              <strong>{metrics.collisionFrequency} /detik</strong>
            </div>
            <div className="kv-row">
              <span>Tumbukan Efektif (E ≥ Ea)</span>
              <strong className="text-amber">{metrics.effectiveCollisionCount}</strong>
            </div>
            <div className="kv-row">
              <span>Produk Terbentuk</span>
              <strong className="text-emerald">{metrics.productCount} partikel</strong>
            </div>
            <div className="kv-row">
              <span>Laju Reaksi Model</span>
              <strong>{metrics.reactionRate} produk/s</strong>
            </div>
          </div>
        </section>

        {/* Panel 2: Catatan & Kesimpulan Siswa */}
        <section className="report-panel">
          <h3 className="panel-subheading">Interpretasi & Kesimpulan Siswa</h3>
          {observation ? (
            <div className="student-report-entries">
              <div className="entry-item">
                <span className="entry-label">Catatan Pengamatan:</span>
                <p>{observation.studentInterpretation?.observationNotes}</p>
              </div>
              <div className="entry-item">
                <span className="entry-label">Analisis Variabel:</span>
                <p>{observation.studentInterpretation?.analysis}</p>
              </div>
              <div className="entry-item">
                <span className="entry-label">Kesimpulan Ilmiah:</span>
                <p>{observation.studentInterpretation?.conclusion}</p>
              </div>
            </div>
          ) : (
            <p className="no-data-hint">Lembar pengamatan belum tersimpan.</p>
          )}
        </section>
      </div>

      {/* Footer Aksi */}
      <div className="report-footer-actions">
        <button className="btn btn-secondary" onClick={onRestartLab}>
          ↻ Jalankan Ulang Eksperimen
        </button>
        <button className="btn btn-primary" onClick={() => onNavigate('materi')}>
          Lanjut ke Pembahasan Modul Materi &rarr;
        </button>
        <button className="btn btn-secondary" onClick={() => onNavigate('progres')}>
          Lihat Progres Belajar Kamu &rarr;
        </button>
      </div>
    </div>
  );
}
