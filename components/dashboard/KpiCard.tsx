type Props = {
  title: string;
  value: number | string;
};

export default function KpiCard({ title, value }: Props) {
  return (
    <div className="card p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">
        {typeof value === "number"
          ? `Rp ${value.toLocaleString("id-ID")}`
          : value}
      </p>
    </div>
  );
}
