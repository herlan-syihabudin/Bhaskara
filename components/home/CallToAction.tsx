export default function CallToAction() {
  return (
    <section className="bg-gray-900 text-white">
      <div className="container-bbm py-28">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          
          {/* COPY */}
          <div className="max-w-2xl">
            <h2 className="text-white">
              Let’s build with clarity,
              <span className="block">
                safety, and execution excellence
              </span>
            </h2>

            <p className="mt-6 text-gray-300">
              Talk to our team about your next project. We bring engineering
              rigor, disciplined execution, and accountable delivery from
              mobilization to handover.
            </p>
          </div>

          {/* CTA */}
          <a
            href="/contact"
            className="inline-flex items-center justify-center
                       px-8 py-4 bg-white text-gray-900
                       text-sm font-semibold
                       hover:bg-gray-100 transition"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </section>
  );
}
