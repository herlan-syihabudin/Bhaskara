export default function DeliveryModel() {
  return (
    <section className="bg-gray-50 border-t border-gray-200">
      <div className="container-bbm py-28">

        {/* HEADER */}
        <div className="max-w-3xl">
          <span className="badge">DELIVERY MODEL</span>

          <h2 className="mt-6">
            How we deliver
            <span className="block">industrial-grade projects</span>
          </h2>

          <p className="mt-8 text-lg text-gray-800">
            Our delivery model is built on engineering discipline, structured
            planning, and safety-first execution to control risk, cost, and
            schedule across industrial and commercial projects.
          </p>
        </div>

        {/* PHASES */}
        <div className="mt-20 grid gap-10 max-w-5xl">

          <Phase
            step="01"
            title="Pre-Construction & Engineering"
            desc="Technical review, constructability assessment, and early coordination to reduce execution risk before site mobilization."
            items={[
              "Scope clarification & technical review",
              "Engineering coordination & constructability input",
              "Method statements & execution strategy",
              "Risk identification and mitigation planning",
            ]}
          />

          <Phase
            step="02"
            title="Planning & Mobilization"
            desc="Structured planning and site preparation to ensure safe and efficient execution from day one."
            items={[
              "Baseline schedule & look-ahead planning",
              "Resource & subcontractor mobilization",
              "HSE planning, induction, and permits",
              "Site logistics and access control",
            ]}
          />

          <Phase
            step="03"
            title="Execution & Site Control"
            desc="Disciplined site execution with active supervision, quality checks, and progress control."
            items={[
              "Daily supervision & coordination",
              "Quality inspection & ITP implementation",
              "Progress tracking & reporting",
              "Safety enforcement & toolbox meetings",
            ]}
          />

          <Phase
            step="04"
            title="Testing, Commissioning & QA"
            desc="Verification that systems, structures, and installations meet design intent and operational requirements."
            items={[
              "System testing & commissioning",
              "Defect rectification & punch listing",
              "Regulatory inspection support",
              "Client walkthrough & verification",
            ]}
          />

          <Phase
            step="05"
            title="Handover & Documentation"
            desc="Structured handover with complete documentation to support safe operation and maintenance."
            items={[
              "As-built drawings & records",
              "Operation & maintenance documentation",
              "Final acceptance & sign-off",
              "Post-project support if required",
            ]}
          />

        </div>
      </div>
    </section>
  );
}

/* ================= COMPONENT ================= */

function Phase({
  step,
  title,
  desc,
  items,
}: {
  step: string;
  title: string;
  desc: string;
  items: string[];
}) {
  return (
    <div className="card p-10">
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold text-gray-400">
          PHASE {step}
        </span>
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
      </div>

      <p className="mt-4 text-gray-600 max-w-3xl">
        {desc}
      </p>

      <ul className="mt-6 grid gap-3 md:grid-cols-2 text-sm text-gray-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-gray-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
