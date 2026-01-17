import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

/* ===============================
   DATA SOURCE (CAN MOVE TO /lib)
================================ */
const capabilities = {
  "general-contracting": {
    title: "General Contracting",
    seoTitle: "General Contracting Services | Industrial & Commercial Projects",
    seoDesc:
      "Engineering-led general contracting services for industrial and commercial projects with disciplined execution, cost control, and safety-first delivery.",
    intro:
      "End-to-end project delivery across industrial and commercial sectors, managed with disciplined planning, cost control, and coordinated site execution.",
    summary:
      "We act as a single point of responsibility to coordinate trades, manage interfaces, and ensure construction activities follow approved drawings, method statements, and project controls.",
    scope: [
      "End-to-end project delivery for industrial and commercial facilities",
      "Coordination of civil, structural, MEP, and interior trades",
      "Construction planning, sequencing, and site logistics",
      "Contractor and subcontractor supervision",
      "Progress tracking, reporting, and owner coordination",
    ],
    controls: [
      "Baseline schedule & look-ahead planning",
      "Cost control and variation management",
      "HSE enforcement and toolbox meetings",
      "Inspection & Test Plans (ITP)",
      "As-built documentation & handover",
    ],
  },

  "mep-engineering": {
    title: "MEP Engineering",
    seoTitle: "MEP Engineering Contractor | Industrial & Commercial Facilities",
    seoDesc:
      "Mechanical, Electrical & Plumbing (MEP) engineering services for industrial and commercial facilities with full compliance and commissioning.",
    intro:
      "Mechanical, electrical, and plumbing systems engineered for performance, safety, and regulatory compliance.",
    summary:
      "Our MEP scope covers design coordination, installation, testing, and commissioning, ensuring systems operate reliably and integrate with other disciplines.",
    scope: [
      "Power distribution, lighting, and earthing systems",
      "HVAC and mechanical ventilation systems",
      "Plumbing, water supply, and drainage",
      "Fire alarm and fire-fighting systems",
      "Low-voltage and control systems",
    ],
    controls: [
      "Shop drawing & coordination review",
      "Load calculation & equipment validation",
      "Method statements & installation procedures",
      "Testing & commissioning protocols",
      "Regulatory inspection & compliance records",
    ],
  },

  "steel-civil-works": {
    title: "Steel & Civil Works",
    seoTitle: "Steel Structure & Civil Works Contractor",
    seoDesc:
      "Civil works and structural steel construction for industrial plants, warehouses, and utilities with strict quality and safety control.",
    intro:
      "Structural steel, foundations, and civil works constructed with engineering precision.",
    summary:
      "We execute foundations, concrete works, and steel structures with focus on constructability, durability, and operational safety.",
    scope: [
      "Foundations, pedestals, and ground beams",
      "Concrete slabs, pits, and retaining structures",
      "Structural steel fabrication and erection",
      "Warehouse and plant structures",
      "External works and drainage systems",
    ],
    controls: [
      "Surveying and level control",
      "Concrete & rebar quality inspections",
      "Welding & bolting procedures",
      "Lifting plans and work-at-height safety",
      "Structural handover documentation",
    ],
  },

  "interior-fit-out": {
    title: "Interior Fit-Out",
    seoTitle: "Interior Fit-Out Contractor | Industrial & Commercial",
    seoDesc:
      "Interior fit-out services integrating architectural finishes and MEP systems for operational-ready environments.",
    intro:
      "Functional, durable, and efficient interior environments for industrial and commercial operations.",
    summary:
      "We deliver interior fit-out works integrated with MEP systems to ensure safety, efficiency, and operational readiness.",
    scope: [
      "Partitioning, ceilings, and architectural finishes",
      "Joinery and built-in furniture",
      "MEP coordination within interior areas",
      "Operational-grade flooring systems",
      "Wayfinding and minor architectural details",
    ],
    controls: [
      "Shop drawings and material approvals",
      "Interface coordination with MEP",
      "Quality inspection and punch list",
      "Handover with O&M considerations",
      "Client acceptance documentation",
    ],
  },
};

/* ===============================
   SEO METADATA
================================ */
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const capability = capabilities[params.slug as keyof typeof capabilities];

  if (!capability) {
    return { title: "Capability Not Found | PT Bhaskara Buana Mulya" };
  }

  return {
    title: `${capability.seoTitle} | PT Bhaskara Buana Mulya`,
    description: capability.seoDesc,
  };
}

/* ===============================
   PAGE
================================ */
export default function CapabilityPage({
  params,
}: {
  params: { slug: string };
}) {
  const capability = capabilities[params.slug as keyof typeof capabilities];
  if (!capability) return notFound();

  const capabilityLinks = Object.entries(capabilities).filter(
    ([key]) => key !== params.slug
  );

  return (
    <>
      {/* ===== BREADCRUMB SCHEMA ===== */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Capabilities",
                item: "https://bhaskara-lqtk.vercel.app/capabilities",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: capability.title,
                item: `https://bhaskara-lqtk.vercel.app/capabilities/${params.slug}`,
              },
            ],
          }),
        }}
      />

      <section className="bg-white">
        <div className="container-bbm py-28">

          {/* BREADCRUMB */}
          <div className="text-sm text-gray-500">
            <Link href="/capabilities" className="hover:underline">
              Capabilities
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{capability.title}</span>
          </div>

          {/* HEADER */}
          <div className="mt-6 max-w-3xl">
            <span className="badge">CAPABILITY</span>
            <h1 className="mt-4">{capability.title}</h1>
            <p className="mt-6 text-lg text-gray-800">{capability.intro}</p>
            <p className="mt-4 text-sm text-gray-600">{capability.summary}</p>
          </div>

          {/* OVERVIEW MATRIX */}
          <div className="mt-16 grid gap-10 md:grid-cols-2 max-w-5xl">
            <div className="card p-8">
              <h2 className="text-lg font-semibold">Typical Scope of Work</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {capability.scope.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-gray-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-8">
              <h2 className="text-lg font-semibold">Project Controls</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {capability.controls.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-gray-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CERTIFICATION SIGNAL */}
          <div className="mt-16 card p-8 max-w-5xl">
            <h2 className="text-lg font-semibold">Compliance & Certification</h2>
            <ul className="mt-4 grid gap-2 text-sm text-gray-700 md:grid-cols-2">
              <li>ISO 9001 – Quality Management System</li>
              <li>ISO 45001 – Occupational Health & Safety</li>
              <li>SMK3 – Indonesian HSE Compliance</li>
              <li>Project documentation & audit-ready records</li>
            </ul>
          </div>

          {/* RELATED CAPABILITIES */}
          <div className="mt-20 max-w-5xl">
            <h2 className="text-lg font-semibold">Related Capabilities</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {capabilityLinks.map(([slug, cap]) => (
                <Link
                  key={slug}
                  href={`/capabilities/${slug}`}
                  className="card p-6 hover:shadow-md hover:-translate-y-0.5 transition"
                >
                  <h3 className="text-sm font-semibold">{cap.title}</h3>
                  <p className="mt-2 text-xs text-gray-600">{cap.intro}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 max-w-3xl border-t border-gray-200 pt-10">
            <p className="text-sm text-gray-600">
              To discuss how this capability applies to your project,
              <Link href="/contact" className="font-medium text-gray-900 hover:underline">
                {" "}contact our engineering team
              </Link>{" "}
              with your scope, schedule, and technical requirements.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
