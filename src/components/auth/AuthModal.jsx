import { useState, useEffect } from 'react';
import {
  loginWithEmail,
  registerWithEmail,
  logoutUser,
  getCurrentSession,
  subscribeAuthState,
} from '../../services/authService.js';
import {
  getSyncStats,
  processQueue,
  migrateGuestDataToAccount,
  subscribeSyncStatus,
} from '../../services/syncService.js';
import { getStoredProgress } from '../../services/progressService.js';
import { getStoredObservations } from '../../services/observationService.js';
import { isConfigured } from '../../services/cloudClient.js';
import './AuthModal.css';

/**
 * AuthModal.jsx
 * Modal Autentikasi Siswa & Guru, Manajemen Akun, dan Dialog Migrasi Data Tamu
 * Sesuai spesifikasi DATABASE.md dan PRD Bab 13 & 16
 */
export default function AuthModal({ isOpen, onClose, onNavigate }) {
  const [session, setSession] = useState(getCurrentSession());
  const [syncStats, setSyncStats] = useState({ total: 0, pending: 0, synced: 0, error: 0 });
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [migrationPrompt, setMigrationPrompt] = useState(false);
  const [migrationLoading, setMigrationLoading] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);

  // Berlangganan status sesi dan sinkronisasi
  useEffect(() => {
    const unsubAuth = subscribeAuthState((newSession) => {
      setSession(newSession);
      if (newSession.user?.uid) {
        setSyncStats(getSyncStats(newSession.user.uid));
      }
    });

    const unsubSync = subscribeSyncStatus(() => {
      const s = getCurrentSession();
      if (s.user?.uid) {
        setSyncStats(getSyncStats(s.user.uid));
      }
    });

    return () => {
      unsubAuth();
      unsubSync();
    };
  }, []);

  // Periksa apakah ada data mode tamu yang layak ditawarkan untuk migrasi saat siswa login
  const checkForGuestData = () => {
    const guestProg = getStoredProgress();
    const guestObs = getStoredObservations();

    const hasGuestRecords =
      (guestProg.quizAttempts && guestProg.quizAttempts.length > 0) ||
      (guestObs && guestObs.length > 0);

    if (hasGuestRecords) {
      setMigrationPrompt(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await loginWithEmail(email, password);
      if (res.error) {
        setErrorMessage(res.error);
      } else if (res.role === 'student') {
        checkForGuestData();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Gagal masuk akun.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await registerWithEmail(email, password);
      if (res.error) {
        setErrorMessage(res.error);
      } else if (res.role === 'student') {
        checkForGuestData();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Gagal mendaftar akun.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setMigrationPrompt(false);
      setMigrationResult(null);
    } catch (err) {
      console.warn('[AuthModal] Gagal logout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    if (!session.user?.uid) return;
    setIsLoading(true);
    try {
      await processQueue(session.user.uid);
      setSyncStats(getSyncStats(session.user.uid));
    } catch (err) {
      console.warn('[AuthModal] Gagal memproses antrean manual:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmMigration = async () => {
    if (!session.user?.uid) return;
    setMigrationLoading(true);
    try {
      const res = await migrateGuestDataToAccount(session.user.uid, session.alias);
      setMigrationResult(`Berhasil menambahkan ${res.migratedCount} aktivitas belajar lokal ke antrean cloud.`);
      setMigrationPrompt(false);
      setSyncStats(getSyncStats(session.user.uid));
    } catch (err) {
      console.error('[AuthModal] Gagal migrasi data:', err);
    } finally {
      setMigrationLoading(false);
    }
  };

  const handleDismissMigration = () => {
    setMigrationPrompt(false);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="auth-modal-card">
        {/* Header Modal */}
        <div className="auth-modal-header">
          <div className="auth-header-title-box">
            <h2 id="auth-modal-title" className="auth-title">
              {session.user ? 'Akun Pengguna' : 'Masuk ke REAKSI LAB'}
            </h2>
            <span className="auth-subtitle">
              {session.user
                ? 'Kelola sesi belajar dan sinkronisasi hasil belajar cloud'
                : 'Penyimpanan hasil belajar cloud untuk Siswa & Guru'}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup modal">
            &times;
          </button>
        </div>

        {/* Pemberitahuan jika konfigurasi Firebase belum diisi */}
        {!isConfigured && (
          <div className="auth-alert warning">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Mode Tamu Aktif (Tanpa Konfigurasi Firebase)</strong>
              <p>
                Variabel lingkungan Firebase belum terisi di <code>.env</code>. Anda tetap dapat menggunakan seluruh fitur simulasi dan kuis secara penuh dengan penyimpanan lokal (LocalStorage).
              </p>
            </div>
          </div>
        )}

        {/* BODY MODAL */}
        <div className="auth-modal-body">
          {session.user ? (
            /* TAMPILAN USER AKTIF */
            <div className="user-profile-view">
              <div className="profile-badge-card">
                <div className="profile-avatar-circle">
                  {session.role === 'teacher' ? '👨‍🏫' : session.role === 'student' ? '🎓' : '👤'}
                </div>
                <div className="profile-details">
                  <span className="profile-role-tag">
                    {session.role === 'teacher'
                      ? 'GURU PENGAMPU'
                      : session.role === 'student'
                      ? 'SISWA TERDAFTAR'
                      : 'BELUM DI ROSTER'}
                  </span>
                  <h3 className="profile-alias">
                    {session.alias || session.user.email || 'Pengguna'}
                  </h3>
                  <span className="profile-uid">UID: {session.user.uid}</span>
                  <span className="profile-email">{session.user.email}</span>
                </div>
              </div>

              {/* Status Akses Roster */}
              {session.role === 'unregistered' && (
                <div className="auth-alert error">
                  <span className="alert-icon">🚫</span>
                  <div>
                    <strong>Akses Cloud Belum Diaktifkan</strong>
                    <p>
                      Akun Anda berhasil masuk, tetapi UID belum terdaftar atau belum aktif di dokumen <code>roster</code> kelas. Hubungi guru Anda untuk mengaktifkan sinkronisasi cloud.
                    </p>
                  </div>
                </div>
              )}

              {/* Status Sinkronisasi Antrean Cloud */}
              {session.active && (
                <div className="sync-status-card">
                  <div className="sync-header-row">
                    <h4 className="sync-card-title">Status Sinkronisasi Cloud</h4>
                    <span className={`sync-pill ${syncStats.pending > 0 ? 'pending' : 'synced'}`}>
                      {syncStats.pending > 0 ? 'Menunggu Kirim' : 'Tersinkronisasi'}
                    </span>
                  </div>

                  <div className="sync-metrics-grid">
                    <div className="metric-box">
                      <span className="metric-val">{syncStats.total}</span>
                      <span className="metric-lbl">Total Riwayat</span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-val text-emerald">{syncStats.synced}</span>
                      <span className="metric-lbl">Terkirim ke Cloud</span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-val text-amber">{syncStats.pending}</span>
                      <span className="metric-lbl">Dalam Antrean</span>
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary sync-now-btn"
                    onClick={handleManualSync}
                    disabled={isLoading || syncStats.pending === 0}
                  >
                    {isLoading ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}
                  </button>
                </div>
              )}

              {/* Dialog Penawaran Migrasi Data Tamu */}
              {migrationPrompt && (
                <div className="migration-prompt-box">
                  <div className="migration-icon">📦</div>
                  <div className="migration-content">
                    <h4>Pindahkan Hasil Belajar Mode Tamu?</h4>
                    <p>
                      Ditemukan riwayat kuis atau pengamatan laboratorium pada penyimpanan lokal perangkat ini. Apakah ingin memasukkan data tersebut ke akun Anda (Alias: <strong>{session.alias}</strong>)?
                    </p>
                    <div className="migration-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleConfirmMigration}
                        disabled={migrationLoading}
                      >
                        {migrationLoading ? 'Memproses...' : 'Ya, Masukkan ke Akun'}
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={handleDismissMigration}
                        disabled={migrationLoading}
                      >
                        Biarkan Lokal
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {migrationResult && (
                <div className="auth-alert success">
                  <span className="alert-icon">✓</span>
                  <div>{migrationResult}</div>
                </div>
              )}

              {/* Tindakan Khusus Guru */}
              {session.role === 'teacher' && onNavigate && (
                <div className="teacher-quick-action">
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => {
                      onClose();
                      onNavigate('guru');
                    }}
                  >
                    Buka Dashboard Guru (Pantau Kelas) &rarr;
                  </button>
                </div>
              )}

              {/* Tombol Logout */}
              <div className="auth-footer-actions">
                <button
                  className="btn btn-danger-outline w-full"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sedang Keluar...' : 'Keluar dari Akun'}
                </button>
              </div>
            </div>
          ) : (
            /* TAMPILAN FORM MASUK / DAFTAR */
            <div className="auth-form-view">
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                >
                  Masuk Akun
                </button>
                <button
                  className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                >
                  Daftar Baru
                </button>
              </div>

              {errorMessage && (
                <div className="auth-alert error">
                  <span className="alert-icon">⚠️</span>
                  <div>{errorMessage}</div>
                </div>
              )}

              <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="auth-form">
                <div className="form-group">
                  <label htmlFor="auth-email">Alamat Email</label>
                  <input
                    id="auth-email"
                    type="email"
                    required
                    placeholder="nama@sekolah.sch.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    disabled={isLoading || !isConfigured}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="auth-password">Kata Sandi</label>
                  <input
                    id="auth-password"
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                    disabled={isLoading || !isConfigured}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full submit-btn"
                  disabled={isLoading || !isConfigured}
                >
                  {isLoading
                    ? 'Memproses...'
                    : mode === 'login'
                    ? 'Masuk ke Akun'
                    : 'Daftar Akun Siswa'}
                </button>
              </form>

              <div className="guest-mode-note">
                <span className="note-icon">💡</span>
                <p>
                  Tidak memiliki akun? Anda tetap dapat belajar tanpa login menggunakan <strong>Mode Tamu</strong> (seluruh data tersimpan otomatis di perangkat).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
