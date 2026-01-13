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
        <div className="border border-gray-200 rounded-2xl bg-gray-50 p-6 md:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.k}
                className="bg-white rounded-xl p-6"
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
      </div>
    </section>
  );
}
