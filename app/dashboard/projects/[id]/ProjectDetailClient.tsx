"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MaterialRequestSummary from "@/components/dashboard/MaterialRequestSummary";

export default function ProjectDetailClient({
  projectId,
}: {
  projectId: string;
}) {
  const [mrList, setMrList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `/api/material-request?project_id=${projectId}`
        );
        const json = await res.json();
        setMrList(json.data || []);
      } catch (err) {
        console.error("LOAD MR ERROR:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [projectId]);

  if (loading) {
    return <p className="text-gray-500">Loading material request...</p>;
  }

  return (
    <>
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

      {/* MATERIAL REQUEST */}
      <MaterialRequestSummary
        projectId={projectId}
        mrList={mrList}
      />
    </>
  );
}
