type Vendor = {
  name: string;
  po: number;
  real: number;
};

export default function CostByVendor({
  data,
}: {
  data: Vendor[];
}) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Biaya per Vendor
      </h3>

      <table className="w-full mt-4 text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-2">Vendor</th>
            <th className="pb-2">PO</th>
            <th className="pb-2">Realisasi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.name} className="border-b last:border-none">
              <td className="py-3">{row.name}</td>
              <td className="py-3">Rp {row.po.toLocaleString("id-ID")}</td>
              <td className="py-3">Rp {row.real.toLocaleString("id-ID")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
