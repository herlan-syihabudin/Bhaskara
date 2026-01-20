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

const SHEET_ID = process.env.GS_SHEET_ID!;
const RANGE_KARYAWAN = "MASTER_KARYAWAN!A:G";
const RANGE_ABSENSI = "ABSENSI!A:I";
const RANGE_KASBON = "KASBON!A:H";
const RANGE_PAYROLL = "PAYROLL!A:Q";

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
   HELPERS
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
   POST GENERATE PAYROLL
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
        range: RANGE_PAYROLL, // buat anti dobel payroll_id
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
       MASTER_KARYAWAN!A:G:
       A karyawan_id
       B nama
       C role
       D type (HARIAN/TETAP/KONTRAK/...)
       E rate
       F status (AKTIF/NONAKTIF/RESIGN)
       G tanggal_masuk (optional)
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
       ABSENSI!A:I:
       B tanggal (index 1)
       C karyawan_id (index 2)
       G project_id (index 6)
    ===================== */
    const absensi = absensiRows
      .map((r) => ({
        tanggal: String(r[1] || "").trim(),
        karyawan_id: String(r[2] || "").trim(),
        project_id: String(r[6] || "").trim(),
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
       NORMALIZE KASBON (BELUM_DIPOTONG) <= endDate
       KASBON!A:H:
       A kasbon_id (0)
       B karyawan_id (1)
       C tanggal (2)
       D jumlah (3)
       F status (5)
    ===================== */
    const kasbon = kasbonRows
      .map((r) => ({
        kasbon_id: String(r[0] || "").trim(),
        karyawan_id: String(r[1] || "").trim(),
        tanggal: String(r[2] || "").trim(),
        jumlah: Number(r[3] || 0),
        status: upper(r[5]),
      }))
      .filter((k) => {
        if (!k.kasbon_id || !k.karyawan_id) return false;
        if (k.status !== "BELUM_DIPOTONG") return false;
        // kasbon lama yang belum kepotong -> ikut dipotong di periode ini (selama <= endDate)
        if (k.tanggal && k.tanggal > endDate) return false;
        return true;
      });

    /* =====================
       BUILD PAYROLL ROWS
       PAYROLL!A:Q (17 kolom) sesuai format lama kamu:

       0  payroll_id
       1  tanggal (WIB)
       2  periodeText
       3  project_id
       4  karyawan_id
       5  nama
       6  role
       7  type
       8  qty_hari
       9  rate
       10 lembur_jam (0)
       11 lembur (0)
       12 potongan_kasbon
       13 total
       14 status (UNPAID)
       15 payment_date
       16 payment_method
    ===================== */
    const tanggal = todayISO_WIB();
    const periodeText = String(periode || `${startDate} s/d ${endDate}`);

    const valuesToAppend: any[][] = [];
    const kasbonUpdateRequests: any[] = []; // batchUpdate to KASBON F:G

    // helper map kasbon per karyawan
    const kasbonByKaryawan = new Map<string, { kasbon_id: string; jumlah: number }[]>();
    for (const kb of kasbon) {
      const arr = kasbonByKaryawan.get(kb.karyawan_id) || [];
      arr.push({ kasbon_id: kb.kasbon_id, jumlah: kb.jumlah });
      kasbonByKaryawan.set(kb.karyawan_id, arr);
    }

    let skippedDuplicate = 0;
    let skippedNoWork = 0;

    for (const k of karyawan) {
      const hadir = hadirMap.get(k.karyawan_id) || 0;

      const type = upper(k.type);
      const isHarian = type === "HARIAN";
      // legacy: kalau dulu ada "BULANAN" anggap bulanan/tetap (flat)
      const isBulananLike = type === "BULANAN" || type === "TETAP" || type === "KONTRAK";

      // aturan: pekerja harian kalau 0 hadir -> skip biar tidak bikin payroll kosong
      if (isHarian && hadir === 0) {
        skippedNoWork++;
        continue;
      }

      const qty_hari = hadir; // tetap simpan hadir utk bulanan-like biar ada data monitoring
      const rate = Number(k.rate || 0);

      const gaji_pokok = isHarian ? hadir * rate : rate; // bulanan-like flat

      const kasbonList = kasbonByKaryawan.get(k.karyawan_id) || [];
      const totalKasbon = sum(kasbonList.map((x) => x.jumlah));

      const lembur_jam = 0;
      const lembur = 0;

      const total = gaji_pokok + lembur - totalKasbon;

      // payroll_id konsisten (anti dobel) -> period + emp + project
      const pid = `PAY-${startDate}-${endDate}-${k.karyawan_id}-${project_id || "ALL"}`;

      // anti dobel
      if (existingPayrollIds.has(pid)) {
        skippedDuplicate++;
        continue;
      }

      valuesToAppend.push([
        pid,
        tanggal,
        periodeText,
        project_id || "",
        k.karyawan_id,
        k.nama,
        k.role,
        // type distandarkan: kalau legacy BULANAN, simpan sebagai TETAP biar rapi
        type === "BULANAN" ? "TETAP" : type || "",
        qty_hari,
        rate,
        lembur_jam,
        lembur,
        totalKasbon,
        total,
        "UNPAID",
        "",
        "",
      ]);

      // update kasbon yang kepotong -> DIPOTONG + payroll_id
      // cari row kasbon di sheet untuk update range F:G (status, payroll_id)
      for (const item of kasbonList) {
        const rowIndex = kasbonRows.findIndex((r) => String(r[0] || "").trim() === item.kasbon_id);
        if (rowIndex === -1) continue;

        // +2 karena kita skip header saat mapping, tapi kasbonRows masih versi rows tanpa header?
        // kasbonRows = rows setelah header? iya: const [, ...kasbonRows]
        // berarti baris sheet asli = rowIndex + 2
        const rowNumber = rowIndex + 2;

        kasbonUpdateRequests.push({
          range: `KASBON!F${rowNumber}:G${rowNumber}`,
          values: [["DIPOTONG", pid]],
        });
      }
    }

    if (valuesToAppend.length === 0) {
      return NextResponse.json(
        {
          success: true,
          inserted: 0,
          skippedDuplicate,
          skippedNoWork,
          message: "Tidak ada payroll baru (semua dobel / pekerja harian tidak ada absensi).",
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
