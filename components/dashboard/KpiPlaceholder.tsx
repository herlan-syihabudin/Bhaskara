export default function KpiPlaceholder() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="card p-6 animate-pulse"
        >
          <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
          <div className="h-6 w-32 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
}
