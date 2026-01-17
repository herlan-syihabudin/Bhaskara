import Link from "next/link";

export default function CapabilitiesPage() {
  return (
    <section className="bg-white">
      <div className="container-bbm py-28">

        {/* ================= HEADER ================= */}
        <div className="max-w-3xl">
          <span className="badge">CAPABILITIES</span>

          <h1 className="mt-6">
            Engineering, safety, and
            <span className="block">execution excellence</span>
          </h1>

          <p className="mt-8 text-lg text-gray-800">
            PT Bhaskara Buana Mulya delivers projects through disciplined
            engineering, structured project management, and a safety-first
            culture supported by robust quality, safety, and control systems.
          </p>

          <p className="mt-4 text-sm text-gray-600 max-w-2xl">
            Our capability framework is designed to support complex industrial
            and commercial projects from early planning through execution,
            testing, and handover.
          </p>
        </div>

        {/* ================= CORE CAPABILITY FRAMEWORK ================= */}
        <div className="mt-24 grid gap-16 max-w-5xl">

          <CapabilitySection
            title="Engineering Capability"
            desc="Engineering discipline is embedded into our planning and execution processes to ensure constructability, safety, and predictable outcomes."
            items={[
              "MEP system design review and coordination",
              "Method statements and construction sequencing",
              "Shop drawing coordination and technical submittals",
              "Value engineering and constructability review",
            ]}
          />

          <CapabilitySection
            title="Project Management"
            desc="Projects are managed through structured planning, monitoring, and control to maintain schedule, cost, and quality objectives."
            items={[
              "Integrated project planning and scheduling",
              "Cost control and progress monitoring",
              "Risk identification and mitigation planning",
              "Client communication and progress reporting",
            ]}
          />

          <CapabilitySection
            title="Health, Safety & Environment (HSE)"
            desc="Safety is a non-negotiable value enforced across all project activities through proactive planning, supervision, and site controls."
            items={[
              "Safety induction and regular toolbox meetings",
              "Job Safety Analysis (JSA) implementation",
              "Permit-to-work system and site access control",
              "Incident prevention, reporting, and corrective actions",
            ]}
          />

          <CapabilitySection
            title="Quality Assurance & Control"
            desc="Quality is ensured through systematic inspection, documentation, and continuous improvement processes aligned with project specifications."
            items={[
              "Inspection and Test Plans (ITP)",
              "Material and workmanship inspection",
              "Documentation and handover dossiers",
              "Continuous improvement and corrective actions",
            ]}
          />
        </div>

        {/* ================= DETAILED CAPABILITY MATRIX ================= */}
        <div className="mt-28 max-w-5xl">

          <h2 className="text-2xl font-semibold text-gray-900">
            Detailed Capability Breakdown
          </h2>

          <p className="mt-4 text-sm text-gray-600 max-w-3xl">
            Each execution capability is supported by defined scope,
            delivery controls, and coordination systems aligned with
            industrial and commercial project requirements.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <CapabilityLink
              href="/capabilities/general-contracting"
              title="General Contracting"
              desc="End-to-end project delivery with integrated trade coordination."
            />
            <CapabilityLink
              href="/capabilities/mep-engineering"
              title="MEP Engineering"
              desc="Mechanical, electrical, and plumbing systems delivery."
            />
            <CapabilityLink
              href="/capabilities/steel-civil-works"
              title="Steel & Civil Works"
              desc="Structural steel, foundations, and civil construction."
            />
            <CapabilityLink
              href="/capabilities/interior-fit-out"
              title="Interior Fit-Out"
              desc="Functional interior environments for operational use."
            />
          </div>
        </div>

        {/* ================= CLOSING STATEMENT ================= */}
        <div className="mt-28 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500 leading-relaxed">
            Our capabilities are continuously developed to align with project
            complexity, regulatory requirements, and our clients’ operational
            objectives. Detailed execution references and documentation are
            available during formal tender or procurement discussions.
          </p>

          <p className="mt-6 text-sm text-gray-700">
            To discuss capability alignment for your project,{" "}
            <Link
              href="/contact"
              className="font-medium text-gray-900 hover:underline"
            >
              contact our engineering team
            </Link>{" "}
            with your scope, schedule, and technical requirements.
          </p>
        </div>

      </div>
    </section>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function CapabilitySection({
  title,
  desc,
  items,
}: {
  title: string;
  desc: string;
  items: string[];
}) {
  return (
    <div className="card p-10">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

      <p className="mt-4 max-w-3xl text-gray-600">
        {desc}
      </p>

      <ul className="mt-8 grid gap-3 md:grid-cols-2 text-sm text-gray-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-gray-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CapabilityLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="card p-6 transition
                 hover:shadow-md hover:-translate-y-0.5"
    >
      <h3 className="text-sm font-semibold text-gray-900">
        {title}
      </h3>
      <p className="mt-2 text-xs text-gray-600">
        {desc}
      </p>
    </Link>
  );
}
