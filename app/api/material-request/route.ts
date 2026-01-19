import { NextResponse } from "next/server";
import { sheets, SHEET_ID } from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      project_id,
      project_name,
      material,
      qty,
      unit,
      requester,
      note,
    } = body;

    const req_id = `MR-${Date.now()}`;
    const created_at = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "MATERIAL_REQUEST!A:L",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          req_id,
          project_id,
          project_name,
          material,
          qty,
          unit,
          "",          // harga (purchasing)
          "",          // total
          "SUBMITTED", // status
          requester,
          note,
          created_at,
        ]],
      },
    });

    return NextResponse.json({ success: true, req_id });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Failed submit material request" },
      { status: 500 }
    );
  }
}
