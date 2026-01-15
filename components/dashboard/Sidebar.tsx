import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Owner Dashboard" },
  { href: "/dashboard/pm", label: "Project Manager" }, // ✅ PM
  { href: "/dashboard/finance", label: "Finance" },
  { href: "/dashboard/purchasing", label: "Purchasing" },
  { href: "/dashboard/logistik", label: "Logistik" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r">
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
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
