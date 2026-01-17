"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/projectsData";

export default function ProjectClient({
  project,
}: {
  project: Project;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  /* ===============================
     KEYBOARD & ESC HANDLER
  ================================ */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIndex(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const activeImage =
    activeIndex !== null ? project.images[activeIndex] : null;

  return (
    <section className="bg-white">
      <div className="container-bbm py-28">

        {/* ================= BREADCRUMB ================= */}
        <div className="text-sm text-gray-500">
          <Link href="/projects" className="hover:underline">
            Projects
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{project.title}</span>
        </div>

        {/* ================= HEADER ================= */}
        <div className="mt-6 max-w-3xl">
          <span className="badge">{project.category}</span>
          <h1 className="mt-4">{project.title}</h1>
          <p className="mt-6 text-lg text-gray-800">
            {project.overview}
          </p>
        </div>

        {/* ================= IMAGE GALLERY ================= */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {project.images.map((img, idx) => (
            <button
              key={img.src}
              onClick={() => setActiveIndex(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setActiveIndex(idx);
              }}
              tabIndex={0}
              aria-label={`View project image ${idx + 1}`}
              className="group relative overflow-hidden rounded-xl border
                         focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={img.src}
                  alt={img.alt || project.title}
                  fill
                  sizes="(max-width: 640px) 100vw,
                         (max-width: 1024px) 50vw,
                         33vw"
                  className="object-cover transition-transform
                             group-hover:scale-105"
                  priority={idx === 0}
                />
              </div>

              <div className="absolute inset-0 bg-black/0
                              group-hover:bg-black/10 transition" />
            </button>
          ))}
        </div>

        {/* ================= SEO IMAGE CONTEXT ================= */}
        <p className="sr-only">
          Project documentation images for {project.title} delivered by
          PT Bhaskara Buana Mulya.
        </p>

        {/* ================= SCOPE & EXECUTION ================= */}
        <div className="mt-20 grid gap-10 md:grid-cols-2 max-w-5xl">
          <div className="card p-8">
            <h2 className="text-lg font-semibold">Project Scope</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {project.scope.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-[6px] w-[6px]
                                   rounded-full bg-gray-400" />
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
                  <span className="mt-[6px] h-[6px] w-[6px]
                                   rounded-full bg-gray-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ================= CTA ================= */}
        <div className="mt-20 max-w-3xl border-t border-gray-200 pt-10">
          <p className="text-sm text-gray-500">
            This project reflects our disciplined execution model,
            engineering coordination, and safety-first delivery.
          </p>

          <p className="mt-4 text-sm">
            To discuss similar projects,{" "}
            <Link href="/contact" className="font-medium hover:underline">
              contact our engineering team
            </Link>.
          </p>
        </div>
      </div>

      {/* ================= LIGHTBOX ================= */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveIndex(null)}
        >
          {/* CLOSE BUTTON */}
          <div className="absolute right-4 top-4 z-10">
            <button
              onClick={() => setActiveIndex(null)}
              className="rounded-xl bg-white/10 px-4 py-2 text-white
                         hover:bg-white/20 transition"
            >
              Close ✕
            </button>
          </div>

          {/* IMAGE */}
          <div className="flex h-full items-center justify-center p-6">
            <div
              className="relative w-[90vw] max-w-5xl h-[75vh]
                         rounded-xl overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeImage.src}
                alt={activeImage.alt || project.title}
                fill
                sizes="90vw"
                className="object-contain bg-black"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
