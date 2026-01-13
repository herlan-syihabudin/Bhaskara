const projects = [
  {
    title: "Industrial Plant Construction",
    category: "Industrial",
    desc: "Construction and coordination works for industrial facilities with strict safety and quality control.",
  },
  {
    title: "Warehouse & Factory Expansion",
    category: "Civil & Structural",
    desc: "Structural, foundation, and expansion works to support operational growth.",
  },
  {
    title: "Commercial Office Fit-Out",
    category: "Interior",
    desc: "End-to-end office fit-out with integrated MEP and schedule discipline.",
  },
  {
    title: "Electrical & Power System Upgrade",
    category: "MEP Engineering",
    desc: "Electrical system upgrade and commissioning with safety-first execution.",
  },
];

export default function ProjectsPage() {
  return (
    <section className="bg-white">
      <div className="container-bbm py-28">
        {/* HEADER */}
        <div className="max-w-3xl">
          <span className="badge">PROJECTS</span>

          <h1 className="mt-6">
            Selected projects delivered
            <span className="block">with engineering discipline</span>
          </h1>

          <p className="mt-6 text-lg">
            Below are selected projects delivered across industrial,
            commercial, and infrastructure sectors, executed with strong
            engineering control and safety compliance.
          </p>
        </div>

        {/* PROJECT GRID */}
        <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.title} className="card p-8 group">
              <span className="badge">{p.category}</span>

              <h3 className="mt-4 text-lg text-gray-900">
                {p.title}
              </h3>

              <p className="mt-4 text-sm">
                {p.desc}
              </p>

              <div className="mt-8 text-sm font-medium text-gray-900 opacity-0 group-hover:opacity-100 transition">
                View project →
              </div>
            </div>
          ))}
        </div>

        {/* CLOSING */}
        <div className="mt-24 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500">
            Detailed project case studies can be provided upon request
            or discussed during proposal and tender clarification.
          </p>
        </div>
      </div>
    </section>
  );
}
