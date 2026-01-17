import Link from "next/link";
import type { Metadata } from "next";

/* ===============================
   SEO METADATA
================================ */
export const metadata: Metadata = {
  title: "Industries We Serve | PT Bhaskara Buana Mulya",
  description:
    "PT Bhaskara Buana Mulya serves industrial, manufacturing, warehouse, commercial, and institutional sectors with engineering-led construction, MEP, and integrated project delivery.",
};

/* ===============================
   DATA
================================ */
const industries = [
  {
    title: "Manufacturing & Industrial Plants",
    desc: "Engineering-led construction and MEP works for active and new manufacturing facilities, executed with strict safety, quality, and operational continuity controls.",
    scope: [
      "Factories & production plants",
      "Process utilities & support buildings",
      "Plant modification & expansion",
      "Shutdown and phased execution projects",
    ],
  },
  {
    title: "Warehouse & Logistics Facilities",
    desc: "Civil, steel structure, MEP, and interior works for warehouses and logistics hubs supporting distribution and supply chain operations.",
    scope: [
      "Warehouse & distribution centers",
      "Steel structure & large-span buildings",
      "Docking areas & material handling zones",
      "MEP systems for logistics operations",
    ],
  },
  {
    title: "Commercial & Mixed-Use Buildings",
    desc: "Commercial facilities delivered with integrated construction, MEP, and interior fit-out for operational readiness and long-term use.",
    scope: [
      "Offices & commercial facilities",
      "Retail & mixed-use developments",
      "Interior fit-out & refurbishment",
      "Building services coordination",
    ],
  },
  {
    title: "Institutional & Public Facilities",
    desc: "Selective institutional projects executed with engineering discipline, regulatory compliance, and structured documentation.",
    scope: [
      "Educational facilities",
      "Healthcare-related buildings",
      "Public & institutional projects",
      "Renovation and system upgrades",
    ],
  },
];

/* ===============================
   PAGE
================================ */
export default function IndustriesPage() {
  return (
    <section className="bg-white">
      <div className="container-bbm py-28">

        {/* ================= HEADER ================= */}
        <div className="max-w-3xl">
          <span className="badge">INDUSTRIES</span>

          <h1 className="mt-6">
            Industries we
            <span className="block">serve and support</span>
          </h1>

          <p className="mt-8 text-lg text-gray-800">
            PT Bhaskara Buana Mulya delivers engineering-driven construction,
            MEP, and integrated project solutions across key industrial and
            commercial sectors.
          </p>

          <p className="mt-4 text-sm text-gray-600 max-w-2xl">
            Our experience is concentrated in industrial and operational
            environments where safety, coordination, and execution discipline
            are critical to project success.
          </p>
        </div>

        {/* ================= INDUSTRY GRID ================= */}
        <div className="mt-24 grid gap-12 max-w-5xl">
          {industries.map((industry) => (
            <div key={industry.title} className="card p-10">
              <h2 className="text-xl font-semibold text-gray-900">
                {industry.title}
              </h2>

              <p className="mt-4 text-gray-600 max-w-3xl">
                {industry.desc}
              </p>

              <ul className="mt-6 grid gap-3 md:grid-cols-2 text-sm text-gray-700">
                {industry.scope.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-gray-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ================= EXECUTION MODEL ================= */}
        <div className="mt-28 max-w-4xl border-t border-gray-200 pt-12">
          <h2 className="text-xl font-semibold text-gray-900">
            How we deliver across industries
          </h2>

          <p className="mt-6 text-sm text-gray-600 leading-relaxed">
            Regardless of industry type, our execution model is built on
            engineering discipline, structured planning, safety-first
            supervision, and measurable project controls. This approach
            enables us to deliver projects of varying scale — from small
            modifications to multi-phase developments — with predictable
            outcomes and controlled risk.
          </p>
        </div>

        {/* ================= CROSS LINKS ================= */}
        <div className="mt-16 flex flex-wrap gap-6">
          <Link
            href="/capabilities"
            className="text-sm font-medium text-gray-900 border-b border-gray-900 hover:opacity-80 transition"
          >
            View our capabilities →
          </Link>

          <Link
            href="/projects"
            className="text-sm font-medium text-gray-900 border-b border-gray-900 hover:opacity-80 transition"
          >
            View selected projects →
          </Link>

          <Link
            href="/contact"
            className="text-sm font-medium text-gray-900 border-b border-gray-900 hover:opacity-80 transition"
          >
            Discuss your project →
          </Link>
        </div>

        {/* ================= NDA DISCLAIMER ================= */}
        <div className="mt-12 max-w-3xl">
          <p className="text-xs text-gray-500">
            Industry references and project details are presented at a high
            level to respect confidentiality and non-disclosure obligations.
            Detailed references are available during formal tender or
            procurement discussions.
          </p>
        </div>

      </div>
    </section>
  );
}
