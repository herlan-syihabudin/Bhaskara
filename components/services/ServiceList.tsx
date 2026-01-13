const services = [
  {
    title: "General Contracting",
    desc: "End-to-end project delivery covering planning, procurement, construction, and handover with strict cost, quality, and safety control.",
  },
  {
    title: "MEP Engineering",
    desc: "Design, installation, and commissioning of electrical, mechanical, and plumbing systems engineered for reliability and compliance.",
  },
  {
    title: "Civil & Structural Works",
    desc: "Concrete works, foundations, structural steel, and site infrastructure for industrial and commercial projects.",
  },
  {
    title: "Interior Fit-Out",
    desc: "Functional, durable, and efficient interior solutions for offices, factories, and commercial facilities.",
  },
];

export default function ServiceList() {
  return (
    <section className="bg-white">
      <div className="container-bbm py-24">
        <div className="grid gap-10 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="card p-10">
              <h3 className="text-xl text-gray-900">{s.title}</h3>
              <p className="mt-4 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
