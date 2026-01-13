export default function CallToAction() {
  return (
    <section
      style={{
        padding: "96px 48px",
        background: "#111827",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <h2 style={{ fontSize: 36, lineHeight: 1.2 }}>
            Let’s build with clarity, safety, and execution excellence.
          </h2>
          <p style={{ marginTop: 16, color: "#d1d5db", fontSize: 16 }}>
            Talk to our team about your next project. We bring engineering rigor,
            disciplined execution, and accountable delivery.
          </p>
        </div>

        <a
          href="#"
          style={{
            padding: "16px 32px",
            background: "#ffffff",
            color: "#111827",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Contact Our Team
        </a>
      </div>
    </section>
  );
}
