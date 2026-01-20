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

const SHEET_ID = process.env.GS_SHEET_ID!;

// RANGE
const RANGE_KARYAWAN = "MASTER_KARYAWAN!A:G";
const RANGE_ABSENSI = "ABSENSI!A:I";
const RANGE_PAYROLL = "PAYROLL!A:T";

/* =====================
   HELPERS
===================== */
function parseDate(str: string): Date | null {
  if (!str) return null;
  // asumsi format: yyyy-mm-dd
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function isBetween(dateStr: string, startStr: string, endStr: string): boolean {
  const d = parseDate(dateStr);
  const s = parseDate(startStr);
  const e = parseDate(endStr);
  if (!d || !s || !e) return false;
  return d >= s && d <= e;
}

/* =====================
   GET /api/payroll
   Query opsional:
   - ?periode=2026-01
   - ?project_id=PRJ-001
   - ?karyawan_id=KRY-001
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
      qty_hari: Number(r[8] || 0),
      rate: Number(r[9] || 0),
      gaji_bruto: Number(r[10] || 0),
      lembur_jam: Number(r[11] || 0),
      lembur_rate: Number(r[12] || 0),
      lembur_total: Number(r[13] || 0),
      potongan_kasbon: Number(r[14] || 0),
      potongan_lain: Number(r[15] || 0),
      total: Number(r[16] || 0),
      status: r[17] ?? "",
      payment_date: r[18] ?? "",
      payment_method: r[19] ?? "",
    }));

    if (periode) {
      data = data.filter((x) => x.periode === periode);
    }
    if (projectId) {
      data = data.filter((x) => x.project_id === projectId);
    }
    if (karyawanId) {
      data = data.filter((x) => x.karyawan_id === karyawanId);
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET PAYROLL ERROR:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data payroll" },
      { status: 500 }
    );
  }
}

/* =====================
   POST /api/payroll
   Generate payroll dari ABSENSI + MASTER_KARYAWAN

   Body contoh (tukang 2 mingguan):
   {
     "periode": "2026-01-01 s.d 2026-01-15",
     "start_date": "2026-01-01",
     "end_date": "2026-01-15",
     "project_id": "PRJ-001"
   }

   Catatan:
   - TUKANG HARIAN: dibayar per qty_hari dalam range tanggal
   - STAFF BULANAN: dibayar full rate_default (1x per bulan, biasanya
     kamu panggil API ini saat akhir bulan / tanggal gajian)
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const periode: string = body.periode;
    const startDate: string = body.start_date;
    const endDate: string = body.end_date;
    const projectId: string | undefined = body.project_id || "";

    if (!periode || !startDate || !endDate) {
      return NextResponse.json(
        { error: "periode, start_date, dan end_date wajib diisi" },
        { status: 400 }
      );
    }

    const sheets = await getSheets();

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
      type: "HARIAN" | "BULANAN";
      rate: number;
      status: string;
    };

    const karyawanMap = new Map<string, Karyawan>();

    for (const r of kRows) {
      const karyawan_id = r[0] || "";
      const nama = r[1] || "";
      const role = r[2] || "";
      const typeRaw = (r[3] || "").toString().toUpperCase(); // Harian/Bulanan
      const rate = Number(r[4] || 0);
      const status = (r[5] || "").toString().toUpperCase(); // Aktif/Nonaktif

      if (!karyawan_id || status !== "AKTIF") continue;

      const type: "HARIAN" | "BULANAN" =
        typeRaw === "HARIAN" ? "HARIAN" : "BULANAN";

      karyawanMap.set(karyawan_id, {
        karyawan_id,
        nama,
        role,
        type,
        rate,
        status,
      });
    }

    /* ===== 2. ABSENSI DALAM RANGE ===== */
    const ab = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE_ABSENSI,
    });
    const [, ...aRows] = ab.data.values ?? [];

    type Absensi = {
      tanggal: string;
      karyawan_id: string;
      project_id: string;
    };

    const absensiFiltered: Absensi[] = aRows
      .map((r) => ({
        tanggal: r[1] || "",
        karyawan_id: r[2] || "",
        project_id: r[6] || "",
      }))
      .filter((row) => {
        if (!row.karyawan_id || !row.tanggal) return false;
        if (!isBetween(row.tanggal, startDate, endDate)) return false;
        if (projectId && row.project_id !== projectId) return false;
        return true;
      });

    // Hitung qty_hari untuk karyawan HARIAN
    const qtyHarianMap = new Map<string, number>();
    for (const row of absensiFiltered) {
      const k = karyawanMap.get(row.karyawan_id);
      if (!k || k.type !== "HARIAN") continue;

      const current = qtyHarianMap.get(row.karyawan_id) || 0;
      qtyHarianMap.set(row.karyawan_id, current + 1);
    }

    /* ===== 3. BENTUK ROW PAYROLL ===== */

    const valuesToAppend: any[][] = [];
    const tanggalProses = endDate; // tanggal payroll = akhir periode

    for (const [karyawan_id, k] of karyawanMap.entries()) {
      let qtyHari: number | "" = "";
      if (k.type === "HARIAN") {
        const qty = qtyHarianMap.get(karyawan_id) || 0;
        if (qty === 0) {
          // tukang tidak kerja di periode ini → lewati
          continue;
        }
        qtyHari = qty;
      }

      const rate = k.rate;
      const gaji_bruto =
        k.type === "HARIAN"
          ? Number(qtyHari || 0) * rate
          : rate; // staf bulanan = flat

      // sementara lembur & potongan manual (0 dulu)
      const lembur_jam = 0;
      const lembur_rate = 0;
      const lembur_total = 0;
      const potongan_kasbon = 0;
      const potongan_lain = 0;

      const total =
        gaji_bruto + lembur_total - potongan_kasbon - potongan_lain;

      const payroll_id = `PAY-${startDate}-${karyawan_id}`;

      valuesToAppend.push([
        payroll_id,        // A payroll_id
        periode,           // B periode (teks bebas)
        tanggalProses,     // C tanggal proses
        projectId || "",   // D project_id
        karyawan_id,       // E karyawan_id
        k.nama,            // F nama
        k.role,            // G role
        k.type,            // H type (HARIAN/BULANAN)
        qtyHari,           // I qty_hari (khusus harian)
        rate,              // J rate
        gaji_bruto,        // K gaji_bruto
        lembur_jam,        // L lembur_jam
        lembur_rate,       // M lembur_rate
        lembur_total,      // N lembur_total
        potongan_kasbon,   // O potongan_kasbon
        potongan_lain,     // P potongan_lain
        total,             // Q total
        "DRAFT",           // R status (DRAFT / DIBAYAR)
        "",                // S payment_date
        "",                // T payment_method
      ]);
    }

    if (valuesToAppend.length === 0) {
      return NextResponse.json({
        success: true,
        created: 0,
        message: "Tidak ada karyawan yang memiliki absensi pada periode ini",
      });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE_PAYROLL,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: valuesToAppend,
      },
    });

    return NextResponse.json({
      success: true,
      created: valuesToAppend.length,
    });
  } catch (err) {
    console.error("POST PAYROLL ERROR:", err);
    return NextResponse.json(
      { error: "Gagal generate payroll" },
      { status: 500 }
    );
  }
}
