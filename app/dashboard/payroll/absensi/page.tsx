"use client"

import { useEffect, useState, useRef } from "react"

type Mode = "MASUK" | "KELUAR" | "IZIN" | "SAKIT" | "CUTI" | "ALFA"

type Karyawan = {
  karyawan_id: string
  nama: string
  role: string
  type: string
  status_kerja: string
}

/* =====================
   DEVICE ID (ANTI TITIP)
===================== */
function getDeviceId() {
  if (typeof window === "undefined") return ""
  const key = "bbm_device_id"
  let id = localStorage.getItem(key)
  if (!id) {
    id = window.crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

export default function AbsensiPage() {
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([])
  const [karyawan, setKaryawan] = useState<Karyawan | null>(null)

  const [pin, setPin] = useState("")
  const [qrToken, setQrToken] = useState("")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  const [selfieBase64, setSelfieBase64] = useState("")
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  /* =====================
     LOAD MASTER DATA
  ===================== */
  useEffect(() => {
    fetch("/api/karyawan")
      .then((r) => r.json())
      .then((data) => {
        const aktif = (data || []).filter(
          (k: any) => String(k.status_kerja || "").toUpperCase() === "AKTIF"
        )
        setKaryawanList(aktif)
      })
  }, [])

  /* =====================
     AUTO GPS
  ===================== */
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setError("Izin GPS ditolak. Aktifkan lokasi.")
    )
  }, [])

  /* =====================
     CAMERA
  ===================== */
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraOpen(true)
        setError("")
      }
    } catch {
      setError("Gagal akses kamera. Periksa izin browser.")
    }
  }

  function takePhoto() {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current

    canvas.width = 400
    canvas.height = (video.videoHeight / video.videoWidth) * 400

    const ctx = canvas.getContext("2d")!
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const dataUrl = canvas.toDataURL("image/jpeg", 0.7) // compress 70%
    setSelfiePreview(dataUrl)
    setSelfieBase64(dataUrl.split(",")[1])

    const stream = video.srcObject as MediaStream
    stream.getTracks().forEach((t) => t.stop())
    setIsCameraOpen(false)
  }

  /* =====================
     ABSEN
  ===================== */
  async function absen(mode: Mode) {
    if (!karyawan || !pin || !qrToken || !location || !selfieBase64) {
      setError("Lengkapi PIN, QR, GPS, dan Foto")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          karyawan_id: karyawan.karyawan_id,
          pin,
          device_id: getDeviceId(),
          qr_token: qrToken,
          lat: location.lat,
          lng: location.lng,
          selfie_b64: selfieBase64,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Gagal absensi")
      } else {
        setMessage("✅ Absensi berhasil")
      }
    } catch {
      setError("❌ Gagal koneksi")
    } finally {
      setLoading(false)
    }
  }

  const gpsOk = Boolean(location)
  const photoOk = Boolean(selfieBase64)

  /* =====================
     UI
  ===================== */
  return (
    <section className="container-bbm py-10 max-w-xl space-y-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-slate-800">
          Presensi Proyek BBM
        </h1>
        <p className="text-sm text-slate-500">
          Pastikan GPS & Kamera aktif
        </p>
      </header>

      <div className="card p-6 shadow-xl border-t-4 border-blue-600 space-y-5">

        {/* STATUS BAR */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-2 rounded text-xs font-bold text-center ${gpsOk ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {gpsOk ? "📍 GPS TERKUNCI" : "📍 GPS OFF"}
          </div>
          <div className={`p-2 rounded text-xs font-bold text-center ${photoOk ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {photoOk ? "📸 FOTO SIAP" : "📸 BELUM FOTO"}
          </div>
        </div>

        {/* INPUT */}
        <select
          className="form-input"
          value={karyawan?.karyawan_id || ""}
          onChange={(e) => {
            const found = karyawanList.find(
              (k) => k.karyawan_id === e.target.value
            )
            setKaryawan(found || null)
          }}
        >
          <option value="">-- pilih karyawan --</option>
          {karyawanList.map((k) => (
            <option key={k.karyawan_id} value={k.karyawan_id}>
              {k.nama}
            </option>
          ))}
        </select>

        <input
          type="password"
          placeholder="PIN"
          className="form-input text-center tracking-widest"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <input
          type="text"
          placeholder="Scan / Tempel QR Token"
          className="form-input bg-slate-50"
          value={qrToken}
          onChange={(e) => setQrToken(e.target.value)}
        />

        {/* CAMERA SECTION */}
        {!selfiePreview && !isCameraOpen && (
          <button
            className="btn-outline w-full py-4 border-dashed"
            onClick={startCamera}
          >
            🤳 Mulai Verifikasi Wajah
          </button>
        )}

        {isCameraOpen && (
          <div className="relative overflow-hidden rounded-lg bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full scale-x-[-1]"
            />
            <button
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black p-4 rounded-full shadow-lg"
              onClick={takePhoto}
            >
              📸 TANGKAP
            </button>
          </div>
        )}

        {selfiePreview && !isCameraOpen && (
          <div className="relative">
            <img
              src={selfiePreview}
              className="w-full rounded-lg border-2 border-blue-500 shadow-md"
              alt="Preview"
            />
            <button
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded text-xs"
              onClick={() => {
                setSelfiePreview(null)
                setSelfieBase64("")
                startCamera()
              }}
            >
              Ulangi
            </button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* SUBMIT */}
        <div className="pt-4 border-t flex gap-3">
          <button
            onClick={() => absen("MASUK")}
            className="btn-primary flex-1 h-14 text-lg font-bold"
            disabled={loading || !photoOk || !gpsOk}
          >
            {loading ? "PROSES..." : "MASUK"}
          </button>

          <button
            onClick={() => absen("KELUAR")}
            className="btn-outline flex-1 h-14 text-lg font-bold"
            disabled={loading || !photoOk || !gpsOk}
          >
            PULANG
          </button>
        </div>

        {(message || error) && (
          <div className={`p-3 text-sm rounded ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {error || message}
          </div>
        )}
      </div>
    </section>
  )
}
