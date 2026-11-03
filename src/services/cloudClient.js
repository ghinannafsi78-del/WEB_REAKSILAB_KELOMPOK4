/**
 * services/cloudClient.js
 * Inisialisasi dan konfigurasi Firebase Cloud SDK (Auth & Firestore)
 * Sesuai spesifikasi DATABASE.md dan PRD Bab 13
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
};

// Periksa apakah konfigurasi Firebase tersedia dan lengkap
export const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let app = null;
let auth = null;
let db = null;

if (isConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn('[REAKSI LAB CloudClient] Inisialisasi Firebase gagal:', err);
  }
} else {
  // Graceful degradation: Berjalan penuh pada Mode Tamu (LocalStorage)
  if (import.meta.env.DEV) {
    console.info(
      '[REAKSI LAB CloudClient] Variabel Firebase belum dikonfigurasi. Aplikasi berjalan dalam Mode Tamu (Penyimpanan Lokal).'
    );
  }
}

export { app, auth, db };

