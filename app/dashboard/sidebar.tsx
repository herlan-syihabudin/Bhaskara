// app/dashboard/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard/owner", label: "Owner Dashboard" },
  { href: "/dashboard/pm", label: "Project Manager" },
  { href: "/dashboard/finance", label: "Finance" },
  { href: "/dashboard/purchasing", label: "Purchasing" },
  { href: "/dashboard/logistik", label: "Logistik" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-72 shrink-0 border-r border-gray-200 bg-white">
      <div className="w-full flex flex-col">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-gray-200">
          <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
            ERP
          </p>
          <h2 className="text-lg font-semibold text-gray-900">Bhaskara</h2>
          <p className="mt-1 text-sm text-gray-500">Control Center</p>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1 text-sm">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname?.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center justify-between px-4 py-2.5 rounded-xl transition",
                  active
                    ? "bg-[#2F6F55]/10 text-gray-900 border border-[#2F6F55]/20"
                    : "text-gray-700 hover:bg-gray-50",
                ].join(" ")}
              >
                <span className="font-medium">{item.label}</span>
                {active ? (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-[#2F6F55] text-white">
                    ACTIVE
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom note */}
        <div className="px-6 py-5 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Role-based access akan kita aktifkan di step berikutnya.
          </p>
        </div>
      </div>
    </aside>
  );
}
