import WhatWeDo from "@/components/home/WhatWeDo";
import TrustBar from "@/components/home/TrustBar";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import CallToAction from "@/components/home/CallToAction";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section
        style={{
          padding: "120px 48px",
          background: "linear-gradient(to bottom, #ffffff, #f9fafb)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.2em",
              color: "#6b7280",
              marginBottom: 16,
            }}
          >
            ENGINEERING • SAFETY • EXECUTION
          </p>

          <h1
            style={{
              fontSize: 48,
              lineHeight: 1.2,
              maxWidth: 800,
              color: "#111827",
            }}
          >
            Engineering-driven contractor delivering world-class construction and MEP solutions.
          </h1>

          <p
            style={{
              marginTop: 24,
              fontSize: 18,
              maxWidth: 720,
              color: "#374151",
            }}
          >
            PT Bhaskara Buana Mulya provides integrated services in general contracting, civil and
            steel construction, mechanical–electrical–plumbing works, and interior fit-out with
            strong governance and safety culture.
          </p>

          <div style={{ marginTop: 40, display: "flex", gap: 16 }}>
            <a
              href="#"
              style={{
                padding: "14px 28px",
                background: "#111827",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              Request Proposal
            </a>

            <a
              href="#"
              style={{
                padding: "14px 28px",
                border: "1px solid #111827",
                color: "#111827",
                textDecoration: "none",
                fontSize: 14,
              }}
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
