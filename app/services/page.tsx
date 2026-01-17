import type { Metadata } from "next";
import ServicesHero from "@/components/services/ServicesHero";
import ServiceList from "@/components/services/ServiceList";
import CallToAction from "@/components/home/CallToAction";

/* ===============================
   SEO METADATA
================================ */
export const metadata: Metadata = {
  title:
    "Construction & MEP Services | PT Bhaskara Buana Mulya",
  description:
    "PT Bhaskara Buana Mulya provides engineering-led construction services including general contracting, civil & steel works, MEP engineering, and interior fit-out for industrial and commercial projects in Indonesia.",
  alternates: {
    canonical: "https://bhaskara-lqtk.vercel.app/services",
  },
  openGraph: {
    title: "Construction & MEP Services | PT Bhaskara Buana Mulya",
    description:
      "Engineering-driven construction and MEP services delivered with disciplined execution, safety-first culture, and accountable project management.",
    url: "https://bhaskara-lqtk.vercel.app/services",
    type: "website",
  },
};

/* ===============================
   PAGE
================================ */
export default function ServicesPage() {
  const baseUrl = "https://bhaskara-lqtk.vercel.app";

  /* ===============================
     JSON-LD SERVICE SCHEMA
  ================================ */
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: "PT Bhaskara Buana Mulya",
        url: baseUrl,
      },

      {
        "@type": "Service",
        "@id": `${baseUrl}/services#general-contracting`,
        serviceType: "General Contracting",
        provider: {
          "@id": `${baseUrl}#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "Indonesia",
        },
        description:
          "Engineering-led general contracting services covering planning, coordination, execution, and project delivery across industrial and commercial sectors.",
      },

      {
        "@type": "Service",
        "@id": `${baseUrl}/services#mep-engineering`,
        serviceType: "MEP Engineering",
        provider: {
          "@id": `${baseUrl}#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "Indonesia",
        },
        description:
          "Mechanical, Electrical, and Plumbing (MEP) engineering services delivered with safety-first execution, testing, and commissioning.",
      },

      {
        "@type": "Service",
        "@id": `${baseUrl}/services#civil-structural`,
        serviceType: "Civil & Structural Construction",
        provider: {
          "@id": `${baseUrl}#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "Indonesia",
        },
        description:
          "Civil works, structural steel, concrete, and foundation construction delivered with engineering discipline and quality control.",
      },

      {
        "@type": "Service",
        "@id": `${baseUrl}/services#interior-fitout`,
        serviceType: "Interior Fit-Out",
        provider: {
          "@id": `${baseUrl}#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "Indonesia",
        },
        description:
          "Interior fit-out services integrated with MEP coordination, quality assurance, and disciplined execution management.",
      },
    ],
  };

  return (
    <>
      {/* ===== SCHEMA INJECTION ===== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      {/* ===== HERO (H1 ADA DI DALAM COMPONENT) ===== */}
      <ServicesHero />

      {/* ===== SERVICES OVERVIEW ===== */}
      <ServiceList />

      {/* ===== CTA ===== */}
      <CallToAction />
    </>
  );
}
