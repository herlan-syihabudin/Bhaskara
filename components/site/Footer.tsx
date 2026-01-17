export default function Footer() {
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
              Engineering-driven general contractor delivering civil,
              structural, MEP, and interior solutions with a strong
              commitment to safety, quality, and disciplined execution.
            </p>

            {/* LEGITIMACY CONTEXT */}
            <p className="mt-4 text-xs text-gray-500 max-w-sm">
              Serving industrial, commercial, and infrastructure projects
              through structured engineering, site supervision, and
              accountable project delivery.
            </p>
          </div>

          {/* ================= OFFICE ADDRESS ================= */}
          <div>
            <p className="font-medium text-gray-900 mb-3">
              Office Address
            </p>

            <p className="text-sm leading-relaxed text-gray-700">
              Jl. Raya Kedaung, RT.002/RW.004<br />
              Cimuning, Kec. Mustika Jaya<br />
              Kota Bekasi, Jawa Barat 17155
            </p>
          </div>

          {/* ================= CONTACT ================= */}
<div>
  <p className="font-medium text-gray-900 mb-3">
    Contact
  </p>

  <p className="text-sm text-gray-700">
    <span className="block">
      Office:
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

        {/* ================= FOOTNOTE ================= */}
        <p className="mt-12 text-xs text-gray-500">
          © {new Date().getFullYear()} PT Bhaskara Buana Mulya.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
