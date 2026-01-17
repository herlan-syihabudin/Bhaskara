const stats = [
  {
    k: "Health & Safety",
    v: "HSE management enforced through site induction, toolbox meetings, and permit-to-work systems.",
  },
  {
    k: "Quality Control",
    v: "Workmanship governed by inspection checklists, ITPs, and controlled documentation.",
  },
  {
    k: "Schedule Discipline",
    v: "Progress monitored through structured planning, sequencing, and regular reporting.",
  },
  {
    k: "Engineering Control",
    v: "Execution driven by approved drawings, method statements, and multi-discipline coordination.",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-white">
      <div className="container-bbm pb-24">

        {/* ================= INTRO ================= */}
        <div className="max-w-2xl mb-12">
          <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
            HOW WE DELIVER
          </p>

          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Structured delivery framework
          </h3>

          <p className="mt-4 text-sm text-gray-500 leading-relaxed">
            Our projects are executed through disciplined engineering,
            structured site controls, and accountable supervision to
            ensure safety, quality, and predictable delivery outcomes.
          </p>
        </div>

        {/* ================= TRUST GRID ================= */}
        <div className="border border-gray-200 rounded-2xl bg-gray-50 p-6 md:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.k}
                className="bg-white rounded-xl p-6
                           transition-all duration-200
                           hover:shadow-sm hover:-translate-y-0.5"
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

        {/* ================= DELIVERY ANCHOR ================= */}
        <div className="mt-12 max-w-3xl border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 leading-relaxed">
            This delivery framework is applied consistently across all
            project phases — from engineering and procurement to site
            execution and final handover — enabling controlled risk,
            compliance with specifications, and accountable project delivery.
          </p>
        </div>

      </div>
    </section>
  );
}
