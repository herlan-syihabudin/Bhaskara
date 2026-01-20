"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* =====================
   SIDEBAR CONFIG (ERP v1)
===================== */
const sections = [
  {
    title: "OWNER",
    items: [
      { href: "/dashboard", label: "Owner Dashboard" },
      { href: "/dashboard/pm", label: "Project Manager" },
      { href: "/dashboard/finance", label: "Finance" },
    ],
  },
  {
    title: "OPERASIONAL",
    items: [
      { href: "/dashboard/purchasing", label: "Purchasing" },
      { href: "/dashboard/logistik", label: "Logistik" },
    ],
  },
  {
    title: "HR & PAYROLL",
    items: [
      { href: "/dashboard/payroll", label: "Payroll Overview" },
      {
        label: "HR Management",
        children: [
          { href: "/dashboard/payroll/karyawan", label: "Data Karyawan" },
          { href: "/dashboard/payroll/absensi", label: "Absensi" },
          { href: "/dashboard/payroll/kasbon", label: "Kasbon" },
          { href: "/dashboard/payroll/generate", label: "Generate Payroll" },
        ],
      },
    ],
  },
];

/* =====================
   COMPONENT
===================== */
export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      {/* HEADER */}
      <div className="p-6 border-b">
        <p className="text-xs tracking-widest text-gray-400 uppercase">
          ERP
        </p>
        <h2 className="font-semibold text-lg">
          Bhaskara
        </h2>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-6 text-sm overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 tracking-wider uppercase">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item, idx) => {
                // LINK BIASA
                if ("href" in item) {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-2 rounded-lg transition
                        ${
                          active
                            ? "bg-black text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                // GROUP DENGAN CHILD
                const childActive = item.children?.some((c) =>
                  isActive(c.href)
                );

                return (
                  <div key={idx}>
                    <div
                      className={`px-4 py-2 rounded-lg font-medium
                        ${
                          childActive
                            ? "text-black"
                            : "text-gray-700"
                        }`}
                    >
                      {item.label}
                    </div>

                    <div className="ml-3 mt-1 space-y-1 border-l pl-3">
                      {item.children?.map((child) => {
                        const active = isActive(child.href);

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-3 py-1.5 rounded-md transition text-sm
                              ${
                                active
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t text-xs text-gray-400">
        ERP Bhaskara © {new Date().getFullYear()}
      </div>
    </aside>
  );
}
