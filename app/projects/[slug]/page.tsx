import { notFound } from "next/navigation";
import Link from "next/link";

const projects = {
  "industrial-plant-construction": {
    title: "Industrial Plant Construction",
    category: "Industrial",
    overview:
      "Construction and coordination works for industrial facilities executed with strict safety controls, engineering discipline, and structured project management.",
    scope: [
      "Foundation and substructure works",
      "Structural steel fabrication and erection",
      "Concrete slabs and supporting structures",
      "Coordination with ongoing plant operations",
    ],
    execution: [
      "Phased execution to maintain plant operation continuity",
      "Strict HSE enforcement and daily toolbox meetings",
      "Inspection and Test Plans (ITP) for structural works",
      "Progress tracking and coordination with client representatives",
    ],
    images: [
      "/projects/industrial-1.jpg",
      "/projects/industrial-2.jpg",
      "/projects/industrial-3.jpg",
    ],
  },
};

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = projects[params.slug as keyof typeof projects];

  if (!project) return notFound();

  return (
    <section className="bg-white">
      <div className="container-bbm py-28">

        {/* BACK LINK */}
        <div className="text-sm text-gray-500">
          <Link href="/projects" className="hover:underline">
            Projects
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{project.title}</span>
        </div>

        {/* HEADER */}
        <div className="mt-6 max-w-3xl">
          <span className="badge">{project.category}</span>

          <h1 className="mt-4">
            {project.title}
          </h1>

          <p className="mt-6 text-lg text-gray-800">
            {project.overview}
          </p>
        </div>

        {/* IMAGE GALLERY */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {project.images.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className="h-56 w-full rounded-xl border object-cover"
            />
          ))}
        </div>

        {/* SCOPE & EXECUTION */}
        <div className="mt-20 grid gap-10 md:grid-cols-2 max-w-5xl">
          <div className="card p-8">
            <h2 className="text-lg font-semibold">
              Project Scope
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {project.scope.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-gray-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-8">
            <h2 className="text-lg font-semibold">
              Execution & Delivery
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {project.execution.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-gray-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CLOSING / CTA */}
        <div className="mt-20 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500">
            This project demonstrates our approach to disciplined execution,
            engineering coordination, and safety-first delivery within active
            industrial environments.
          </p>

          <p className="mt-4 text-sm">
            To discuss similar projects,{" "}
            <Link href="/contact" className="font-medium hover:underline">
              contact our team
            </Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
