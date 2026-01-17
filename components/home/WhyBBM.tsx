const points = [
  {
    title: "Engineering-Led Project Delivery",
    desc: "Project execution is driven by structured engineering planning, coordinated shop drawings, and approved method statements — ensuring constructability, safety, and predictable outcomes.",
  },
  {
    title: "Embedded Safety Management",
    desc: "Health, Safety, and Environment (HSE) controls are integrated into daily site operations through induction, toolbox meetings, supervision, and formal permit-to-work systems.",
  },
  {
    title: "Controlled Cost and Schedule",
    desc: "We apply disciplined planning, sequencing, and progress monitoring to maintain cost and schedule predictability throughout all phases of project execution.",
  },
  {
    title: "Accountable and Transparent Execution",
    desc: "Clear communication, documented processes, and accountable supervision provide stakeholders with continuous visibility and control across the project lifecycle.",
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
            Disciplined delivery,
            <span className="block">engineered for reliability</span>
          </h2>

          <p className="mt-5 leading-relaxed">
            Our differentiation lies not in claims, but in how projects
            are planned, controlled, and executed through engineering
            discipline, site rigor, and accountable project governance.
          </p>

          <p className="mt-3 text-sm text-gray-500 max-w-xl leading-relaxed">
            This approach enables us to manage technical complexity,
            operational risk, and stakeholder expectations in a
            structured and transparent manner.
          </p>
        </div>

        {/* ================= DIFFERENTIATION GRID ================= */}
        <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => (
            <div
              key={p.title}
              className="card p-8 transition-all duration-200
                         hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-lg text-gray-900 leading-snug">
                {p.title}
              </h3>

              <p className="mt-4 text-sm text-gray-700 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ================= STRATEGIC CLOSING ================= */}
        <div className="mt-20 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500 leading-relaxed">
            By combining engineering control, disciplined execution,
            and transparent governance, we deliver projects with
            predictable outcomes, controlled risk, and long-term
            operational reliability — from early planning through
            final handover and operation.
          </p>
        </div>

      </div>
    </section>
  );
}
