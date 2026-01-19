import KpiCard from "@/components/dashboard/KpiCard";
import Link from "next/link";

export default function PayrollPage() {
  return (
    <section className="space-y-10">
      {/* HEADER */}
      <div>
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
          HR & PAYROLL
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          Payroll Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola tukang, staff, absensi, dan pembayaran gaji
        </p>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Karyawan" value={0} type="text" />
        <KpiCard title="Hadir Bulan Ini" value={0} type="text" />
        <KpiCard title="Total Gaji Bulan Ini" value={0} />
        <KpiCard title="Belum Dibayar" value={0} type="text" />
      </div>

      {/* ACTION */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/payroll/karyawan"
          className="card p-6 hover:border-black transition"
        >
          <h3 className="font-semibold text-lg mb-1">
            👷 Data Karyawan
          </h3>
          <p className="text-sm text-gray-500">
            Tukang harian, mandor, staff kantor
          </p>
        </Link>

        <Link
          href="/dashboard/payroll/absensi"
          className="card p-6 hover:border-black transition"
        >
          <h3 className="font-semibold text-lg mb-1">
            🗓️ Absensi
          </h3>
          <p className="text-sm text-gray-500">
            Kehadiran, lembur, izin
          </p>
        </Link>

        <Link
          href="/dashboard/payroll/gaji"
          className="card p-6 hover:border-black transition"
        >
          <h3 className="font-semibold text-lg mb-1">
            💰 Penggajian
          </h3>
          <p className="text-sm text-gray-500">
            Hitung & bayar gaji bulanan / harian
          </p>
        </Link>
      </div>

      {/* INFO */}
      <div className="border rounded-xl p-6 bg-gray-50">
        <p className="text-sm text-gray-600">
          💡 <b>Catatan:</b> Payroll terhubung dengan proyek, absensi,
          dan finance untuk memastikan biaya tenaga kerja tercatat
          otomatis per proyek.
        </p>
      </div>
    </section>
  );
}
