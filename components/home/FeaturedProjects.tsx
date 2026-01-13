const projects = [
  {
    title: "Industrial Facility Expansion",
    category: "Civil & Structural",
    desc: "Foundation, steel structure, and concrete works delivered for industrial expansion with strict schedule control.",
    scope: "Foundation • Steel Structure • Concrete Works",
  },
  {
    title: "Commercial Office Fit-Out",
    category: "Interior & MEP",
    desc: "End-to-end interior fit-out integrated with MEP systems and disciplined execution management.",
    scope: "Interior • MEP Coordination • Execution Control",
  },
  {
    title: "Power & Electrical Upgrade",
    category: "MEP Engineering",
    desc: "Electrical system upgrade executed with safety-first commissioning and regulatory compliance.",
    scope: "Electrical • Power Distribution • Commissioning",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="bg-gray-50">
      <div className="container-bbm py-28">
        {/* HEADER */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="badge">SELECTED PROJECTS</span>

            <h2 className="mt-4">
              Delivering results across
              <span className="block">industrial and commercial sectors</span>
            </h2>
          </div>

          <a
            href="/projects"
            className="text-sm font-medium text-gray-900 border-b border-gray-900 w-fit"
          >
            View all projects →
          </a>
        </div>

        {/* PROJECT GRID */}
        <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div
              key={p.title}
              className="card p-8 flex flex-col"
            >
              <span className="text-xs tracking-widest text-gray-500 uppercase">
                {p.category}
              </span>

              <h3 className="mt-3 text-lg">
                {p.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed">
                {p.desc}
              </p>

              {/* EXECUTION META (TAMBAHAN) */}
              <div className="mt-5 text-xs text-gray-500">
                Execution Scope:
                <span className="block mt-1 text-gray-700">
                  {p.scope}
                </span>
              </div>

              <div className="mt-auto pt-6 text-sm font-medium text-gray-900">
                View case study →
              </div>
            </div>
          ))}
        </div>

        {/* DELIVERY STATEMENT (TAMBAHAN) */}
        <div className="mt-20 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500">
            Selected projects above reflect our approach to disciplined execution,
            engineering coordination, and safety-focused delivery across diverse
            project scopes and operational environments.
          </p>
        </div>
      </div>
    </section>
  );
}
