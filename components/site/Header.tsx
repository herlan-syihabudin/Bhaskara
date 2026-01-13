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
      {/* LOGO / BRAND */}
      <a
        href="/"
        style={{
          fontSize: 18,
          fontWeight: 700,
          textDecoration: "none",
          color: "#111827",
        }}
      >
        Bhaskara Buana Mulya
      </a>

      {/* NAVIGATION */}
      <nav style={{ display: "flex", gap: 32, fontSize: 14 }}>
        <a href="/about" style={navStyle}>
          About
        </a>
        <a href="/services" style={navStyle}>
          Services
        </a>
        <a href="/projects" style={navStyle}>
          Projects
        </a>
        <a href="/capabilities" style={navStyle}>
          Capabilities
        </a>
        <a href="/contact" style={navStyle}>
          Contact
        </a>
      </nav>
    </header>
  );
}

/* ===== shared nav style ===== */
const navStyle = {
  textDecoration: "none",
  color: "#111827",
  fontWeight: 500,
};
