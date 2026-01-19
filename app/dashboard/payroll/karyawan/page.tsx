import Link from "next/link";

async function getKaryawan() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/karyawan`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed load karyawan");
  return res.json();
}

export default async function KaryawanPage() {
  const data = await getKaryawan();

  return (
    <section className="container-bbm py-12 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <p className="badge">HR & PAYROLL</p>
          <h1>Data Karyawan</h1>
          <p className="text-body mt-1">
            Tukang harian, mandor, dan staff kantor
          </p>
        </div>

        <Link href="/dashboard/payroll/karyawan/tambah" className="btn-primary">
          ➕ Tambah Karyawan
        </Link>
      </div>

      {/* TABLE */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="py-3 px-4 text-left">Nama</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Tipe</th>
              <th className="py-3 px-4 text-right">Rate</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right"></th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  Belum ada karyawan
                </td>
              </tr>
            )}

            {data.map((k: any) => (
              <tr key={k.karyawan_id} className="border-b last:border-none">
                <td className="px-4 py-3 font-medium">{k.nama}</td>
                <td className="px-4 py-3">{k.role}</td>
                <td className="px-4 py-3">{k.type}</td>
                <td className="px-4 py-3 text-right">
                  Rp {k.rate.toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 text-xs rounded font-medium
                      ${
                        k.status === "AKTIF"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {k.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/dashboard/payroll/karyawan/edit/${k.karyawan_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
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
