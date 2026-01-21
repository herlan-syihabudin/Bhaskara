export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

/* =====================
   GOOGLE AUTH
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
   CONSTANTS
===================== */
const SHEET_ID = process.env.GS_SHEET_ID!;

// MASTER_KARYAWAN!A:G
// A karyawan_id | B nama | C role | D type | E rate | F status | G tanggal_masuk (optional)
const RANGE_KARYAWAN = "MASTER_KARYAWAN!A:G";

// ABSENSI!A:I
// B tanggal (1) | C karyawan_id (2) | G project_id (6)
const RANGE_ABSENSI = "ABSENSI!A:I";

// KASBON!A:J
// 0 kasbon_id
// 1 karyawan_id
// 2 tanggal
// 3 total_kasbon
// 4 sisa_kasbon
// 5 potong_per_payroll
// 6 keterangan
// 7 status (BELUM_DIPOTONG | DIPOTONG)
// 8 payroll_id
// 9 created_at
const RANGE_KASBON = "KASBON!A:J";

// PAYROLL!A:T (20 kolom)
// 0  payroll_id
// 1  periode
// 2  tanggal
// 3  project_id
// 4  karyawan_id
// 5  nama
// 6  role
// 7  type
// 8  qty_hari
// 9  rate
// 10 gaji_bruto
// 11 lembur_jam
// 12 lembur_rate
// 13 lembur_total
// 14 potongan_kasbon
// 15 potongan_lain
// 16 total
// 17 status (DRAFT / UNPAID / PAID)
// 18 payment_date
// 19 payment_method
const RANGE_PAYROLL = "PAYROLL!A:T";

/* =====================
   TIME HELPERS (WIB)
===================== */
function todayISO_WIB() {
  const d = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );
  return d.toISOString().slice(0, 10);
}

/* =====================
   GENERIC HELPERS
===================== */
function inRange(date: string, start: string, end: string) {
  // aman untuk yyyy-mm-dd (string compare)
  return date >= start && date <= end;
}

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

function upper(v: any) {
  return String(v || "").trim().toUpperCase();
}

/* =====================
   POST /api/payroll/generate
   body:
   {
     startDate: "2026-01-01",
     endDate: "2026-01-15",
     periode?: "2026-01-01 s/d 2026-01-15",
     project_id?: "PRJ-001"
   }
===================== */
export async function POST(req: Request) {
  try {
    const { startDate, endDate, periode, project_id } = await req.json();

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate & endDate wajib" },
        { status: 400 }
      );
    }

    const sheets = await getSheets();

    /* =====================
       LOAD DATA (PARALLEL)
    ===================== */
    const [karyawanRes, absensiRes, kasbonRes, payrollRes] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: RANGE_KARYAWAN,
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: RANGE_ABSENSI,
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: RANGE_KASBON,
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: RANGE_PAYROLL,
      }),
    ]);

    const [, ...karyawanRows] = karyawanRes.data.values ?? [];
    const [, ...absensiRows] = absensiRes.data.values ?? [];
    const [, ...kasbonRows] = kasbonRes.data.values ?? [];
    const [, ...payrollExistingRows] = payrollRes.data.values ?? [];

    /* =====================
       EXISTING PAYROLL IDS (ANTI DOUBLE)
    ===================== */
    const existingPayrollIds = new Set<string>();
    for (const r of payrollExistingRows) {
      const pid = r?.[0];
      if (pid) existingPayrollIds.add(String(pid));
    }

    /* =====================
       NORMALIZE MASTER KARYAWAN
    ===================== */
    const karyawan = karyawanRows
      .map((r) => ({
        karyawan_id: String(r[0] || "").trim(),
        nama: String(r[1] || "").trim(),
        role: String(r[2] || "").trim(),
        type: upper(r[3]), // HARIAN / TETAP / KONTRAK / BULANAN (legacy)
        rate: Number(r[4] || 0),
        status: upper(r[5]), // AKTIF / NONAKTIF / RESIGN
      }))
      .filter((k) => k.karyawan_id && k.status === "AKTIF");

    /* =====================
       NORMALIZE ABSENSI (FILTER RANGE + PROJECT)
    ===================== */
    const absensi = absensiRows
      .map((r) => ({
        tanggal: String(r[1] || "").trim(), // B
        karyawan_id: String(r[2] || "").trim(), // C
        project_id: String(r[6] || "").trim(), // G
      }))
      .filter((a) => {
        if (!a.karyawan_id || !a.tanggal) return false;
        if (!inRange(a.tanggal, startDate, endDate)) return false;
        if (project_id && a.project_id !== project_id) return false;
        return true;
      });

    /* =====================
       HITUNG HADIR PER KARYAWAN
    ===================== */
    const hadirMap = new Map<string, number>();
    for (const a of absensi) {
      hadirMap.set(a.karyawan_id, (hadirMap.get(a.karyawan_id) || 0) + 1);
    }

    /* =====================
       NORMALIZE KASBON (MODE CICILAN BARU)
       Hanya ambil:
       - status = BELUM_DIPOTONG
       - sisa_kasbon > 0
       - tanggal <= endDate (kasbon lama masih boleh ikut)
    ===================== */
    type KasbonRow = {
      kasbon_id: string;
      karyawan_id: string;
      tanggal: string;
      total_kasbon: number;
      sisa_kasbon: number;
      potong_per_payroll: number;
      keterangan: string;
      status: string;
      payroll_id: string;
      created_at: string;
      rowIndex: number; // index di kasbonRows (0-based, tanpa header)
    };

    const kasbonRaw: KasbonRow[] = kasbonRows
      .map((r, idx) => ({
        kasbon_id: String(r[0] || "").trim(),
        karyawan_id: String(r[1] || "").trim(),
        tanggal: String(r[2] || "").trim(),
        total_kasbon: Number(r[3] || 0),
        sisa_kasbon: Number(r[4] || 0),
        potong_per_payroll: Number(r[5] || 0),
        keterangan: String(r[6] || "").trim(),
        status: upper(r[7]),
        payroll_id: String(r[8] || "").trim(),
        created_at: String(r[9] || "").trim(),
        rowIndex: idx,
      }))
      .filter((k) => {
        if (!k.kasbon_id || !k.karyawan_id) return false;
        if (k.status !== "BELUM_DIPOTONG") return false;
        if (k.sisa_kasbon <= 0) return false;
        if (k.tanggal && k.tanggal > endDate) return false;
        return true;
      });

    // Group kasbon per karyawan
    const kasbonByKaryawan = new Map<string, KasbonRow[]>();
    for (const kb of kasbonRaw) {
      const arr = kasbonByKaryawan.get(kb.karyawan_id) || [];
      arr.push(kb);
      kasbonByKaryawan.set(kb.karyawan_id, arr);
    }

    /* =====================
       BUILD PAYROLL ROWS
    ===================== */
    const tanggal = todayISO_WIB();
    const periodeText = String(periode || `${startDate} s/d ${endDate}`);

    const valuesToAppend: any[][] = [];
    const kasbonUpdateRequests: any[] = [];
    const previewRows: any[] = [];

    let skippedDuplicate = 0;
    let skippedNoWork = 0;

    for (const k of karyawan) {
      const hadir = hadirMap.get(k.karyawan_id) || 0;

      const typeRaw = upper(k.type);
      const isHarian = typeRaw === "HARIAN";
      const isBulananLike =
        typeRaw === "BULANAN" || typeRaw === "TETAP" || typeRaw === "KONTRAK";

      // pekerja harian tanpa absensi -> skip
      if (isHarian && hadir === 0) {
        skippedNoWork++;
        continue;
      }

      const qty_hari = hadir;
      const rate = Number(k.rate || 0);
      const gaji_bruto = isHarian ? hadir * rate : rate;

      const kasbonList = kasbonByKaryawan.get(k.karyawan_id) || [];

      let potongan_kasbon = 0;
      const kasbonUpdatesForEmp: {
        rowIndex: number;
        newSisa: number;
        newStatus: string;
        potong_per_payroll: number;
        keterangan: string;
      }[] = [];

      // hitung potongan kasbon per periode
      for (const item of kasbonList) {
        const amountThisPeriod =
          item.potong_per_payroll > 0
            ? Math.min(item.potong_per_payroll, item.sisa_kasbon)
            : item.sisa_kasbon;

        if (amountThisPeriod <= 0) continue;

        potongan_kasbon += amountThisPeriod;

        const newSisa = item.sisa_kasbon - amountThisPeriod;
        const newStatus = newSisa <= 0 ? "DIPOTONG" : "BELUM_DIPOTONG";

        kasbonUpdatesForEmp.push({
          rowIndex: item.rowIndex,
          newSisa,
          newStatus,
          potong_per_payroll: item.potong_per_payroll,
          keterangan: item.keterangan,
        });
      }

      const lembur_jam = 0;
      const lembur_rate = 0;
      const lembur_total = 0;
      const potongan_lain = 0;
      const total = gaji_bruto + lembur_total - potongan_kasbon - potongan_lain;

      // payroll_id unik: by periode + karyawan + project
      const pid = `PAY-${startDate}-${endDate}-${k.karyawan_id}-${project_id || "ALL"}`;

      if (existingPayrollIds.has(pid)) {
        skippedDuplicate++;
        continue;
      }

      // NORMALIZED TYPE (buat simpan di sheet)
      const typeFinal =
        typeRaw === "BULANAN" ? "TETAP" : typeRaw || "UNKNOWN";

      // append ke PAYROLL sheet
      valuesToAppend.push([
        pid,                 // 0 payroll_id
        periodeText,         // 1 periode
        tanggal,             // 2 tanggal (generate)
        project_id || "",    // 3 project_id
        k.karyawan_id,       // 4 karyawan_id
        k.nama,              // 5 nama
        k.role,              // 6 role
        typeFinal,           // 7 type
        qty_hari,            // 8 qty_hari
        rate,                // 9 rate
        gaji_bruto,          // 10 gaji_bruto
        lembur_jam,          // 11 lembur_jam
        lembur_rate,         // 12 lembur_rate
        lembur_total,        // 13 lembur_total
        potongan_kasbon,     // 14 potongan_kasbon
        potongan_lain,       // 15 potongan_lain
        total,               // 16 total
        "DRAFT",             // 17 status (bisa diganti ke UNPAID kalau mau)
        "",                  // 18 payment_date
        "",                  // 19 payment_method
      ]);

      // simpan untuk UI preview
      previewRows.push({
        payroll_id: pid,
        karyawan_id: k.karyawan_id,
        nama: k.nama,
        role: k.role,
        type: typeFinal,
        qty_hari,
        rate,
        gaji_bruto,
        potongan_kasbon,
        potongan_lain,
        total,
      });

      // siapkan update kasbon (E:I)
      for (const upd of kasbonUpdatesForEmp) {
        const rowNumber = upd.rowIndex + 2; // +1 header, +1 1-based index

        kasbonUpdateRequests.push({
          range: `KASBON!E${rowNumber}:I${rowNumber}`,
          values: [[
            upd.newSisa,                       // sisa_kasbon
            upd.potong_per_payroll || "",      // potong_per_payroll
            upd.keterangan || "",              // keterangan
            upd.newStatus,                     // status
            pid,                               // payroll_id
          ]],
        });
      }
    }

    // kalau nggak ada payroll baru
    if (valuesToAppend.length === 0) {
      return NextResponse.json(
        {
          success: true,
          periode: periodeText,
          inserted: 0,
          total_karyawan: 0,
          rows: [],
          kasbon_updated: 0,
          skippedDuplicate,
          skippedNoWork,
          message:
            "Tidak ada payroll baru (semua sudah pernah digenerate / pekerja harian tanpa absensi).",
        },
        { status: 200 }
      );
    }

    /* =====================
       SAVE PAYROLL
    ===================== */
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE_PAYROLL,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: valuesToAppend },
    });

    /* =====================
       UPDATE KASBON (BATCH)
    ===================== */
    if (kasbonUpdateRequests.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          valueInputOption: "USER_ENTERED",
          data: kasbonUpdateRequests,
        },
      });
    }

    return NextResponse.json({
      success: true,
      periode: periodeText,
      inserted: valuesToAppend.length,
      total_karyawan: previewRows.length,
      rows: previewRows,
      kasbon_updated: kasbonUpdateRequests.length,
      skippedDuplicate,
      skippedNoWork,
    });
  } catch (e) {
    console.error("PAYROLL GENERATE ERROR:", e);
    return NextResponse.json(
      { error: "Gagal generate payroll" },
      { status: 500 }
    );
  }
}
