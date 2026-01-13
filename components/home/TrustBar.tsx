const stats = [
  { k: "Safety", v: "HSE-first culture on every site." },
  { k: "Quality", v: "Workmanship and documentation control." },
  { k: "Delivery", v: "Schedule discipline & progress tracking." },
  { k: "Engineering", v: "MEP & execution driven by method statements." },
];

export default function TrustBar() {
  return (
    <section style={{ padding: "0 48px 72px", background: "#ffffff" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          border: "1px solid #e5e7eb",
          borderRadius: 20,
          padding: 18,
          background: "#fafafa",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {stats.map((s) => (
            <div key={s.k} style={{ padding: 14, background: "#ffffff", borderRadius: 16 }}>
              <div style={{ fontSize: 13, color: "#6b7280" }}>{s.k}</div>
              <div style={{ marginTop: 6, fontSize: 14, color: "#111827", fontWeight: 600 }}>
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
