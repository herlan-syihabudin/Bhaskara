import Link from "next/link";

async function getAbsensi() {
  const month = new Date().toISOString().slice(0, 7); // yyyy-mm
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const res = await fetch(`${base}/api/absensi?month=${month}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal load absensi");
  return res.json();
}

export default async function AbsensiPage() {
  const data = await getAbsensi();

  return (
    <section className="container-bbm py-12 space-y-8">
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="badge">HR & PAYROLL</p>
          <h1>Absensi</h1>
          <p className="text-body mt-1">Input kehadiran harian karyawan</p>
        </div>

        <Link href="/dashboard/payroll/absensi/tambah" className="btn-primary">
          ➕ Tambah Absensi
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Tanggal</th>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Project</th>
              <th className="px-4 py-3 text-center">Masuk</th>
              <th className="px-4 py-3 text-center">Pulang</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  Belum ada absensi bulan ini
                </td>
              </tr>
            )}

            {data.map((a: any) => (
              <tr key={a.absensi_id} className="border-b last:border-none">
                <td className="px-4 py-3">{a.tanggal}</td>
                <td className="px-4 py-3 font-medium">{a.nama}</td>
                <td className="px-4 py-3">{a.role}</td>
                <td className="px-4 py-3">{a.project_id}</td>
                <td className="px-4 py-3 text-center">{a.jam_masuk}</td>
                <td className="px-4 py-3 text-center">{a.jam_keluar}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
