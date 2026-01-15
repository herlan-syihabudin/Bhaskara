import { projects } from "@/lib/data/projects";
import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";

export default function LogistikDashboardPage() {
  const totalProyek = projects.length;

  // simulasi beban logistik (sementara)
  const proyekAktif = projects.filter(
    (p) => p.biayaReal < p.nilaiKontrak
  ).length;

  const proyekSelesai = totalProyek - proyekAktif;

  return (
    <section className="space-y-10">
      {/* HEADER */}
      <div>
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
          LOGISTIK
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          Logistik Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitoring distribusi material dan kesiapan proyek
        </p>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Proyek"
          value={totalProyek}
          type="text"
        />

        <KpiCard
          title="Proyek Aktif"
          value={proyekAktif}
          type="text"
        />

        <KpiCard
          title="Proyek Selesai"
          value={proyekSelesai}
          type="text"
        />

        <KpiCard
          title="Status Logistik"
          value="ON TRACK"
          type="text"
        />
      </div>

      {/* PROJECT LIST */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Proyek & Distribusi
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Digunakan sebagai dasar pengiriman material dan alat
        </p>

        <ProjectTable projects={projects} />
      </div>
    </section>
  );
}
