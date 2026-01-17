import Link from "next/link";

const capabilities = [
  {
    slug: "general-contracting",
    title: "General Contracting",
    desc: "End-to-end project delivery with disciplined planning, coordination, and execution across industrial and commercial facilities.",
  },
  {
    slug: "civil-structural-works",
    title: "Civil & Structural Steel Works",
    desc: "Foundations, concrete structures, and structural steel works executed with engineering precision and site safety control.",
  },
  {
    slug: "mep-engineering",
    title: "MEP Engineering",
    desc: "Mechanical, electrical, and plumbing systems delivered with full coordination, testing, and regulatory compliance.",
  },
  {
    slug: "interior-fit-out",
    title: "Interior Fit-Out & Facility Upgrade",
    desc: "Functional interior environments integrated with MEP systems for operational, commercial, and industrial use.",
  },
  {
    slug: "renovation-modification",
    title: "Renovation & Brownfield Works",
    desc: "Modification, expansion, and upgrade of existing facilities while maintaining operational continuity.",
  },
];

export default function CapabilitiesPage() {
  return (
    <section className="bg-white">
      <div className="container-bbm py-28">

        {/* ================= HEADER ================= */}
        <div className="max-w-3xl">
          <span className="badge">CAPABILITIES</span>

          <h1 className="mt-6">
            Engineering-led delivery across
            <span className="block">industrial and commercial projects</span>
          </h1>

          <p className="mt-6 text-lg text-gray-700">
            PT Bhaskara Buana Mulya operates as an engineering-driven general
            contractor delivering structured, safe, and accountable execution
            for manufacturing, warehouse, and commercial facilities.
          </p>
        </div>

        {/* ================= CAPABILITY MATRIX ================= */}
        <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap) => (
            <div
              key={cap.slug}
              className="card p-8 flex flex-col
                         transition hover:shadow-md hover:-translate-y-0.5"
            >
              <h3 className="text-lg">{cap.title}</h3>

              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {cap.desc}
              </p>

              <div className="mt-auto pt-6">
                <Link
                  href={`/capabilities/${cap.slug}`}
                  className="text-sm font-medium text-gray-900
                             border-b border-gray-900
                             hover:opacity-80 transition"
                >
                  View capability details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ================= DELIVERY MODEL ================= */}
        <div className="mt-24 max-w-4xl border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-semibold">
            How we typically deliver projects
          </h2>

          <p className="mt-6 text-gray-600">
            Our engagement model is flexible and adapted to project constraints,
            operational conditions, and client requirements.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 text-sm text-gray-700">
            <li>• Full General Contracting (greenfield & brownfield)</li>
            <li>• Design & Build (selective scope)</li>
            <li>• Existing facility modification & expansion</li>
            <li>• Small to multi-billion rupiah project values</li>
          </ul>
        </div>

        {/* ================= INDUSTRY FOCUS ================= */}
        <div className="mt-20 max-w-4xl border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-semibold">
            Industry focus
          </h2>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 text-sm text-gray-700">
            <li>• Manufacturing & industrial plants</li>
            <li>• Warehouse & logistics facilities</li>
            <li>• Commercial buildings & offices</li>
            <li>• Selective residential & public facilities</li>
          </ul>

          <p className="mt-6 text-xs text-gray-500">
            Primary execution areas include Jabodetabek, West Java, Central Java,
            and selected regions across Java Island.
          </p>
        </div>

        {/* ================= CTA ================= */}
        <div className="mt-24 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-600">
            To discuss project scope, constraints, and execution strategy,
            engage directly with our engineering and project delivery team.
          </p>

          <Link
            href="/contact"
            className="inline-block mt-4 text-sm font-medium
                       text-gray-900 border-b border-gray-900
                       hover:opacity-80 transition"
          >
            Discuss your project →
          </Link>
        </div>

      </div>
    </section>
  );
}
