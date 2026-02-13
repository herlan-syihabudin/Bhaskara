export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { google } from "googleapis"
import crypto from "crypto"

/* =====================
   CONFIG
===================== */
const SHEET_ID = process.env.GS_SHEET_ID!

// Sheet names (sesuaikan kalau beda persis)
const SHEET_ABSENSI = "ABSENSI"
const SHEET_KARYAWAN = "MASTER_KARYAWAN"
const SHEET_PROYEK = "Master proyek"

// Ranges (ambil lebar biar fleksibel)
const RANGE_ABSENSI = `${SHEET_ABSENSI}!A:U`
const RANGE_KARYAWAN = `${SHEET_KARYAWAN}!A:K` // tambah pin_hash, device_id, device_bound_at
const RANGE_PROYEK = `${SHEET_PROYEK}!A:H` // tambah lat,lng,radius_m

// Rule
const QR_SECRET = process.env.ATTENDANCE_QR_SECRET || ""
const QR_REQUIRED = true
const DEVICE_LOCK = String(process.env.ATTENDANCE_DEVICE_LOCK || "true") === "true"
const DEFAULT_RADIUS = Number(process.env.ATTENDANCE_MAX_RADIUS_DEFAULT || 120)

// Jam kerja (WIB)
const MASUK_START = "06:00:00"
const MASUK_END = "09:00:00"
const KELUAR_START = "16:00:00"
const KELUAR_END = "20:00:00"

/* =====================
   GOOGLE AUTH
===================== */
async function getAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GS_CLIENT_EMAIL!,
      private_key: process.env.GS_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file", // untuk upload selfie
    ],
  })
  return auth
}

async function getSheets() {
  const auth = await getAuth()
  return google.sheets({ version: "v4", auth })
}

async function getDrive() {
  const auth = await getAuth()
  return google.drive({ version: "v3", auth })
}

/* =====================
   TIME (WIB)
===================== */
function nowWIB() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }))
}

function todayISO() {
  return nowWIB().toISOString().slice(0, 10)
}

function nowTime() {
  return nowWIB().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  })
}

function inWindow(t: string, start: string, end: string) {
  return t >= start && t <= end
}

function masukStatus(jam: string) {
  if (jam <= "08:00:00") return jam
  if (jam <= "08:30:00") return `TELAT_RINGAN_${jam}`
  return `TELAT_BERAT_${jam}`
}

/* =====================
   HELPERS: HEADER MAP
===================== */
function headerMap(headerRow: string[]) {
  const map: Record<string, number> = {}
  headerRow.forEach((h, i) => {
    const key = String(h || "").trim().toLowerCase()
    if (key) map[key] = i
  })
  return map
}

/* =====================
   CRYPTO
===================== */
function sha256(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex")
}

function sign(payload: string) {
  if (!QR_SECRET) throw new Error("ATTENDANCE_QR_SECRET belum di set")
  return crypto.createHmac("sha256", QR_SECRET).update(payload).digest("hex")
}

function verifyQrToken(token: string) {
  const [b64, sig] = String(token || "").split(".")
  if (!b64 || !sig) throw new Error("QR token format invalid")

  const payload = Buffer.from(b64, "base64url").toString("utf8")
  const expected = sign(payload)
  if (expected !== sig) throw new Error("QR token signature invalid")

  const obj = JSON.parse(payload) as { project_id: string; exp: number; nonce: string }
  const now = Math.floor(Date.now() / 1000)
  if (now > obj.exp) throw new Error("QR expired (scan ulang)")
  if (!obj.project_id) throw new Error("QR project_id kosong")
  if (!obj.nonce) throw new Error("QR nonce kosong")
  return obj
}

/* =====================
   GEO
===================== */
function distanceM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c * 1000
}

/* =====================
   READ MASTER KARYAWAN
   Expect columns:
   karyawan_id, nama, role, type/tipe, ..., status_kerja, ..., pin_hash, device_id, device_bound_at
===================== */
async function getKaryawanById(karyawan_id: string) {
  const sheets = await getSheets()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE_KARYAWAN,
  })

  const rows = res.data.values ?? []
  if (rows.length < 2) return null

  const head = headerMap(rows[0] as string[])
  const dataRows = rows.slice(1)

  const idxId = head["karyawan_id"] ?? 0
  const rowIndex0 = dataRows.findIndex(r => String(r[idxId] || "") === karyawan_id)
  if (rowIndex0 === -1) return null

  const row = dataRows[rowIndex0]

  const get = (key: string, fallbackIndex?: number) => {
    const i = head[key]
    if (typeof i === "number") return row[i]
    if (typeof fallbackIndex === "number") return row[fallbackIndex]
    return ""
  }

  // kompatibel sama header lu: role/type/status_kerja
  const status = String(get("status_kerja", 5) || "").trim().toUpperCase()
  const tipe = String(get("type", 3) || get("tipe", 3) || "").trim()

  return {
    // rowNumber di sheet (1-based) untuk update device
    rowNumber: rowIndex0 + 2, // + header, +1
    karyawan_id: String(get("karyawan_id", 0) || ""),
    nama: String(get("nama", 1) || ""),
    role: String(get("role", 2) || ""),
    tipe,
    status,
    pin_hash: String(get("pin_hash", 8) || "").trim(),
    device_id: String(get("device_id", 9) || "").trim(),
  }
}

async function bindDevice(karyawanRowNumber: number, device_id: string) {
  const sheets = await getSheets()

  // cari kolom device_id + device_bound_at dari header
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_KARYAWAN}!A1:K1`,
  })
  const header = (res.data.values?.[0] || []) as string[]
  const head = headerMap(header)

  const colDevice = (head["device_id"] ?? 9) + 1 // to A1 index
  const colBound = (head["device_bound_at"] ?? 10) + 1

  const boundAt = nowWIB().toISOString()

  // update 2 kolom
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_KARYAWAN}!${colToA1(colDevice)}${karyawanRowNumber}:${colToA1(colBound)}${karyawanRowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[device_id, boundAt]] },
  })
}

function colToA1(col: number) {
  // 1->A
  let s = ""
  let n = col
  while (n > 0) {
    const m = (n - 1) % 26
    s = String.fromCharCode(65 + m) + s
    n = Math.floor((n - 1) / 26)
  }
  return s
}

/* =====================
   READ MASTER PROYEK (GEOFENCE)
   Need columns: project_id, status, lat, lng, radius_m
===================== */
async function getProyekFence(project_id: string) {
  const sheets = await getSheets()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE_PROYEK,
  })

  const rows = res.data.values ?? []
  if (rows.length < 2) throw new Error("Master proyek kosong")

  const head = headerMap(rows[0] as string[])
  const dataRows = rows.slice(1)

  const idxId = head["project_id"] ?? 0
  const row = dataRows.find(r => String(r[idxId] || "").trim() === project_id)
  if (!row) throw new Error("Proyek tidak ditemukan")

  const status = String(row[head["status"] ?? 4] || "").trim().toUpperCase()
  if (status !== "RUNNING") throw new Error("Proyek tidak RUNNING")

  const lat = Number(row[head["lat"] ?? 5])
  const lng = Number(row[head["lng"] ?? 6])
  const radius_m = Number(row[head["radius_m"] ?? 7] || DEFAULT_RADIUS)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Master proyek belum ada lat/lng")
  }

  return { lat, lng, radius_m }
}

/* =====================
   SELFIE UPLOAD (Google Drive)
===================== */
async function uploadSelfieToDrive(selfie_b64: string, filename: string) {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
  if (!folderId) throw new Error("GOOGLE_DRIVE_FOLDER_ID belum di set")

  const drive = await getDrive()

  // decode base64 -> buffer
  const buffer = Buffer.from(selfie_b64, "base64")

  const fileRes = await drive.files.create({
    requestBody: {
      name: filename,
      parents: [folderId],
      mimeType: "image/jpeg",
    },
    media: {
      mimeType: "image/jpeg",
      body: bufferToStream(buffer),
    },
    fields: "id, webViewLink, webContentLink",
  })

  const id = fileRes.data.id
  if (!id) throw new Error("Upload selfie gagal")

  // set permission public view (opsional; kalau mau private, skip ini)
  await drive.permissions.create({
    fileId: id,
    requestBody: { role: "reader", type: "anyone" },
  })

  const meta = await drive.files.get({ fileId: id, fields: "webViewLink" })
  return meta.data.webViewLink || ""
}

function bufferToStream(buffer: Buffer) {
  const { Readable } = require("stream")
  const stream = new Readable()
  stream.push(buffer)
  stream.push(null)
  return stream
}

/* =====================
   ATTENDANCE READ HELPERS
===================== */
async function getAbsensiRows() {
  const sheets = await getSheets()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE_ABSENSI,
  })
  const rows = res.data.values ?? []
  return rows
}

function findAnyRecord(rows: any[][], date: string, karyawan_id: string) {
  // rows[0] = header
  const head = headerMap((rows[0] || []) as string[])
  const idxDate = head["tanggal"] ?? head["date"] ?? 1
  const idxKid = head["karyawan_id"] ?? 2
  return rows.findIndex((r, i) => i > 0 && String(r[idxDate] || "") === date && String(r[idxKid] || "") === karyawan_id)
}

function hasMode(rows: any[][], date: string, karyawan_id: string, mode: string) {
  const head = headerMap((rows[0] || []) as string[])
  const idxDate = head["tanggal"] ?? head["date"] ?? 1
  const idxKid = head["karyawan_id"] ?? 2
  const idxMode = head["mode"] ?? 10 // K (0-based 10)
  return rows.some((r, i) =>
    i > 0 &&
    String(r[idxDate] || "") === date &&
    String(r[idxKid] || "") === karyawan_id &&
    String(r[idxMode] || "").toUpperCase() === mode
  )
}

/* =====================
   POST ABSENSI (FULL)
   Expected body:
   {
     karyawan_id,
     mode,
     // project_id optional, akan diambil dari QR (recommended)
     project_id?,
     pin? or pin_hash,
     device_id,
     qr_token,
     lat,
     lng,
     selfie_b64
   }
===================== */
export async function POST(req: Request) {
  const timestampServer = nowWIB().toISOString()
  const ip = req.headers.get("x-forwarded-for") || ""
  const user_agent = req.headers.get("user-agent") || ""

  // helper buat reject yang tetap tercatat (optional)
  const reject = async (msg: string) => {
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  try {
    const body = await req.json()
    const {
      karyawan_id,
      mode,
      project_id: project_id_from_body,
      pin,
      pin_hash: pin_hash_from_body,
      device_id,
      qr_token,
      lat,
      lng,
      selfie_b64,
    } = body || {}

    if (!karyawan_id || !mode) return reject("Data absensi tidak lengkap")
    if (!device_id) return reject("device_id wajib (anti titip)")

    const MODE = String(mode).toUpperCase()
    if (!["MASUK", "KELUAR", "IZIN", "SAKIT", "CUTI", "ALFA"].includes(MODE)) {
      return reject("Mode tidak valid")
    }

    // ===== QR verify (wajib) =====
    let project_id = String(project_id_from_body || "")
    let qr_nonce = ""

    if (QR_REQUIRED) {
      if (!qr_token) return reject("QR token wajib (scan QR proyek)")
      const qr = verifyQrToken(String(qr_token))
      project_id = qr.project_id
      qr_nonce = qr.nonce
    } else {
      if (!project_id) return reject("project_id wajib")
    }

    // ===== GPS wajib =====
    const LAT = Number(lat)
    const LNG = Number(lng)
    if (!Number.isFinite(LAT) || !Number.isFinite(LNG)) {
      return reject("GPS wajib (lat/lng tidak valid)")
    }

    // ===== selfie wajib =====
    if (!selfie_b64) return reject("Selfie wajib")

    // ===== master karyawan =====
    const karyawan = await getKaryawanById(String(karyawan_id))
    if (!karyawan || karyawan.status !== "AKTIF") {
      return NextResponse.json({ error: "Karyawan tidak terdaftar / nonaktif" }, { status: 403 })
    }

    // ===== PIN validate =====
    const pin_hash = String(pin_hash_from_body || (pin ? sha256(String(pin)) : "")).trim()
    if (!pin_hash) return reject("PIN / pin_hash wajib")

    if (!karyawan.pin_hash) {
      return reject("pin_hash karyawan belum diisi di MASTER_KARYAWAN")
    }
    if (karyawan.pin_hash !== pin_hash) {
      return NextResponse.json({ error: "PIN salah" }, { status: 401 })
    }

    // ===== device lock =====
    if (DEVICE_LOCK) {
      if (!karyawan.device_id) {
        // bind device pertama kali
        await bindDevice(karyawan.rowNumber, String(device_id))
      } else if (karyawan.device_id !== String(device_id)) {
        return NextResponse.json({ error: "Device berbeda. Hubungi admin untuk reset device." }, { status: 403 })
      }
    }

    // ===== geofence proyek =====
    const fence = await getProyekFence(project_id)
    const dist = distanceM(LAT, LNG, fence.lat, fence.lng)
    if (dist > fence.radius_m) {
      return NextResponse.json(
        { error: `Di luar area proyek (${Math.round(dist)}m > ${fence.radius_m}m)` },
        { status: 400 }
      )
    }

    // ===== rule jam kerja =====
    const waktu = nowTime()
    if (MODE === "MASUK" && !inWindow(waktu, MASUK_START, MASUK_END)) {
      return NextResponse.json({ error: `Absen MASUK hanya ${MASUK_START}–${MASUK_END}` }, { status: 400 })
    }
    if (MODE === "KELUAR" && !inWindow(waktu, KELUAR_START, KELUAR_END)) {
      return NextResponse.json({ error: `Absen KELUAR hanya ${KELUAR_START}–${KELUAR_END}` }, { status: 400 })
    }

    const tanggal = todayISO()
    const rows = await getAbsensiRows()

    // ===== anti double =====
    if (MODE === "MASUK") {
      if (hasMode(rows, tanggal, karyawan.karyawan_id, "MASUK")) {
        return NextResponse.json({ error: "Sudah absen MASUK hari ini" }, { status: 400 })
      }
    }

    if (MODE === "KELUAR") {
      if (!hasMode(rows, tanggal, karyawan.karyawan_id, "MASUK")) {
        return NextResponse.json({ error: "Belum absen MASUK" }, { status: 400 })
      }
      if (hasMode(rows, tanggal, karyawan.karyawan_id, "KELUAR")) {
        return NextResponse.json({ error: "Sudah absen KELUAR hari ini" }, { status: 400 })
      }
    }

    if (["IZIN", "SAKIT", "CUTI", "ALFA"].includes(MODE)) {
      const any = findAnyRecord(rows, tanggal, karyawan.karyawan_id)
      if (any !== -1) {
        return NextResponse.json({ error: "Absensi sudah ada hari ini" }, { status: 400 })
      }
    }

    // ===== upload selfie =====
    const filename = `ATT_${tanggal}_${karyawan.karyawan_id}_${MODE}_${qr_nonce || Date.now()}.jpg`
    const selfie_url = await uploadSelfieToDrive(String(selfie_b64), filename)

    // ===== build row (A:U) =====
    const absensi_id = `ABS-${Date.now()}`
    const jamMasuk = MODE === "MASUK" ? masukStatus(waktu) : ""
    const jamKeluar = MODE === "KELUAR" ? waktu : ""

    // status VALID (kalau lolos semua validasi)
    const status = "VALID"
    const reject_reason = ""

    const values = [[
      absensi_id,          // A absensi_id
      tanggal,             // B tanggal
      karyawan.karyawan_id,// C karyawan_id
      karyawan.nama,       // D nama
      karyawan.role,       // E role
      karyawan.tipe,       // F tipe
      project_id,          // G project_id
      jamMasuk,            // H jam_masuk
      jamKeluar,           // I jam_keluar
      timestampServer,     // J timestamp_server
      MODE,                // K mode
      LAT,                 // L lat
      LNG,                 // M lng
      Math.round(dist),    // N distance_m
      String(device_id),   // O device_id
      qr_nonce,            // P qr_nonce
      selfie_url,          // Q selfie_url
      ip,                  // R ip
      user_agent,          // S user_agent
      status,              // T status
      reject_reason,       // U reject_reason
    ]]

    const sheets = await getSheets()
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE_ABSENSI,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    })

    return NextResponse.json({
      success: true,
      mode: MODE,
      project_id,
      distance_m: Math.round(dist),
      selfie_url,
    })
  } catch (e: any) {
    console.error("ABSENSI FULL ERROR", e)
    return NextResponse.json(
      { error: e?.message || "Gagal proses absensi" },
      { status: 500 }
    )
  }
}
