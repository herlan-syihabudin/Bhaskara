import { notFound } from "next/navigation";
import { projects } from "@/lib/projectsData";
import ProjectClient from "./ProjectClient";
import type { Metadata } from "next";

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
      images: project.images[0],
    },
  };
}

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) return notFound();

  return <ProjectClient project={project} />;
}
