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
      robots: { index: false },
    };
  }

  const url = `https://bhaskara-lqtk.vercel.app/projects/${project.slug}`;

  return {
    title: `${project.title} | PT Bhaskara Buana Mulya`,
    description: project.desc,

    alternates: {
      canonical: url,
    },

    openGraph: {
      type: "article",
      url,
      title: project.title,
      description: project.overview,
      images: [
        {
          url: project.images[0].src,
          alt: project.images[0].alt || project.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.desc,
      images: [project.images[0].src],
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
