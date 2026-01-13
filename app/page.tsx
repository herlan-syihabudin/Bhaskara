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
      <p className="text-xs tracking-[0.35em] text-gray-500 mb-6">
        ENGINEERING • SAFETY • EXECUTION
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

      <div className="mt-12 flex gap-4">
        <a href="/contact" className="btn-primary px-8 py-4">
          Request Proposal
        </a>

        <a href="/projects" className="btn-outline px-8 py-4">
          View Projects
        </a>
      </div>
    </div>

    {/* RIGHT STATS */}
    <div className="lg:col-span-5">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 grid grid-cols-2 gap-8">
        
        <div>
          <p className="text-sm text-gray-500">Experience</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">10+</p>
          <p className="text-sm text-gray-600">Years in industry</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Projects Delivered</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">120+</p>
          <p className="text-sm text-gray-600">Across sectors</p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Core Disciplines</p>
          <p className="mt-2 text-lg font-medium text-gray-900">
            MEP • Civil • Steel
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Safety Culture</p>
          <p className="mt-2 text-lg font-medium text-gray-900">
            Zero Accident Focus
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
