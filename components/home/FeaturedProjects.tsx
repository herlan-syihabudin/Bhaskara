import Link from "next/link";
import { projects } from "@/lib/projectsData";

export default function FeaturedProjects() {
  return (
    <section className="bg-gray-50">
      <div className="container-bbm py-28">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="badge">SELECTED PROJECTS</span>
            <h2 className="mt-4">
              Delivering results across
              <span className="block">industrial and commercial sectors</span>
            </h2>
          </div>

          <Link
            href="/projects"
            className="text-sm font-medium text-gray-900 border-b border-gray-900 w-fit"
          >
            View all projects →
          </Link>
        </div>

        <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="card p-8 flex flex-col group
                         transition hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-xs tracking-widest text-gray-500 uppercase">
                {p.category}
              </span>

              <h3 className="mt-3 text-lg">{p.title}</h3>

              <p className="mt-4 text-sm">{p.desc}</p>

              <div className="mt-auto pt-6 text-sm font-medium text-gray-900
                              opacity-0 group-hover:opacity-100 transition">
                View case study →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
