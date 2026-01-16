import type { BudgetStatus } from "@/lib/engine/budget";

function barColor(status: BudgetStatus) {
  switch (status) {
    case "AMAN":
      return "bg-emerald-500";
    case "WARNING":
      return "bg-amber-500";
    case "BAHAYA":
      return "bg-rose-500";
  }
}

export default function UsedPctBar({
  value,
  status,
}: {
  value: number;
  status: BudgetStatus;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Budget Terpakai</span>
        <span>{value.toFixed(1)}%</span>
      </div>

      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full ${barColor(status)} transition-all`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}
