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
   GET LIST KARYAWAN
===================== */
export async function GET() {
  try {
    const sheets = await getSheets();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GS_SHEET_ID!,
      range: "MASTER_KARYAWAN!A:G",
    });

    const [, ...rows] = res.data.values ?? [];

    const data = rows.map((r) => ({
      karyawan_id: r[0],
      nama: r[1],
      role: r[2],
      type: r[3], // HARIAN / BULANAN
      rate: Number(r[4] || 0),
      status: (r[5] || "").toUpperCase(), // AKTIF / NONAKTIF
      catatan: r[6] || "",
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET KARYAWAN ERROR:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data karyawan" },
      { status: 500 }
    );
  }
}

/* =====================
   ADD KARYAWAN
===================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sheets = await getSheets();

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GS_SHEET_ID!,
      range: "MASTER_KARYAWAN!A:G",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            `KRY-${Date.now()}`, // karyawan_id
            body.nama,
            body.role,
            body.type,
            Number(body.rate),
            body.status,
            body.catatan || "",
          ],
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ADD KARYAWAN ERROR:", err);
    return NextResponse.json(
      { error: "Gagal menambah karyawan" },
      { status: 500 }
    );
  }
}
