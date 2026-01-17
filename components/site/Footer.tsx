export default function Footer() {
  const mapUrl =
    "https://www.google.com/maps/search/?api=1&query=PT+Bhaskara+Buana+Mulya+Bekasi";

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container-bbm py-16">
        <div className="grid gap-12 md:grid-cols-3">

          {/* ================= COMPANY ================= */}
          <div>
            <strong className="text-gray-900">
              PT Bhaskara Buana Mulya
            </strong>

            <p className="mt-4 text-sm leading-relaxed text-gray-700">
              Engineering-driven general contractor based in Bekasi,
              delivering civil, structural, MEP, and interior construction
              services across Jabodetabek, Java, and Indonesia.
            </p>

            {/* LOCAL SEO CONTEXT */}
            <p className="mt-4 text-xs text-gray-500 max-w-sm">
              Trusted general contractor for industrial plants, warehouses,
              commercial buildings, and infrastructure projects with a
              safety-first execution culture.
            </p>
          </div>

          {/* ================= OFFICE ADDRESS ================= */}
          <div>
            <p className="font-medium text-gray-900 mb-3">
              Office Address
            </p>

            <address className="not-italic text-sm leading-relaxed text-gray-700">
              Jl. Raya Kedaung, RT.002/RW.004<br />
              Cimuning, Kec. Mustika Jaya<br />
              Kota Bekasi, Jawa Barat 17155<br />
              Indonesia
            </address>

            {/* GOOGLE MAP LINK (MAP SEO BOOST) */}
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium
                         text-[#2F6F55] hover:underline"
            >
              View location on Google Maps →
            </a>
          </div>

          {/* ================= CONTACT ================= */}
          <div>
            <p className="font-medium text-gray-900 mb-3">
              Contact
            </p>

            <p className="text-sm text-gray-700">
              <span className="block">
                Office Phone:
                <a
                  href="tel:+622138716066"
                  className="block hover:underline"
                >
                  +62 21 3871 6066
                </a>
              </span>

              <span className="block mt-2">
                WhatsApp:
                <a
                  href="https://wa.me/6281297396612"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:underline"
                >
                  +62 812 9739 6612
                </a>
              </span>

              <span className="block mt-3">
                Email:
                <a
                  href="mailto:adm.buanamulya@gmail.com"
                  className="block hover:underline"
                >
                  adm.buanamulya@gmail.com
                </a>
              </span>
            </p>
          </div>

        </div>

        {/* ================= SERVICE AREA (LOCAL SEO SIGNAL) ================= */}
        <div className="mt-12 max-w-3xl">
          <p className="text-xs text-gray-500">
            Service Areas: Bekasi, Cikarang, Jakarta, Bogor, Depok,
            Tangerang, Karawang, Purwakarta, Bandung, Semarang,
            Surabaya, and industrial regions across Indonesia.
          </p>
        </div>

        {/* ================= FOOTNOTE ================= */}
        <p className="mt-10 text-xs text-gray-500">
          © {new Date().getFullYear()} PT Bhaskara Buana Mulya.
          Engineering, Construction & MEP Contractor Indonesia.
        </p>
      </div>
    </footer>
  );
}
