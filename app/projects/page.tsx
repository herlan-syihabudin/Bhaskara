const projects = [
  "Industrial Plant Construction",
  "Warehouse & Factory Expansion",
  "Commercial Office Fit-Out",
  "Electrical & Power System Upgrade",
];

export default function ProjectsPage() {
  return (
    <section style={{ padding: "96px 48px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ fontSize: 40 }}>Projects</h1>

        <p style={{ marginTop: 16, fontSize: 18 }}>
          Selected projects delivered with strong engineering control
          and safety compliance.
        </p>

        <ul style={{ marginTop: 32, lineHeight: 2 }}>
          {projects.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
