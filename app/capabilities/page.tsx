export default function CapabilitiesPage() {
  return (
    <section style={{ padding: "96px 48px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontSize: 12, letterSpacing: "0.2em", color: "#6b7280" }}>
          CAPABILITIES
        </p>

        <h1 style={{ fontSize: 40, marginTop: 16 }}>
          Engineering, Safety, and Execution Excellence
        </h1>

        <p style={{ marginTop: 20, fontSize: 18, lineHeight: 1.7, maxWidth: 800 }}>
          PT Bhaskara Buana Mulya delivers projects through disciplined engineering,
          structured project management, and a safety-first culture supported by
          robust quality systems.
        </p>

        {/* ENGINEERING */}
        <Section
          title="Engineering Capability"
          items={[
            "MEP system design review & coordination",
            "Method statements & construction sequencing",
            "Shop drawing coordination",
            "Value engineering and constructability review",
          ]}
        />

        {/* PROJECT MANAGEMENT */}
        <Section
          title="Project Management"
          items={[
            "Integrated project planning & scheduling",
            "Cost control and progress monitoring",
            "Risk identification and mitigation",
            "Client communication and reporting",
          ]}
        />

        {/* HSE */}
        <Section
          title="Health, Safety & Environment (HSE)"
          items={[
            "Safety induction and toolbox meetings",
            "Job Safety Analysis (JSA)",
            "Permit-to-work system",
            "Incident prevention and reporting",
          ]}
        />

        {/* QUALITY */}
        <Section
          title="Quality Assurance & Control"
          items={[
            "Inspection & Test Plan (ITP)",
            "Material and workmanship inspection",
            "Documentation and handover dossiers",
            "Continuous improvement process",
          ]}
        />
      </div>
    </section>
  );
}

/* ===== reusable section ===== */
function Section({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div style={{ marginTop: 56 }}>
      <h2 style={{ fontSize: 26 }}>{title}</h2>

      <ul style={{ marginTop: 16, lineHeight: 2 }}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
