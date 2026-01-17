import Link from "next/link";

export default function ClientSummary() {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="container-bbm py-24">

        {/* ================= HEADER ================= */}
        <div className="max-w-3xl">
          <span className="badge">CLIENT TRUST</span>

          <h2 className="mt-4">
            Trusted by leading industrial
            <span className="block">and commercial organizations</span>
          </h2>

          <p className="mt-5 text-gray-600 max-w-2xl">
            PT Bhaskara Buana Mulya has delivered projects for a broad range of
            industrial and commercial clients across Indonesia, supporting
            manufacturing, logistics, utilities, and infrastructure operations.
          </p>

          {/* MICRO PROOF (UPGRADE LEVEL) */}
          <p className="mt-6 text-xs text-gray-500 max-w-2xl">
            Engagements include EPC support, brownfield upgrades, operational
            facilities, and live-plant environments with strict safety,
            quality, and schedule controls.
          </p>
        </div>

        {/* ================= TRUST STATS ================= */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-8">
            <p className="text-sm text-gray-500">Total Clients Served</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">50+</p>
            <p className="mt-2 text-xs text-gray-500">
              Across multiple industrial sectors
            </p>
          </div>

          <div className="card p-8">
            <p className="text-sm text-gray-500">Project Locations</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">10+</p>
            <p className="mt-2 text-xs text-gray-500">
              Major industrial regions in Indonesia
            </p>
          </div>

          <div className="card p-8">
            <p className="text-sm text-gray-500">Industry Coverage</p>
            <p className="mt-2 text-lg font-medium text-gray-900">
              Manufacturing • Logistics • Utilities
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Industrial & commercial facilities
            </p>
          </div>

          <div className="card p-8">
            <p className="text-sm text-gray-500">Engagement Model</p>
            <p className="mt-2 text-lg font-medium text-gray-900">
              Long-term & repeat clients
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Based on performance and trust
            </p>
          </div>
        </div>

        {/* ================= REGIONAL COVERAGE ================= */}
        <div className="mt-14 max-w-3xl">
          <p className="text-sm text-gray-600 leading-relaxed">
            Our client engagements span key industrial regions including
            Bekasi, Cikarang, Karawang, Jakarta, Semarang, Lampung,
            and other strategic production hubs across Indonesia.
          </p>
        </div>

        {/* ================= CLIENT TYPE GROUPING (PSYCHO UPGRADE) ================= */}
        <div className="mt-10 max-w-3xl">
          <p className="text-sm font-medium text-gray-700">
            Client engagements include:
          </p>

          <ul className="mt-3 text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Multinational manufacturing & automotive suppliers</li>
            <li>FMCG, food & pharmaceutical production facilities</li>
            <li>Property developers & industrial estates</li>
            <li>Government & institutional projects</li>
          </ul>
        </div>

        {/* ================= NDA DISCLAIMER ================= */}
        <div className="mt-8 max-w-3xl">
          <p className="text-xs text-gray-500">
            Client details and project references are presented in aggregate
            to respect confidentiality and non-disclosure obligations.
            Detailed references may be shared during formal tender
            or contractual discussions.
          </p>
        </div>

        {/* ================= CLIENT PORTFOLIO CTA (TENDER LANGUAGE) ================= */}
        <div className="mt-10">
          <Link
            href="/credentials"
            className="inline-flex items-center gap-2
                       text-sm font-medium text-gray-900
                       border-b border-gray-900
                       hover:opacity-80 transition"
          >
            View client portfolio, certifications & tender credentials
            <span aria-hidden>→</span>
          </Link>

          <p className="mt-2 text-xs text-gray-500 max-w-md">
            Available for pre-qualification, procurement review,
            and formal tender submissions upon request.
          </p>
        </div>

      </div>
    </section>
  );
}
