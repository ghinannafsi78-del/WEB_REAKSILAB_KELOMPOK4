import { useState, useEffect, useRef } from 'react';
import {
  loginWithEmail,
  registerWithAccount,
  submitRegistrationDoc,
  requestPasswordReset,
  logoutUser,
  getCurrentSession,
  subscribeAuthState,
  CLASS_OPTIONS,
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
import { login as googleLogin, getAccess } from '../../lib/firebaseService.js';
import './AuthModal.css';

/**
 * AuthModal.jsx
 * Modal Autentikasi Siswa & Guru, Pendaftaran Mandiri, Pemulihan Sandi,
 * dan Pemantauan Status Akses Kelas / Sinkronisasi Cloud.
 * Sesuai spesifikasi PRD.md, AGENT.md, dan DATABASE.md.
 */
export default function AuthModal({
  isOpen,
  onClose,
  onNavigate,
  initialMode = 'login',
}) {
  const [session, setSession] = useState(getCurrentSession());
  const [syncStats, setSyncStats] = useState({ total: 0, pending: 0, synced: 0, error: 0 });
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'

  // Input states
  const [name, setName] = useState('');
  const [kelas, setKelas] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Re-submit registration state
  const [resendName, setResendName] = useState('');
  const [resendKelas, setResendKelas] = useState(CLASS_OPTIONS[0] || 'XI-1');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState(null);

  // Validation & feedback
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Forgot password cooldown (60 detik)
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const cooldownTimerRef = useRef(null);

  // Migration states
  const [migrationPrompt, setMigrationPrompt] = useState(false);
  const [migrationLoading, setMigrationLoading] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);

  // Sinkronkan mode saat initialMode berubah atau modal dibuka (pola adjusting state during render)
  const [prevOpenState, setPrevOpenState] = useState({ isOpen, initialMode });
  if (prevOpenState.isOpen !== isOpen || prevOpenState.initialMode !== initialMode) {
    setPrevOpenState({ isOpen, initialMode });
    if (isOpen) {
      setMode(initialMode || 'login');
      setErrorMessage(null);
      setSuccessMessage(null);
      setFieldErrors({});
    }
  }

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Berlangganan status sesi dan antrean sinkronisasi
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
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
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

  // Validasi Login sisi klien
  const validateLogin = () => {
    const errors = {};
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      errors.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errors.email = 'Format email tidak valid.';
    }

    if (!password) {
      errors.password = 'Kata sandi wajib diisi.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validasi Registrasi sisi klien
  const validateRegister = () => {
    const errors = {};
    const nameTrimmed = name.trim();
    const emailTrimmed = email.trim();

    if (!nameTrimmed) {
      errors.name = 'Nama lengkap atau inisial wajib diisi.';
    } else if (nameTrimmed.length < 2 || nameTrimmed.length > 80) {
      errors.name = 'Nama harus antara 2 hingga 80 karakter.';
    }

    if (!kelas) {
      errors.kelas = 'Kelas wajib dipilih.';
    }

    if (!emailTrimmed) {
      errors.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errors.email = 'Format email tidak valid.';
    }

    if (!password) {
      errors.password = 'Kata sandi wajib diisi.';
    } else if (password.length < 8) {
      errors.password = 'Kata sandi minimal 8 karakter.';
    } else if (password === emailTrimmed) {
      errors.password = 'Kata sandi tidak boleh sama dengan email.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handler Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const enteredPassword = password;
    setPassword(''); // Langsung kosongkan field password dari state

    try {
      const res = await loginWithEmail(email, enteredPassword);
      if (res.error) {
        setErrorMessage(res.error);
      } else if (res.role === 'student') {
        checkForGuestData();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Email atau password salah.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler Login dengan Google (Prosedur 4-05)
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // 1. Jalankan autentikasi Google via firebaseService.js
      const uid = await googleLogin();
      if (!uid) {
        throw new Error('Identitas pengguna tidak ditemukan setelah masuk dengan Google.');
      }

      // 2. Periksa hak akses melalui getAccess() sebelum sesi dianggap valid untuk aplikasi
      let access = null;
      try {
        access = await getAccess();
      } catch (accessErr) {
        console.warn('[AuthModal] Gagal memverifikasi getAccess():', accessErr);
      }

      if (!access || (!access.teacher && !access.member)) {
        setSuccessMessage(
          'Autentikasi Google berhasil. Namun akun belum terdaftar di anggota kelas (members); akses cloud kelas belum diaktifkan.'
        );
      } else if (access.teacher) {
        setSuccessMessage('Autentikasi Google berhasil sebagai Guru Pengampu.');
      } else {
        const memberAlias = access.member?.alias || access.member?.name || 'Siswa';
        setSuccessMessage(`Autentikasi Google berhasil sebagai anggota kelas (${memberAlias}).`);
        checkForGuestData();
      }
    } catch (err) {
      // 3. Tangani kondisi popup dibatalkan, ditutup pengguna, diblokir browser, atau kegagalan jaringan
      if (
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request'
      ) {
        setErrorMessage('Proses masuk dengan Google dibatalkan.');
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMessage('Jendela sembul (popup) Google diblokir oleh peramban. Mohon izinkan popup untuk situs ini.');
      } else if (err.code === 'auth/network-request-failed') {
        setErrorMessage('Koneksi jaringan terputus saat menghubungi Google. Silakan periksa koneksi internet Anda.');
      } else {
        setErrorMessage(err.message || 'Gagal melakukan autentikasi dengan akun Google.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handler Registrasi
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const enteredPassword = password;
    setPassword(''); // Langsung kosongkan field password dari state

    try {
      const res = await registerWithAccount({
        name,
        email,
        password: enteredPassword,
        kelas,
      });

      setSuccessMessage(
        'Akun dibuat. Menunggu persetujuan pengelola agar hasil dapat dikirim ke kelas. Belajar lokal tetap bisa.'
      );

      if (res.role === 'student') {
        checkForGuestData();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Gagal mendaftar akun.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler Lupa Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setFieldErrors({ email: 'Masukkan alamat email yang valid.' });
      return;
    }

    if (cooldownSeconds > 0) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    try {
      const res = await requestPasswordReset(cleanEmail);
      setSuccessMessage(res.message);

      // Mulai jeda hitung mundur 60 detik sebelum kirim ulang
      setCooldownSeconds(60);
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || 'Gagal mengirim tautan pemulihan kata sandi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler Kirim Ulang Data Pendaftaran (jika dokumen registrations belum ada)
  const handleResendRegistration = async (e) => {
    e.preventDefault();
    if (!resendName.trim() || resendName.trim().length < 2 || resendName.trim().length > 80) {
      setResendMessage({ type: 'error', text: 'Nama harus antara 2 hingga 80 karakter.' });
      return;
    }

    setResendLoading(true);
    setResendMessage(null);
    try {
      await submitRegistrationDoc(resendName, resendKelas);
      setResendMessage({
        type: 'success',
        text: 'Permohonan pendaftaran terkirim. Menunggu persetujuan pengelola.',
      });
    } catch (err) {
      setResendMessage({
        type: 'error',
        text: err.message || 'Gagal mengirim permohonan pendaftaran.',
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setMigrationPrompt(false);
      setMigrationResult(null);
      setSuccessMessage(null);
      setErrorMessage(null);
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
    <div
      className="auth-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="auth-modal-card">
        {/* Header Modal */}
        <div className="auth-modal-header">
          <div className="auth-header-title-box">
            <h2 id="auth-modal-title" className="auth-title">
              {session.user
                ? 'Akun Pengguna'
                : mode === 'forgot'
                ? 'Pulihkan Kata Sandi'
                : mode === 'register'
                ? 'Daftar Akun REAKSI LAB'
                : 'Masuk ke REAKSI LAB'}
            </h2>
            <span className="auth-subtitle">
              {session.user
                ? 'Kelola sesi belajar dan sinkronisasi hasil belajar cloud'
                : mode === 'forgot'
                ? 'Tautan reset sandi akan dikirim ke email Anda'
                : mode === 'register'
                ? 'Pendaftaran akun mandiri untuk pembelajaran kimia kelas XI'
                : 'Penyimpanan hasil belajar cloud untuk Siswa & Guru'}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup modal">
            &times;
          </button>
        </div>

        {/* Pemberitahuan jika konfigurasi Firebase belum diisi */}
        {!isConfigured && (
          <div className="auth-alert warning" role="alert" aria-live="polite">
            <span className="alert-icon" aria-hidden="true">⚠️</span>
            <div>
              <strong>Mode Tamu Aktif (Tanpa Konfigurasi Firebase)</strong>
              <p>
                Variabel lingkungan Firebase belum terisi di <code>.env</code>. Anda tetap dapat menggunakan seluruh fitur simulasi dan kuis secara penuh dengan penyimpanan lokal (LocalStorage).
              </p>
            </div>
          </div>
        )}

        {/* Pesan Kesalahan Global */}
        {errorMessage && (
          <div className="auth-alert error" role="alert" aria-live="polite">
            <span className="alert-icon" aria-hidden="true">⚠️</span>
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Pesan Sukses Global */}
        {successMessage && (
          <div className="auth-alert success" role="status" aria-live="polite">
            <span className="alert-icon" aria-hidden="true">✓</span>
            <div>{successMessage}</div>
          </div>
        )}

        {/* BODY MODAL */}
        <div className="auth-modal-body">
          {session.user ? (
            /* ==============================================================
               TAMPILAN PENGGUNA YANG SUDAH LOGIN
               ============================================================== */
            <div className="user-profile-view">
              <div className="profile-badge-card">
                <div className="profile-avatar-circle" aria-hidden="true">
                  {session.role === 'teacher' ? '👨‍🏫' : session.role === 'student' ? '🎓' : '👤'}
                </div>
                <div className="profile-details">
                  <span className="profile-role-tag">
                    {session.role === 'teacher'
                      ? 'GURU PENGAMPU'
                      : session.role === 'student'
                      ? 'ANGGOTA KELAS'
                      : session.role === 'pending_registration'
                      ? 'MENUNGGU PERSETUJUAN'
                      : session.role === 'verification_failed'
                      ? 'VERIFIKASI GAGAL'
                      : 'BELUM TERDAFTAR DI KELAS'}
                  </span>
                  <h3 className="profile-alias">
                    {session.alias || session.user.email?.split('@')[0] || 'Pengguna'}
                  </h3>
                  <span className="profile-email">{session.user.email}</span>
                  <span className="profile-uid">UID: {session.user.uid}</span>
                </div>
              </div>

              {/* Status Akses Kelas Sesuai Ketentuan */}
              <div
                className={`access-status-card ${
                  session.role === 'student'
                    ? 'approved'
                    : session.role === 'pending_registration'
                    ? 'pending'
                    : session.role === 'verification_failed'
                    ? 'failed'
                    : 'unregistered'
                }`}
              >
                <div className="access-status-header">
                  <span className="access-status-label">Status Akses Kelas:</span>
                  <strong className="access-status-text">
                    {session.role === 'student'
                      ? `Anggota kelas: ${session.alias}`
                      : session.role === 'pending_registration'
                      ? 'Menunggu persetujuan'
                      : session.role === 'verification_failed'
                      ? 'Verifikasi hak akses gagal'
                      : 'Akun belum terdaftar di kelas; cloud kelas belum diizinkan'}
                  </strong>
                </div>
                <p className="access-status-hint">
                  {session.role === 'student'
                    ? 'Hasil kuis dan lembar pengamatan lab otomatis disinkronkan ke cloud kelas.'
                    : session.role === 'verification_failed'
                    ? (session.error || 'Terjadi gangguan jaringan atau izin saat memverifikasi status keanggotaan kelas. Belajar lokal tetap berfungsi.')
                    : 'Belajar lokal tetap berfungsi secara penuh. Hasil tersimpan aman di browser Anda.'}
                </p>
              </div>

              {/* Kirim Ulang Data Pendaftaran (Jika dokumen registrations belum ada) */}
              {session.needsRegistrationDoc && session.role === 'unregistered' && (
                <div className="resend-registration-box">
                  <h4>Kirim Data Pendaftaran Kelas</h4>
                  <p>
                    Data profil pendaftaran Anda belum tersimpan pada database guru. Lengkapi formulir di bawah agar guru dapat menyetujui akun Anda ke dalam roster kelas:
                  </p>
                  {resendMessage && (
                    <div className={`auth-alert ${resendMessage.type}`} role="alert" aria-live="polite">
                      {resendMessage.text}
                    </div>
                  )}
                  <form onSubmit={handleResendRegistration} className="auth-form-compact">
                    <div className="form-group">
                      <label htmlFor="resend-name">Nama Lengkap / Panggilan</label>
                      <input
                        id="resend-name"
                        type="text"
                        required
                        value={resendName}
                        onChange={(e) => setResendName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="auth-input"
                        disabled={resendLoading}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="resend-kelas">Kelas</label>
                      <select
                        id="resend-kelas"
                        value={resendKelas}
                        onChange={(e) => setResendKelas(e.target.value)}
                        className="auth-input auth-select"
                        disabled={resendLoading}
                      >
                        {CLASS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-secondary w-full"
                      disabled={resendLoading}
                    >
                      {resendLoading ? 'Mengirim...' : 'Kirim Ulang Data Pendaftaran'}
                    </button>
                  </form>
                </div>
              )}

              {/* Status Sinkronisasi Antrean Cloud (Jika akun aktif) */}
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
                  <div className="migration-icon" aria-hidden="true">📦</div>
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
                <div className="auth-alert success" role="status" aria-live="polite">
                  <span className="alert-icon" aria-hidden="true">✓</span>
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
          ) : mode === 'forgot' ? (
            /* ==============================================================
               TAMPILAN LUPA PASSWORD
               ============================================================== */
            <div className="auth-form-view">
              <form onSubmit={handleForgotPassword} className="auth-form" noValidate>
                <div className="form-group">
                  <label htmlFor="auth-forgot-email">Alamat Email Terdaftar</label>
                  <input
                    id="auth-forgot-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="nama@sekolah.sch.id"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                    }}
                    className={`auth-input ${fieldErrors.email ? 'has-error' : ''}`}
                    disabled={isLoading || !isConfigured}
                  />
                  {fieldErrors.email && (
                    <span className="form-field-error" role="alert">
                      {fieldErrors.email}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full submit-btn"
                  disabled={isLoading || !isConfigured || cooldownSeconds > 0}
                >
                  {isLoading
                    ? 'Mengirim...'
                    : cooldownSeconds > 0
                    ? `Kirim Ulang (${cooldownSeconds} d)`
                    : 'Kirim Tautan Reset'}
                </button>

                <div className="auth-links-row center">
                  <button
                    type="button"
                    className="auth-link-btn"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                      setFieldErrors({});
                    }}
                  >
                    &larr; Kembali ke Halaman Masuk
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ==============================================================
               TAMPILAN MASUK / DAFTAR
               ============================================================== */
            <div className="auth-form-view">
              {/* Tab Navigasi Masuk vs Daftar */}
              <div className="auth-tabs" role="tablist">
                <button
                  role="tab"
                  aria-selected={mode === 'login'}
                  className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setFieldErrors({});
                  }}
                >
                  Masuk Akun
                </button>
                <button
                  role="tab"
                  aria-selected={mode === 'register'}
                  className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setFieldErrors({});
                  }}
                >
                  Daftar Siswa
                </button>
              </div>

              <form
                onSubmit={mode === 'login' ? handleLogin : handleRegister}
                className="auth-form"
                noValidate
              >
                {/* Field Khusus Mode Registrasi: Nama & Kelas */}
                {mode === 'register' && (
                  <>
                    <div className="form-group">
                      <div className="label-with-hint">
                        <label htmlFor="auth-name">Nama Lengkap / Panggilan</label>
                        <span className="field-hint-inline">Boleh memakai nama panggilan/inisial</span>
                      </div>
                      <input
                        id="auth-name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="Contoh: Rian Pratama"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                        }}
                        className={`auth-input ${fieldErrors.name ? 'has-error' : ''}`}
                        disabled={isLoading || !isConfigured}
                      />
                      {fieldErrors.name && (
                        <span className="form-field-error" role="alert">
                          {fieldErrors.name}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="auth-kelas">Kelas</label>
                      <select
                        id="auth-kelas"
                        required
                        value={kelas}
                        onChange={(e) => {
                          setKelas(e.target.value);
                          if (fieldErrors.kelas) setFieldErrors({ ...fieldErrors, kelas: '' });
                        }}
                        className={`auth-input auth-select ${fieldErrors.kelas ? 'has-error' : ''}`}
                        disabled={isLoading || !isConfigured}
                      >
                        <option value="">-- Pilih Kelas --</option>
                        {CLASS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.kelas && (
                        <span className="form-field-error" role="alert">
                          {fieldErrors.kelas}
                        </span>
                      )}
                    </div>
                  </>
                )}

                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="auth-email">Alamat Email</label>
                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="nama@sekolah.sch.id"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                    }}
                    className={`auth-input ${fieldErrors.email ? 'has-error' : ''}`}
                    disabled={isLoading || !isConfigured}
                  />
                  {fieldErrors.email && (
                    <span className="form-field-error" role="alert">
                      {fieldErrors.email}
                    </span>
                  )}
                </div>

                {/* Password Field with Toggle */}
                <div className="form-group">
                  <div className="label-with-hint">
                    <label htmlFor="auth-password">Kata Sandi</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        className="auth-link-inline"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMessage(null);
                          setSuccessMessage(null);
                          setFieldErrors({});
                        }}
                      >
                        Lupa kata sandi?
                      </button>
                    )}
                  </div>
                  <div className="password-input-wrapper">
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      required
                      placeholder={mode === 'login' ? 'Masukkan kata sandi' : 'Minimal 8 karakter'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                      }}
                      className={`auth-input password-input ${fieldErrors.password ? 'has-error' : ''}`}
                      disabled={isLoading || !isConfigured}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      tabIndex={0}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <span className="form-field-error" role="alert">
                      {fieldErrors.password}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full submit-btn"
                  disabled={isLoading || isGoogleLoading || !isConfigured}
                >
                  {isLoading
                    ? 'Memproses...'
                    : mode === 'login'
                    ? 'Masuk ke Akun'
                    : 'Daftar Akun Siswa'}
                </button>
              </form>

              {/* Tombol Masuk dengan Google (Khusus Mode Login - Prosedur 4-05) */}
              {mode === 'login' && (
                <>
                  <div className="auth-divider" aria-hidden="true">
                    <span>atau</span>
                  </div>

                  <button
                    type="button"
                    id="google-login-btn"
                    className="btn btn-google w-full"
                    onClick={handleGoogleLogin}
                    disabled={isLoading || isGoogleLoading || !isConfigured}
                    aria-label="Masuk dengan Akun Google"
                  >
                    {isGoogleLoading ? (
                      'Menghubungkan ke Google...'
                    ) : (
                      <>
                        <svg
                          className="google-icon"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Masuk dengan Google</span>
                      </>
                    )}
                  </button>
                </>
              )}

              <div className="guest-mode-note">
                <span className="note-icon" aria-hidden="true">💡</span>
                <p>
                  Belajar tanpa login tetap didukung melalui <strong>Mode Tamu</strong>. Data simulasi dan kuis Anda tersimpan aman secara lokal di peramban ini.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
