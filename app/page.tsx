import WhatWeDo from "../components/home/WhatWeDo";
import TrustBar from "../components/home/TrustBar";
import FeaturedProjects from "../components/home/FeaturedProjects";
import CallToAction from "../components/home/CallToAction";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
<section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
  <div className="container-bbm py-28 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
    {/* LEFT CONTENT */}
    <div className="md:col-span-7 fade-in">
      <span className="badge mb-6 inline-block">
        ENGINEERING • SAFETY • EXECUTION
      </span>

      <h1 className="mt-4 max-w-3xl">
        Engineering-driven contractor delivering
        <span className="block text-gray-900">
          world-class construction & MEP solutions
        </span>
      </h1>

      <p className="mt-6 max-w-2xl">
        PT Bhaskara Buana Mulya provides integrated general contracting,
        civil & steel construction, MEP engineering, and interior fit-out
        with disciplined execution and safety-first culture.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <a href="/contact" className="btn-primary">
          Request Proposal
        </a>

        <a href="/projects" className="btn-outline">
          View Projects
        </a>
      </div>
    </div>

    {/* RIGHT VISUAL */}
    <div className="md:col-span-5 relative fade-in">
      <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Experience</p>
            <p className="text-2xl font-semibold text-gray-900">10+ Years</p>
          </div>
          <div>
            <p className="text-gray-500">Projects Delivered</p>
            <p className="text-2xl font-semibold text-gray-900">120+</p>
          </div>
          <div>
            <p className="text-gray-500">Core Disciplines</p>
            <p className="text-2xl font-semibold text-gray-900">MEP • Civil</p>
          </div>
          <div>
            <p className="text-gray-500">Safety Focus</p>
            <p className="text-2xl font-semibold text-gray-900">Zero Accident</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* SUBTLE BACKGROUND ACCENT */}
  <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gray-100 rounded-full blur-3xl opacity-60" />
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
