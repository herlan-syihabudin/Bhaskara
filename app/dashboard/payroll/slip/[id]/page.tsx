import Link from "next/link";

/* =====================
   FETCH PAYROLL BY ID
===================== */
async function getPayroll(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) throw new Error("BASE URL not set");

  const res = await fetch(`${baseUrl}/api/payroll?id=${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Slip gaji tidak ditemukan");
  }

  return res.json();
}

/* =====================
   PAGE
===================== */
export default async function SlipGajiPage({
  params,
}: {
  params: { id: string };
}) {
  const p = await getPayroll(params.id);

  return (
    <section className="container-bbm py-12 max-w-3xl space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">
            Slip Gaji
          </p>
          <h1 className="text-2xl font-semibold mt-1">
            {p.nama}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Periode {p.periode}
          </p>
        </div>

        <Link
          href="/dashboard/payroll"
          className="btn-outline"
        >
          ← Kembali
        </Link>
      </div>

      {/* INFO PERUSAHAAN */}
      <div className="card p-6 space-y-1">
        <p className="font-semibold">
          PT Bhaskara Buana Mulya
        </p>
        <p className="text-sm text-gray-500">
          Slip Gaji Karyawan
        </p>
      </div>

      {/* DATA KARYAWAN */}
      <div className="card grid grid-cols-2 gap-6 p-6">
        <Info label="Nama" value={p.nama} />
        <Info label="Jabatan" value={p.role} />
        <Info label="Status Kerja" value={p.type} />
        <Info label="Project" value={p.project_id || "-"} />
        <Info label="Tanggal Proses" value={p.tanggal} />
        <Info
          label="Status Pembayaran"
          value={p.status}
          highlight
        />
      </div>

      {/* RINCIAN GAJI */}
      <div className="card p-6 space-y-4">
        <h3 className="font-semibold">Rincian Gaji</h3>

        <Row label="Hari Kerja" value={`${p.qty_hari || 0} hari`} />
        <Row
          label="Gaji Pokok"
          value={`Rp ${Number(p.gaji_bruto || p.rate || 0).toLocaleString("id-ID")}`}
        />

        <Row
          label="Lembur"
          value={`Rp ${Number(p.lembur_total || 0).toLocaleString("id-ID")}`}
        />

        <Row
          label="Potongan Kasbon"
          value={`Rp ${Number(p.potongan_kasbon || 0).toLocaleString("id-ID")}`}
          danger
        />

        <hr />

        <Row
          label="Total Diterima"
          value={`Rp ${Number(p.total || 0).toLocaleString("id-ID")}`}
          bold
        />
      </div>

      {/* FOOTER */}
      <div className="text-sm text-gray-500 text-center pt-4">
        Slip gaji ini dihasilkan otomatis oleh sistem ERP Bhaskara.
      </div>
    </section>
  );
}

/* =====================
   COMPONENTS
===================== */
function Info({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`font-semibold ${
          highlight ? "text-green-700" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  danger,
}: {
  label: string;
  value: string;
  bold?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-600">
        {label}
      </span>
      <span
        className={`text-sm ${
          bold ? "font-semibold text-black" : ""
        } ${danger ? "text-red-600" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
