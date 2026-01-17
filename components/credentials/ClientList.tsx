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
  "RI 1 Indonesia,
  "Universitas Negeri Jakarta",
  "PT Modena Energy",
  "PT Kawasaki Motor Indonesia,
  "PT Natura Aromatik Nusantara
];

export default function ClientList() {
  return (
    <section className="bg-white border-t border-gray-200">
      <div className="container-bbm py-24">

        <div className="max-w-3xl">
          <span className="badge">CLIENT PORTFOLIO</span>
          <h1 className="mt-4">
            Selected Client Engagements
          </h1>
          <p className="mt-5 text-gray-600">
            Below is a selection of organizations we have supported across
            industrial and commercial sectors in Indonesia.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <div
              key={c}
              className="card p-5 text-sm text-gray-700"
            >
              {c}
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-gray-500 max-w-3xl">
          Client information is presented for reference purposes only.
          Project scope details are subject to confidentiality and
          may be disclosed during formal tender or contractual discussions.
        </p>

      </div>
    </section>
  );
}
