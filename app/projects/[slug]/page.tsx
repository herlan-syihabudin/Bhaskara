import { notFound } from "next/navigation";

const projects = {
  "industrial-plant-construction": {
    title: "Industrial Plant Construction",
    category: "Industrial",
    description:
      "Construction and coordination works for industrial facilities with strict safety and quality control.",
    images: [
      "/projects/industrial-1.jpg",
      "/projects/industrial-2.jpg",
    ],
  },
};

export default function ProjectDetail({
  params,
}: {
  params: { slug: string };
}) {
  const project = projects[params.slug as keyof typeof projects];

  if (!project) return notFound();

  return (
    <section className="container-bbm py-28">
      <span className="badge">{project.category}</span>

      <h1 className="mt-6">{project.title}</h1>

      <p className="mt-6 max-w-3xl text-lg">
        {project.description}
      </p>

      {/* IMAGE GRID */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {project.images.map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            className="rounded-xl border object-cover"
          />
        ))}
      </div>
    </section>
  );
}
