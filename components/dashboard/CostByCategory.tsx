// /components/dashboard/CostByCategory.tsx
import { rowToneFromRemainingPct } from "@/lib/budgetEngine";

type Category = { name: string; po: number; real: number };

export default function CostByCategory({ data }: { data: Category[] }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900">Biaya per Kategori</h3>

      <table className="w-full mt-4 text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-2">Kategori</th>
            <th className="pb-2">PO</th>
            <th className="pb-2">Realisasi</th>
            <th className="pb-2">Sisa</th>
            <th className="pb-2 text-right">Sisa %</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => {
            const sisa = row.po - row.real;
            const sisaPct = row.po > 0 ? (sisa / row.po) * 100 : 0;
            const tone = rowToneFromRemainingPct(sisaPct);

            return (
              <tr key={row.name} className="border-b last:border-none">
                <td className="py-3">{row.name}</td>
                <td className="py-3">Rp {row.po.toLocaleString("id-ID")}</td>
                <td className="py-3">Rp {row.real.toLocaleString("id-ID")}</td>
                <td className="py-3 font-medium">Rp {sisa.toLocaleString("id-ID")}</td>
                <td className={`py-3 text-right font-semibold ${tone}`}>{sisaPct.toFixed(1)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
