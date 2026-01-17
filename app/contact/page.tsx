export default function ContactPage() {
  return (
    <section className="bg-gray-50">
      <div className="container-bbm py-28">
        <div className="grid gap-16 lg:grid-cols-2 items-start">
          
          {/* LEFT: INFO */}
<div className="max-w-xl">
  <span className="badge">CONTACT</span>

  <h1 className="mt-6">
    Let’s discuss
    <span className="block">your project</span>
  </h1>

  <p className="mt-6 text-lg">
    Reach out to our team to discuss project scope, schedule,
    and execution strategy. We approach every project with
    engineering rigor and safety-first principles.
  </p>

  {/* ===== COMPANY IDENTITY ===== */}
  <div className="mt-10 space-y-3 text-sm text-gray-700">
    <p>
      <strong>Company:</strong><br />
      PT Bhaskara Buana Mulya
    </p>

    <p>
      <strong>Office Address:</strong><br />
      Jl. Raya Kedaung, RT.002/RW.004<br />
      Cimuning, Kec. Mustika Jaya<br />
      Kota Bekasi, Jawa Barat 17155
    </p>

    <p>
      <strong>Office Phone:</strong><br />
      <a href="tel:+622138716066" className="hover:underline">
        +62 21 3871 6066
      </a>
    </p>

    <p>
      <strong>WhatsApp:</strong><br />
      <a
        href="https://wa.me/6281297396612?text=Halo%20PT%20Bhaskara%20Buana%20Mulya,%20saya%20ingin%20konsultasi%20proyek."
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        +62 812 9739 6612
      </a>
    </p>

    <p>
      <strong>Email:</strong><br />
      <a
        href="mailto:adm.buanamulya@gmail.com"
        className="hover:underline"
      >
        adm.buanamulya@gmail.com
      </a>
    </p>
  </div>
</div>

          {/* RIGHT: FORM */}
          <div className="bg-white border border-gray-200 rounded-2xl p-10">
            <h2>Request for Proposal (RFQ)</h2>

            <p className="mt-3 text-sm text-gray-600">
              Provide a brief overview of your project and our team
              will respond promptly.
            </p>

            <form className="mt-8 grid gap-5">
              <Input placeholder="Full Name" />
              <Input placeholder="Company Name" />
              <Input type="email" placeholder="Email Address" />
              <Input placeholder="Phone Number" />

              <select className="form-input">
                <option>Project Type</option>
                <option>General Contracting</option>
                <option>MEP Engineering</option>
                <option>Civil & Structural</option>
                <option>Interior Fit-Out</option>
              </select>

              <textarea
                className="form-input min-h-[140px]"
                placeholder="Project description, scope, timeline, or drawings link"
              />

              <button
                type="submit"
                className="btn-primary mt-4 w-fit px-8 py-4"
              >
                Submit RFQ
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== FORM INPUT ===== */
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
