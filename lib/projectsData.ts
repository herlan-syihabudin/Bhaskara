export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  overview: string;
  desc: string;
  scope: string[];
  execution: string[];
  images: ProjectImage[];
};

export const projects: Project[] = [
  {
    slug: "industrial-plant-construction",
    title: "Industrial Plant Construction",
    category: "Industrial",
    desc:
      "Construction and coordination works for industrial facilities with strict safety and quality control.",
    overview:
      "Construction and coordination works for active industrial facilities executed with strict safety controls, engineering discipline, and structured project management.",
    scope: [
      "Foundation and substructure works",
      "Structural steel fabrication and erection",
      "Concrete slabs and supporting structures",
      "Coordination with ongoing plant operations",
    ],
    execution: [
      "Phased execution to maintain plant operation continuity",
      "Strict HSE enforcement and daily toolbox meetings",
      "Inspection and Test Plans (ITP) for structural works",
      "Progress tracking and coordination with client representatives",
    ],
    images: [
    {
      src: "/projects/factory-bekasi/overview-knt21.jpg",
      alt:
        "Industrial factory construction in Bekasi – overall site and warehouse view",
    },
      {
        src: "/projects/factory-bekasi/industrial-2.jpg",
        alt:
          "Industrial plant construction – steel structure erection",
      },
      {
        src: "/projects/factory-bekasi/industrial-3.jpg",
        alt:
          "Industrial plant construction – ongoing site execution",
      },
    ],
  },

  {
    slug: "commercial-office-fit-out",
    title: "Commercial Office Fit-Out",
    category: "Interior & MEP",
    desc:
      "End-to-end interior fit-out integrated with MEP systems and disciplined execution management.",
    overview:
      "Interior fit-out works delivered with integrated MEP coordination, quality control, and disciplined execution management.",
    scope: [
      "Partitioning, ceilings, and architectural finishes",
      "MEP coordination within interior spaces",
      "Lighting, power, and low-voltage systems",
      "Final testing and handover",
    ],
    execution: [
      "Shop drawing coordination across disciplines",
      "Interface control between interior and MEP works",
      "Quality inspections and punch list management",
      "On-time handover with full documentation",
    ],
    images: [
      {
        src: "/projects/factory-bekasi/office-1.jpg",
        alt:
          "Commercial office fit-out – interior finishing works",
      },
      {
        src: "/projects/office-2.jpg",
        alt:
          "Commercial office fit-out – integrated MEP installation",
      },
    ],
  },

  {
    slug: "power-electrical-upgrade",
    title: "Power & Electrical Upgrade",
    category: "MEP Engineering",
    desc:
      "Electrical system upgrade executed with safety-first commissioning and regulatory compliance.",
    overview:
      "Electrical system upgrade delivered with safety-first commissioning and full regulatory compliance.",
    scope: [
      "Power distribution system upgrade",
      "Panel installation and cable management",
      "Testing and commissioning",
      "Regulatory compliance coordination",
    ],
    execution: [
      "Permit-to-work and lockout-tagout procedures",
      "Testing and commissioning protocols",
      "Coordination with facility operations",
      "As-built documentation and handover",
    ],
    images: [
      {
        src: "/projects/electrical-1.jpg",
        alt:
          "Electrical system upgrade – panel installation",
      },
      {
        src: "/projects/electrical-2.jpg",
        alt:
          "Electrical system upgrade – testing and commissioning",
      },
    ],
  },
];
