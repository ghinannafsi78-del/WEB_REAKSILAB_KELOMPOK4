import { payloadOf, sameAttempt } from "./attemptContract.js";

const KEY = "chem:kimia-kelompok-01:v1";
const blank = () => ({ drafts: {}, records: {} });
const isMap = v => v && typeof v === "object" && !Array.isArray(v);

function readAll() {
  const raw = localStorage.getItem(KEY);
  if (raw === null) return { version: 1, scopes: {} };
  const data = JSON.parse(raw);
  if (data.version !== 1 || !isMap(data.scopes)) throw new Error("Data lokal perlu dipulihkan");
  for (const scope of Object.values(data.scopes)) {
    if (!isMap(scope) || !isMap(scope.drafts) || !isMap(scope.records)) {
      throw new Error("Data lokal tidak sesuai skema");
    }
    for (const record of Object.values(scope.records)) {
      payloadOf(record.attempt);
      if (!["local", "pending", "sent"].includes(record.status)) throw new Error("Status lokal rusak");
    }
  }
  return data;
}

function change(owner, action) {
  if (!owner || ["__proto__", "constructor", "prototype"].includes(owner)) throw new Error("Pemilik tidak valid");
  const data = readAll();
  if (!Object.hasOwn(data.scopes, owner)) data.scopes[owner] = blank();
  action(data.scopes[owner], data);
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function readScope(owner) {
  return readAll().scopes[owner] ?? blank();
}

export function saveDraft(owner, activityKey, draft) {
  change(owner, scope => { scope.drafts[activityKey] = draft; });
}

export function resetDraft(owner, activityKey) {
  change(owner, scope => { delete scope.drafts[activityKey]; });
}

export function recordAttempt(owner, value) {
  const attempt = payloadOf(value);
  if (attempt.ownerId !== owner) throw new Error("Pemilik hasil tidak cocok");
  change(owner, scope => {
    const old = scope.records[attempt.id];
    if (old && !sameAttempt(old.attempt, attempt)) throw new Error("ID percobaan sudah dipakai");
    scope.records[attempt.id] ??= { attempt, status: owner === "guest" ? "local" : "pending" };
  });
}

export function claimGuest(owner, alias, ids) {
  if (!owner || owner === "guest") throw new Error("Masuk ke akun siswa dahulu");
  change(owner, (scope, data) => {
    const guest = data.scopes.guest ?? blank();
    for (const id of new Set(ids)) {
      const source = guest.records[id];
      if (!source) continue;
      const attempt = payloadOf({ ...source.attempt, ownerId: owner, alias });
      const old = scope.records[id];
      if (old && !sameAttempt(old.attempt, attempt)) throw new Error("Hasil lokal bertabrakan");
      scope.records[id] ??= { attempt, status: "pending" };
      delete guest.records[id];
    }
  });
}

export function markSent(owner, value) {
  const attempt = payloadOf(value);
  if (attempt.ownerId !== owner) throw new Error("Pemilik hasil server tidak cocok");
  change(owner, scope => {
    const old = scope.records[attempt.id];
    if (old && !sameAttempt(old.attempt, attempt)) throw new Error("Isi server berbeda; perlu pemeriksaan");
    scope.records[attempt.id] = { attempt, status: "sent", receivedAt: value.receivedAt ?? null };
  });
}

export function forgetAccount(owner, discardPending = false) {
  const data = readAll();
  const pending = Object.values(data.scopes[owner]?.records ?? {}).some(r => r.status === "pending");
  if (pending && !discardPending) throw new Error("Masih ada hasil belum terkirim");
  delete data.scopes[owner];
  localStorage.setItem(KEY, JSON.stringify(data));
}
