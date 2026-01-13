const items = [
  {
    title: "General Contracting",
    desc: "End-to-end project delivery with disciplined planning, cost control, and execution excellence.",
  },
  {
    title: "MEP Engineering",
    desc: "Electrical, mechanical, and plumbing systems engineered for performance, reliability, and safety.",
  },
  {
    title: "Steel & Civil Works",
    desc: "Structural steel, foundations, concrete works, and integrated site infrastructure.",
  },
  {
    title: "Interior Fit-Out",
    desc: "Durable, functional, and efficient interior solutions for commercial and industrial spaces.",
  },
];

export default function WhatWeDo() {
  return (
    <section className="bg-white">
      <div className="container-bbm py-24">
        {/* SECTION HEADER */}
        <div className="max-w-2xl">
          <span className="badge">WHAT WE DO</span>

          <h2 className="mt-4">
            Integrated services built to
            <span className="block text-gray-900">
              global engineering standards
            </span>
          </h2>

          <p className="mt-5">
            We combine engineering rigor, site discipline, and strong governance
            to deliver safe, predictable, and high-quality outcomes across all
            project phases.
          </p>
        </div>

        {/* SERVICES GRID */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((x) => (
            <div
              key={x.title}
              className="card p-8 group hover:border-gray-300"
            >
              <span className="badge">Service</span>

              <h3 className="mt-4 text-lg text-gray-900">
                {x.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed">
                {x.desc}
              </p>

              <div className="mt-6 text-sm font-medium text-gray-900 opacity-0 group-hover:opacity-100 transition">
                Learn more →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
