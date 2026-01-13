const items = [
  {
    title: "General Contracting",
    desc: "End-to-end project delivery with disciplined planning, control, and execution.",
  },
  {
    title: "MEP Engineering",
    desc: "Electrical, mechanical, plumbing systems built for performance and safety.",
  },
  {
    title: "Steel & Civil Works",
    desc: "Structural steel, foundations, concrete works, and site infrastructure.",
  },
  {
    title: "Interior Fit-Out",
    desc: "Durable and functional interior solutions for commercial & industrial spaces.",
  },
];

export default function WhatWeDo() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.25em] text-gray-500">
            WHAT WE DO
          </p>
          <h2 className="mt-3 text-3xl">
            Integrated services built to global standards.
          </h2>
          <p className="mt-4 text-gray-600">
            We combine engineering rigor, site discipline, and strong governance
            to deliver safe, predictable outcomes.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((x) => (
            <div
              key={x.title}
              className="border border-gray-200 rounded-2xl p-6 bg-white"
            >
              <div className="text-sm text-gray-500">Service</div>
              <h3 className="mt-2 text-lg">{x.title}</h3>
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                {x.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
