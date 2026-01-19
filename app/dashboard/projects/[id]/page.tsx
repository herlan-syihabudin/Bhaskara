"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import KpiCard from "@/components/dashboard/KpiCard";
import MaterialRequestSummary from "@/components/dashboard/MaterialRequestSummary";

type ProjectSummary = {
  project_id: string;
  project_name: string;
  nilaiKontrak: number;
  biayaMaterial: number;
  biayaJasa: number;
  biayaAlat: number;
  biayaReal: number;
  sisaBudget: number;
  statusBudget: "AMAN" | "WARNING" | "BAHAYA";
};

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const [project, setProject] = useState<ProjectSummary | null>(null);
  const [mrList, setMrList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // 1️⃣ Project Summary
        const ps = await fetch(
          `/api/project-summary?id=${projectId}`
        ).then((r) => r.json());

        // 2️⃣ Material Request
        const mr = await fetch(
          `/api/material-request?project_id=${projectId}`
        ).then((r) => r.json());

        setProject(ps.project);
        setMrList(mr.data || []);
      } catch (err) {
        console.error("LOAD PROJECT DETAIL ERROR:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [projectId]);

  if (loading) {
    return (
      <section className="container-bbm py-12">
        <p className="text-gray-500">Loading project data...</p>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="container-bbm py-12">
        <p className="text-red-500">Project tidak ditemukan</p>
      </section>
    );
  }

  return (
    <section className="container-bbm py-12 space-y-12">
      {/* HEADER */}
      <div>
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
          PROJECT DETAIL
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          {project.project_name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Kontrol proyek & permintaan material
        </p>
      </div>

      {/* KPI */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard
          title="Nilai Kontrak"
          value={project.nilaiKontrak}
        />
        <KpiCard
          title="Status Budget"
          value={project.statusBudget}
          type="text"
        />
        <KpiCard
          title="Jumlah Material Request"
          value={mrList.length}
          type="text"
        />
      </div>

      {/* ACTION PM */}
      <div className="border rounded-xl p-6 space-y-3">
        <h2 className="text-lg font-semibold">
          Aksi Project Manager
        </h2>
        <Link
          href={`/dashboard/projects/${projectId}/request-material`}
          className="inline-block px-4 py-2 rounded-lg bg-black text-white text-sm"
        >
          + Request Material
        </Link>
      </div>

      {/* MATERIAL REQUEST SUMMARY */}
      <MaterialRequestSummary
        projectId={projectId}
        mrList={mrList}
      />
    </section>
  );
}
