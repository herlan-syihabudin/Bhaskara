import StatusBadge from "@/components/dashboard/StatusBadge";
import type { BudgetStatus } from "@/lib/budgetEngine";

type Props = {
  title: string;
  value: number | string;
  subtitle?: string;
  type?: "money" | "text" | "status";
  statusValue?: BudgetStatus;
};

function formatIDR(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export default function KpiCard({
  title,
  value,
  subtitle,
  type = "money",
  statusValue,
}: Props) {
  return (
    <div className="card p-6">
      <p className="text-sm text-gray-500">{title}</p>

      <div className="mt-2">
        {type === "status" && statusValue ? (
          <StatusBadge status={statusValue} />
        ) : (
          <p className="text-2xl font-semibold text-gray-900">
            {typeof value === "number" && type === "money"
              ? formatIDR(value)
              : value}
          </p>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}
