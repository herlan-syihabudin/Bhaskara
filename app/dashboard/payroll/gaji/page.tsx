import Link from "next/link";

/* =====================
   FETCH PAYROLL
===================== */
async function getPayroll() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${baseUrl}/api/payroll`, { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal load payroll");
  return res.json();
}

export default async function PayrollListPage() {
  const data = await getPayroll();

  return (
    <section className="container-bbm py-12 space-y-6">
      <div>
        <p className="badge">HR & PAYROLL</p>
        <h1>Penggajian</h1>
        <p className="text-body mt-1">
          Daftar gaji karyawan per periode
        </p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left py-2">Nama</th>
              <th>Role</th>
              <th>Periode</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">
                  Belum ada payroll
                </td>
              </tr>
            )}

            {data.map((p: any) => (
              <tr key={p.payroll_id} className="border-b">
                <td className="py-2">{p.nama}</td>
                <td className="text-center">{p.role}</td>
                <td className="text-center">{p.periode}</td>
                <td className="text-right">
                  Rp {Number(p.total || 0).toLocaleString("id-ID")}
                </td>
                <td className="text-center">
                  <span className="badge badge-warning">
                    {p.status}
                  </span>
                </td>
                <td className="text-right">
                  <Link
                    href={`/dashboard/payroll/slip/${p.payroll_id}`}
                    className="btn-outline text-xs"
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
