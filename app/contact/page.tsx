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

            <div className="mt-10 space-y-2 text-sm">
              <p><strong>Company:</strong> PT Bhaskara Buana Mulya</p>
              <p><strong>Location:</strong> Indonesia</p>
              <p><strong>Email:</strong> info@bhaskarabuanamulya.co.id</p>
              <p><strong>Phone:</strong> +62 xxx xxxx xxxx</p>
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
