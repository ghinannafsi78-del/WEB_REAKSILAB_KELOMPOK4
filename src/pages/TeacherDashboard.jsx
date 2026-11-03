import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getClassRoster,
  getAllResultsForTeacher,
  groupResultsByStudent,
  calculateClassMetrics,
} from '../services/resultService.js';
import { getCurrentSession, subscribeAuthState } from '../services/authService.js';
import { QUIZ_QUESTIONS } from './QuizPage.jsx';
import { EXPERIMENTS_DATA } from '../data/experiments.js';
import './TeacherDashboard.css';

/**
 * TeacherDashboard.jsx
 * Portal Khusus Guru untuk Memantau Hasil Belajar Seluruh Siswa di Kelas
 * Sesuai spesifikasi PRD Bab 11, 16 & DATABASE.md
 */
export default function TeacherDashboard({ onNavigate }) {
  const [session, setSession] = useState(getCurrentSession());
  const [roster, setRoster] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & State
  const [activityFilter, setActivityFilter] = useState('all'); // 'all' | 'quiz' | 'lab-observation'
  const [searchQuery, setSearchQuery] = useState('');
  const [detailModalStudent, setDetailModalStudent] = useState(null);
  const [detailModalTab, setDetailModalTab] = useState('quiz'); // 'quiz' | 'lab'

  useEffect(() => {
    const unsub = subscribeAuthState((newSession) => {
      setSession(newSession);
    });
    return unsub;
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rosterData, resultsData] = await Promise.all([
        getClassRoster(),
        getAllResultsForTeacher(),
      ]);
      setRoster(rosterData);
      setAllResults(resultsData);
    } catch (err) {
      console.error('[TeacherDashboard] Gagal memuat data kelas:', err);
      setError(err.message || 'Gagal memuat data hasil belajar siswa.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;
    if (session.role === 'teacher') {
      Promise.all([getClassRoster(), getAllResultsForTeacher()])
        .then(([rosterData, resultsData]) => {
          if (!isCancelled) {
            setRoster(rosterData);
            setAllResults(resultsData);
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            setError(err.message || 'Gagal memuat data kelas.');
          }
        });
    }
    return () => {
      isCancelled = true;
    };
  }, [session.role]);

  // Kelompokkan siswa dan hitung metrik kelas
  const groupedStudents = useMemo(() => {
    return groupResultsByStudent(allResults, roster);
  }, [allResults, roster]);

  const metrics = useMemo(() => {
    return calculateClassMetrics(groupedStudents, allResults);
  }, [groupedStudents, allResults]);

  // Filter daftar siswa
  const filteredStudents = useMemo(() => {
    return groupedStudents.filter((student) => {
      const matchSearch =
        student.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.uid.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (activityFilter === 'quiz') return student.quizResults.length > 0;
      if (activityFilter === 'lab-observation') return student.labResults.length > 0;

      return true;
    });
  }, [groupedStudents, searchQuery, activityFilter]);

  // Jika bukan akun guru terverifikasi
  if (session.role !== 'teacher') {
    return (
      <div className="teacher-dashboard-container">
        <div className="teacher-access-denied-card">
          <div className="denied-icon">🔒</div>
          <h2>Akses Portal Guru Dibatasi</h2>
          <p>
            Halaman ini khusus diperuntukkan bagi Guru Pengampu terdaftar. Akun Anda saat ini{' '}
            <strong>{session.user ? session.alias || session.user.email : 'belum masuk (Mode Tamu)'}</strong>{' '}
            tidak memiliki hak akses administratif.
          </p>
          <div className="denied-actions">
            <button className="btn btn-primary" onClick={() => onNavigate('beranda')}>
              &larr; Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard-container">
      {/* Header Dashboard Guru */}
      <header className="teacher-header-banner">
        <div className="header-left-col">
          <div className="teacher-badge-row">
            <span className="badge badge-emerald">PORTAL GURU TERVERIFIKASI</span>
            <span className="badge badge-cyan">KIMIA KELAS XI — LAJU REAKSI</span>
          </div>
          <h1 className="teacher-title">Dasbor Hasil Belajar Siswa</h1>
          <p className="teacher-subtitle">
            Pemantauan langsung progres belajar, hasil kuis formatif per butir soal, dan data lembar pengamatan laboratorium siswa.
          </p>
        </div>
        <div className="header-right-actions">
          <button className="btn btn-secondary reload-btn" onClick={loadData} disabled={loading}>
            {loading ? 'Menyegarkan...' : '🔄 Segarkan Data'}
          </button>
        </div>
      </header>

      {/* Pesan Kesalahan jika ada */}
      {error && (
        <div className="teacher-alert-error">
          <span>⚠️ {error}</span>
          <button className="btn btn-sm btn-secondary" onClick={loadData}>
            Coba Lagi
          </button>
        </div>
      )}

      {/* 1. Ringkasan Metrik Kelas */}
      <section className="class-metrics-grid" aria-label="Metrik Ringkasan Kelas">
        <div className="teacher-stat-card">
          <div className="stat-header">
            <span className="stat-icon">👥</span>
            <span className="stat-title">Siswa Terdaftar</span>
          </div>
          <div className="stat-value">{metrics.totalStudents}</div>
          <div className="stat-desc">
            {metrics.activeStudents} siswa aktif di roster kelas
          </div>
        </div>

        <div className="teacher-stat-card">
          <div className="stat-header">
            <span className="stat-icon">📊</span>
            <span className="stat-title">Tingkat Partisipasi</span>
          </div>
          <div className="stat-value text-cyan">{metrics.participationRate}%</div>
          <div className="stat-desc">
            {metrics.participatedStudents} dari {metrics.totalStudents} siswa telah mengirim hasil
          </div>
        </div>

        <div className="teacher-stat-card">
          <div className="stat-header">
            <span className="stat-icon">📝</span>
            <span className="stat-title">Rata-rata Skor Kuis</span>
          </div>
          <div className="stat-value text-emerald">{metrics.averageClassScore} / 100</div>
          <div className="stat-desc">
            Tertinggi: {metrics.highestScore} | Terendah: {metrics.lowestScore} ({metrics.totalQuizAttempts} percobaan)
          </div>
        </div>

        <div className="teacher-stat-card">
          <div className="stat-header">
            <span className="stat-icon">🧪</span>
            <span className="stat-title">Lembar Pengamatan Lab</span>
          </div>
          <div className="stat-value text-amber">{metrics.totalLabObservations}</div>
          <div className="stat-desc">
            Total laporan pengamatan virtual dikirim siswa
          </div>
        </div>
      </section>

      {/* 2. Filter & Toolbar */}
      <section className="dashboard-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Cari berdasarkan alias siswa (misal: XI-01)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="activity-filter" className="filter-label">Filter Kegiatan:</label>
          <select
            id="activity-filter"
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Semua Kegiatan</option>
            <option value="quiz">Khusus Kuis Formatif</option>
            <option value="lab-observation">Khusus Pengamatan Lab</option>
          </select>
        </div>
      </section>

      {/* 3. Tabel Siswa */}
      <section className="student-roster-section">
        {loading ? (
          <div className="table-loading-box">
            <div className="loading-spinner"></div>
            <p>Memuat data hasil belajar siswa dari Cloud Firestore...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="table-empty-box">
            <span className="empty-icon">📭</span>
            <h3>Belum Ada Data Hasil Belajar</h3>
            <p>
              Tidak ditemukan data siswa yang cocok dengan filter. Pastikan siswa telah login dan menyelesaikan kuis atau pengamatan laboratorium virtual.
            </p>
          </div>
        ) : (
          <div className="table-responsive-wrapper">
            <table className="teacher-data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Alias Siswa</th>
                  <th>Status Roster</th>
                  <th>Percobaan Kuis</th>
                  <th>Skor Terbaik</th>
                  <th>Rata-rata Skor</th>
                  <th>Laporan Lab</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) => (
                  <tr key={student.uid}>
                    <td className="text-muted">{idx + 1}</td>
                    <td className="student-alias-cell">
                      <strong className="alias-name">{student.alias}</strong>
                      <span className="uid-subtext">{student.uid.substring(0, 10)}...</span>
                    </td>
                    <td>
                      <span className={`status-pill ${student.active ? 'active' : 'inactive'}`}>
                        {student.active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td>{student.quizResults.length} kali</td>
                    <td>
                      {student.bestQuizScore !== null ? (
                        <span className="score-badge best">{student.bestQuizScore}</span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      {student.avgQuizScore !== null ? (
                        <span className="score-badge avg">{student.avgQuizScore}</span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <span className="lab-count-badge">
                        🧪 {student.labResults.length} lembar
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setDetailModalStudent(student);
                          setDetailModalTab('quiz');
                        }}
                      >
                        Detail Jawaban &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 4. MODAL DETAIL SISWA (Drill-down: Jawaban Kuis per butir & Lembar Pengamatan) */}
      {detailModalStudent && (
        <div className="detail-modal-backdrop" role="dialog" aria-modal="true">
          <div className="detail-modal-card">
            <div className="detail-modal-header">
              <div>
                <span className="badge badge-cyan">DETAIL HASIL BELAJAR SISWA</span>
                <h2 className="detail-student-title">
                  {detailModalStudent.alias}{' '}
                  <span className="detail-uid-badge">UID: {detailModalStudent.uid}</span>
                </h2>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setDetailModalStudent(null)}
                aria-label="Tutup detail"
              >
                &times;
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="detail-modal-tabs">
              <button
                className={`detail-tab ${detailModalTab === 'quiz' ? 'active' : ''}`}
                onClick={() => setDetailModalTab('quiz')}
              >
                📝 Riwayat Kuis ({detailModalStudent.quizResults.length})
              </button>
              <button
                className={`detail-tab ${detailModalTab === 'lab' ? 'active' : ''}`}
                onClick={() => setDetailModalTab('lab')}
              >
                🧪 Pengamatan Lab ({detailModalStudent.labResults.length})
              </button>
            </div>

            <div className="detail-modal-body">
              {/* TAB 1: KUIS */}
              {detailModalTab === 'quiz' && (
                <div className="quiz-drilldown-list">
                  {detailModalStudent.quizResults.length === 0 ? (
                    <div className="empty-drilldown">
                      Siswa ini belum pernah menyelesaikan kuis formatif.
                    </div>
                  ) : (
                    detailModalStudent.quizResults.map((attempt, attemptIdx) => (
                      <div key={attempt.id} className="attempt-detail-card">
                        <div className="attempt-header-row">
                          <div>
                            <span className="attempt-badge">Percobaan #{detailModalStudent.quizResults.length - attemptIdx}</span>
                            <h4 className="attempt-title">{attempt.activityId}</h4>
                            <span className="attempt-time">
                              Diselesaikan: {new Date(attempt.completedAt).toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="attempt-score-box">
                            <span className="score-big">{attempt.score}</span>
                            <span className="score-denom">/ 100</span>
                          </div>
                        </div>

                        {/* Rincian Jawaban Siswa per Soal */}
                        <div className="attempt-answers-breakdown">
                          <h5 className="breakdown-heading">Analisis Jawaban Siswa per Butir Soal:</h5>
                          <div className="answers-grid">
                            {QUIZ_QUESTIONS.map((q, qIndex) => {
                              const studentAnswerIndex = attempt.answers?.[q.id];
                              const isAnswered = studentAnswerIndex !== undefined;
                              const isCorrect = studentAnswerIndex === q.correctAnswer;
                              const selectedText = isAnswered
                                ? q.options[studentAnswerIndex]
                                : 'Tidak dijawab';

                              return (
                                <div
                                  key={q.id}
                                  className={`answer-item-card ${
                                    isAnswered ? (isCorrect ? 'correct' : 'wrong') : 'unanswered'
                                  }`}
                                >
                                  <div className="answer-item-header">
                                    <span className="question-num-tag">Soal {qIndex + 1} ({q.category})</span>
                                    <span className={`eval-pill ${isCorrect ? 'correct' : 'wrong'}`}>
                                      {isCorrect ? '✓ Benar' : '✗ Salah'}
                                    </span>
                                  </div>
                                  <p className="question-prompt">{q.question}</p>
                                  <div className="student-choice-row">
                                    <span className="choice-lbl">Jawaban Siswa:</span>
                                    <span className="choice-val">
                                      {isAnswered && (
                                        <strong>[{String.fromCharCode(65 + studentAnswerIndex)}] </strong>
                                      )}
                                      {selectedText}
                                    </span>
                                  </div>
                                  {!isCorrect && (
                                    <div className="correct-answer-row">
                                      <span className="choice-lbl text-emerald">Kunci Jawaban:</span>
                                      <span className="choice-val text-emerald">
                                        <strong>[{String.fromCharCode(65 + q.correctAnswer)}] </strong>
                                        {q.options[q.correctAnswer]}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: PENGAMATAN LAB */}
              {detailModalTab === 'lab' && (
                <div className="lab-drilldown-list">
                  {detailModalStudent.labResults.length === 0 ? (
                    <div className="empty-drilldown">
                      Siswa ini belum pernah mengirim lembar pengamatan laboratorium virtual.
                    </div>
                  ) : (
                    detailModalStudent.labResults.map((obs) => {
                      const exp = EXPERIMENTS_DATA.find((e) => e.id === obs.activityId);
                      const answers = obs.answers || {};
                      const sim = obs.simulation || {};

                      return (
                        <div key={obs.id} className="lab-obs-detail-card">
                          <div className="lab-obs-header">
                            <div>
                              <span className="badge badge-amber">Percobaan #{answers.trialNumber || 1}</span>
                              <h4 className="lab-obs-title">{exp?.title || obs.activityId}</h4>
                              <span className="attempt-time">
                                Dikirim: {new Date(obs.completedAt).toLocaleString('id-ID')}
                              </span>
                            </div>
                            <span className="badge badge-cyan">{exp?.code || 'LAB'}</span>
                          </div>

                          {/* Parameter Simulasi Mesin */}
                          <div className="sim-parameters-box">
                            <h5 className="sub-section-title">Parameter Simulasi:</h5>
                            <div className="params-chips-row">
                              <span className="param-chip">[A] = {sim.parameters?.concA ?? '-'} M</span>
                              <span className="param-chip">[B] = {sim.parameters?.concB ?? '-'} M</span>
                              <span className="param-chip">Suhu = {sim.parameters?.tempC ?? sim.parameters?.temperature ?? '-'} °C</span>
                              <span className="param-chip">
                                Katalis: {sim.parameters?.hasCatalyst ? 'Ya (Aktif)' : 'Tidak'}
                              </span>
                              <span className="param-chip">Durasi: {sim.duration || 15}s</span>
                            </div>
                          </div>

                          {/* Metrik Simulasi Mesin vs Catatan Siswa */}
                          <div className="metrics-comparison-table-wrapper">
                            <table className="mini-metrics-table">
                              <thead>
                                <tr>
                                  <th>Indikator</th>
                                  <th>Data Mesin Simulasi</th>
                                  <th>Catatan Dicatat Siswa</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Tumbukan A-B Total</td>
                                  <td>{sim.collisionCount ?? '-'} kali</td>
                                  <td>{answers.recordedCollisionCount ?? '-'} kali</td>
                                </tr>
                                <tr>
                                  <td>Frekuensi Tumbukan</td>
                                  <td>{sim.collisionFrequency ?? '-'} /detik</td>
                                  <td>{answers.recordedCollisionFrequency ?? '-'} /detik</td>
                                </tr>
                                <tr>
                                  <td>Tumbukan Efektif</td>
                                  <td>{sim.effectiveCollisionCount ?? '-'} kali</td>
                                  <td>{answers.recordedEffectiveCollisionCount ?? '-'} kali</td>
                                </tr>
                                <tr>
                                  <td>Jumlah Produk [AB]</td>
                                  <td>{sim.productCount ?? '-'} molekul</td>
                                  <td>{answers.recordedProductCount ?? '-'} molekul</td>
                                </tr>
                                <tr>
                                  <td>Laju Reaksi Model</td>
                                  <td>{sim.reactionRate ?? '-'} M/s</td>
                                  <td>{answers.recordedReactionRate ?? '-'} M/s</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Isian Mandiri & Interpretasi Siswa */}
                          <div className="student-qualitative-box">
                            <h5 className="sub-section-title">Catatan dan Interpretasi Mandiri Siswa:</h5>
                            <div className="qualitative-item">
                              <span className="qualitative-lbl">Catatan Pengamatan:</span>
                              <p className="qualitative-text">{answers.observationNotes || '—'}</p>
                            </div>
                            <div className="qualitative-item">
                              <span className="qualitative-lbl">Analisis Hubungan Variabel:</span>
                              <p className="qualitative-text">{answers.analysis || '—'}</p>
                            </div>
                            <div className="qualitative-item">
                              <span className="qualitative-lbl">Kesimpulan:</span>
                              <p className="qualitative-text">{answers.conclusion || '—'}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
