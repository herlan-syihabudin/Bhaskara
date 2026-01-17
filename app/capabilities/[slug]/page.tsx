import { notFound } from "next/navigation";
import Link from "next/link";

const capabilities = {
  "general-contracting": {
    title: "General Contracting",
    intro:
      "End-to-end project delivery across industrial and commercial sectors, managed with disciplined planning, cost control, and coordinated site execution.",
    summary:
      "We act as a single point of responsibility to coordinate trades, manage interfaces, and ensure that construction activities follow approved drawings, method statements, and project controls.",
    scope: [
      "End-to-end project delivery for industrial and commercial facilities",
      "Coordination of civil, structural, MEP, and interior trades",
      "Construction planning, sequencing, and site logistics",
      "Contractor and subcontractor coordination and supervision",
      "Progress tracking, reporting, and owner communication",
    ],
    controls: [
      "Baseline schedule and look-ahead planning",
      "Cost control and variation management",
      "HSE enforcement and toolbox meetings",
      "Inspection and test plans (ITP) and quality records",
      "Handover documentation and as-built coordination",
    ],
  },
  "mep-engineering": {
    title: "MEP Engineering",
    intro:
      "Mechanical, electrical, and plumbing systems engineered for performance, safety, and regulatory compliance across industrial and commercial facilities.",
    summary:
      "Our MEP scope covers design coordination, installation, testing, and commissioning, ensuring systems operate reliably and integrate with architectural and structural requirements.",
    scope: [
      "Power distribution, lighting, and earthing systems",
      "HVAC systems, ducting, and mechanical ventilation",
      "Plumbing, water supply, and drainage networks",
      "Fire alarm, fire-fighting, and life safety systems",
      "Low-voltage, control, and auxiliary systems coordination",
    ],
    controls: [
      "Shop drawing and coordination with other disciplines",
      "Load calculations and equipment selection validation",
      "Method statements and installation procedures",
      "Testing, commissioning, and performance verification",
      "Regulatory inspections and compliance documentation",
    ],
  },
  "steel-civil-works": {
    title: "Steel & Civil Works",
    intro:
      "Structural steel, foundations, and civil works constructed with engineering precision to support industrial and commercial operations.",
    summary:
      "We execute foundations, superstructures, concrete works, and steel structures with attention to constructability, safety, and durability in operation.",
    scope: [
      "Foundations, pedestals, and ground beams",
      "Concrete slabs, pits, and retaining structures",
      "Structural steel fabrication and erection",
      "Warehouse, plant, and utility building structures",
      "External works, drainage, and access roads",
    ],
    controls: [
      "Surveying, setting out, and level control",
      "Rebar, formwork, and concrete quality control",
      "Welding, bolting, and steel erection procedures",
      "Lifting plans and work-at-height safety",
      "Inspection records and structural handover documentation",
    ],
  },
  "interior-fit-out": {
    title: "Interior Fit-Out",
    intro:
      "Functional, durable, and efficient interior environments for operational, commercial, and industrial use cases.",
    summary:
      "We deliver interior fit-out works that integrate architectural finishes with MEP systems, ensuring spaces are ready for safe and reliable daily operations.",
    scope: [
      "Partitioning, ceilings, and architectural finishes",
      "Joinery, built-in furniture, and feature elements",
      "Coordination of MEP services within interior spaces",
      "Flooring systems suitable for operational requirements",
      "Wayfinding, signage, and minor architectural details",
    ],
    controls: [
      "Shop drawings and sample approvals",
      "Material submittals and compliance checks",
      "Interface coordination with base building and MEP",
      "Quality inspections and punch list management",
      "Handover with operation and maintenance considerations",
    ],
  },
};

export default function CapabilityPage({ params }: { params: { slug: string } }) {
  const capability = capabilities[params.slug as keyof typeof capabilities];

  if (!capability) {
    return notFound();
  }

  return (
    <section className="bg-white">
      <div className="container-bbm py-28">

        {/* BREADCRUMB / BACK LINK */}
        <div className="text-sm text-gray-500">
          <Link href="/services" className="hover:underline">
            Services
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{capability.title}</span>
        </div>

        {/* HEADER */}
        <div className="mt-6 max-w-3xl">
          <span className="badge">CAPABILITY</span>

          <h1 className="mt-4">
            {capability.title}
          </h1>

          <p className="mt-6 text-lg text-gray-800">
            {capability.intro}
          </p>

          <p className="mt-4 text-sm text-gray-600">
            {capability.summary}
          </p>
        </div>

        {/* GRID: SCOPE & CONTROLS */}
        <div className="mt-16 grid gap-10 md:grid-cols-2 max-w-5xl">
          <div className="card p-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Typical Scope of Work
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {capability.scope.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-gray-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Project Controls & Delivery Approach
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {capability.controls.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-gray-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CLOSING / CTA */}
        <div className="mt-20 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500 leading-relaxed">
            This capability can be integrated with our other services such as
            General Contracting, Steel & Civil Works, and Interior Fit-Out
            depending on project requirements.
          </p>

          <p className="mt-4 text-sm text-gray-600">
            To discuss how this capability applies to your project,{" "}
            <Link href="/contact" className="font-medium text-gray-900 hover:underline">
              contact our team
            </Link>{" "}
            with your scope, schedule, and technical requirements.
          </p>
        </div>
      </div>
    </section>
  );
}
