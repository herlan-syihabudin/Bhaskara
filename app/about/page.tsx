export default function AboutPage() {
  return (
    <section className="bg-white">
      <div className="container-bbm py-28">

        {/* ================= HEADER ================= */}
        <div className="max-w-3xl">
          <span className="badge">ABOUT US</span>

          <h1 className="mt-6">
            PT Bhaskara Buana Mulya
          </h1>

          <p className="mt-8 text-lg leading-relaxed">
            PT Bhaskara Buana Mulya is an engineering-driven general contractor
            delivering civil, structural, MEP, and interior works with a strong
            emphasis on safety, quality, and disciplined execution across
            industrial and commercial environments.
          </p>

          <p className="mt-4 text-sm text-gray-600 max-w-2xl leading-relaxed">
            Our involvement extends beyond construction activities to include
            engineering coordination, site supervision, and structured project
            controls throughout the entire project lifecycle.
          </p>
        </div>

        {/* ================= POSITIONING ================= */}
        <div className="mt-20 max-w-4xl border-t border-gray-200 pt-12">
          <h2>
            Engineering-led delivery, not ad-hoc construction
          </h2>

          <p className="mt-6 leading-relaxed">
            We believe that successful project delivery is achieved through
            structured engineering planning, qualified site supervision, and
            disciplined execution — rather than reactive, ad-hoc decisions
            made on site.
          </p>

          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            Each project is managed with clearly defined scope, approved
            drawings and method statements, measurable performance controls,
            and accountable coordination between all disciplines involved.
          </p>
        </div>

        {/* ================= OPERATING PRINCIPLES ================= */}
        <div className="mt-20">
          <h2>
            Our Operating Principles
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2 max-w-4xl">
            <div className="card p-8">
              <h3>Health, Safety & Environment</h3>
              <p className="mt-3 text-sm leading-relaxed">
                Safety is embedded into our planning and execution processes
                through formal HSE management systems, site induction,
                toolbox meetings, and continuous supervision without compromise.
              </p>
            </div>

            <div className="card p-8">
              <h3>Engineering Discipline</h3>
              <p className="mt-3 text-sm leading-relaxed">
                Project execution is driven by engineering analysis,
                constructability review, coordinated shop drawings,
                and approved method statements to ensure predictable outcomes.
              </p>
            </div>

            <div className="card p-8">
              <h3>Quality Assurance & Control</h3>
              <p className="mt-3 text-sm leading-relaxed">
                Workmanship quality is maintained through inspection
                and test plans, systematic documentation, and continuous
                monitoring against project specifications.
              </p>
            </div>

            <div className="card p-8">
              <h3>Accountable Project Delivery</h3>
              <p className="mt-3 text-sm leading-relaxed">
                We maintain transparent communication, progress reporting,
                and accountability from mobilization through final handover,
                ensuring alignment with client objectives.
              </p>
            </div>
          </div>
        </div>

        {/* ================= LEGAL & COMPLIANCE ================= */}
        <div className="mt-24 max-w-4xl border-t border-gray-200 pt-12">
          <h2>
            Legal & Compliance
          </h2>

          <p className="mt-6 leading-relaxed">
            PT Bhaskara Buana Mulya is a legally registered Indonesian company
            operating in compliance with applicable laws and regulations
            governing construction and engineering services.
          </p>

          <p className="mt-4 text-sm text-gray-600 max-w-3xl leading-relaxed">
            Our operations are supported by formal corporate registration,
            statutory tax compliance, and relevant business permits required
            to perform general contracting, civil and structural works,
            and MEP engineering services.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 text-sm text-gray-700 max-w-3xl">
            <ul className="list-disc list-inside space-y-2">
              <li>Deed of Establishment and corporate registration</li>
              <li>Business Identification Number (NIB)</li>
              <li>Tax Registration (NPWP)</li>
            </ul>

            <ul className="list-disc list-inside space-y-2">
              <li>Relevant construction licenses and certifications</li>
              <li>Compliance with national HSE and labor regulations</li>
              <li>Governance, reporting, and operational controls</li>
            </ul>
          </div>

          <p className="mt-6 text-xs text-gray-500 max-w-3xl">
            Detailed legal documentation and certifications are available
            upon formal request during tender processes, audits,
            or contractual discussions.
          </p>
        </div>

        {/* ================= CLOSING ================= */}
        <div className="mt-24 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500 leading-relaxed">
            Our focus is not only on completing projects, but on delivering
            outcomes that are safe, reliable, and aligned with our clients’
            operational and business objectives.
          </p>

          <p className="mt-4 text-xs text-gray-500">
            This commitment underpins our long-term relationships with
            clients across industrial, commercial, and infrastructure sectors.
          </p>
        </div>

      </div>
    </section>
  );
}
