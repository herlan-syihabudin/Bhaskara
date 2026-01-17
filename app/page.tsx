import type { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";

import WhatWeDo from "@/components/home/WhatWeDo";
import TrustBar from "@/components/home/TrustBar";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import CallToAction from "@/components/home/CallToAction";
import WhyBBM from "@/components/home/WhyBBM";
import Reveal from "@/components/ui/Reveal";
import ClientSummary from "@/components/credentials/ClientSummary";

/* ================= SEO METADATA ================= */
export const metadata: Metadata = {
  title:
    "PT Bhaskara Buana Mulya | Engineering, Construction & MEP Contractor Indonesia",
  description:
    "Engineering-driven general contractor based in Bekasi, serving Jabodetabek, Jawa, and seluruh Indonesia. Specialist in industrial construction, civil & steel works, MEP engineering, and interior fit-out.",
  alternates: {
    canonical: "https://bhaskara-lqtk.vercel.app",
  },
  openGraph: {
    title:
      "PT Bhaskara Buana Mulya | Engineering & Construction Contractor Indonesia",
    description:
      "General contractor and MEP engineering company serving industrial and commercial projects across Jabodetabek, Jawa, and Indonesia.",
    url: "https://bhaskara-lqtk.vercel.app",
    siteName: "PT Bhaskara Buana Mulya",
    images: [
      {
        url: "/hero-project.jpg",
        width: 1200,
        height: 630,
        alt: "Industrial construction and MEP project execution in Indonesia",
      },
    ],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ================= PAGE ================= */
export default function HomePage() {
  const baseUrl = "https://bhaskara-lqtk.vercel.app";

  /* ================= LOCAL BUSINESS SCHEMA ================= */
  const localSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "PT Bhaskara Buana Mulya",
    legalName: "PT Bhaskara Buana Mulya",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/hero-project.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Raya Kedaung, Cimuning",
      addressLocality: "Bekasi",
      addressRegion: "Jawa Barat",
      postalCode: "17155",
      addressCountry: "ID",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Jabodetabek" },
      { "@type": "AdministrativeArea", name: "Pulau Jawa" },
      { "@type": "Country", name: "Indonesia" },
    ],
    description:
      "Engineering-driven general contractor providing industrial construction, civil & steel works, MEP engineering, and interior fit-out services across Indonesia.",
  };

  return (
    <>
      {/* ===== LOCAL SEO SCHEMA ===== */}
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localSchema),
        }}
      />

      {/* ================= HERO SECTION ================= */}
      <section className="relative border-b border-gray-200 overflow-hidden">

        {/* ===== BACKGROUND IMAGE ===== */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero-project.jpg"
            alt="Industrial construction and MEP engineering project in Indonesia"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50" />
        </div>

        <div className="container-bbm py-32 grid lg:grid-cols-12 gap-16 items-center">

          {/* ================= LEFT CONTENT ================= */}
          <div className="lg:col-span-7">

            <Reveal>
              <p className="text-xs tracking-[0.35em] text-gray-600 mb-4">
                ENGINEERING • SAFETY • EXECUTION • MEP • CONSTRUCTION
              </p>
            </Reveal>

            <Reveal className="reveal-delay-1">
              <p className="text-sm text-gray-700 mb-6 max-w-xl">
                Engineering-driven general contractor serving Jabodetabek,
                Jawa, and industrial regions across Indonesia.
              </p>
            </Reveal>

            {/* ===== H1 ===== */}
            <Reveal className="reveal-delay-2">
              <h1 className="max-w-3xl">
                Engineering-driven contractor delivering
                <span className="block mt-2 relative">
                  world-class construction and MEP solutions.
                  <span className="absolute left-0 -bottom-3 w-24 h-1 bg-[#E6B800] rounded-full" />
                </span>
              </h1>
            </Reveal>

            <Reveal className="reveal-delay-3">
              <p className="mt-10 text-lg max-w-2xl text-gray-800">
                PT Bhaskara Buana Mulya delivers integrated general contracting,
                civil and steel construction, MEP engineering, and interior
                fit-out for industrial and commercial projects throughout Indonesia.
              </p>
            </Reveal>

            <Reveal className="reveal-delay-4">
              <p className="mt-4 text-sm text-gray-700 max-w-2xl">
                Based in Bekasi, we support projects across Jabodetabek,
                Central Java, and other strategic industrial regions with
                disciplined execution and safety-first culture.
              </p>
            </Reveal>

            {/* CTA */}
            <Reveal className="reveal-delay-4">
              <div className="mt-12 flex flex-wrap gap-4">
                <a
                  href="/contact"
                  className="px-8 py-4 rounded-xl font-medium text-white
                             transition hover:opacity-90 hover:-translate-y-0.5"
                  style={{ backgroundColor: "#2F6F55" }}
                >
                  Discuss Your Project
                </a>

                <a
                  href="/projects"
                  className="px-8 py-4 rounded-xl border font-medium
                             transition hover:bg-[#2F6F55]/5"
                  style={{
                    borderColor: "#2F6F55",
                    color: "#2F6F55",
                  }}
                >
                  View Relevant Projects
                </a>
              </div>
            </Reveal>
          </div>

          {/* ================= RIGHT STATS ================= */}
          <Reveal className="lg:col-span-5 reveal-delay-2">
            <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-2xl
                            p-8 grid grid-cols-2 gap-8 shadow-sm">
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">10+</p>
                <p className="text-sm text-gray-600">
                  Years delivering engineered projects
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Projects Delivered</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">120+</p>
                <p className="text-sm text-gray-600">
                  Across Jabodetabek & Java
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Core Disciplines</p>
                <p className="mt-2 text-lg font-medium text-gray-900">
                  MEP • Civil • Steel
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Service Coverage</p>
                <p className="mt-2 text-lg font-medium text-gray-900">
                  Indonesia Wide
                </p>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ================= LOCAL SEO CONTEXT (SAFE) ================= */}
      <section className="sr-only">
        <h2>General Contractor & MEP Engineering in Jabodetabek and Indonesia</h2>
        <p>
          PT Bhaskara Buana Mulya is a Bekasi-based general contractor providing
          industrial construction, civil and structural steel works, MEP engineering,
          and interior fit-out services across Jabodetabek, Jawa, and Indonesia.
        </p>
      </section>

      {/* ================= CONTENT ================= */}
      <WhatWeDo />
      <TrustBar />
      <ClientSummary />
      <WhyBBM />
      <FeaturedProjects />
      <CallToAction />
    </>
  );
}
