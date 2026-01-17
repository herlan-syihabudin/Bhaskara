import Link from "next/link";

export default function ContactPage() {
  return (
    <section className="bg-gray-50">
      <div className="container-bbm py-28">
        <div className="grid gap-16 lg:grid-cols-2 items-start">

          {/* ================= LEFT: INFO ================= */}
          <div className="max-w-xl">
            <span className="badge">CONTACT</span>

            <h1 className="mt-6">
              Let’s discuss
              <span className="block">your project requirements</span>
            </h1>

            <p className="mt-6 text-lg text-gray-800 leading-relaxed">
              Engage with our engineering and project team to align
              scope, technical requirements, schedule, and execution
              approach before project commitment.
            </p>

            {/* EXPECTATION SETTING */}
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              Initial discussions focus on constructability, coordination,
              risk control, and delivery strategy — ensuring informed
              decisions from the outset.
            </p>

            {/* ================= COMPANY IDENTITY ================= */}
            <div className="mt-12 space-y-4 text-sm text-gray-700">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Company
                </p>
                <p className="mt-1 font-medium">
                  PT Bhaskara Buana Mulya
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Office Address
                </p>
                <p className="mt-1 leading-relaxed">
                  Jl. Raya Kedaung, RT.002/RW.004<br />
                  Cimuning, Kec. Mustika Jaya<br />
                  Kota Bekasi, Jawa Barat 17155
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Office Phone
                </p>
                <a
                  href="tel:+622138716066"
                  className="mt-1 inline-block hover:underline"
                >
                  +62 21 3871 6066
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  WhatsApp
                </p>
                <a
                  href="https://wa.me/6281297396612?text=Hello%20PT%20Bhaskara%20Buana%20Mulya,%20I%20would%20like%20to%20discuss%20a%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block hover:underline"
                >
                  +62 812 9739 6612
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Email
                </p>
                <a
                  href="mailto:adm.buanamulya@gmail.com"
                  className="mt-1 inline-block hover:underline"
                >
                  adm.buanamulya@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* ================= RIGHT: RFQ FORM ================= */}
          <div className="bg-white border border-gray-200 rounded-2xl p-10">
            <h2>Request for Proposal (RFQ)</h2>

            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Share a brief overview of your project scope and
              requirements. Our engineering or project coordination
              team will respond accordingly.
            </p>

            <form className="mt-8 grid gap-5">
              <Input placeholder="Full Name" />
              <Input placeholder="Company / Organization" />
              <Input type="email" placeholder="Email Address" />
              <Input placeholder="Phone / WhatsApp Number" />

              <select className="form-input">
                <option value="">Project Type</option>
                <option>General Contracting</option>
                <option>MEP Engineering</option>
                <option>Civil & Structural Works</option>
                <option>Interior Fit-Out</option>
              </select>

              <textarea
                className="form-input min-h-[160px]"
                placeholder="Brief project description, scope, timeline, location, or drawings link"
              />

              <button
                type="submit"
                className="btn-primary mt-4 w-fit px-9 py-4"
              >
                Submit RFQ
              </button>
            </form>

            {/* MICRO TRUST */}
            <p className="mt-4 text-xs text-gray-500">
              Your inquiry will be reviewed by our engineering or
              project coordination team.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= FORM INPUT ================= */
function Input({
  type = "text",
  placeholder,
}: {
  type?: string;
  placeholder: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="form-input"
    />
  );
}
