const stats = [
  {
    k: "Safety",
    v: "HSE-first culture enforced across all project sites.",
  },
  {
    k: "Quality",
    v: "Strict workmanship standards with documentation control.",
  },
  {
    k: "Delivery",
    v: "Schedule discipline supported by progress tracking.",
  },
  {
    k: "Engineering",
    v: "MEP and execution driven by approved method statements.",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-white">
      <div className="container-bbm pb-24">

        {/* ================= INTRO ================= */}
        <div className="max-w-2xl mb-10">
          <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
            HOW WE DELIVER
          </p>

          {/* Micro context (TAMBAHAN HALUS) */}
          <p className="mt-3 text-sm text-gray-500">
            Our delivery framework is built on engineering control,
            site discipline, and accountable execution.
          </p>
        </div>

        {/* ================= TRUST GRID ================= */}
        <div className="border border-gray-200 rounded-2xl bg-gray-50 p-6 md:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.k}
                className="bg-white rounded-xl p-6
                           transition hover:shadow-sm hover:-translate-y-0.5"
              >
                <div className="text-xs tracking-widest text-gray-500 uppercase">
                  {s.k}
                </div>

                <div className="mt-3 text-sm font-medium text-gray-900 leading-relaxed">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= TRUST ANCHOR ================= */}
        <div className="mt-10 max-w-3xl">
          <p className="text-sm text-gray-500 leading-relaxed">
            These principles guide every phase of our projects — from planning
            and procurement to site execution and final handover — ensuring
            predictable outcomes, controlled risk, and accountable delivery.
          </p>
        </div>

      </div>
    </section>
  );
}
