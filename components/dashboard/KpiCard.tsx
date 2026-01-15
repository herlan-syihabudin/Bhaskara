// /components/dashboard/KpiCard.tsx
import StatusBadge from "@/components/dashboard/StatusBadge";
import type { BudgetStatus } from "@/lib/budgetEngine";

type BaseProps = {
  title: string;
  subtitle?: string;
};

type MoneyOrTextProps = BaseProps & {
  type?: "money" | "text";
  value: number | string;
};

type StatusProps = BaseProps & {
  type: "status";
  statusValue: BudgetStatus;
};

type Props = MoneyOrTextProps | StatusProps;

function formatIDR(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export default function KpiCard(props: Props) {
  return (
    <div className="card p-6">
      <p className="text-sm text-gray-500">{props.title}</p>

      <div className="mt-2">
        {props.type === "status" ? (
          <StatusBadge status={props.statusValue} />
        ) : (
          <p className="text-2xl font-semibold text-gray-900">
            {typeof props.value === "number" && props.type !== "text"
              ? formatIDR(props.value)
              : props.value}
          </p>
        )}
      </div>

      {props.subtitle && (
        <p className="mt-2 text-xs text-gray-500">{props.subtitle}</p>
      )}
    </div>
  );
}
