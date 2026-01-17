const clients = [
  "PT Jipindo Oil Indonesia",
  "PT Nippon Oil Indonesia",
  "PT Asahi Synthetic Chemical",
  "PT Pacinesia Chemical Industry",
  "PT Indolakto Indonesia",
  "PT Sari Takaful Produk",
  "PT Greenlam Metal Stamping Indonesia",
  "PT Multi Karya Gemilang Utama",
  "PT Honda Motorcycle & Engine Manufacturing",
  "PT Panasonic Industrial Devices",
  "PT Suzuki Indomobil Motor",
  "PT Modena Energy",
  "PT Karya Bangun Mandiri Persada",
  "PT Trouw Nutrition Indonesia",
  // dst (lanjut semua dari PDF lu)
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
