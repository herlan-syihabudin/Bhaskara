type ProjectSummary = {
  project_id: string;
  project_name: string;
  nilaiKontrak: number;
  biayaReal: number;
  sisaBudget: number;
  statusBudget: "AMAN" | "WARNING" | "BAHAYA";
};

export default function ProjectTable({
  projects,
}: {
  projects: ProjectSummary[];
}) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Daftar Proyek
      </h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-2">Proyek</th>
            <th className="pb-2 text-right">Nilai Kontrak</th>
            <th className="pb-2 text-right">Biaya Real</th>
            <th className="pb-2 text-right">Sisa</th>
            <th className="pb-2 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p) => (
            <tr key={p.project_id} className="border-b last:border-0">
              <td className="py-3 font-medium">
                {p.project_name}
              </td>

              <td className="py-3 text-right">
                Rp {p.nilaiKontrak.toLocaleString("id-ID")}
              </td>

              <td className="py-3 text-right">
                Rp {p.biayaReal.toLocaleString("id-ID")}
              </td>

              <td className="py-3 text-right">
                Rp {p.sisaBudget.toLocaleString("id-ID")}
              </td>

              <td className="py-3 text-center">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    p.statusBudget === "AMAN"
                      ? "bg-green-100 text-green-700"
                      : p.statusBudget === "WARNING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.statusBudget}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
