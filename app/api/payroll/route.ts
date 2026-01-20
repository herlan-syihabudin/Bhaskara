import { NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

/* =====================
   GOOGLE SHEETS AUTH
===================== */
async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GS_CLIENT_EMAIL!,
      private_key: process.env.GS_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

/* =====================
   CONFIG
===================== */
const SHEET_ID = process.env.GS_SHEET_ID!;

// penting: MASTER_KARYAWAN kamu A:H (id,nama,role,type,rate,status,tgl_masuk,catatan)
const RANGE_KARYAWAN = "MASTER_KARYAWAN!A:H";
const RANGE_ABSENSI = "ABSENSI!A:I";
const RANGE_PAYROLL = "PAYROLL!A:T";

/* =====================
   HELPERS
===================== */
function normalizeType(v: string) {
  const t = (v || "").toUpperCase().trim();
  if (t === "BULANAN") return "TETAP"; // legacy support
  if (t === "HARIAN" || t === "TETAP" || t === "KONTRAK") return t;
  return "HARIAN";
}

function normalizeStatus(v: string) {
  const s = (v || "").toUpperCase().trim();
  if (s === "AKTIF" || s === "NONAKTIF" || s === "RESIGN") return s;
  return "AKTIF";
}

// parse yyyy-mm-dd -> Date UTC (biar ga geser timezone)
function parseDateYMD(str: string): Date | null {
  if (!str) return null;
  const m = String(str).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return isNaN(dt.getTime()) ? null : dt;
}

function isBetweenYMD(dateStr: string, startStr: string, endStr: string): boolean {
  const d = parseDateYMD(dateStr);
  const s = parseDateYMD(startStr);
  const e = parseDateYMD(endStr);
  if (!d || !s || !e) return false;
  return d.getTime() >= s.getTime() && d.getTime() <= e.getTime();
}

function makePayrollId(startDate: string, endDate: string, karyawan_id: string, projectId?: string) {
  // projectId opsional biar payroll tukang per proyek tidak tabrakan
  const p = (projectId || "").trim();
  return p ? `PAY-${startDate}-${endDate}-${p}-${karyawan_id}` : `PAY-${startDate}-${endDate}-${karyawan_id}`;
}

function toNumber(v: any) {
  const n = Number(String(v ?? "").toString().replace(/[^\d.-]/g, ""));
  return isNaN(n) ? 0 : n;
}

/* =====================
   GET /api/payroll
   ?periode=...
   ?project_id=...
   ?karyawan_id=...
===================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const periode = searchParams.get("periode");
    const projectId = searchParams.get("project_id");
    const karyawanId = searchParams.get("karyawan_id");

    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_PAYROLL,
    });

    const values = res.data.values ?? [];
    const [, ...rows] = values; // skip header

    let data = rows.map((r) => ({
      payroll_id: r[0] ?? "",
      periode: r[1] ?? "",
      tanggal: r[2] ?? "",
      project_id: r[3] ?? "",
      karyawan_id: r[4] ?? "",
      nama: r[5] ?? "",
      role: r[6] ?? "",
      type: r[7] ?? "",
      qty_hari: toNumber(r[8]),
      rate: toNumber(r[9]),
      gaji_bruto: toNumber(r[10]),
      lembur_jam: toNumber(r[11]),
      lembur_rate: toNumber(r[12]),
      lembur_total: toNumber(r[13]),
      potongan_kasbon: toNumber(r[14]),
      potongan_lain: toNumber(r[15]),
      total: toNumber(r[16]),
      status: r[17] ?? "",
      payment_date: r[18] ?? "",
      payment_method: r[19] ?? "",
    }));

    if (periode) data = data.filter((x) => x.periode === periode);
    if (projectId) data = data.filter((x) => x.project_id === projectId);
    if (karyawanId) data = data.filter((x) => x.karyawan_id === karyawanId);

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET PAYROLL ERROR:", err);
    return NextResponse.json({ error: "Gagal mengambil data payroll" }, { status: 500 });
  }
}

/* =====================
   POST /api/payroll
   Generate payroll dari ABSENSI + MASTER_KARYAWAN

   Body:
   {
     "periode": "2026-01-01 s.d 2026-01-15",
     "start_date": "2026-01-01",
     "end_date": "2026-01-15",
     "project_id": "PRJ-001" // optional (biasanya buat tukang)
   }

   Rules:
   - HARIAN: qty_hari = jumlah absensi dalam range (opsional filter project)
   - TETAP/KONTRAK: 1 row per orang (flat rate) tanpa butuh absensi
   - status default DRAFT
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const periode: string = body.periode;
    const startDate: string = body.start_date;
    const endDate: string = body.end_date;
    const projectId: string = (body.project_id || "").trim();

    if (!periode || !startDate || !endDate) {
      return NextResponse.json(
        { error: "periode, start_date, dan end_date wajib diisi" },
        { status: 400 }
      );
    }

    // validasi format tanggal supaya ga silent fail
    if (!parseDateYMD(startDate) || !parseDateYMD(endDate)) {
      return NextResponse.json(
        { error: "Format tanggal harus yyyy-mm-dd" },
        { status: 400 }
      );
    }

    const sheets = await getSheets();

    /* ===== 0. Ambil payroll existing (anti double generate) ===== */
    const ex = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_PAYROLL,
    });
    const existing = new Set<string>();
    const exRows = ex.data.values ?? [];
    for (let i = 1; i < exRows.length; i++) {
      const pid = exRows[i]?.[0];
      if (pid) existing.add(String(pid));
    }

    /* ===== 1. MASTER KARYAWAN (AKTIF) ===== */
    const mk = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_KARYAWAN,
    });
    const [, ...kRows] = mk.data.values ?? [];

    type Karyawan = {
      karyawan_id: string;
      nama: string;
      role: string;
      type: "HARIAN" | "TETAP" | "KONTRAK";
      rate: number;
      status_kerja: "AKTIF" | "NONAKTIF" | "RESIGN";
    };

    const karyawanMap = new Map<string, Karyawan>();

    for (const r of kRows) {
      const karyawan_id = r[0] || "";
      const nama = r[1] || "";
      const role = r[2] || "";
      const type = normalizeType(r[3]) as Karyawan["type"];
      const rate = toNumber(r[4]);
      const status_kerja = normalizeStatus(r[5]) as Karyawan["status_kerja"];

      if (!karyawan_id || status_kerja !== "AKTIF") continue;

      karyawanMap.set(karyawan_id, {
        karyawan_id,
        nama,
        role,
        type,
        rate,
        status_kerja,
      });
    }

    /* ===== 2. ABSENSI DALAM RANGE (untuk HARIAN saja) ===== */
    const ab = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_ABSENSI,
    });
    const [, ...aRows] = ab.data.values ?? [];

    type AbsensiRow = {
      tanggal: string;     // B
      karyawan_id: string; // C
      project_id: string;  // G
    };

    const absensiFiltered: AbsensiRow[] = aRows
      .map((r) => ({
        tanggal: r[1] || "",
        karyawan_id: r[2] || "",
        project_id: r[6] || "",
      }))
      .filter((row) => {
        if (!row.karyawan_id || !row.tanggal) return false;
        if (!isBetweenYMD(row.tanggal, startDate, endDate)) return false;
        if (projectId && row.project_id !== projectId) return false;
        return true;
      });

    const qtyHarianMap = new Map<string, number>();
    for (const row of absensiFiltered) {
      const k = karyawanMap.get(row.karyawan_id);
      if (!k || k.type !== "HARIAN") continue;
      qtyHarianMap.set(row.karyawan_id, (qtyHarianMap.get(row.karyawan_id) || 0) + 1);
    }

    /* ===== 3. BENTUK ROW PAYROLL ===== */
    const valuesToAppend: any[][] = [];
    const tanggalProses = endDate;

    for (const k of karyawanMap.values()) {
      // qty hari
      let qtyHari: number | "" = "";

      if (k.type === "HARIAN") {
        const qty = qtyHarianMap.get(k.karyawan_id) || 0;
        if (qty === 0) continue; // tukang tidak kerja di periode ini
        qtyHari = qty;
      } else {
        // TETAP / KONTRAK: tetap dibuat row, qty_hari kosong
        qtyHari = "";
      }

      const rate = k.rate;

      const gaji_bruto =
        k.type === "HARIAN"
          ? Number(qtyHari || 0) * rate
          : rate;

      const lembur_jam = 0;
      const lembur_rate = 0;
      const lembur_total = 0;
      const potongan_kasbon = 0;
      const potongan_lain = 0;

      const total = gaji_bruto + lembur_total - potongan_kasbon - potongan_lain;

      const payroll_id = makePayrollId(startDate, endDate, k.karyawan_id, projectId || "");

      // anti double generate
      if (existing.has(payroll_id)) continue;

      valuesToAppend.push([
        payroll_id,        // A payroll_id
        periode,           // B periode
        tanggalProses,     // C tanggal proses
        projectId || "",   // D project_id
        k.karyawan_id,     // E karyawan_id
        k.nama,            // F nama
        k.role,            // G role
        k.type,            // H type (HARIAN/TETAP/KONTRAK)
        qtyHari,           // I qty_hari
        rate,              // J rate
        gaji_bruto,        // K gaji_bruto
        lembur_jam,        // L lembur_jam
        lembur_rate,       // M lembur_rate
        lembur_total,      // N lembur_total
        potongan_kasbon,   // O potongan_kasbon
        potongan_lain,     // P potongan_lain
        total,             // Q total
        "DRAFT",           // R status
        "",                // S payment_date
        "",                // T payment_method
      ]);
    }

    if (valuesToAppend.length === 0) {
      return NextResponse.json({
        success: true,
        created: 0,
        message: "Tidak ada payroll baru (mungkin sudah pernah di-generate / tidak ada absensi harian pada periode tsb)",
      });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE_PAYROLL,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: valuesToAppend },
    });

    return NextResponse.json({
      success: true,
      created: valuesToAppend.length,
    });
  } catch (err) {
    console.error("POST PAYROLL ERROR:", err);
    return NextResponse.json({ error: "Gagal generate payroll" }, { status: 500 });
  }
}
