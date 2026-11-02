import { useState } from 'react';
import { saveObservation, validateObservationData } from '../../services/observationService.js';
import './ObservationForm.css';

/**
 * ObservationForm.jsx
 * Formulir Lembar Data Pengamatan dan Analisis Mandiri Siswa
 * Sesuai spesifikasi PRD Bab 8.11, 9.3, & AGENT.md Bab 6
 */
export default function ObservationForm({
  experiment,
  metrics,
  parameters,
  onObservationSaved,
  initialData = null,
  trialNumber = 1,
  onCancel = null,
}) {
  const [formData, setFormData] = useState(() => ({
    concA: initialData?.observedParameters?.concA ?? parameters.concA,
    concB: initialData?.observedParameters?.concB ?? parameters.concB,
    temperature: initialData?.observedParameters?.temperature ?? parameters.temperature,
    hasCatalyst: initialData?.observedParameters?.hasCatalyst ?? parameters.hasCatalyst,
    duration: initialData?.observedParameters?.duration ?? metrics.elapsedTime ?? 0,
    recordedCollisionCount: initialData?.machineData?.collisionCount ?? metrics.collisionCount ?? 0,
    recordedCollisionFrequency: initialData?.machineData?.collisionFrequency ?? metrics.collisionFrequency ?? 0,
    recordedEffectiveCollisionCount: initialData?.machineData?.effectiveCollisionCount ?? metrics.effectiveCollisionCount ?? 0,
    recordedProductCount: initialData?.machineData?.productCount ?? metrics.productCount ?? 0,
    recordedReactionRate: initialData?.machineData?.reactionRate ?? metrics.reactionRate ?? 0,
    observationNotes: initialData?.studentInterpretation?.observationNotes ?? '',
    analysis: initialData?.studentInterpretation?.analysis ?? '',
    conclusion: initialData?.studentInterpretation?.conclusion ?? '',
    id: initialData?.id,
    trialNumber: initialData?.trialNumber ?? trialNumber,
  }));

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopyCurrentMetrics = () => {
    setFormData((prev) => ({
      ...prev,
      concA: parameters.concA,
      concB: parameters.concB,
      temperature: parameters.temperature,
      hasCatalyst: parameters.hasCatalyst,
      duration: metrics.elapsedTime,
      recordedCollisionCount: metrics.collisionCount,
      recordedCollisionFrequency: metrics.collisionFrequency,
      recordedEffectiveCollisionCount: metrics.effectiveCollisionCount,
      recordedProductCount: metrics.productCount,
      recordedReactionRate: metrics.reactionRate,
    }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submissionPayload = {
      ...formData,
      experimentId: experiment.id,
      trialNumber: formData.trialNumber || trialNumber,
    };

    const validation = validateObservationData(submissionPayload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setSaveSuccess(false);
      return;
    }

    const result = saveObservation(submissionPayload);
    if (result.success) {
      setErrors({});
      setSaveSuccess(true);
      if (onObservationSaved) {
        onObservationSaved(result.observation);
      }
    } else {
      setErrors(result.errors || {});
      setSaveSuccess(false);
    }
  };

  return (
    <section className="observation-form-card" aria-labelledby="obs-form-title">
      <div className="form-card-header">
        <div>
          <div className="badge-row">
            <span className="badge badge-cyan">LEMBAR KERJA SISWA</span>
            <span className="badge badge-amber">Percobaan #{formData.trialNumber || trialNumber}</span>
          </div>
          <h3 id="obs-form-title" className="form-main-heading">
            Formulir Data Pengamatan & Analisis Mandiri
          </h3>
          <p className="form-subtitle">
            Catat hasil simulasi yang telah kamu jalankan, lalu susun interpretasi dan kesimpulan ilmiah berdasarkan data bukti.
          </p>
        </div>
        <div className="form-header-actions">
          <button
            type="button"
            className="btn-sync-metrics"
            onClick={handleCopyCurrentMetrics}
            title="Salin pembacaan metrik simulasi terbaru ke formulir"
          >
            🔄 Salin Data Simulasi Terkini
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="observation-form-content">
        {/* 1. Bagian Parameter & Identitas Eksperimen */}
        <fieldset className="form-fieldset">
          <legend className="fieldset-legend">1. Kondisi Parameter Percobaan #{formData.trialNumber || trialNumber}</legend>
          <div className="params-snapshot-grid">
            <div className="param-cell">
              <span className="cell-label">Faktor yang Diuji</span>
              <strong className="cell-val text-cyan">{experiment.factor}</strong>
            </div>
            <div className="param-cell">
              <span className="cell-label">Konsentrasi [A]</span>
              <strong className="cell-val">{formData.concA} M</strong>
            </div>
            <div className="param-cell">
              <span className="cell-label">Konsentrasi [B]</span>
              <strong className="cell-val">{formData.concB} M</strong>
            </div>
            <div className="param-cell">
              <span className="cell-label">Suhu Sistem</span>
              <strong className="cell-val">{formData.temperature} °C</strong>
            </div>
            <div className="param-cell">
              <span className="cell-label">Kondisi Katalis</span>
              <strong className="cell-val">{formData.hasCatalyst ? 'Dengan Katalis' : 'Tanpa Katalis'}</strong>
            </div>
            <div className="param-cell">
              <span className="cell-label">Durasi Teramati</span>
              <strong className="cell-val text-amber">{formData.duration} s</strong>
            </div>
          </div>
        </fieldset>

        {/* 2. Bagian Data Kuantitatif Tercatat */}
        <fieldset className="form-fieldset">
          <legend className="fieldset-legend">2. Data Kuantitatif Hasil Model Simulasi (Tercatat)</legend>
          <div className="quant-inputs-grid">
            <div className="input-field">
              <label htmlFor="field-collision-count">Jumlah Tumbukan A-B (Total)</label>
              <input
                id="field-collision-count"
                type="number"
                value={formData.recordedCollisionCount}
                onChange={(e) => handleChange('recordedCollisionCount', e.target.value)}
                required
              />
              {errors.recordedCollisionCount && <span className="field-error">{errors.recordedCollisionCount}</span>}
            </div>

            <div className="input-field">
              <label htmlFor="field-collision-freq">Frekuensi Tumbukan (/detik)</label>
              <input
                id="field-collision-freq"
                type="number"
                step="0.01"
                value={formData.recordedCollisionFrequency}
                onChange={(e) => handleChange('recordedCollisionFrequency', e.target.value)}
                required
              />
              {errors.recordedCollisionFrequency && <span className="field-error">{errors.recordedCollisionFrequency}</span>}
            </div>

            <div className="input-field">
              <label htmlFor="field-eff-collision">Tumbukan Efektif (E ≥ Ea)</label>
              <input
                id="field-eff-collision"
                type="number"
                value={formData.recordedEffectiveCollisionCount}
                onChange={(e) => handleChange('recordedEffectiveCollisionCount', e.target.value)}
                required
              />
              {errors.recordedEffectiveCollisionCount && <span className="field-error">{errors.recordedEffectiveCollisionCount}</span>}
            </div>

            <div className="input-field">
              <label htmlFor="field-product-count">Jumlah Produk Terbentuk [AB]</label>
              <input
                id="field-product-count"
                type="number"
                value={formData.recordedProductCount}
                onChange={(e) => handleChange('recordedProductCount', e.target.value)}
                required
              />
              {errors.recordedProductCount && <span className="field-error">{errors.recordedProductCount}</span>}
            </div>

            <div className="input-field">
              <label htmlFor="field-reaction-rate">Laju Reaksi Model (produk/s)</label>
              <input
                id="field-reaction-rate"
                type="number"
                step="0.01"
                value={formData.recordedReactionRate}
                onChange={(e) => handleChange('recordedReactionRate', e.target.value)}
              />
            </div>
          </div>
        </fieldset>

        {/* 3. Bagian Interpretasi dan Analisis Siswa (Wajib Siswa Sendiri) */}
        <fieldset className="form-fieldset">
          <legend className="fieldset-legend">3. Analisis & Interpretasi Siswa</legend>

          <div className="textarea-field">
            <label htmlFor="field-notes">
              a. Catatan Pengamatan Pola Gerak & Tumbukan Partikel <span className="req-star">*</span>
            </label>
            <span className="field-hint">
              Contoh: Bagaimana kecepatan gerak partikel saat suhu diubah? Apakah semua peristiwa tumbukan menghasilkan produk?
            </span>
            <textarea
              id="field-notes"
              rows={3}
              placeholder="Tuliskan deskripsi visual mikroskopik yang kamu amati pada area simulasi..."
              value={formData.observationNotes}
              onChange={(e) => handleChange('observationNotes', e.target.value)}
              required
            />
            {errors.observationNotes && <span className="field-error">{errors.observationNotes}</span>}
          </div>

          <div className="textarea-field">
            <label htmlFor="field-analysis">
              b. Analisis Hubungan Variabel Bebas terhadap Laju Reaksi <span className="req-star">*</span>
            </label>
            <span className="field-hint">
              Jelaskan hubungan parameter yang kamu manipulasi dengan frekuensi tumbukan atau persentase tumbukan efektif.
            </span>
            <textarea
              id="field-analysis"
              rows={3}
              placeholder="Jelaskan alasan ilmiah mengapa perubahan parameter tersebut memengaruhi frekuensi atau efektivitas tumbukan..."
              value={formData.analysis}
              onChange={(e) => handleChange('analysis', e.target.value)}
              required
            />
            {errors.analysis && <span className="field-error">{errors.analysis}</span>}
          </div>

          <div className="textarea-field">
            <label htmlFor="field-conclusion">
              c. Kesimpulan Percobaan Berdasarkan Data <span className="req-star">*</span>
            </label>
            <span className="field-hint">
              Tarik kesimpulan ilmiah berdasarkan bukti data kuantitatif yang tercatat dalam pengamatan ini.
            </span>
            <textarea
              id="field-conclusion"
              rows={3}
              placeholder="Simpulkan pengaruh faktor yang diuji terhadap laju reaksi kimia..."
              value={formData.conclusion}
              onChange={(e) => handleChange('conclusion', e.target.value)}
              required
            />
            {errors.conclusion && <span className="field-error">{errors.conclusion}</span>}
          </div>
        </fieldset>

        {/* Feedback Sukses */}
        {saveSuccess && (
          <div className="save-success-alert" role="alert">
            <span className="success-icon">✓</span>
            <div>
              <strong>Data Pengamatan Percobaan #{formData.trialNumber || trialNumber} Berhasil Disimpan!</strong>
              <p>Data tersimpan di penyimpanan perangkat kamu. Kamu sekarang dapat melihat ringkasan atau melanjutkan ke kuis interaktif.</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="form-submit-row">
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Batal
            </button>
          )}
          <button type="submit" className="btn btn-primary btn-save-obs">
            💾 Simpan Data Pengamatan ke LocalStorage
          </button>
        </div>
      </form>
    </section>
  );
}
