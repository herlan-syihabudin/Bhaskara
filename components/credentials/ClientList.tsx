export const clients = [
  "PT JX Nippon Oil Indonesia",
  "PT Agel Langgeng",
  "PT Haldin Pacific Indonesia",
  "PT Hanes Supply Chain Indonesia",
  "PT Precision Tools Service Indonesia",
  "PT Meiwa Kogyo Indonesia",
  "PT Uyemura Indonesia",
  "PT Asahi Synchrotech Indonesia",
  "PT Prima Gerbang Persada",
  "PT Mega Detos Utama",
  "PT Surya Pekalongan",
  "PT Indolakto Indonesia",
  "PT Trouw Nutrition Indonesia",
  "PT Fuji Precision Tool Indonesia",
  "PT Mada Wirti Tunggal",
  "PT Amcor Flexibles Indonesia",
  "PT Menarini Indria Laboratories",
  "PT Aptiv Components Indonesia",
  "PT Sari Takagi Elok Produk",
  "PT Greenland Metal Stamping Indonesia",
  "PT Sinarmas Land",
  "PT Toa Coating Indonesia",

  "PT Pacinesia Chemical Industry",
  "PT Bima Bisaloy",
  "PT Summarecon Agung Tbk",
  "PT H-One Kogi Prima Auto Technologies Indonesia",
  "PT Mory Industries Indonesia",
  "PT Karya Bangun Mandiri Persada",
  "PT Monaco Residence",
  "PT Catur Sentosa",
  "PT Gunze Socks Indonesia",
  "PT Dai Saburi Indonesia",
  "PT Multi Karya Gemilang Utama",
  "PT Shinto Kogyo Indonesia",
  "PT Bagus Jaya Sukses",
  "PT Kino Indonesia",
  "PT KNT 21",
  "RI 1 Indonesia",
  "Universitas Negeri Jakarta",
  "PT Modena Energy",
  "PT Kawasaki Motor Indonesia",
  "PT Natura Aromatik Nusantara",
];

export default function ClientList() {
  return (
    <section className="bg-white border-t border-gray-200">
      <div className="container-bbm py-28">

        {/* ================= HEADER ================= */}
        <div className="max-w-3xl">
          <span className="badge">CLIENT PORTFOLIO</span>

          <h1 className="mt-4">
            Selected Client Engagements
          </h1>

          <p className="mt-5 text-gray-600">
            Below is a selection of organizations we have supported across
            industrial and commercial sectors in Indonesia.
          </p>

          {/* Trust anchor (HALUS tapi KUAT) */}
          <p className="mt-3 text-sm text-gray-500">
            Including multinational manufacturers, publicly listed companies,
            and government institutions.
          </p>
        </div>

        {/* ================= CLIENT GRID ================= */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {clients.map((c) => (
            <div
              key={c}
              className="
                group bg-white border border-gray-200 rounded-xl
                px-6 py-4 text-sm text-gray-700
                transition-all duration-200
                hover:border-[color:var(--bbm-green)]
                hover:shadow-sm hover:-translate-y-0.5
              "
            >
              <div className="flex items-center gap-3">
                {/* Accent dot */}
                <span
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "#F4C430" }}
                />
                <span className="font-medium text-gray-800">
                  {c}
                </span>
              </div>
            </div>
          ))}

        </div>

        {/* ================= FOOTNOTE ================= */}
        <div className="mt-16 max-w-3xl border-t border-gray-200 pt-8">
          <p className="text-xs text-gray-500 leading-relaxed">
            Client information is presented for reference purposes only.
            Project scopes, documentation, and site references are subject
            to confidentiality and may be disclosed during formal tender,
            pre-qualification, or contractual discussions.
          </p>
        </div>

      </div>
    </section>
  );
}
