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

  const baseUrl = "https://bhaskara-lqtk.vercel.app";

  /* ===============================
     JSON-LD SCHEMA (LEVEL 4)
  ================================ */
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      /* ========= ORGANIZATION ========= */
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: "PT Bhaskara Buana Mulya",
        url: baseUrl,
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "Jl. Raya Kedaung, RT.002/RW.004, Cimuning, Mustika Jaya",
          addressLocality: "Bekasi",
          addressRegion: "Jawa Barat",
          postalCode: "17155",
          addressCountry: "ID",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+62-21-38716066",
          contactType: "Project Inquiry",
        },
      },

      /* ========= BREADCRUMB ========= */
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Projects",
            item: `${baseUrl}/projects`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: project.title,
            item: `${baseUrl}/projects/${project.slug}`,
          },
        ],
      },

      /* ========= PROJECT / CASE STUDY ========= */
      {
        "@type": "CreativeWork",
        "@id": `${baseUrl}/projects/${project.slug}#project`,
        name: project.title,
        description: project.overview,
        url: `${baseUrl}/projects/${project.slug}`,
        creator: {
          "@id": `${baseUrl}#organization`,
        },
        about: project.category,
        image: project.images.map((img) => ({
          "@type": "ImageObject",
          url: `${baseUrl}${img.src}`,
          caption: img.alt,
        })),
      },
    ],
  };

  return (
    <>
      {/* ===== SCHEMA INJECTION ===== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <ProjectClient project={project} />
    </>
  );
}
