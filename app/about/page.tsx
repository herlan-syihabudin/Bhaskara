export default function AboutPage() {
  return (
    <section className="bg-white">
      <div className="container-bbm py-28">

        {/* HEADER */}
        <div className="max-w-3xl">
          <span className="badge">ABOUT US</span>

          <h1 className="mt-6">
            PT Bhaskara Buana Mulya
          </h1>

          <p className="mt-8 text-lg">
            PT Bhaskara Buana Mulya is an engineering-driven general contractor
            delivering civil, structural, MEP, and interior works with a strong
            focus on safety, quality, and disciplined execution across
            industrial and commercial projects.
          </p>

          {/* ➕ CONTEXT ANCHOR (TAMBAHAN HALUS) */}
          <p className="mt-4 text-sm text-gray-600 max-w-2xl">
            Our role extends beyond construction activities, encompassing
            engineering coordination, site supervision, and structured
            project controls throughout the project lifecycle.
          </p>
        </div>

        {/* POSITIONING */}
        <div className="mt-20 max-w-4xl border-t border-gray-200 pt-12">
          <h2>
            Engineering-led execution, not just construction
          </h2>

          <p className="mt-6">
            We operate with the belief that successful project delivery is
            achieved through structured engineering planning, qualified site
            supervision, and disciplined execution rather than ad-hoc decisions
            on site. Every project is managed with clear scope definition,
            approved method statements, and measurable performance controls.
          </p>

          {/* ➕ OPERATIONAL CLARIFIER */}
          <p className="mt-4 text-sm text-gray-600">
            This approach allows us to manage risk, control quality, and
            maintain schedule predictability from mobilization through
            final handover.
          </p>
        </div>

        {/* PRINCIPLES */}
        <div className="mt-20">
          <h2>
            Our Operating Principles
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2 max-w-4xl">
            <div className="card p-8">
              <h3>Safety First</h3>
              <p className="mt-3 text-sm">
                Safety is embedded into our planning and execution processes.
                We enforce HSE standards across all project phases and site
                activities without compromise.
              </p>
            </div>

            <div className="card p-8">
              <h3>Engineering Discipline</h3>
              <p className="mt-3 text-sm">
                Our projects are led by engineering analysis, detailed planning,
                and approved method statements to ensure predictable outcomes.
              </p>
            </div>

            <div className="card p-8">
              <h3>Quality Assurance</h3>
              <p className="mt-3 text-sm">
                We implement quality control procedures, inspection records,
                and documentation to maintain workmanship and compliance.
              </p>
            </div>

            <div className="card p-8">
              <h3>Accountable Delivery</h3>
              <p className="mt-3 text-sm">
                We commit to transparent communication, progress reporting,
                and accountability from mobilization through final handover.
              </p>
            </div>
          </div>
        </div>

        {/* CLOSING STATEMENT */}
        <div className="mt-24 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500">
            Our focus is not only on completing projects, but on delivering
            outcomes that are safe, reliable, and aligned with our clients’
            operational and business objectives.
          </p>

          {/* ➕ STRATEGIC CLOSE */}
          <p className="mt-4 text-xs text-gray-500">
            This commitment underpins our long-term relationships with
            clients across industrial, commercial, and infrastructure sectors.
          </p>
        </div>
      </div>
    </section>
  );
}
