export type BudgetStatus = "AMAN" | "WARNING" | "BAHAYA";

export function pct(part: number, total: number) {
  if (!total) return 0;
  return (part / total) * 100;
}

export function statusFromBudget(
  nilaiKontrak: number,
  biayaReal: number
): BudgetStatus {
  const p = pct(biayaReal, nilaiKontrak);
  if (p >= 90) return "BAHAYA";
  if (p >= 75) return "WARNING";
  return "AMAN";
}
