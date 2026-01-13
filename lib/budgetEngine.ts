/* ===============================
   TYPES
================================ */
export type BudgetStatus = "AMAN" | "WARNING" | "BAHAYA";

/* ===============================
   CONSTANTS (RULE ENGINE)
   gampang diubah nanti
================================ */
const WARNING_USED_PCT = 75; // >=75% mulai waspada
const DANGER_USED_PCT = 90;  // >=90% bahaya

/* ===============================
   HELPERS
================================ */
export function pct(part: number, total: number): number {
  if (!total || total <= 0) return 0;
  return (part / total) * 100;
}

/* ===============================
   STATUS ENGINE
================================ */
export function statusFromUsedPct(usedPct: number): BudgetStatus {
  if (usedPct >= DANGER_USED_PCT) return "BAHAYA";
  if (usedPct >= WARNING_USED_PCT) return "WARNING";
  return "AMAN";
}

export function statusFromBudget(
  nilaiKontrak: number,
  biayaReal: number
): BudgetStatus {
  const used = pct(biayaReal, nilaiKontrak);
  return statusFromUsedPct(used);
}

/* ===============================
   UI HELPERS
================================ */
export function statusColor(status: BudgetStatus): string {
  switch (status) {
    case "AMAN":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "WARNING":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "BAHAYA":
      return "bg-rose-50 text-rose-800 border-rose-200";
  }
}

export function rowToneFromRemainingPct(remainingPct: number): string {
  if (remainingPct <= 10) return "text-rose-700";
  if (remainingPct <= 25) return "text-amber-700";
  return "text-gray-900";
}
