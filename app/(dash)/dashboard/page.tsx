import { projectBudgets, getBudgetSummary } from "@/lib/dummy/projectBudget";
import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";

export default function OwnerDashboardPage() {
  const summary = getBudgetSummary();

  return (
    <section className="container-bbm py-12 space-y-12">
      {/* ================= HEADER ================= */}
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase mb-2">
          OWNER DASHBOARD
        </p>

        <h1 className="text-3xl font-semibold">
          Dashboard Proyek
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Ringkasan seluruh proyek berjalan beserta kondisi biaya dan kontrak.
        </p>
      </div>

      {/* ================= KPI SUMMARY ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Proyek"
          value={summary.totalProyek}
          type="text"
          subtitle="Proyek aktif berjalan"
        />

        <KpiCard
          title="Total Kontrak"
          value={summary.totalKontrak}
          subtitle="Akumulasi nilai kontrak"
        />

        <KpiCard
          title="Total Biaya"
          value={summary.totalBiaya}
          subtitle="Realisasi biaya berjalan"
        />

        <KpiCard
          title="Total Sisa"
          value={summary.totalSisa}
          subtitle="Sisa exposure seluruh proyek"
        />
      </div>

      {/* ================= PROJECT LIST ================= */}
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Daftar Proyek
            </h2>
            <p className="text-sm text-gray-500">
              Klik proyek untuk melihat detail anggaran dan realisasi
            </p>
          </div>
        </div>

        <ProjectTable projects={projectBudgets} />
      </div>
    </section>
  );
}
