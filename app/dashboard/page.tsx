export default async function DashboardHomePage() {
  const projects = await getProjectSummary();

  const totalProyek = projects.length;

  const totalKontrak = projects.reduce(
    (sum: number, p: any) => sum + (Number(p.nilaiKontrak) || 0),
    0
  );

  const totalBiaya = projects.reduce(
    (sum: number, p: any) => sum + (Number(p.biayaReal) || 0),
    0
  );

  const totalSisa = projects.reduce(
    (sum: number, p: any) => sum + (Number(p.sisaBudget) || 0),
    0
  );

  const status =
    projects.some((p: any) => p.statusBudget === "BAHAYA")
      ? "BAHAYA"
      : projects.some((p: any) => p.statusBudget === "WARNING")
      ? "WARNING"
      : "AMAN";

  return (
    <section className="space-y-10">
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCard title="Total Proyek" value={totalProyek} type="text" />
        <KpiCard title="Total Kontrak" value={totalKontrak} />
        <KpiCard title="Total Biaya" value={totalBiaya} />
        <KpiCard title="Total Sisa" value={totalSisa} />
        <KpiCard title="Status" type="status" statusValue={status} />
      </div>

      <ProjectTable projects={projects} />
    </section>
  );
}
