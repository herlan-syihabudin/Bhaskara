export default function Header() {
  return (
    <header
      style={{
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        borderBottom: "1px solid #e5e7eb",
        background: "#ffffff",
      }}
    >
      <strong style={{ fontSize: 18 }}>
        Bhaskara Buana Mulya
      </strong>

      <nav style={{ display: "flex", gap: 32, fontSize: 14 }}>
        <a href="#" style={{ textDecoration: "none", color: "#111827" }}>
          About
        </a>
        <a href="#" style={{ textDecoration: "none", color: "#111827" }}>
          Services
        </a>
        <a href="#" style={{ textDecoration: "none", color: "#111827" }}>
          Projects
        </a>
        <a href="#" style={{ textDecoration: "none", color: "#111827" }}>
          Capabilities
        </a>
        <a href="#" style={{ textDecoration: "none", color: "#111827" }}>
          Contact
        </a>
      </nav>
    </header>
  );
}
