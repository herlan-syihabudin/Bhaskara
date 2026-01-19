"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Owner Dashboard" },
  { href: "/dashboard/pm", label: "Project Manager" },
  { href: "/dashboard/finance", label: "Finance" },

  // OPERASIONAL
  { href: "/dashboard/purchasing", label: "Purchasing" },
  { href: "/dashboard/logistik", label: "Logistik" },

  // HR & PAYROLL
  { href: "/dashboard/payroll", label: "HR & Payroll" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r min-h-screen">
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
      <nav className="p-4 space-y-1 text-sm">
        {links.map((l) => {
          const active =
            pathname === l.href ||
            pathname.startsWith(l.href + "/");

          return (
            <Link
              key={l.href}
              href={l.href}
              className={`block px-4 py-2 rounded-lg transition
                ${
                  active
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
