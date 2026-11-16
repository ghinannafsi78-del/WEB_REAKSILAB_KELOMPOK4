import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut,
  setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore, doc, getDocFromServer, setDoc, serverTimestamp,
  collection, query, where, getDocsFromServer } from "firebase/firestore";
import { payloadOf, sameAttempt } from "./attemptContract.js";
import { verifyUserRole } from "../services/authService.js";

let handles;
function clients() {
  if (!handles) {
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
    if (Object.values(config).some(v => !v)) throw new Error("Konfigurasi login/cloud belum lengkap");
    const app = initializeApp(config);
    handles = { auth: getAuth(app), db: getFirestore(app) };
  }
  return handles;
}

export async function getIdentity() {
  const { auth } = clients();
  await auth.authStateReady();
  return auth.currentUser?.uid ?? null;
}

export async function login() {
  const { auth } = clients();
  await setPersistence(auth, browserSessionPersistence);
  await signInWithPopup(auth, new GoogleAuthProvider());
  return getIdentity();
}

export async function logout() { await signOut(clients().auth); }

export async function getAccess() {
  const uid = await getIdentity();
  if (!uid) return { uid: null, teacher: false, member: null };
  const { auth } = clients();
  const currentUser = auth.currentUser || { uid };
  const session = await verifyUserRole(currentUser);
  return {
    uid,
    teacher: session.role === 'teacher',
    member: session.role === 'student' ? (session.memberData || { alias: session.alias, active: true }) : null,
    role: session.role,
    error: session.error || null,
  };
}

const unpack = snap => ({ ...snap.data(), receivedAt: snap.data().receivedAt?.toDate().toISOString() ?? null });

export async function saveAttempt(value) {
  const a = payloadOf(value);
  if (await getIdentity() !== a.ownerId) throw new Error("Akun pengirim berubah");
  const ref = doc(clients().db, "attempts", a.id);
  const before = await getDocFromServer(ref);
  if (before.exists()) {
    if (!sameAttempt(before.data(), a)) throw new Error("ID server sudah berisi hasil berbeda");
    return unpack(before);
  }
  if (await getIdentity() !== a.ownerId) throw new Error("Akun pengirim berubah");
  try {
    await setDoc(ref, { ...a, receivedAt: serverTimestamp() });
  } catch (error) {
    // Pengiriman lain bisa sudah berhasil; hanya isi yang sama dianggap retry.
    const existing = await getDocFromServer(ref).catch(() => null);
    if (!existing?.exists() || !sameAttempt(existing.data(), a)) throw error;
  }
  const saved = await getDocFromServer(ref);
  if (!saved.exists() || !sameAttempt(saved.data(), a)) throw new Error("Penerimaan server belum terkonfirmasi");
  return unpack(saved);
}

export async function listMine() {
  const uid = await getIdentity();
  if (!uid) throw new Error("Masuk dahulu");
  const q = query(collection(clients().db, "attempts"), where("ownerId", "==", uid));
  return (await getDocsFromServer(q)).docs.map(unpack);
}

export async function listClass() {
  if (!(await getAccess()).teacher) throw new Error("Panel khusus guru yang ditetapkan");
  return (await getDocsFromServer(collection(clients().db, "attempts"))).docs.map(unpack);
}