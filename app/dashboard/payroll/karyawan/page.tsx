import Link from "next/link";

export default function KaryawanPage() {
  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">👷 Data Karyawan</h1>
          <p className="text-sm text-gray-500">
            Modul data tukang harian, mandor, dan staff kantor
          </p>
        </div>

        <Link
          href="/dashboard/payroll/karyawan/tambah"
          className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800"
        >
          + Tambah Karyawan
        </Link>
      </div>

      {/* EMPTY STATE */}
      <div className="border rounded-xl p-10 text-center text-gray-400">
        Belum ada data karyawan.
      </div>
    </section>
  );
}
