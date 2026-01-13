export default function ContactPage() {
  return (
    <section style={{ padding: "96px 48px", background: "#f9fafb" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
        }}
      >
        {/* LEFT: INFO */}
        <div>
          <p style={{ fontSize: 12, letterSpacing: "0.2em", color: "#6b7280" }}>
            CONTACT
          </p>
          <h1 style={{ fontSize: 40, marginTop: 12 }}>
            Let’s discuss your project
          </h1>
          <p style={{ marginTop: 16, fontSize: 18, lineHeight: 1.7 }}>
            Reach out to our team to discuss scope, schedule, and execution
            strategy. We approach every project with engineering rigor and
            safety-first principles.
          </p>

          <div style={{ marginTop: 32, fontSize: 15, lineHeight: 1.8 }}>
            <p><strong>Company:</strong> PT Bhaskara Buana Mulya</p>
            <p><strong>Location:</strong> Indonesia</p>
            <p><strong>Email:</strong> info@bhaskarabuanamulya.co.id</p>
            <p><strong>Phone:</strong> +62 xxx xxxx xxxx</p>
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 20,
            padding: 32,
          }}
        >
          <h2 style={{ fontSize: 22 }}>Request for Proposal (RFQ)</h2>
          <p style={{ marginTop: 8, color: "#6b7280", fontSize: 14 }}>
            Provide a brief overview and our team will respond promptly.
          </p>

          <form style={{ marginTop: 24, display: "grid", gap: 16 }}>
            <input style={inputStyle} placeholder="Full Name" />
            <input style={inputStyle} placeholder="Company Name" />
            <input style={inputStyle} placeholder="Email Address" />
            <input style={inputStyle} placeholder="Phone Number" />

            <select style={inputStyle}>
              <option>Project Type</option>
              <option>General Contracting</option>
              <option>MEP Engineering</option>
              <option>Civil & Structural</option>
              <option>Interior Fit-Out</option>
            </select>

            <textarea
              style={{ ...inputStyle, minHeight: 120 }}
              placeholder="Project description, scope, timeline, or drawings link"
            />

            <button
              type="submit"
              style={{
                marginTop: 12,
                padding: "14px 20px",
                background: "#111827",
                color: "#ffffff",
                border: "none",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Submit RFQ
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

const inputStyle = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontSize: 14,
};
