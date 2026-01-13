import WhatWeDo from "@/components/home/WhatWeDo";
import TrustBar from "@/components/home/TrustBar";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import CallToAction from "@/components/home/CallToAction";

export default function HomePage() {
  return (
    <>
      <section className="relative bg-gradient-to-b from-white to-gray-50 border-b border-gray-200">
  <div className="container-bbm py-32 grid lg:grid-cols-12 gap-16 items-center">
    
    {/* LEFT CONTENT */}
    <div className="lg:col-span-7">
      <p className="text-xs tracking-[0.35em] text-gray-500 mb-4">
        ENGINEERING • SAFETY • EXECUTION
      </p>

      {/* ➕ Positioning clarifier (TAMBAHAN) */}
      <p className="text-sm text-gray-600 mb-6 max-w-xl">
        Engineering-driven general contractor for industrial, commercial,
        and infrastructure projects.
      </p>

      <h1 className="max-w-3xl">
        Engineering-driven contractor delivering
        <span className="block mt-2">
          world-class construction & MEP solutions.
        </span>
      </h1>

      <p className="mt-8 text-lg max-w-2xl">
        PT Bhaskara Buana Mulya provides integrated general contracting,
        civil & steel construction, MEP engineering, and interior fit-out
        with disciplined execution and safety-first culture.
      </p>

      {/* ➕ Trust sentence (TAMBAHAN) */}
      <p className="mt-4 text-sm text-gray-600 max-w-2xl">
        We execute every project through structured planning, method
        statements, and site supervision to ensure compliance with
        approved specifications, schedules, and safety standards.
      </p>

      <div className="mt-12 flex gap-4">
        <a href="/contact" className="btn-primary px-8 py-4">
          Request Proposal
        </a>

        <a href="/projects" className="btn-outline px-8 py-4">
          View Projects
        </a>
      </div>

      {/* ➕ CTA micro context */}
      <p className="mt-3 text-xs text-gray-500">
        Discuss your project scope, timeline, and technical requirements with our team.
      </p>
    </div>

    {/* RIGHT STATS */}
    <div className="lg:col-span-5">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 grid grid-cols-2 gap-8">
        
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
            Industrial & commercial sectors
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Core Disciplines</p>
          <p className="mt-2 text-lg font-medium text-gray-900">
            MEP • Civil • Steel
          </p>
          <p className="text-xs text-gray-600">
            Integrated execution & coordination
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Safety Culture</p>
          <p className="mt-2 text-lg font-medium text-gray-900">
            Zero Accident Focus
          </p>
          <p className="text-xs text-gray-600">
            HSE-first on every site
          </p>
        </div>

      </div>
    </div>

  </div>
</section>

      {/* WHAT WE DO */}
      <WhatWeDo />

      {/* TRUST BAR */}
      <TrustBar />

      {/* FEATURED PROJECTS */}
      <FeaturedProjects />

      {/* CTA */}
      <CallToAction />
    </>
  );
}
