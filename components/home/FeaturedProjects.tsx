import Link from "next/link";
import { projects } from "@/lib/projectsData";

export default function FeaturedProjects() {
  return (
    <section className="bg-gray-50">
      <div className="container-bbm py-28">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="badge">SELECTED PROJECTS</span>

            <h2 className="mt-4">
              Engineered delivery across
              <span className="block">industrial and commercial environments</span>
            </h2>

            <p className="mt-4 text-sm text-gray-600 max-w-xl">
              The following projects highlight our capability to execute
              complex scopes through structured engineering, disciplined
              project controls, and safety-first site execution.
            </p>
          </div>

          <Link
            href="/projects"
            className="text-sm font-medium text-gray-900
                       border-b border-gray-900 w-fit
                       hover:opacity-70 transition"
          >
            View full project list →
          </Link>
        </div>

        {/* ================= PROJECT GRID ================= */}
        <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              aria-label={`View project ${p.title}`}
              className="card p-8 flex flex-col group
                         transition-all duration-200
                         hover:shadow-md hover:-translate-y-0.5"
            >
              {/* CATEGORY */}
              <span className="text-xs tracking-widest text-gray-500 uppercase">
                {p.category}
              </span>

              {/* TITLE */}
              <h3 className="mt-3 text-lg text-gray-900 leading-snug">
                {p.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="mt-4 text-sm text-gray-700 leading-relaxed">
                {p.desc}
              </p>

              {/* EXECUTION SNAPSHOT */}
              <div className="mt-5 text-xs text-gray-500 leading-relaxed">
                Execution focus:
                <span className="block mt-1 text-gray-700">
                  Structured planning, multi-discipline coordination,
                  quality control, and HSE compliance.
                </span>
              </div>

              {/* DELIVERY SIGNAL */}
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="px-2 py-1 text-[11px] rounded-md bg-gray-100 text-gray-700">
                  Engineering-led
                </span>
                <span className="px-2 py-1 text-[11px] rounded-md bg-gray-100 text-gray-700">
                  Safety-first
                </span>
                <span className="px-2 py-1 text-[11px] rounded-md bg-gray-100 text-gray-700">
                  Controlled delivery
                </span>
              </div>

              {/* CTA */}
              <div
                className="mt-auto pt-6 text-sm font-medium text-gray-900
                           opacity-0 group-hover:opacity-100 transition"
              >
                View case study →
              </div>
            </Link>
          ))}
        </div>

        {/* ================= FOOTNOTE ================= */}
        <div className="mt-20 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500 leading-relaxed">
            Detailed scope, execution methodology, and project documentation
            can be discussed during proposal, tender clarification, or
            client meetings upon request.
          </p>
        </div>

      </div>
    </section>
  );
}
