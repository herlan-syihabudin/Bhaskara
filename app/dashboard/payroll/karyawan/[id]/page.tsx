import Link from "next/link";

/* =====================
   DATA FETCHER
===================== */
async function getKaryawan(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/karyawan?id=${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Karyawan tidak ditemukan");
  return res.json();
}

async function getAbsensi(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/absensi?karyawan_id=${id}`,
    { cache: "no-store" }
  );

  return res.ok ? res.json() : [];
}

/* =====================
   HELPERS
===================== */
function labelType(type: string) {
  if (type === "HARIAN") return "Pekerja Harian";
  if (type === "TETAP") return "Karyawan Tetap";
  if (type === "KONTRAK") return "Karyawan Kontrak";
  return type;
}

function labelGaji(type: string, rate: number) {
  const r = `Rp ${rate.toLocaleString("id-ID")}`;
  if (type === "HARIAN") return `${r} / hari`;
  return `${r} / bulan`;
}

/* =====================
   PAGE
===================== */
export default async function DetailKaryawanPage({
  params,
}: {
  params: { id: string };
}) {
  const karyawan = await getKaryawan(params.id);
  const absensi = await getAbsensi(params.id);

  /**
   * LOGIKA HADIR (AMAN SEMENTARA)
   * - Hadir = ada jam_masuk
   * - Izin / Sakit / Alpha bisa dikembangkan nanti via kolom status_absen
   */
  const totalHadir = absensi.filter(
    (a: any) => a.jam_masuk && a.jam_masuk !== ""
  ).length;

  async function handleResign() {
    "use server";
    // ini cuma fallback visual, eksekusi real via client button
  }

  return (
    <section className="container-bbm py-12 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <p className="badge">HR & PAYROLL</p>
          <h1>{karyawan.nama}</h1>
          <p className="text-body">
            {karyawan.role} • {labelType(karyawan.type)}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/dashboard/payroll/karyawan/edit/${karyawan.karyawan_id}`}
            className="btn-outline"
          >
            Edit
          </Link>

          <ResignButton karyawan={karyawan} />
        </div>
      </div>

      {/* PROFIL */}
      <div className="card grid md:grid-cols-4 gap-6">
        <Info label="Status Kerja" value={karyawan.status_kerja} />
        <Info
          label="Tanggal Masuk"
          value={karyawan.tanggal_masuk || "-"}
        />
        <Info
          label="Gaji"
          value={labelGaji(karyawan.type, Number(karyawan.rate))}
        />
        <Info label="Total Hadir" value={`${totalHadir} hari`} />
      </div>

      {/* ABSENSI */}
      <div className="card">
        <h3 className="font-semibold mb-4">Absensi Terakhir</h3>

        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left py-2">Tanggal</th>
              <th className="text-center">Masuk</th>
              <th className="text-center">Pulang</th>
              <th className="text-left">Project</th>
            </tr>
          </thead>

          <tbody>
            {absensi.slice(0, 5).map((a: any) => (
              <tr key={a.absensi_id} className="border-b last:border-none">
                <td className="py-2">{a.tanggal}</td>
                <td className="text-center">{a.jam_masuk || "-"}</td>
                <td className="text-center">{a.jam_keluar || "-"}</td>
                <td>{a.project_id || "-"}</td>
              </tr>
            ))}

            {absensi.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                  Belum ada absensi
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4">
          <Link
            href={`/dashboard/payroll/absensi?karyawan_id=${karyawan.karyawan_id}`}
            className="text-blue-600 text-sm hover:underline"
          >
            Lihat semua absensi →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* =====================
   CLIENT COMPONENT
===================== */
function ResignButton({ karyawan }: { karyawan: any }) {
  async function onResign() {
    if (!confirm("Yakin set karyawan menjadi RESIGN?")) return;

    await fetch("/api/karyawan", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...karyawan,
        status_kerja: "RESIGN",
      }),
    });

    location.reload();
  }

  return (
    <button onClick={onResign} className="btn-danger">
      Set Resign
    </button>
  );
}

/* =====================
   COMPONENT
===================== */
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
