"use client";

import { useEffect, useState } from "react";
import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";
import type { ProjectSummary } from "@/lib/types/project";

export default function PMDashboardPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/project-summary");
        const json: ProjectSummary[] = await res.json();
        setProjects(json); // ✅ FIX
      } catch (err) {
        console.error("LOAD PM DASHBOARD ERROR:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <p className="py-12 text-gray-500">Loading dashboard...</p>;
  }

  const proyekAktif = projects.filter(
    (p) => p.biayaReal < p.nilaiKontrak
  );

  const proyekRisiko = proyekAktif.filter(
    (p) => p.statusBudget !== "AMAN"
  );

  return (
    <section className="space-y-10">
      <div>
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
          PROJECT MANAGER
        </p>
        <h1 className="text-2xl font-semibold mt-1">PM Dashboard</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Proyek" value={projects.length} type="text" />
        <KpiCard title="Proyek Aktif" value={proyekAktif.length} type="text" />
        <KpiCard title="Proyek Risiko" value={proyekRisiko.length} type="text" />
        <KpiCard title="Fokus Hari Ini" value="Kontrol Biaya" type="text" />
      </div>

      <ProjectTable projects={projects} />
    </section>
  );
}
