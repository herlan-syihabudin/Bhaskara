const items = [
  {
    title: "General Contracting",
    desc: "End-to-end project delivery with disciplined planning, control, and execution.",
  },
  {
    title: "MEP Engineering",
    desc: "Electrical, mechanical, plumbing systems built for performance, safety, and maintainability.",
  },
  {
    title: "Steel & Civil Works",
    desc: "Structural steel, foundations, concrete works, and site infrastructure with quality assurance.",
  },
  {
    title: "Interior Fit-Out",
    desc: "Functional, durable, and refined interior delivery for commercial & industrial spaces.",
  },
];

export default function WhatWeDo() {
  return (
    <section style={{ padding: "72px 48px", background: "#ffffff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 560 }}>
            <p style={{ fontSize: 12, letterSpacing: "0.2em", color: "#6b7280", margin: 0 }}>
              WHAT WE DO
            </p>
            <h2 style={{ fontSize: 32, lineHeight: 1.2, color: "#111827", marginTop: 12 }}>
              Integrated services, built to global standards.
            </h2>
            <p style={{ marginTop: 14, color: "#374151", fontSize: 16, lineHeight: 1.6 }}>
              We combine engineering rigor, site discipline, and strong governance to deliver safe,
              predictable outcomes—on time and on spec.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
            {["HSE-first", "Quality System", "Cost Control", "Schedule Discipline"].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 12,
                  padding: "8px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 999,
                  color: "#111827",
                  background: "#fafafa",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {items.map((x) => (
            <div
              key={x.title}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                padding: 20,
                background: "#ffffff",
              }}
            >
              <div style={{ fontSize: 14, color: "#6b7280" }}>Service</div>
              <div style={{ marginTop: 8, fontSize: 18, fontWeight: 600, color: "#111827" }}>
                {x.title}
              </div>
              <p style={{ marginTop: 10, color: "#374151", lineHeight: 1.6 }}>
                {x.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
