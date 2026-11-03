import { useState, useEffect } from 'react';
import { MODULES_DATA } from '../data/modules.js';
import { EXPERIMENTS_DATA } from '../data/experiments.js';
import { getCurrentSession, subscribeAuthState } from '../services/authService.js';
import { getSyncStats } from '../services/syncService.js';
import './ProgressPage.css';

/**
 * ProgressPage.jsx
 * Halaman detail pemantauan progres belajar siswa REAKSI LAB
 * Mendukung Mode Tamu (LocalStorage) dan Mode Akun (Cloud Firestore)
 * Sesuai spesifikasi PRD Bab 11, 13 & DATABASE.md
 */
export default function ProgressPage({
  onNavigate,
  progress,
  overallPercent,
  isModuleCompleted,
  isExperimentCompleted,
  toggleModule,
  resetProgress,
}) {
  const [session, setSession] = useState(getCurrentSession());

  useEffect(() => {
    return subscribeAuthState(setSession);
  }, []);

  const completedModulesCount = progress?.completedModules?.length || 0;
  const completedExpCount = progress?.completedExperiments?.length || 0;
  const attempts = progress?.quizAttempts || [];

  const handleReset = () => {
    let warningMsg = 'Apakah kamu yakin ingin mengatur ulang seluruh data progres belajar lokal di perangkat ini?';
    if (session.user?.uid) {
      const stats = getSyncStats(session.user.uid);
      if (stats.pending > 0) {
        warningMsg = `Perhatian: Terdapat ${stats.pending} aktivitas belajar yang belum selesai disinkronkan ke cloud. Mengatur ulang hanya menghapus data lokal di perangkat ini, hasil yang sudah terkirim ke cloud tetap aman. Lanjutkan?`;
      } else {
        warningMsg = 'Mengatur ulang progres hanya menghapus riwayat di peramban ini. Data capaian cloud Anda tetap tersimpan aman. Lanjutkan?';
      }
    }

    if (window.confirm(warningMsg)) {
      resetProgress();
    }
  };

  return (
    <div className="progress-page-container">
      <div className="progress-page-header">
        <button className="back-btn" onClick={() => onNavigate('beranda')}>
          &larr; Kembali ke Beranda
        </button>
        <span className="page-category-badge">
          {session.user ? `MODE AKUN: ${session.alias || 'TERDAFTAR'}` : 'MODE TAMU: PENYIMPANAN LOKAL'}
        </span>
        <h1 className="progress-main-title">Progres Belajar Siswa</h1>
        <p className="progress-main-subtitle">
          Data capaian pembelajaran kimia Laju Reaksi yang tersimpan pada perangkat kamu.
          {session.user && ' Hasil evaluasi Anda tersinkronisasi dengan akun kelas.'}
        </p>
      </div>

      {/* Overview Progress Card */}
      <div className="progress-hero-banner">
        <div className="banner-info">
          <span className="banner-tag">CAPAIAN MATERI LAJU REAKSI</span>
          <h2 className="banner-title">Status Kurikulum Mandiri</h2>
          <p className="banner-desc">
            Selesaikan 3 modul materi dan jalankan 4 eksperimen laboratorium virtual untuk mencapai penguasaan penuh.
          </p>
          <div className="overall-bar-wrapper">
            <div className="overall-bar-track">
              <div
                className="overall-bar-fill"
                style={{ width: `${overallPercent}%` }}
                aria-valuenow={overallPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <span className="overall-bar-text">{overallPercent}% Selesai</span>
          </div>
        </div>

        <div className="banner-actions">
          <button className="btn btn-secondary btn-reset" onClick={handleReset}>
            Atur Ulang Progres Lokal
          </button>
        </div>
      </div>

      {/* Grid: Modul & Eksperimen */}
      <div className="progress-breakdown-grid">
        {/* Modul Checkpoints */}
        <section className="breakdown-card" aria-labelledby="modul-status-title">
          <div className="card-top">
            <h3 id="modul-status-title">Status Modul Materi ({completedModulesCount} / 3)</h3>
            <span className="card-badge">{completedModulesCount === 3 ? 'Lengkap' : 'Dalam Proses'}</span>
          </div>
          <div className="items-checklist">
            {MODULES_DATA.map((mod) => {
              const done = isModuleCompleted(mod.id);
              return (
                <div key={mod.id} className={`checklist-item ${done ? 'done' : ''}`}>
                  <button
                    className="check-toggle-btn"
                    onClick={() => toggleModule(mod.id)}
                    aria-label={`Ubah status penyelesaian ${mod.title}`}
                  >
                    <span className="checkbox-indicator">{done ? '✓' : ''}</span>
                    <div className="check-text-group">
                      <strong>{mod.label}: {mod.title}</strong>
                      <span>{done ? 'Selesai dipelajari' : 'Belum selesai'}</span>
                    </div>
                  </button>
                  <button
                    className="btn-read-mod"
                    onClick={() => onNavigate('materi')}
                  >
                    Buka
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Eksperimen Checkpoints */}
        <section className="breakdown-card" aria-labelledby="exp-status-title">
          <div className="card-top">
            <h3 id="exp-status-title">Status Eksperimen Virtual ({completedExpCount} / 4)</h3>
            <span className="card-badge">{completedExpCount === 4 ? 'Lengkap' : 'Dalam Proses'}</span>
          </div>
          <div className="items-checklist">
            {EXPERIMENTS_DATA.map((exp) => {
              const done = isExperimentCompleted(exp.id);
              return (
                <div key={exp.id} className={`checklist-item ${done ? 'done' : ''}`}>
                  <div className="check-toggle-btn">
                    <span className="checkbox-indicator">{done ? '✓' : ''}</span>
                    <div className="check-text-group">
                      <strong>{exp.code}: Pengaruh {exp.factor}</strong>
                      <span>{done ? 'Simulasi telah diuji' : 'Belum dijalankan'}</span>
                    </div>
                  </div>
                  <button
                    className="btn-read-mod"
                    onClick={() => onNavigate('lab')}
                  >
                    Uji Lab
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Riwayat Percobaan Kuis */}
      <section className="quiz-history-card" aria-labelledby="history-title">
        <h3 id="history-title">Riwayat Percobaan Kuis</h3>
        {attempts.length === 0 ? (
          <div className="empty-history-box">
            <p>Belum ada riwayat kuis yang tersimpan. Coba kerjakan kuis untuk menguji pemahaman kamu!</p>
            <button className="btn btn-primary" onClick={() => onNavigate('kuis')}>
              Mulai Kuis Sekarang
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Kategori</th>
                  <th>Jawaban Benar</th>
                  <th>Skor Akhir</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((att) => (
                  <tr key={att.id}>
                    <td>{new Date(att.completedAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{att.category}</td>
                    <td>{att.correctAnswers} dari {att.totalQuestions} soal</td>
                    <td>
                      <span className={`score-pill ${att.score >= 75 ? 'pass' : 'retry'}`}>
                        {att.score} / 100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
