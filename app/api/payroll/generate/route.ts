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
   HELPERS
===================== */
function inRange(date: string, start: string, end: string) {
  return date >= start && date <= end;
}

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

/* =====================
   POST GENERATE PAYROLL
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
       LOAD DATA
    ===================== */
    const [karyawanRes, absensiRes, kasbonRes] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: RANGE_KARYAWAN }),
      sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: RANGE_ABSENSI }),
      sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: RANGE_KASBON }),
    ]);

    const [, ...karyawanRows] = karyawanRes.data.values ?? [];
    const [, ...absensiRows] = absensiRes.data.values ?? [];
    const [, ...kasbonRows] = kasbonRes.data.values ?? [];

    /* =====================
       NORMALIZE DATA
    ===================== */
    const karyawan = karyawanRows.map(r => ({
      karyawan_id: r[0],
      nama: r[1],
      role: r[2],
      type: r[3], // HARIAN / BULANAN
      rate: Number(r[4] || 0),
      status: r[5],
    })).filter(k => k.status === "Aktif" || k.status === "AKTIF");

    const absensi = absensiRows.map(r => ({
      tanggal: r[1],
      karyawan_id: r[2],
      project_id: r[6],
    })).filter(a =>
      inRange(a.tanggal, startDate, endDate) &&
      (!project_id || a.project_id === project_id)
    );

    const kasbon = kasbonRows.map(r => ({
      karyawan_id: r[1],
      jumlah: Number(r[3] || 0),
      status: r[5], // BELUM_DIPOTONG / DIPOTONG
    })).filter(k => k.status === "BELUM_DIPOTONG");

    /* =====================
       GENERATE PAYROLL
    ===================== */
    const tanggal = new Date().toISOString().slice(0, 10);
    const periodeText = periode || `${startDate} s/d ${endDate}`;

    const payrollRows = karyawan.map(k => {
      const hadir = absensi.filter(a => a.karyawan_id === k.karyawan_id).length;

      // LOGIKA INTI
      let gaji_pokok = 0;
      let qty_hari = 0;

      if (k.type === "HARIAN") {
        qty_hari = hadir;
        gaji_pokok = hadir * k.rate;
      } else {
        qty_hari = hadir;
        gaji_pokok = k.rate;
      }

      const kasbonKaryawan = kasbon
        .filter(x => x.karyawan_id === k.karyawan_id)
        .map(x => x.jumlah);

      const totalKasbon = sum(kasbonKaryawan);
      const total = gaji_pokok - totalKasbon;

      return [
        `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        tanggal,
        periodeText,
        project_id || "",
        k.karyawan_id,
        k.nama,
        k.role,
        k.type,
        qty_hari,
        k.rate,
        0,           // lembur_jam
        0,           // lembur
        totalKasbon, // potongan (kasbon)
        total,
        "UNPAID",
        "",
        "",
      ];
    });

    if (payrollRows.length === 0) {
      return NextResponse.json({ error: "Tidak ada payroll tergenerate" }, { status: 400 });
    }

    /* =====================
       SAVE PAYROLL
    ===================== */
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE_PAYROLL,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: payrollRows },
    });

    return NextResponse.json({
      success: true,
      periode: periodeText,
      total_karyawan: payrollRows.length,
    });
  } catch (e) {
    console.error("PAYROLL GENERATE ERROR:", e);
    return NextResponse.json(
      { error: "Gagal generate payroll" },
      { status: 500 }
    );
  }
}
