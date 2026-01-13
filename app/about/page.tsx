export default function AboutPage() {
  return (
    <section style={{ padding: "96px 48px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ fontSize: 12, letterSpacing: "0.2em", color: "#6b7280" }}>
          ABOUT US
        </p>

        <h1 style={{ fontSize: 40, marginTop: 16 }}>
          PT Bhaskara Buana Mulya
        </h1>

        <p style={{ marginTop: 24, fontSize: 18, lineHeight: 1.7 }}>
          PT Bhaskara Buana Mulya is an engineering-driven general contractor
          delivering civil, structural, MEP, and interior works with a strong
          focus on safety, quality, and disciplined execution.
        </p>

        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 24 }}>Our Principles</h2>
          <ul style={{ marginTop: 16, lineHeight: 1.8 }}>
            <li>Safety-first culture on every project</li>
            <li>Engineering-led planning & execution</li>
            <li>Quality assurance & documentation</li>
            <li>Accountable delivery and transparency</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
