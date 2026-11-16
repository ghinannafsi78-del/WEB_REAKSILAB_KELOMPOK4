/**
 * services/authService.js
 * Manajemen autentikasi siswa dan guru serta verifikasi izin akses Cloud Firestore
 * Sesuai spesifikasi DATABASE.md, PRD Bab 13 & 16, dan Prosedur 4-05 Tahap 2 (Adapter Pattern)
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isConfigured } from './cloudClient.js';

// Konstanta opsi kelas untuk registrasi siswa (informasi profil)
export const CLASS_OPTIONS = ['XI-1', 'XI-2'];

// Objek sesi aktif
let currentSession = {
  user: null,
  role: 'guest', // 'guest' | 'student' | 'teacher' | 'pending_registration' | 'unregistered' | 'verification_failed'
  alias: null,
  active: false,
  accessStatus: 'Mode Tamu',
  registration: null,
  memberData: null,
  needsRegistrationDoc: false,
  error: null,
};

const listeners = new Set();

function notifyListeners() {
  const sessionCopy = { ...currentSession };
  listeners.forEach((listener) => {
    try {
      listener(sessionCopy);
    } catch (err) {
      console.error('[authService] Error on listener:', err);
    }
  });
}

/**
 * Logika inti Adapter Pattern (Dual-Read Role Resolver).
 * Menyatukan pengenalan peran dari struktur database lama dan struktur handout:
 *
 * 1. Guru (Prioritas Utama):
 *    - Periksa config/roles (teacherUid)
 *    - Periksa settings/classroom (teacherUid)
 *    - Jika cocok, tetapkan role: 'teacher'
 *
 * 2. Siswa (Hanya jika bukan Guru):
 *    - Periksa roster/{uid} (active === true)
 *    - Jika tidak ditemukan di roster, periksa members/{uid}
 *    - Jika terdaftar, tetapkan role: 'student', ambil alias dari data anggota
 *
 * 3. Pending:
 *    - Periksa registrations/{uid} (status === 'pending')
 *    - Jika cocok, tetapkan role: 'pending_registration'
 *
 * 4. Pengguna Lain:
 *    - Tetapkan role: 'unregistered'
 *
 * Pengamanan:
 * - Prioritaskan Guru sebelum Siswa (UID tidak boleh memperoleh kedua role sekaligus).
 * - Gunakan UID Firebase Auth untuk otorisasi, bukan email atau displayName.
 * - Jika pembacaan Firestore gagal karena jaringan atau permission-denied pada dokumen keanggotaan,
 *   kembalikan status role: 'verification_failed', bukan 'unregistered'.
 */
export async function resolveUserRole(user, firestoreDb = db, getDocFn = getDoc) {
  if (!user || !user.uid || !firestoreDb) {
    return {
      user: null,
      role: 'guest',
      alias: null,
      active: false,
      accessStatus: 'Mode Tamu',
      registration: null,
      memberData: null,
      needsRegistrationDoc: false,
      error: null,
    };
  }

  const uid = user.uid;

  // ==============================================================
  // 1. PRIORITAS UTAMA: PEMERIKSAAN GURU (DUAL-READ)
  // ==============================================================

  // 1.a. Struktur lama: config/roles
  try {
    const rolesSnap = await getDocFn(doc(firestoreDb, 'config', 'roles'));
    if (rolesSnap?.exists() && rolesSnap.data()?.teacherUid === uid) {
      return {
        user,
        role: 'teacher',
        alias: 'Guru Pengampu',
        active: true,
        accessStatus: 'Guru Pengampu (Akses Penuh)',
        registration: null,
        memberData: null,
        needsRegistrationDoc: false,
        error: null,
      };
    }
  } catch (rolesErr) {
    // Permission-denied pada config/roles wajar bagi non-guru di Firestore security rules
    if (rolesErr.code !== 'permission-denied') {
      console.warn('[authService] Gagal memeriksa config/roles:', rolesErr);
    }
  }

  // 1.b. Struktur handout: settings/classroom
  try {
    const settingsSnap = await getDocFn(doc(firestoreDb, 'settings', 'classroom'));
    if (settingsSnap?.exists() && settingsSnap.data()?.teacherUid === uid) {
      return {
        user,
        role: 'teacher',
        alias: 'Guru Pengampu',
        active: true,
        accessStatus: 'Guru Pengampu (Akses Penuh)',
        registration: null,
        memberData: null,
        needsRegistrationDoc: false,
        error: null,
      };
    }
  } catch (settingsErr) {
    if (settingsErr.code !== 'permission-denied') {
      console.warn('[authService] Gagal memeriksa settings/classroom:', settingsErr);
    }
  }

  // ==============================================================
  // 2. PEMERIKSAAN SISWA (DUAL-READ) - HANYA JIKA BUKAN GURU
  // ==============================================================
  let studentData = null;
  let studentSource = null;

  // 2.a. Struktur lama: roster/{uid}
  try {
    const rosterSnap = await getDocFn(doc(firestoreDb, 'roster', uid));
    if (rosterSnap?.exists()) {
      const data = rosterSnap.data();
      if (data?.active === true) {
        studentData = data;
        studentSource = 'roster';
      } else {
        // Akun terdaftar di roster tetapi dinonaktifkan
        return {
          user,
          role: 'unregistered',
          alias: data?.alias || null,
          active: false,
          accessStatus: 'Akun belum terdaftar di kelas; cloud kelas belum diizinkan',
          registration: null,
          memberData: data,
          needsRegistrationDoc: false,
          error: 'Akun Anda berstatus nonaktif di roster kelas. Akses penyimpanan cloud belum diizinkan.',
        };
      }
    }
  } catch (rosterErr) {
    if (
      rosterErr.code === 'unavailable' ||
      rosterErr.code === 'network-request-failed' ||
      rosterErr.code === 'permission-denied'
    ) {
      return {
        user,
        role: 'verification_failed',
        alias: user.displayName || user.email?.split('@')[0] || null,
        active: false,
        accessStatus: 'Verifikasi hak akses gagal',
        registration: null,
        memberData: null,
        needsRegistrationDoc: false,
        error: rosterErr.code === 'permission-denied'
          ? 'Akses ditolak saat memverifikasi status keanggotaan kelas.'
          : 'Gagal menghubungi server database: ' + (rosterErr.message || 'Koneksi bermasalah'),
      };
    }
    console.warn('[authService] Gagal membaca roster:', rosterErr);
  }

  // 2.b. Struktur handout: members/{uid}
  if (!studentData) {
    try {
      const memberSnap = await getDocFn(doc(firestoreDb, 'members', uid));
      if (memberSnap?.exists()) {
        const data = memberSnap.data();
        if (data?.active !== false) {
          studentData = data;
          studentSource = 'members';
        }
      }
    } catch (memberErr) {
      if (
        memberErr.code === 'unavailable' ||
        memberErr.code === 'network-request-failed' ||
        memberErr.code === 'permission-denied'
      ) {
        return {
          user,
          role: 'verification_failed',
          alias: user.displayName || user.email?.split('@')[0] || null,
          active: false,
          accessStatus: 'Verifikasi hak akses gagal',
          registration: null,
          memberData: null,
          needsRegistrationDoc: false,
          error: memberErr.code === 'permission-denied'
            ? 'Akses ditolak saat memverifikasi status keanggotaan kelas.'
            : 'Gagal menghubungi server database: ' + (memberErr.message || 'Koneksi bermasalah'),
        };
      }
      console.warn('[authService] Gagal membaca members:', memberErr);
    }
  }

  // Jika siswa terdaftar ditemukan (dari roster atau members)
  if (studentData) {
    const studentAlias =
      studentData.alias ||
      studentData.name ||
      `Siswa-${uid.substring(0, 5)}`;

    return {
      user,
      role: 'student',
      alias: studentAlias,
      active: true,
      accessStatus: `Anggota kelas: ${studentAlias}`,
      registration: null,
      memberData: studentData,
      source: studentSource,
      needsRegistrationDoc: false,
      error: null,
    };
  }

  // ==============================================================
  // 3. PEMERIKSAAN PERMOHONAN PENDAFTARAN (registrations/{uid})
  // ==============================================================
  try {
    const regSnap = await getDocFn(doc(firestoreDb, 'registrations', uid));
    if (regSnap?.exists()) {
      const regData = regSnap.data();
      if (regData?.status === 'pending') {
        return {
          user,
          role: 'pending_registration',
          alias: regData.name || user.displayName || user.email?.split('@')[0],
          active: false,
          accessStatus: 'Menunggu persetujuan',
          registration: regData,
          memberData: null,
          needsRegistrationDoc: false,
          error: null,
        };
      }
    }
  } catch (regErr) {
    if (
      regErr.code === 'unavailable' ||
      regErr.code === 'network-request-failed'
    ) {
      return {
        user,
        role: 'verification_failed',
        alias: user.displayName || user.email?.split('@')[0] || null,
        active: false,
        accessStatus: 'Verifikasi pendaftaran tertunda',
        registration: null,
        memberData: null,
        needsRegistrationDoc: false,
        error: 'Gagal memeriksa status pendaftaran: ' + (regErr.message || 'Koneksi bermasalah'),
      };
    }
    console.warn('[authService] Gagal membaca registrations:', regErr);
  }

  // ==============================================================
  // 4. PENGGUNA LAIN (Akun Auth aktif tetapi belum terdaftar di kelas)
  // ==============================================================
  return {
    user,
    role: 'unregistered',
    alias: user.displayName || user.email?.split('@')[0] || null,
    active: false,
    accessStatus: 'Akun belum terdaftar di kelas; cloud kelas belum diizinkan',
    registration: null,
    memberData: null,
    needsRegistrationDoc: true,
    error: null,
  };
}

/**
 * Memverifikasi peran pengguna dan memperbarui sesi aplikasi serta memberitahu seluruh subscriber
 */
export async function verifyUserRole(user) {
  try {
    currentSession = await resolveUserRole(user, db, getDoc);
    notifyListeners();
    return currentSession;
  } catch (err) {
    console.error('[authService] Gagal memverifikasi peran user di Firestore:', err);
    currentSession = {
      user,
      role: 'verification_failed',
      alias: user?.displayName || user?.email?.split('@')[0] || null,
      active: false,
      accessStatus: 'Verifikasi hak akses gagal',
      registration: null,
      memberData: null,
      needsRegistrationDoc: false,
      error: 'Gagal menghubungi server verifikasi peran: ' + (err.message || 'Koneksi bermasalah'),
    };
    notifyListeners();
    return currentSession;
  }
}

/**
 * Berlangganan perubahan status sesi autentikasi
 */
export function subscribeAuthState(callback) {
  listeners.add(callback);
  callback({ ...currentSession });

  return () => {
    listeners.delete(callback);
  };
}

/**
 * Mengambil sesi pengguna saat ini
 */
export function getCurrentSession() {
  return { ...currentSession };
}

/**
 * Login dengan Email dan Password
 * Pada login yang gagal, tidak membedakan "email tidak ada" dari "password salah" (PRD FR-21, AGENT §16)
 */
export async function loginWithEmail(email, password) {
  if (!isConfigured || !auth) {
    throw new Error('Firebase belum dikonfigurasi. Aplikasi berjalan dalam Mode Tamu.');
  }

  const cleanEmail = (email || '').trim();
  if (!cleanEmail || !password) {
    throw new Error('Email dan kata sandi wajib diisi.');
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
    return await verifyUserRole(cred.user);
  } catch (err) {
    let message = 'Email atau password salah.';
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/wrong-password' ||
      err.code === 'auth/invalid-credential'
    ) {
      message = 'Email atau password salah.';
    } else if (err.code === 'auth/invalid-email') {
      message = 'Format email tidak valid.';
    } else if (err.code === 'auth/too-many-requests') {
      message = 'Terlalu banyak percobaan masuk yang gagal. Silakan coba lagi beberapa saat lagi.';
    } else if (err.code === 'auth/network-request-failed') {
      message = 'Koneksi jaringan terputus. Silakan periksa koneksi internet Anda.';
    } else if (err.message) {
      message = err.message;
    }
    const customErr = new Error(message);
    customErr.code = err.code;
    throw customErr;
  }
}

/**
 * Registrasi Akun Siswa Baru
 * Membuat akun Firebase Auth (Email + Password) dan dokumen registrations/{uid}:
 * { name, kelas, status: "pending", createdAt: serverTimestamp() }
 */
export async function registerWithAccount({ name, email, password, kelas }) {
  if (!isConfigured || !auth || !db) {
    throw new Error('Firebase belum dikonfigurasi. Aplikasi berjalan dalam Mode Tamu.');
  }

  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim();
  const cleanKelas = (kelas || '').trim();

  // Validasi sisi klien
  if (!cleanName || cleanName.length < 2 || cleanName.length > 80) {
    throw new Error('Nama harus terdiri dari 2 hingga 80 karakter.');
  }
  if (!cleanKelas) {
    throw new Error('Kelas wajib dipilih.');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error('Format email tidak valid.');
  }
  if (!password || password.length < 8) {
    throw new Error('Kata sandi minimal 8 karakter.');
  }
  if (password === cleanEmail) {
    throw new Error('Kata sandi tidak boleh sama dengan alamat email.');
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);

    // Tulis dokumen pendaftaran permohonan kelas ke registrations/{uid}
    let registrationDocCreated = false;
    try {
      const regDocRef = doc(db, 'registrations', cred.user.uid);
      await setDoc(regDocRef, {
        name: cleanName,
        kelas: cleanKelas,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      registrationDocCreated = true;
    } catch (docErr) {
      console.warn('[authService] Dokumen registrations gagal dibuat:', docErr);
      // Akun auth tetap dipertahankan; pengguna dapat mengirim ulang data pendaftaran nanti
    }

    const sessionResult = await verifyUserRole(cred.user);
    if (!registrationDocCreated) {
      sessionResult.needsRegistrationDoc = true;
    }
    return sessionResult;
  } catch (err) {
    let message = 'Gagal mendaftar akun.';
    if (err.code === 'auth/email-already-in-use') {
      message = 'Email ini sudah terdaftar.';
    } else if (err.code === 'auth/weak-password') {
      message = 'Kata sandi terlalu lemah (minimal 8 karakter).';
    } else if (err.code === 'auth/invalid-email') {
      message = 'Format email tidak valid.';
    } else if (err.code === 'auth/too-many-requests') {
      message = 'Terlalu banyak permintaan pendaftaran. Silakan coba lagi nanti.';
    } else if (err.code === 'auth/network-request-failed') {
      message = 'Koneksi jaringan terputus. Silakan periksa koneksi internet Anda.';
    } else if (err.message) {
      message = err.message;
    }
    const customErr = new Error(message);
    customErr.code = err.code;
    throw customErr;
  }
}

/**
 * Backward compatibility untuk pemanggil lama registerWithEmail
 */
export async function registerWithEmail(email, password, extra = {}) {
  return registerWithAccount({
    name: extra.name || (email ? email.split('@')[0] : 'Siswa Baru'),
    kelas: extra.kelas || CLASS_OPTIONS[0],
    email,
    password,
  });
}

/**
 * Mengirim atau mengirim ulang dokumen pendaftaran registrations/{uid}
 */
export async function submitRegistrationDoc(name, kelas) {
  if (!isConfigured || !auth?.currentUser || !db) {
    throw new Error('Sesi pengguna belum aktif atau konfigurasi belum lengkap.');
  }

  const cleanName = (name || '').trim();
  const cleanKelas = (kelas || '').trim();

  if (!cleanName || cleanName.length < 2 || cleanName.length > 80) {
    throw new Error('Nama harus terdiri dari 2 hingga 80 karakter.');
  }
  if (!cleanKelas) {
    throw new Error('Kelas wajib dipilih.');
  }

  try {
    const regDocRef = doc(db, 'registrations', auth.currentUser.uid);
    await setDoc(regDocRef, {
      name: cleanName,
      kelas: cleanKelas,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    return await verifyUserRole(auth.currentUser);
  } catch (err) {
    let message = 'Gagal mengirim data pendaftaran.';
    if (err.code === 'permission-denied') {
      message = 'Data pendaftaran sudah pernah diajukan atau tidak memenuhi kriteria aturan.';
    } else if (err.code === 'unavailable' || err.message?.includes('network')) {
      message = 'Koneksi jaringan terputus. Silakan coba lagi.';
    }
    const customErr = new Error(message);
    customErr.code = err.code;
    throw customErr;
  }
}

/**
 * Mengirim tautan pemulihan kata sandi (Lupa Password)
 * Pesan selalu netral demi keamanan: "Jika email terdaftar, tautan reset telah dikirim."
 */
export async function requestPasswordReset(email) {
  if (!isConfigured || !auth) {
    throw new Error('Firebase belum dikonfigurasi. Aplikasi berjalan dalam Mode Tamu.');
  }

  const cleanEmail = (email || '').trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    throw new Error('Masukkan alamat email yang valid.');
  }

  try {
    await sendPasswordResetEmail(auth, cleanEmail);
    return {
      success: true,
      message: 'Jika email terdaftar, tautan reset telah dikirim.',
    };
  } catch (err) {
    if (err.code === 'auth/network-request-failed') {
      const customErr = new Error('Koneksi jaringan terputus. Silakan periksa koneksi internet Anda.');
      customErr.code = err.code;
      throw customErr;
    }
    if (err.code === 'auth/too-many-requests') {
      const customErr = new Error('Terlalu banyak permintaan reset kata sandi. Silakan tunggu beberapa saat.');
      customErr.code = err.code;
      throw customErr;
    }
    // Untuk kesalahan auth lain (misalnya email tidak ditemukan), kembalikan pesan netral
    return {
      success: true,
      message: 'Jika email terdaftar, tautan reset telah dikirim.',
    };
  }
}

/**
 * Logout pengguna aktif
 */
export async function logoutUser() {
  if (!auth) {
    currentSession = {
      user: null,
      role: 'guest',
      alias: null,
      active: false,
      accessStatus: 'Mode Tamu',
      registration: null,
      memberData: null,
      needsRegistrationDoc: false,
      error: null,
    };
    notifyListeners();
    return;
  }

  try {
    await signOut(auth);
    currentSession = {
      user: null,
      role: 'guest',
      alias: null,
      active: false,
      accessStatus: 'Mode Tamu',
      registration: null,
      memberData: null,
      needsRegistrationDoc: false,
      error: null,
    };
    notifyListeners();
  } catch (err) {
    console.error('[authService] Gagal keluar:', err);
    throw err;
  }
}

// Inisialisasi listener auth jika Firebase aktif
if (isConfigured && auth) {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      await verifyUserRole(firebaseUser);
    } else {
      currentSession = {
        user: null,
        role: 'guest',
        alias: null,
        active: false,
        accessStatus: 'Mode Tamu',
        registration: null,
        memberData: null,
        needsRegistrationDoc: false,
        error: null,
      };
      notifyListeners();
    }
  });
}
