const details = [
  {
    title: "General Contracting",
    desc: "End-to-end delivery managed through disciplined planning, site control, and accountable execution.",
    points: [
      "Project planning, scheduling, and execution control",
      "Procurement and subcontractor management",
      "Site supervision and safety enforcement",
      "Quality assurance, testing, and handover documentation",
    ],
  },
  {
    title: "MEP Engineering",
    desc: "MEP systems engineered, coordinated, and commissioned to meet operational and safety requirements.",
    points: [
      "Electrical and power distribution systems",
      "Mechanical and HVAC systems",
      "Plumbing and fire protection systems",
      "Testing, commissioning, and as-built documentation",
    ],
  },
  {
    title: "Civil & Structural Works",
    desc: "Structural works executed with engineering review, compliance, and site discipline.",
    points: [
      "Concrete works and foundations",
      "Structural steel fabrication and erection",
      "Industrial flooring and infrastructure",
      "Compliance with applicable structural standards",
    ],
  },
  {
    title: "Interior Fit-Out",
    desc: "Functional and durable interior solutions delivered through coordinated execution.",
    points: [
      "Office and industrial interior works",
      "MEP coordination and integration",
      "Material selection for durability and efficiency",
      "Schedule-driven execution and handover",
    ],
  },
];

export default function ServiceDetail() {
  return (
    <section className="bg-gray-50 border-t border-gray-200">
      <div className="container-bbm py-28">
        {/* SECTION HEADER */}
        <div className="max-w-2xl mb-24">
          <span className="badge">DELIVERY APPROACH</span>

          <h2 className="mt-4">
            How we deliver
            <span className="block">each service</span>
          </h2>

          <p className="mt-5">
            Each service is delivered through structured planning,
            engineering coordination, and site execution aligned
            with safety, quality, and schedule objectives.
          </p>

          {/* ➕ execution anchor */}
          <p className="mt-3 text-sm text-gray-500 max-w-xl">
            Our delivery approach emphasizes repeatable processes,
            documented controls, and accountable supervision across
            all scopes of work.
          </p>
        </div>

        {/* DETAIL BLOCKS */}
        <div className="space-y-20">
          {details.map((d) => (
            <div
              key={d.title}
              className="card p-10 grid gap-10 lg:grid-cols-2"
            >
              {/* LEFT */}
              <div>
                <h3 className="text-2xl text-gray-900">
                  {d.title}
                </h3>

                <p className="mt-4 max-w-xl">
                  {d.desc}
                </p>

                {/* ➕ assurance micro copy */}
                <p className="mt-4 text-sm text-gray-500 max-w-xl">
                  Executed under defined scope, approved drawings,
                  and coordinated supervision.
                </p>
              </div>

              {/* RIGHT */}
              <ul className="grid gap-4 text-sm">
                {d.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-2 block w-1.5 h-1.5 rounded-full bg-gray-900" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CLOSING ASSURANCE */}
        <div className="mt-24 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500">
            By applying the same disciplined delivery framework across
            all services, we ensure consistency, risk control, and
            predictable outcomes throughout the project lifecycle.
          </p>
        </div>
      </div>
    </section>
  );
}
