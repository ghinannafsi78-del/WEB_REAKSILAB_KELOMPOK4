import { readScope, markSent } from "./localStore.js";

const busy = new Set();

export async function syncPending(owner, cloud, isCurrent, report = () => {}) {
  if (!owner || owner === "guest" || busy.has(owner) || !isCurrent()) return;
  busy.add(owner);
  try {
    const records = Object.values(readScope(owner).records);
    for (const record of records.filter(r => r.status === "pending")) {
      if (!isCurrent()) return;
      report("pending", record.attempt.id);
      try {
        const saved = await cloud.saveAttempt(record.attempt);
        if (!isCurrent()) return;
        markSent(owner, saved);
        report("sent", record.attempt.id);
      } catch (error) {
        if (!isCurrent()) return;
        report("error", record.attempt.id, error);
        return; // Antrean tetap tersimpan; jangan mengulang tanpa batas.
      }
    }
  } finally {
    busy.delete(owner);
  }
}