import Link from "next/link";
import Image from "next/image";

const projects = [
  {
    slug: "industrial-plant-construction",
    title: "Industrial Plant Construction",
    category: "Industrial",
    desc: "Construction and coordination works for industrial facilities with strict safety and quality control.",
    image: "/projects/industrial.jpg",
  },
  {
    slug: "warehouse-factory-expansion",
    title: "Warehouse & Factory Expansion",
    category: "Civil & Structural",
    desc: "Structural, foundation, and expansion works to support operational growth.",
    image: "/projects/warehouse.jpg",
  },
  {
    slug: "commercial-office-fit-out",
    title: "Commercial Office Fit-Out",
    category: "Interior",
    desc: "End-to-end office fit-out with integrated MEP and schedule discipline.",
    image: "/projects/office.jpg",
  },
  {
    slug: "electrical-power-system-upgrade",
    title: "Electrical & Power System Upgrade",
    category: "MEP Engineering",
    desc: "Electrical system upgrade and commissioning with safety-first execution.",
    image: "/projects/electrical.jpg",
  },
];

export default function ProjectsPage() {
  return (
    <section className="bg-white">
      <div className="container-bbm py-28">

        {/* HEADER */}
        <div className="max-w-3xl">
          <span className="badge">PROJECTS</span>

          <h1 className="mt-6">
            Selected projects delivered
            <span className="block">with engineering discipline</span>
          </h1>

          <p className="mt-6 text-lg">
            Below are selected projects delivered across industrial,
            commercial, and infrastructure sectors, executed with strong
            engineering control and safety compliance.
          </p>
        </div>

        {/* PROJECT GRID */}
        <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              aria-label={`View project ${p.title}`}
              className="group block rounded-2xl border border-gray-200
                         overflow-hidden transition hover:shadow-lg"
            >
              {/* IMAGE */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={p.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500
                             group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t
                                from-black/50 via-black/10 to-transparent" />

                <span className="absolute top-4 left-4 badge bg-white/90">
                  {p.category}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-8">
                <h3 className="text-lg font-semibold text-gray-900">
                  {p.title}
                </h3>

                <p className="mt-3 text-sm text-gray-700">
                  {p.desc}
                </p>

                <div className="mt-6 text-sm font-medium text-gray-900
                                opacity-0 translate-y-1
                                group-hover:opacity-100
                                group-hover:translate-y-0
                                transition">
                  View project →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CLOSING */}
        <div className="mt-24 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500">
            Detailed project case studies are available upon formal request
            and can be discussed during proposal or tender clarification.
          </p>
        </div>
      </div>
    </section>
  );
}
