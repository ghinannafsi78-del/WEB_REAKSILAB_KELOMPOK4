import { useState } from 'react';
import './ObservationForm.css';

/**
 * ObservationSummary.jsx
 * Menampilkan Ringkasan & Komparasi Data Pengamatan Siswa yang Telah Tersimpan
 * Sesuai spesifikasi PRD Bab 8.11, 8.13, Bab 20 (P1) & AGENT.md Bab 6
 */
export default function ObservationSummary({
  observation,
  allObservations = [],
  experiment,
  onEdit,
  onAddNewTrial,
  onSelectTrial,
  onProceedToQuiz,
}) {
  const [selectedTrialId, setSelectedTrialId] = useState(observation?.id);

  // Gunakan data observasi terpilih atau fallback ke observasi aktif
  const currentObs =
    allObservations.find((o) => o.id === selectedTrialId) ||
    observation ||
    allObservations[0];

  if (!currentObs) return null;

  const { observedParameters, machineData, studentInterpretation, savedAt, trialNumber = 1 } = currentObs;
  const hasMultipleTrials = allObservations.length > 1;

  const handleTabClick = (obs) => {
    setSelectedTrialId(obs.id);
    if (onSelectTrial) {
      onSelectTrial(obs);
    }
  };

  return (
    <div className="observation-summary-card" aria-label="Ringkasan Data Pengamatan Tersimpan">
      {/* Header Utama */}
      <div className="summary-header">
        <div className="summary-badge-group">
          <span className="badge badge-emerald">✓ PENGAMATAN TERSIMPAN</span>
          <span className="badge badge-cyan">Percobaan #{trialNumber}</span>
          <span className="saved-time">
            Tersimpan: {new Date(savedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="summary-header-actions">
          {onAddNewTrial && (
            <button className="btn-add-trial" onClick={onAddNewTrial} title="Tambah percobaan baru dengan variasi parameter berbeda">
              + Catat Percobaan Baru
            </button>
          )}
        </div>
        <h3 className="summary-title">Lembar Pengamatan Siswa & Analisis Hasil</h3>
        <p className="summary-subtitle">
          Eksperimen: <strong>{experiment.title}</strong> (Faktor Diuji: <strong className="text-cyan">{experiment.factor}</strong>)
        </p>
      </div>

      {/* Navigasi Pilihan Percobaan (Jika siswa melakukan > 1 percobaan) */}
      {allObservations.length > 0 && (
        <div className="trials-tab-bar" role="tablist" aria-label="Daftar Percobaan Tersimpan">
          <span className="trials-tab-label">Riwayat Percobaan:</span>
          <div className="trials-tab-pills">
            {allObservations.map((obs, idx) => {
              const isActive = obs.id === currentObs.id;
              return (
                <button
                  key={obs.id}
                  className={`trial-pill-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleTabClick(obs)}
                  role="tab"
                  aria-selected={isActive}
                >
                  Percobaan {obs.trialNumber || idx + 1}
                  <span className="pill-subtext">
                    ({obs.observedParameters?.concA}M / {obs.observedParameters?.concB}M / {obs.observedParameters?.temperature}°C)
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabel Komparasi Antar-Percobaan (Fair Test Comparison Matrix) */}
      {hasMultipleTrials && (
        <section className="multi-trial-comparison-section" aria-labelledby="comp-title">
          <div className="comp-section-header">
            <h4 id="comp-title" className="section-mini-heading">
              📊 Tabel Perbandingan Antar-Kondisi Percobaan ({allObservations.length} Percobaan)
            </h4>
            <span className="comp-hint">
              Perhatikan pengaruh perubahan variabel bebas terhadap frekuensi tumbukan dan laju reaksi model
            </span>
          </div>

          <div className="table-responsive">
            <table className="trial-comparison-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>[A] (M)</th>
                  <th>[B] (M)</th>
                  <th>Suhu</th>
                  <th>Katalis</th>
                  <th>Total Tumbukan</th>
                  <th>Frekuensi (/s)</th>
                  <th>Tumbukan Efektif</th>
                  <th>Produk [AB]</th>
                  <th>Laju (produk/s)</th>
                </tr>
              </thead>
              <tbody>
                {allObservations.map((obs, i) => {
                  const isCurrent = obs.id === currentObs.id;
                  return (
                    <tr key={obs.id} className={isCurrent ? 'row-highlight' : ''}>
                      <td><strong>#{obs.trialNumber || i + 1}</strong></td>
                      <td>{obs.observedParameters?.concA} M</td>
                      <td>{obs.observedParameters?.concB} M</td>
                      <td>{obs.observedParameters?.temperature} °C</td>
                      <td>{obs.observedParameters?.hasCatalyst ? 'Ya' : 'Tidak'}</td>
                      <td className="text-cyan">{obs.machineData?.collisionCount}</td>
                      <td>{obs.machineData?.collisionFrequency}</td>
                      <td className="text-amber">{obs.machineData?.effectiveCollisionCount}</td>
                      <td className="text-emerald">{obs.machineData?.productCount}</td>
                      <td><strong>{obs.machineData?.reactionRate}</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Grid Komparasi Parameter & Hasil Percobaan Terpilih */}
      <div className="summary-tables-grid">
        {/* Kolom 1: Parameter Uji */}
        <div className="summary-section-box">
          <h4 className="section-mini-heading">Kondisi Parameter Percobaan #{trialNumber}</h4>
          <table className="summary-table">
            <tbody>
              <tr>
                <td>Konsentrasi Pereaksi [A]</td>
                <td><strong>{observedParameters.concA} M</strong></td>
              </tr>
              <tr>
                <td>Konsentrasi Pereaksi [B]</td>
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
                <td>Frekuensi Tumbukan A-B</td>
                <td><strong>{machineData.collisionFrequency} /detik</strong></td>
              </tr>
              <tr>
                <td>Tumbukan Efektif (E ≥ Ea)</td>
                <td><strong className="text-amber">{machineData.effectiveCollisionCount}</strong></td>
              </tr>
              <tr>
                <td>Jumlah Produk [AB]</td>
                <td><strong className="text-emerald">{machineData.productCount} partikel</strong></td>
              </tr>
              <tr>
                <td>Laju Reaksi Model (v)</td>
                <td><strong>{machineData.reactionRate} produk/s</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Respons & Analisis Mandiri Siswa */}
      <div className="student-insights-box">
        <h4 className="section-mini-heading">Analisis & Kesimpulan Mandiri Siswa</h4>

        <div className="insight-block">
          <span className="insight-label">a. Catatan Pengamatan Pola Gerak & Tumbukan:</span>
          <p className="insight-text">{studentInterpretation.observationNotes}</p>
        </div>

        <div className="insight-block">
          <span className="insight-label">b. Analisis Hubungan Variabel Bebas:</span>
          <p className="insight-text">{studentInterpretation.analysis}</p>
        </div>

        <div className="insight-block">
          <span className="insight-label">c. Kesimpulan Ilmiah Berdasarkan Data:</span>
          <p className="insight-text">{studentInterpretation.conclusion}</p>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="summary-actions-row">
        <button className="btn btn-secondary" onClick={() => onEdit(currentObs)}>
          ✏️ Edit Isian Percobaan #{trialNumber}
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
