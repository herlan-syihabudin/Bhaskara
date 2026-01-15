const points = [
  {
    title: "Engineering-Led Execution",
    desc: "Every project is delivered through structured planning, method statements, and coordinated execution aligned with approved drawings and technical standards.",
  },
  {
    title: "Safety-First Culture",
    desc: "Health, Safety, and Environment (HSE) principles are embedded in daily site activities, supervision, and reporting to minimize risk and ensure compliance.",
  },
  {
    title: "Controlled Cost & Schedule",
    desc: "We apply disciplined cost control, progress tracking, and coordination to maintain predictability from mobilization through final handover.",
  },
  {
    title: "Accountability & Transparency",
    desc: "Clear communication, documented processes, and accountable supervision ensure stakeholders have full visibility throughout the project lifecycle.",
  },
];

export default function WhyBBM() {
  return (
    <section className="bg-gray-50 border-y border-gray-200">
      <div className="container-bbm py-28">

        {/* ================= HEADER ================= */}
        <div className="max-w-2xl">
          <span className="badge">WHY BBM</span>

          <h2 className="mt-4">
            Built on discipline,
            <span className="block">driven by engineering</span>
          </h2>

          <p className="mt-5">
            Our approach is shaped by engineering rigor, site discipline,
            and a commitment to safety, quality, and accountable delivery
            across every phase of construction.
          </p>

          {/* Trust reinforcement (TAMBAHAN, bukan ganti) */}
          <p className="mt-3 text-sm text-gray-500 max-w-xl">
            This framework allows us to manage technical complexity,
            operational risk, and stakeholder expectations in a
            structured and transparent manner.
          </p>
        </div>

        {/* ================= DIFFERENTIATION GRID ================= */}
        <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => (
            <div
              key={p.title}
              className="card p-8 transition-all
                         hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-lg">
                {p.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ================= CLOSING STATEMENT ================= */}
        <div className="mt-20 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500 leading-relaxed">
            This disciplined approach allows us to deliver projects
            with predictable outcomes, controlled risk, and long-term
            operational reliability — supporting our clients from
            early planning through final handover and operation.
          </p>
        </div>

      </div>
    </section>
  );
}
