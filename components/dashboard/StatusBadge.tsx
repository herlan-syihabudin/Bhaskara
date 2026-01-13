import type { BudgetStatus } from "@/lib/budgetEngine";

export default function StatusBadge({
  status,
}: {
  status: BudgetStatus;
}) {
  const map = {
    AMAN: {
      cls: "bg-emerald-100 text-emerald-800 border-emerald-300",
      label: "AMAN",
    },
    WARNING: {
      cls: "bg-amber-100 text-amber-800 border-amber-300",
      label: "WARNING",
    },
    BAHAYA: {
      cls: "bg-rose-100 text-rose-800 border-rose-300",
      label: "BAHAYA",
    },
  };

  const cfg = map[status];

  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}
