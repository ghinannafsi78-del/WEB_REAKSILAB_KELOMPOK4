export const fields = ["id", "ownerId", "alias", "moduleId", "activityId", 
  "questionVersion", "kind", "answers", "score", "completedAt"]; 
 
export function payloadOf(value) { 
  const a = Object.fromEntries(fields.map(key => [key, value[key]])); 
  const bounded = (v, max) => typeof v === "string" && v.length > 0 && 
v.length <= max; 
  if (!bounded(a.id, 64) || !bounded(a.ownerId, 128) 
      || typeof a.alias !== "string" || a.alias.length > 80 
      || !bounded(a.moduleId, 64) || !bounded(a.activityId, 64) 
      || !bounded(a.questionVersion, 32) 
      || !["diagnostic", "practice", "pretest", "posttest", 
"observation"].includes(a.kind) 
      || !a.answers || typeof a.answers !== "object" || 
Array.isArray(a.answers) 
      || Object.keys(a.answers).length < 1 || Object.keys(a.answers).length 
> 30 
      || !Object.entries(a.answers).every(([id, answer]) => 
        bounded(id, 64) && typeof answer === "string" && answer.length <= 
2000) 
      || !Number.isFinite(a.score) || a.score < 0 || a.score > 100 
      || !bounded(a.completedAt, 40) || 
!Number.isFinite(Date.parse(a.completedAt))) { 
    throw new Error("Bentuk hasil belajar tidak sesuai kontrak"); 
  } 
  a.completedAt = new Date(a.completedAt).toISOString(); 
  return a; 
} 
 
function stable(value) { 
  if (Array.isArray(value)) return value.map(stable); 
  if (value && typeof value === "object") return Object.fromEntries( 
    Object.keys(value).sort().map(key => [key, stable(value[key])]) 
  ); 
  return value; 
} 
 
export function sameAttempt(a, b) { 
  return JSON.stringify(stable(payloadOf(a))) === 
JSON.stringify(stable(payloadOf(b))); 
} 