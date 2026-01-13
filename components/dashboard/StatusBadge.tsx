import { BudgetStatus, statusColor } from "@/lib/budgetEngine";

export default function StatusBadge({ status }: { status: BudgetStatus }) {
  return (
    <span
      className={[
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
        statusColor(status),
      ].join(" ")}
    >
      {status}
    </span>
  );
}
