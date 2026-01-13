export default function KpiCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="card p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold">
        {typeof value === "number"
          ? `Rp ${value.toLocaleString()}`
          : value}
      </p>
    </div>
  );
}
