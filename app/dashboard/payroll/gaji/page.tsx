// app/dashboard/payroll/gaji/page.tsx
import Link from "next/link";

async function getPayroll() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${baseUrl}/api/payroll`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Gagal load payroll");
  return res.json();
}

export default async function PayrollListPage() {
  const data = await getPayroll();

  return (
    <section className="container-bbm py-12 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <p className="badge">HR & PAYROLL</p>
          <h1>Penggajian</h1>
          <p className="text-body mt-1">
            Daftar payroll hasil generate sistem
          </p>
        </div>

        <Link
          href="/dashboard/payroll/generate"
          className="btn-primary"
        >
          ⚙️ Generate Payroll
        </Link>
      </div>

      {/* TABLE */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left py-3 px-4">Nama</th>
              <th>Periode</th>
              <th>Project</th>
              <th className="text-right">Total</th>
              <th>Status</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  Belum ada payroll tergenerate
                </td>
              </tr>
            )}

            {data.map((p: any) => (
              <tr key={p.payroll_id} className="border-b">
                <td className="px-4 py-3 font-medium">
                  {p.nama}
                </td>
                <td className="text-center">
                  {p.periode}
                </td>
                <td className="text-center">
                  {p.project_id || "-"}
                </td>
                <td className="text-right px-4">
                  Rp {Number(p.total || 0).toLocaleString("id-ID")}
                </td>
                <td className="text-center">
                  <span
                    className={`badge ${
                      p.status === "PAID"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="text-center">
                  <Link
                    href={`/dashboard/payroll/slip/${p.payroll_id}`}
                    className="btn-outline btn-xs"
                  >
                    👁 Slip
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
