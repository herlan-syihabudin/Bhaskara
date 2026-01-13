const services = [
  {
    title: "General Contracting",
    desc: "End-to-end project delivery from planning, execution, coordination, to final handover.",
  },
  {
    title: "MEP Engineering",
    desc: "Electrical, mechanical, and plumbing systems engineered for performance, safety, and reliability.",
  },
  {
    title: "Civil & Structural Works",
    desc: "Foundations, concrete, and structural steel works executed with engineering control.",
  },
  {
    title: "Interior Fit-Out",
    desc: "Commercial and industrial interior solutions integrated with MEP and schedule discipline.",
  },
];

export default function ServiceList() {
  return (
    <section className="bg-white">
      <div className="container-bbm py-24">
        <div className="max-w-2xl">
          <span className="badge">SERVICE SCOPE</span>

          <h2 className="mt-4">
            What we deliver
            <span className="block">across project lifecycle</span>
          </h2>

          <p className="mt-5">
            Our services are structured to support projects from
            early-stage planning through construction, testing,
            commissioning, and handover.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} className="card p-8">
              <span className="badge">Service</span>

              <h3 className="mt-4 text-lg text-gray-900">
                {s.title}
              </h3>

              <p className="mt-4 text-sm">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
