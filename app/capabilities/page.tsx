export default function CapabilitiesPage() {
  return (
    <section className="bg-white">
      <div className="container-bbm py-28">
        {/* HEADER */}
        <div className="max-w-3xl">
          <span className="badge">CAPABILITIES</span>

          <h1 className="mt-6">
            Engineering, safety, and
            <span className="block">execution excellence</span>
          </h1>

          <p className="mt-8 text-lg">
            PT Bhaskara Buana Mulya delivers projects through disciplined
            engineering, structured project management, and a safety-first
            culture supported by robust quality and control systems.
          </p>
        </div>

        {/* CAPABILITY SECTIONS */}
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
            desc="Safety is a non-negotiable value enforced across all project activities through proactive planning and site supervision."
            items={[
              "Safety induction and regular toolbox meetings",
              "Job Safety Analysis (JSA) implementation",
              "Permit-to-work system and site controls",
              "Incident prevention, reporting, and corrective actions",
            ]}
          />

          <CapabilitySection
            title="Quality Assurance & Control"
            desc="Quality is ensured through systematic inspection, documentation, and continuous improvement processes."
            items={[
              "Inspection and Test Plans (ITP)",
              "Material and workmanship inspection",
              "Documentation and handover dossiers",
              "Continuous improvement and corrective actions",
            ]}
          />
        </div>

        {/* CLOSING */}
        <div className="mt-24 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500">
            Our capabilities are continuously developed to align with project
            complexity, regulatory requirements, and our clients’ operational
            objectives.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ===== REUSABLE SECTION ===== */
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
      <h2>{title}</h2>

      <p className="mt-4 max-w-3xl">
        {desc}
      </p>

      <ul className="mt-8 grid gap-3 md:grid-cols-2 text-sm">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-gray-400">—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
