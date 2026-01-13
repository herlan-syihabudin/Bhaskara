const items = [
  {
    title: "General Contracting",
    desc: "End-to-end project delivery with disciplined planning, cost control, and execution excellence across industrial and commercial projects.",
    core: true,
  },
  {
    title: "MEP Engineering",
    desc: "Electrical, mechanical, and plumbing systems engineered for performance, reliability, safety, and regulatory compliance.",
    core: true,
  },
  {
    title: "Steel & Civil Works",
    desc: "Structural steel, foundations, concrete works, and integrated site infrastructure delivered with engineering precision.",
    core: false,
  },
  {
    title: "Interior Fit-Out",
    desc: "Durable, functional, and efficient interior solutions for operational, commercial, and industrial environments.",
    core: false,
  },
];

export default function WhatWeDo() {
  return (
    <section className="bg-white">
      <div className="container-bbm py-28">
        {/* SECTION HEADER */}
        <div className="max-w-2xl">
          <span className="badge">WHAT WE DO</span>

          <h2 className="mt-4">
            Integrated services delivered with
            <span className="block">engineering discipline</span>
          </h2>

          <p className="mt-5">
            We combine technical expertise, structured project management,
            and site execution rigor to deliver predictable, safe,
            and high-quality outcomes.
          </p>

          {/* ➕ Trust clarification (TAMBAHAN) */}
          <p className="mt-3 text-sm text-gray-500 max-w-xl">
            Our scope covers planning, coordination, execution, and handover,
            aligned with approved drawings, method statements, and project controls.
          </p>
        </div>

        {/* SERVICES GRID */}
        <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((x) => (
            <div
              key={x.title}
              className={`card p-8 group transition ${
                x.core ? "border-gray-300 shadow-sm" : ""
              }`}
            >
              {x.core && (
                <span className="badge mb-3 block">
                  CORE SERVICE
                </span>
              )}

              <h3 className="mt-2 text-lg">
                {x.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed">
                {x.desc}
              </p>

              {/* ➕ Micro affordance (TAMBAHAN) */}
              <div className="mt-6 text-sm font-medium text-gray-900 opacity-0 group-hover:opacity-100 transition">
                View capability →
              </div>
            </div>
          ))}
        </div>

        {/* DELIVERY STATEMENT */}
        <div className="mt-20 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500">
            All services are delivered through structured project controls,
            qualified supervision, safety-first execution, and transparent
            coordination from mobilization to final handover,
            ensuring compliance with specifications, schedules, and quality standards.
          </p>
        </div>
      </div>
    </section>
  );
}
