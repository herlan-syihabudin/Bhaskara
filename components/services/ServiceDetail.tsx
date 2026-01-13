const details = [
  {
    title: "General Contracting",
    points: [
      "Project planning, scheduling, and execution control",
      "Procurement and subcontractor management",
      "Site supervision and safety enforcement",
      "Quality assurance, testing, and handover documentation",
    ],
  },
  {
    title: "MEP Engineering",
    points: [
      "Electrical and power distribution systems",
      "Mechanical and HVAC systems",
      "Plumbing and fire protection systems",
      "Testing, commissioning, and as-built documentation",
    ],
  },
  {
    title: "Civil & Structural Works",
    points: [
      "Concrete works and foundations",
      "Structural steel fabrication and erection",
      "Industrial flooring and infrastructure",
      "Compliance with applicable structural standards",
    ],
  },
  {
    title: "Interior Fit-Out",
    points: [
      "Office and industrial interior works",
      "MEP coordination and integration",
      "Material selection for durability and efficiency",
      "Schedule-driven execution and handover",
    ],
  },
];

export default function ServiceDetail() {
  return (
    <section className="bg-gray-50">
      <div className="container-bbm py-24 space-y-20">
        {details.map((d) => (
          <div key={d.title}>
            <h3 className="text-2xl text-gray-900">{d.title}</h3>

            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {d.points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-2 block w-1.5 h-1.5 rounded-full bg-gray-900" />
                  <span className="text-gray-600">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
