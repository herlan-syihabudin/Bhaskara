import type { MaterialRequest } from "@/lib/data/materialRequests";

export default function MaterialRequestList({
  data,
}: {
  data: MaterialRequest[];
}) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Belum ada material request
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((mr) => (
        <div
          key={mr.id}
          className="border rounded-lg p-4 space-y-2"
        >
          <div className="flex justify-between">
            <p className="font-medium">{mr.id}</p>
            <span className="text-xs font-semibold">
              {mr.status}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            {mr.createdAt}
          </p>

          <ul className="text-sm list-disc pl-5">
            {mr.items.map((item, i) => (
              <li key={i}>
                {item.name} — {item.qty} {item.unit}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
