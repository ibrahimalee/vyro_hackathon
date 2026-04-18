export function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function truncateText(s, n = 120) {
  if (!s) return "";
  if (s.length <= n) return s;
  return s.slice(0, n) + `…+${s.length - n} more chars`;
}
