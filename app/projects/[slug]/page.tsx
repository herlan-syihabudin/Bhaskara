import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/lib/projectsData";
import ProjectClient from "./ProjectClient";

/* ===============================
   METADATA (SEO + OPEN GRAPH)
================================ */
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    return {
      title: "Project Not Found | PT Bhaskara Buana Mulya",
    };
  }

  return {
    title: `${project.title} | PT Bhaskara Buana Mulya`,
    description: project.desc,
    openGraph: {
      title: project.title,
      description: project.overview,
      images: [
        {
          url: project.images[0].src, // ✅ FIX TYPE
          alt: project.images[0].alt || project.title,
        },
      ],
    },
  };
}

/* ===============================
   PAGE (SERVER COMPONENT)
================================ */
export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) return notFound();

  return <ProjectClient project={project} />;
}
