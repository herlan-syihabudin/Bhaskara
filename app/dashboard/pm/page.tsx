"use client";

import { useEffect, useState } from "react";
import KpiCard from "@/components/dashboard/KpiCard";
import ProjectTable from "@/components/dashboard/ProjectTable";
import { statusFromBudget } from "@/lib/engine/budget";

type ProjectSummary = {
  project_id: string;
  project_name: string;
  nilaiKontrak: number;
  biayaReal: number;
  statusBudget: "AMAN" | "WARNING" | "BAHAYA";
};

export default function PMDashboardPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/project-summary");
        const json = await res.json();
        setProjects(json.projects || []);
      } catch (err) {
        console.error("LOAD PM DASHBOARD ERROR:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const totalProyek = projects.length;
  const proyekAktif = projects.filter(
    (p) => p.biayaReal < p.nilaiKontrak
  );
  const proyekRisiko = proyekAktif.filter(
    (p) => p.statusBudget !== "AMAN"
  );

  if (loading) {
    return (
      <section className="py-12">
        <p className="text-gray-500">Loading dashboard...</p>
      </section>
    );
  }

  return (
    <section className="space-y-10">
      {/* HEADER */}
      <div>
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
          PROJECT MANAGER
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          PM Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Kontrol progres biaya & risiko proyek berjalan
        </p>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Proyek" value={totalProyek} type="text" />
        <KpiCard title="Proyek Aktif" value={proyekAktif.length} type="text" />
        <KpiCard title="Proyek Risiko" value={proyekRisiko.length} type="text" />
        <KpiCard title="Fokus Hari Ini" value="Kontrol Biaya" type="text" />
      </div>

      {/* PROJECT LIST */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Daftar Proyek
        </h2>
        <ProjectTable projects={projects} />
      </div>
    </section>
  );
}
