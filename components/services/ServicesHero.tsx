export default function ServicesHero() {
  return (
    <section className="bg-gray-50 border-b border-gray-200">
      <div className="container-bbm py-28">
        <div className="max-w-3xl">
          <span className="badge">SERVICES</span>

          <h1 className="mt-6">
            Integrated construction &
            <span className="block">engineering services</span>
          </h1>

          <p className="mt-6 text-lg">
            PT Bhaskara Buana Mulya provides end-to-end contracting
            and engineering services delivered through disciplined
            planning, safety-first execution, and accountable delivery.
          </p>

          {/* ➕ ENGINEERING CONTEXT (TAMBAHAN) */}
          <p className="mt-4 text-sm text-gray-600 max-w-2xl">
            Our services cover engineering coordination, site execution,
            and project controls across civil, structural, MEP, and
            interior works — aligned with approved drawings, method
            statements, and project requirements.
          </p>

          {/* ➕ FLOW ANCHOR */}
          <p className="mt-6 text-xs text-gray-500">
            Explore our core capabilities and execution scope below.
          </p>
        </div>
      </div>
    </section>
  );
}
