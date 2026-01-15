export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container-bbm py-16">
        <div className="max-w-2xl">
          {/* COMPANY */}
          <strong className="text-gray-900">
            PT Bhaskara Buana Mulya
          </strong>

          <p className="mt-4 text-sm leading-relaxed">
            Engineering-driven general contractor delivering civil,
            structural, MEP, and interior solutions with a strong
            commitment to safety, quality, and disciplined execution.
          </p>

          {/* ➕ LEGITIMACY CONTEXT (TAMBAHAN HALUS) */}
          <p className="mt-4 text-xs text-gray-500 max-w-xl">
            Serving industrial, commercial, and infrastructure projects
            through structured engineering, site supervision, and
            accountable project delivery.
          </p>

          {/* FOOTNOTE */}
          <p className="mt-10 text-xs text-gray-500">
            © {new Date().getFullYear()} PT Bhaskara Buana Mulya.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
