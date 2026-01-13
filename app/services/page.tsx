const services = [
  {
    title: "General Contracting",
    desc: "End-to-end project delivery from planning to handover.",
  },
  {
    title: "MEP Engineering",
    desc: "Electrical, mechanical, plumbing systems with safety and performance focus.",
  },
  {
    title: "Civil & Structural Works",
    desc: "Concrete, steel structure, and infrastructure works.",
  },
  {
    title: "Interior Fit-Out",
    desc: "Commercial and industrial interior solutions.",
  },
];

export default function ServicesPage() {
  return (
    <section style={{ padding: "96px 48px", background: "#f9fafb" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 40 }}>Our Services</h1>

        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {services.map((s) => (
            <div
              key={s.title}
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                padding: 24,
              }}
            >
              <h3 style={{ fontSize: 18 }}>{s.title}</h3>
              <p style={{ marginTop: 12, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
