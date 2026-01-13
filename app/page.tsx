import WhatWeDo from "../components/home/WhatWeDo";
import TrustBar from "../components/home/TrustBar";
import FeaturedProjects from "../components/home/FeaturedProjects";
import CallToAction from "../components/home/CallToAction";

export default function HomePage() {
  return (
    <>
      <section className="relative bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-12 gap-12 items-center">
    
    {/* LEFT CONTENT */}
    <div className="lg:col-span-7">
      <p className="text-xs tracking-[0.35em] text-gray-500 mb-6">
        ENGINEERING • SAFETY • EXECUTION
      </p>

      <h1 className="text-4xl md:text-5xl xl:text-6xl font-semibold leading-tight tracking-tight max-w-3xl">
        Engineering-driven contractor delivering
        <span className="block text-gray-900 mt-2">
          world-class construction & MEP solutions.
        </span>
      </h1>

      <p className="mt-8 text-lg text-gray-600 max-w-2xl leading-relaxed">
        PT Bhaskara Buana Mulya provides integrated general contracting,
        civil & steel construction, MEP engineering, and interior fit-out
        with disciplined execution and safety-first culture.
      </p>

      <div className="mt-12 flex gap-4">
        <a
          href="/contact"
          className="px-8 py-4 bg-gray-900 text-white text-sm font-medium hover:bg-black transition"
        >
          Request Proposal
        </a>

        <a
          href="/projects"
          className="px-8 py-4 border border-gray-900 text-gray-900 text-sm font-medium hover:bg-gray-900 hover:text-white transition"
        >
          View Projects
        </a>
      </div>
    </div>

    {/* RIGHT STATS */}
    <div className="lg:col-span-5">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm grid grid-cols-2 gap-8">
        <div>
          <p className="text-sm text-gray-500">Experience</p>
          <p className="mt-2 text-3xl font-semibold">10+ Years</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Projects Delivered</p>
          <p className="mt-2 text-3xl font-semibold">120+</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Core Disciplines</p>
          <p className="mt-2 text-lg font-medium">MEP • Civil</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Safety Focus</p>
          <p className="mt-2 text-lg font-medium">Zero Accident</p>
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
