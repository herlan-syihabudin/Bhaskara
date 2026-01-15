import type { BudgetStatus } from "@/lib/engine/budget";
import { statusColor } from "@/lib/engine/budget";

export default function StatusBadge({ status }: { status: BudgetStatus }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${statusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
}
