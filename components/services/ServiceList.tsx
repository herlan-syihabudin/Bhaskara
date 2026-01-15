const services = [
  {
    title: "General Contracting",
    desc: "End-to-end project delivery from planning, execution, coordination, to final handover.",
    core: true,
  },
  {
    title: "MEP Engineering",
    desc: "Electrical, mechanical, and plumbing systems engineered for performance, safety, and reliability.",
    core: true,
  },
  {
    title: "Civil & Structural Works",
    desc: "Foundations, concrete, and structural steel works executed with engineering control.",
    core: false,
  },
  {
    title: "Interior Fit-Out",
    desc: "Commercial and industrial interior solutions integrated with MEP and schedule discipline.",
    core: false,
  },
];

export default function ServiceList() {
  return (
    <section className="bg-white">
      <div className="container-bbm py-24">
        {/* HEADER */}
        <div className="max-w-2xl">
          <span className="badge">SERVICE SCOPE</span>

          <h2 className="mt-4">
            What we deliver
            <span className="block">across project lifecycle</span>
          </h2>

          <p className="mt-5">
            Our services are structured to support projects from
            early-stage planning through construction, testing,
            commissioning, and handover.
          </p>

          {/* ➕ lifecycle clarification */}
          <p className="mt-3 text-sm text-gray-500 max-w-xl">
            Each service is executed through defined scope, approved method
            statements, coordinated supervision, and documented handover.
          </p>
        </div>

        {/* SERVICES GRID */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.title}
              className={`card p-8 transition ${
                s.core ? "border-gray-300 shadow-sm" : ""
              }`}
            >
              <span className="badge mb-3 block">
                {s.core ? "CORE SERVICE" : "SERVICE"}
              </span>

              <h3 className="mt-2 text-lg text-gray-900">
                {s.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed">
                {s.desc}
              </p>

              {/* ➕ execution affordance */}
              <p className="mt-6 text-xs text-gray-500">
                Delivered with engineering coordination and site control
              </p>
            </div>
          ))}
        </div>

        {/* DELIVERY ASSURANCE */}
        <div className="mt-20 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500">
            All services are delivered under structured project controls,
            qualified supervision, and safety-first execution to ensure
            predictable outcomes and compliance with technical requirements.
          </p>
        </div>
      </div>
    </section>
  );
}
