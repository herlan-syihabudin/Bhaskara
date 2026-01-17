"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "@/lib/projectsData";

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = projects.find((p) => p.slug === params.slug);
  const [activeImage, setActiveImage] = useState<string | null>(null);

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
          <h1 className="mt-4">{project.title}</h1>
          <p className="mt-6 text-lg text-gray-800">
            {project.overview}
          </p>
        </div>

        {/* IMAGE GALLERY */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {project.images.map((src) => (
            <button
              key={src}
              onClick={() => setActiveImage(src)}
              className="group relative overflow-hidden rounded-xl border focus:outline-none"
            >
              <img
                src={src}
                alt={project.title}
                className="h-56 w-full object-cover transition-transform
                           group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0
                              group-hover:bg-black/10 transition" />
            </button>
          ))}
        </div>

        {/* SCOPE & EXECUTION */}
        <div className="mt-20 grid gap-10 md:grid-cols-2 max-w-5xl">
          <div className="card p-8">
            <h2 className="text-lg font-semibold">Project Scope</h2>
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
            <h2 className="text-lg font-semibold">Execution & Delivery</h2>
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

        {/* CTA */}
        <div className="mt-20 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500">
            This project demonstrates our approach to disciplined execution,
            engineering coordination, and safety-first delivery.
          </p>

          <p className="mt-4 text-sm">
            To discuss similar projects,{" "}
            <Link href="/contact" className="font-medium hover:underline">
              contact our team
            </Link>.
          </p>
        </div>
      </div>

      {/* LIGHTBOX */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-black/80 backdrop-blur-sm"
          onClick={() => setActiveImage(null)}
        >
          <img
            src={activeImage}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-xl"
          />
        </div>
      )}
    </section>
  );
}
