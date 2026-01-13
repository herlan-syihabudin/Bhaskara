export default function Footer() {
  return (
    <footer
      style={{
        padding: "48px",
        borderTop: "1px solid #e5e7eb",
        background: "#fafafa",
        fontSize: 14,
        color: "#374151",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <strong>PT Bhaskara Buana Mulya</strong>

        <p style={{ marginTop: 12, maxWidth: 520 }}>
          Engineering-driven general contractor delivering civil,
          structural, MEP, and interior solutions with a strong
          commitment to safety, quality, and execution excellence.
        </p>

        <p style={{ marginTop: 24, fontSize: 12, color: "#6b7280" }}>
          © {new Date().getFullYear()} PT Bhaskara Buana Mulya. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
