import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Service Area | General Contractor Jabodetabek, Jawa & Indonesia",
  description:
    "PT Bhaskara Buana Mulya provides engineering-led construction, MEP, and general contracting services across Jabodetabek, Java, and throughout Indonesia.",
  alternates: {
    canonical: "https://bhaskara-lqtk.vercel.app/service-area",
  },
};

export default function ServiceAreaPage() {
  return (
    <section className="bg-white">
      <div className="container-bbm py-28 max-w-5xl">

        <span className="badge">SERVICE AREA</span>

        <h1 className="mt-6">
          Project delivery coverage across
          <span className="block">Jabodetabek, Java & Indonesia</span>
        </h1>

        <p className="mt-8 text-lg text-gray-800 max-w-3xl">
          PT Bhaskara Buana Mulya delivers engineering-driven construction,
          general contracting, and MEP services across strategic industrial
          and commercial regions in Indonesia.
        </p>

        {/* ===== JABODETABEK ===== */}
        <div className="mt-20 card p-10">
          <h2 className="text-xl font-semibold">
            Jabodetabek (Primary Service Area)
          </h2>
          <p className="mt-4 text-gray-600">
            Our core operational base is in Jabodetabek, supporting
            industrial, manufacturing, warehouse, and commercial projects.
          </p>
          <ul className="mt-6 grid md:grid-cols-2 gap-3 text-sm">
            <li>Bekasi & Cikarang industrial zones</li>
            <li>Jakarta commercial & office facilities</li>
            <li>Tangerang & BSD developments</li>
            <li>Depok & Bogor supporting facilities</li>
          </ul>
        </div>

        {/* ===== JAVA ===== */}
        <div className="mt-12 card p-10">
          <h2 className="text-xl font-semibold">
            Java Island Coverage
          </h2>
          <p className="mt-4 text-gray-600">
            We support project delivery across Java for clients requiring
            consistent execution standards and engineering control.
          </p>
          <ul className="mt-6 grid md:grid-cols-2 gap-3 text-sm">
            <li>West Java industrial corridors</li>
            <li>Central Java manufacturing facilities</li>
            <li>East Java industrial & logistics projects</li>
          </ul>
        </div>

        {/* ===== INDONESIA ===== */}
        <div className="mt-12 card p-10">
          <h2 className="text-xl font-semibold">
            Nationwide Project Support
          </h2>
          <p className="mt-4 text-gray-600">
            For selected projects, we provide execution support across
            Indonesia through structured planning, mobilization, and
            engineering supervision.
          </p>
          <ul className="mt-6 grid md:grid-cols-2 gap-3 text-sm">
            <li>Industrial and logistics facilities</li>
            <li>Commercial & institutional buildings</li>
            <li>Plant expansion & system upgrades</li>
          </ul>
        </div>

        {/* ===== CROSS LINKS ===== */}
        <div className="mt-20 flex flex-wrap gap-6 text-sm">
          <Link href="/services" className="border-b font-medium">
            View services →
          </Link>
          <Link href="/projects" className="border-b font-medium">
            View projects →
          </Link>
          <Link href="/contact" className="border-b font-medium">
            Discuss your project →
          </Link>
        </div>

        <p className="mt-10 text-xs text-gray-500 max-w-3xl">
          Project references and detailed locations are presented at a high
          level to respect confidentiality and NDA obligations.
        </p>
      </div>
    </section>
  );
}
