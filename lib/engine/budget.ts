// lib/engine/budget.ts

export type BudgetStatus = "AMAN" | "WARNING" | "BAHAYA";

/* =========================
   BASIC CALC
========================= */
export function pct(part: number, total: number) {
  if (!total || total <= 0) return 0;
  return (part / total) * 100;
}

/* =========================
   STATUS LOGIC
========================= */
export function statusFromUsedPct(p: number): BudgetStatus {
  if (p >= 90) return "BAHAYA";
  if (p >= 75) return "WARNING";
  return "AMAN";
}

export function statusFromBudget(
  nilaiKontrak: number,
  biayaReal: number
): BudgetStatus {
  return statusFromUsedPct(pct(biayaReal, nilaiKontrak));
}

/* =========================
   UI HELPERS
========================= */
export function statusColor(status: BudgetStatus) {
  switch (status) {
    case "AMAN":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "WARNING":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "BAHAYA":
      return "bg-rose-50 text-rose-800 border-rose-200";
  }
}

export function rowToneFromRemainingPct(remainingPct: number) {
  if (remainingPct <= 10) return "text-rose-700";
  if (remainingPct <= 25) return "text-amber-700";
  return "text-gray-900";
}
