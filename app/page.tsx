import WhatWeDo from "../components/home/WhatWeDo";
import TrustBar from "../components/home/TrustBar";
import FeaturedProjects from "../components/home/FeaturedProjects";
import CallToAction from "../components/home/CallToAction";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-28">
          <p className="text-xs tracking-[0.25em] text-gray-500 mb-4">
            ENGINEERING • SAFETY • EXECUTION
          </p>

          <h1 className="text-4xl md:text-5xl leading-tight max-w-3xl">
            Engineering-driven contractor delivering world-class
            construction and MEP solutions.
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl">
            PT Bhaskara Buana Mulya provides integrated general contracting,
            civil & steel construction, MEP engineering, and interior fit-out
            with disciplined execution and safety-first culture.
          </p>

          <div className="mt-10 flex gap-4">
            <a
              href="/contact"
              className="px-6 py-3 bg-gray-900 text-white text-sm hover:bg-black transition"
            >
              Request Proposal
            </a>

            <a
              href="/projects"
              className="px-6 py-3 border border-gray-900 text-gray-900 text-sm hover:bg-gray-900 hover:text-white transition"
            >
              View Projects
            </a>
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
