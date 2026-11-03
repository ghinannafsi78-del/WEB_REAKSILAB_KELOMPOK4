/**
 * services/authService.js
 * Manajemen autentikasi siswa dan guru serta verifikasi izin akses Cloud Firestore
 * Sesuai spesifikasi DATABASE.md dan PRD Bab 13 & 16
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isConfigured } from './cloudClient.js';

// Objek sesi aktif
let currentSession = {
  user: null,
  role: 'guest', // 'guest' | 'student' | 'teacher' | 'unregistered'
  alias: null,
  active: false,
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
 * Memverifikasi peran dan status pengguna di Cloud Firestore
 * Memeriksa config/roles untuk guru, dan roster/{uid} untuk siswa aktif
 */
export async function verifyUserRole(user) {
  if (!user || !db) {
    currentSession = {
      user: null,
      role: 'guest',
      alias: null,
      active: false,
      error: null,
    };
    notifyListeners();
    return currentSession;
  }

  try {
    // 1. Periksa apakah akun adalah Guru via config/roles
    try {
      const rolesRef = doc(db, 'config', 'roles');
      const rolesSnap = await getDoc(rolesRef);
      if (rolesSnap.exists() && rolesSnap.data()?.teacherUid === user.uid) {
        currentSession = {
          user,
          role: 'teacher',
          alias: 'Guru Pengampu',
          active: true,
          error: null,
        };
        notifyListeners();
        return currentSession;
      }
    } catch {
      // Permission-denied jika bukan guru; lanjutkan ke pemeriksaan siswa
    }

    // 2. Periksa apakah akun adalah Siswa terdaftar pada roster/{uid}
    const rosterRef = doc(db, 'roster', user.uid);
    const rosterSnap = await getDoc(rosterRef);

    if (rosterSnap.exists()) {
      const rosterData = rosterSnap.data();
      if (rosterData?.active === true) {
        currentSession = {
          user,
          role: 'student',
          alias: rosterData.alias || `Siswa-${user.uid.substring(0, 5)}`,
          active: true,
          error: null,
        };
        notifyListeners();
        return currentSession;
      } else {
        // Akun terdaftar tetapi dinonaktifkan
        currentSession = {
          user,
          role: 'unregistered',
          alias: rosterData.alias || null,
          active: false,
          error: 'Akun Anda berstatus nonaktif di roster kelas. Akses penyimpanan cloud dinonaktifkan.',
        };
        notifyListeners();
        return currentSession;
      }
    }

    // 3. Login berhasil tetapi UID belum didaftarkan di roster
    currentSession = {
      user,
      role: 'unregistered',
      alias: null,
      active: false,
      error: 'Akun Anda belum terdaftar dalam roster kelas. Silakan hubungi guru pengampu.',
    };
    notifyListeners();
    return currentSession;
  } catch (err) {
    console.warn('[authService] Gagal memverifikasi peran user di Firestore:', err);
    currentSession = {
      user,
      role: 'unregistered',
      alias: null,
      active: false,
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
 */
export async function loginWithEmail(email, password) {
  if (!isConfigured || !auth) {
    throw new Error('Firebase belum dikonfigurasi. Aplikasi berjalan dalam Mode Tamu.');
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    return await verifyUserRole(cred.user);
  } catch (err) {
    let message = 'Gagal masuk akun. Periksa kembali email dan kata sandi Anda.';
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      message = 'Email atau kata sandi tidak cocok.';
    } else if (err.code === 'auth/wrong-password') {
      message = 'Kata sandi tidak tepat.';
    } else if (err.code === 'auth/invalid-email') {
      message = 'Format email tidak valid.';
    } else if (err.code === 'auth/network-request-failed') {
      message = 'Koneksi jaringan terputus. Silakan periksa koneksi internet Anda.';
    }
    const customErr = new Error(message);
    customErr.code = err.code;
    throw customErr;
  }
}

/**
 * Registrasi Siswa Baru (jika diizinkan pengelola)
 */
export async function registerWithEmail(email, password) {
  if (!isConfigured || !auth) {
    throw new Error('Firebase belum dikonfigurasi. Aplikasi berjalan dalam Mode Tamu.');
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    return await verifyUserRole(cred.user);
  } catch (err) {
    let message = 'Gagal mendaftar akun.';
    if (err.code === 'auth/email-already-in-use') {
      message = 'Email ini sudah terdaftar.';
    } else if (err.code === 'auth/weak-password') {
      message = 'Kata sandi terlalu lemah (minimal 6 karakter).';
    }
    const customErr = new Error(message);
    customErr.code = err.code;
    throw customErr;
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
        error: null,
      };
      notifyListeners();
    }
  });
}

