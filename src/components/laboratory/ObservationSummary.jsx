import './ObservationForm.css';

/**
 * ObservationSummary.jsx
 * Menampilkan Ringkasan Data Pengamatan Siswa yang Telah Tersimpan
 * Sesuai spesifikasi PRD Bab 8.11, 8.13, & AGENT.md Bab 6
 */
export default function ObservationSummary({
  observation,
  experiment,
  onEdit,
  onProceedToQuiz,
}) {
  if (!observation) return null;

  const { observedParameters, machineData, studentInterpretation, savedAt } = observation;

  return (
    <div className="observation-summary-card" aria-label="Ringkasan Data Pengamatan Tersimpan">
      <div className="summary-header">
        <div className="summary-badge-group">
          <span className="badge badge-emerald">✓ PENGAMATAN TERSIMPAN</span>
          <span className="saved-time">
            Tersimpan: {new Date(savedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <h3 className="summary-title">Ringkasan Hasil Observasi & Interpretasi Siswa</h3>
        <p className="summary-subtitle">
          Eksperimen: <strong>{experiment.title}</strong>
        </p>
      </div>

      {/* Grid Komparasi Parameter & Hasil */}
      <div className="summary-tables-grid">
        {/* Kolom 1: Parameter Uji */}
        <div className="summary-section-box">
          <h4 className="section-mini-heading">Kondisi Parameter Eksperimen</h4>
          <table className="summary-table">
            <tbody>
              <tr>
                <td>Konsentrasi [A]</td>
                <td><strong>{observedParameters.concA} M</strong></td>
              </tr>
              <tr>
                <td>Konsentrasi [B]</td>
                <td><strong>{observedParameters.concB} M</strong></td>
              </tr>
              <tr>
                <td>Suhu Sistem</td>
                <td><strong>{observedParameters.temperature} °C</strong></td>
              </tr>
              <tr>
                <td>Kondisi Katalis</td>
                <td><strong>{observedParameters.hasCatalyst ? 'Dengan Katalis' : 'Tanpa Katalis'}</strong></td>
              </tr>
              <tr>
                <td>Durasi Teramati</td>
                <td><strong>{observedParameters.duration} detik</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Kolom 2: Hasil Kuantitatif Mesin Simulasi */}
        <div className="summary-section-box">
          <h4 className="section-mini-heading">Data Kuantitatif Hasil Model</h4>
          <table className="summary-table">
            <tbody>
              <tr>
                <td>Total Tumbukan A-B</td>
                <td><strong className="text-cyan">{machineData.collisionCount} kali</strong></td>
              </tr>
              <tr>
                <td>Frekuensi Tumbukan</td>
                <td><strong>{machineData.collisionFrequency} /s</strong></td>
              </tr>
              <tr>
                <td>Tumbukan Efektif</td>
                <td><strong className="text-amber">{machineData.effectiveCollisionCount}</strong></td>
              </tr>
              <tr>
                <td>Jumlah Produk [AB]</td>
                <td><strong className="text-emerald">{machineData.productCount} unit</strong></td>
              </tr>
              <tr>
                <td>Laju Reaksi Model (v)</td>
                <td><strong>{machineData.reactionRate} produk/s</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Respons & Analisis Siswa */}
      <div className="student-insights-box">
        <h4 className="section-mini-heading">Analisis & Kesimpulan Mandiri Siswa</h4>

        <div className="insight-block">
          <span className="insight-label">Catatan Pengamatan:</span>
          <p className="insight-text">{studentInterpretation.observationNotes}</p>
        </div>

        <div className="insight-block">
          <span className="insight-label">Analisis Hubungan Variabel:</span>
          <p className="insight-text">{studentInterpretation.analysis}</p>
        </div>

        <div className="insight-block">
          <span className="insight-label">Kesimpulan Ilmiah:</span>
          <p className="insight-text">{studentInterpretation.conclusion}</p>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="summary-actions-row">
        <button className="btn btn-secondary" onClick={onEdit}>
          ✏️ Edit Isian Pengamatan
        </button>
        {onProceedToQuiz && (
          <button className="btn btn-primary" onClick={onProceedToQuiz}>
            Lanjut ke Kuis Pemahaman Lab &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
