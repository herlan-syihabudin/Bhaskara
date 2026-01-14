import WhatWeDo from "@/components/home/WhatWeDo";
import TrustBar from "@/components/home/TrustBar";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import CallToAction from "@/components/home/CallToAction";
import WhyBBM from "@/components/home/WhyBBM";
import Reveal from "@/components/ui/Reveal";

export default function HomePage() {
  return (
    <>
      <section className="relative border-b border-gray-200 overflow-hidden">
        {/* ===== BACKGROUND IMAGE ===== */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/hero-bbm.jpg"
            alt="BBM Engineering Project"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50" />
        </div>

        <div className="container-bbm py-32 grid lg:grid-cols-12 gap-16 items-center">

          {/* ================= LEFT CONTENT ================= */}
          <div className="lg:col-span-7">

            <Reveal>
              <p className="text-xs tracking-[0.35em] text-gray-600 mb-4">
                ENGINEERING • SAFETY • EXECUTION
              </p>
            </Reveal>

            <Reveal className="reveal-delay-1">
              <p className="text-sm text-gray-700 mb-6 max-w-xl">
                Engineering-driven general contractor for industrial, commercial,
                and infrastructure projects.
              </p>
            </Reveal>

            <Reveal className="reveal-delay-2">
              <h1 className="max-w-3xl">
                Engineering-driven contractor delivering
                <span className="block mt-2 relative">
                  world-class construction & MEP solutions.
                  <span className="absolute left-0 -bottom-2 w-24 h-1 bg-[#E6B800] rounded-full" />
                </span>
              </h1>
            </Reveal>

            <Reveal className="reveal-delay-3">
              <p className="mt-10 text-lg max-w-2xl text-gray-800">
                PT Bhaskara Buana Mulya provides integrated general contracting,
                civil & steel construction, MEP engineering, and interior fit-out
                with disciplined execution and safety-first culture.
              </p>
            </Reveal>

            <Reveal className="reveal-delay-4">
              <p className="mt-4 text-sm text-gray-700 max-w-2xl">
                We execute every project through structured planning, approved method
                statements, and qualified site supervision to ensure compliance with
                specifications, schedules, and safety standards.
              </p>
            </Reveal>

            <Reveal className="reveal-delay-4">
              <div className="mt-12 flex flex-wrap gap-4">
                <a
                  href="/contact"
                  className="px-8 py-4 rounded-xl font-medium text-white
                             transition hover:opacity-90 hover:-translate-y-0.5"
                  style={{ backgroundColor: "#2F6F55" }}
                >
                  Request Proposal
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
                  View Projects
                </a>
              </div>
            </Reveal>

            <Reveal className="reveal-delay-4">
              <p className="mt-3 text-xs text-gray-600">
                Discuss your project scope, timeline, and technical requirements with our team.
              </p>
            </Reveal>
          </div>

          {/* ================= RIGHT STATS ================= */}
          <Reveal className="lg:col-span-5 reveal-delay-2">
            <div
              className="bg-white/95 backdrop-blur border border-gray-200 rounded-2xl
                         p-8 grid grid-cols-2 gap-8 shadow-sm
                         transition hover:shadow-md hover:-translate-y-0.5"
            >
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
          </Reveal>

        </div>
      </section>

      {/* SECTIONS */}
      <WhatWeDo />
      <WhyBBM />
      <TrustBar />
      <FeaturedProjects />
      <CallToAction />
    </>
  );
}
