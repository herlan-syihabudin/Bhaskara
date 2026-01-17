import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="bg-gray-900 text-white">
      <div className="container-bbm py-28">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">

          {/* ================= COPY ================= */}
          <div className="max-w-2xl">
            <h2 className="text-white leading-tight">
              Let’s discuss your project
              <span className="block text-gray-300">
                with clarity, safety, and execution discipline
              </span>
            </h2>

            <p className="mt-6 text-gray-300 leading-relaxed">
              Engage with our engineering and project team to align
              scope, technical requirements, execution strategy,
              and delivery expectations from the outset.
            </p>

            {/* EXPECTATION SETTING */}
            <p className="mt-4 text-sm text-gray-400 max-w-xl leading-relaxed">
              Early discussions focus on constructability, risk control,
              schedule alignment, and coordination approach — ensuring
              informed decisions before project commitment.
            </p>
          </div>

          {/* ================= CTA ================= */}
          <div className="flex flex-col gap-4 items-start lg:items-end">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center
                         px-9 py-4 bg-white text-gray-900
                         text-sm font-semibold rounded-xl
                         transition-all duration-200
                         hover:bg-gray-100 hover:-translate-y-0.5"
            >
              Start a project discussion
            </Link>

            {/* TRUST MICROCOPY */}
            <div className="text-xs text-gray-400 text-left lg:text-right max-w-xs">
              Initial response handled directly by our engineering
              and project coordination team.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
