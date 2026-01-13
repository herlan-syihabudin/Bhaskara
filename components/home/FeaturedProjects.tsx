const projects = [
  {
    title: "Industrial Facility Expansion",
    category: "Civil & Structural",
    desc: "Foundation, steel structure, and concrete works for industrial expansion.",
  },
  {
    title: "Commercial Office Fit-Out",
    category: "Interior",
    desc: "End-to-end interior fit-out with MEP integration and schedule control.",
  },
  {
    title: "Power & Electrical Upgrade",
    category: "MEP Engineering",
    desc: "Electrical system upgrade with safety-first commissioning process.",
  },
];

export default function FeaturedProjects() {
  return (
    <section style={{ padding: "72px 48px", background: "#f9fafb" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            color: "#6b7280",
            marginBottom: 12,
          }}
        >
          SELECTED PROJECTS
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ fontSize: 32, lineHeight: 1.2, color: "#111827" }}>
            Delivering results across sectors.
          </h2>

          <a
            href="#"
            style={{
              fontSize: 14,
              textDecoration: "none",
              color: "#111827",
              borderBottom: "1px solid #111827",
            }}
          >
            View all projects →
          </a>
        </div>

        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {projects.map((p) => (
            <div
              key={p.title}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                padding: 20,
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 12, color: "#6b7280" }}>{p.category}</span>
              <strong style={{ fontSize: 18, color: "#111827" }}>{p.title}</strong>
              <p style={{ color: "#374151", lineHeight: 1.6 }}>{p.desc}</p>
              <span style={{ marginTop: "auto", fontSize: 13, color: "#111827" }}>
                View case study →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
