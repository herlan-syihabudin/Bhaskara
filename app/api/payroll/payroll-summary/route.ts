export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

/* =====================
   GOOGLE SHEETS AUTH
===================== */
async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GS_CLIENT_EMAIL!,
      private_key: process.env.GS_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return google.sheets({ version: "v4", auth });
}

/* =====================
   HELPERS
===================== */
function toNumber(v: any) {
  const n = Number(String(v ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function todayYYYYMM() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function normalizeStatus(raw: string) {
  const s = String(raw || "").trim().toUpperCase();
  if (s === "PAID") return "PAID";
  if (s === "UNPAID") return "UNPAID";
  return s || "UNPAID";
}

/* =====================
   GET /api/payroll-summary
   Query:
   - periode=YYYY-MM (optional, default bulan ini)
   - project_id=PRJ-001 (optional)
===================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const periode = searchParams.get("periode") || todayYYYYMM();
    const projectFilter = searchParams.get("project_id") || "";

    const sheets = await getSheets();
    const SHEET_ID = process.env.GS_SHEET_ID!;

    // Range aman (sesuai kolom final kamu)
    // payroll_id	tanggal	periode	project_id	karyawan_id	nama	role	type	qty_hari	rate	lembur_jam	lembur	potongan	total	status	payment_date	payment_method
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "PAYROLL!A:Q",
    });

    const values = res.data.values ?? [];
    if (values.length <= 1) {
      return NextResponse.json({
        periode,
        project_id: projectFilter || null,
        kpi: { totalKaryawan: 0, hadirBulanIni: 0, totalGaji: 0, belumDibayar: 0 },
        breakdown: { byRole: [], byType: [], byProject: [] },
        rows: [],
      });
    }

    const header = values[0].map((h) => String(h || "").trim());
    const idx = (name: string) => header.findIndex((h) => h === name);

    const iPeriode = idx("periode");
    const iProject = idx("project_id");
    const iKaryawan = idx("karyawan_id");
    const iNama = idx("nama");
    const iRole = idx("role");
    const iType = idx("type");
    const iQtyHari = idx("qty_hari");
    const iTotal = idx("total");
    const iStatus = idx("status");

    const rows = values.slice(1).map((r) => ({
      payroll_id: r[idx("payroll_id")] ?? "",
      tanggal: r[idx("tanggal")] ?? "",
      periode: r[iPeriode] ?? "",
      project_id: r[iProject] ?? "",
      karyawan_id: r[iKaryawan] ?? "",
      nama: r[iNama] ?? "",
      role: r[iRole] ?? "",
      type: r[iType] ?? "",
      qty_hari: toNumber(r[iQtyHari]),
      total: toNumber(r[iTotal]),
      status: normalizeStatus(String(r[iStatus] ?? "")),
    }));

    const filtered = rows.filter((r) => {
      const okPeriode = String(r.periode) === periode;
      const okProject = projectFilter ? String(r.project_id) === projectFilter : true;
      return okPeriode && okProject;
    });

    // KPI
    const uniqKaryawan = new Set<string>();
    let hadirBulanIni = 0;
    let totalGaji = 0;
    let belumDibayar = 0;

    filtered.forEach((r) => {
      if (r.karyawan_id) uniqKaryawan.add(String(r.karyawan_id));
      // hadir: kalau harian qty_hari > 0, kalau bulanan dianggap hadir (qty_hari biasanya 1)
      if (String(r.type).toUpperCase() === "HARIAN") {
        if (r.qty_hari > 0) hadirBulanIni += 1;
      } else {
        hadirBulanIni += 1;
      }

      totalGaji += r.total;
      if (r.status !== "PAID") belumDibayar += r.total;
    });

    // Breakdown helper
    function groupSum(keyFn: (r: any) => string) {
      const map = new Map<string, { key: string; count: number; total: number; unpaid: number }>();
      for (const r of filtered) {
        const key = keyFn(r) || "-";
        const cur = map.get(key) || { key, count: 0, total: 0, unpaid: 0 };
        cur.count += 1;
        cur.total += r.total;
        if (r.status !== "PAID") cur.unpaid += r.total;
        map.set(key, cur);
      }
      return Array.from(map.values()).sort((a, b) => b.total - a.total);
    }

    const byRole = groupSum((r) => String(r.role || "").toUpperCase());
    const byType = groupSum((r) => String(r.type || "").toUpperCase());
    const byProject = groupSum((r) => String(r.project_id || "").toUpperCase());

    return NextResponse.json({
      periode,
      project_id: projectFilter || null,
      kpi: {
        totalKaryawan: uniqKaryawan.size,
        hadirBulanIni,
        totalGaji,
        belumDibayar,
      },
      breakdown: { byRole, byType, byProject },
      rows: filtered, // kalau mau ringan, nanti bisa kita matiin
    });
  } catch (err) {
    console.error("PAYROLL SUMMARY ERROR:", err);
    return NextResponse.json({ error: "Failed load payroll summary" }, { status: 500 });
  }
}
