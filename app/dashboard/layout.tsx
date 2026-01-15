// app/dashboard/layout.tsx
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r">
        <div className="px-6 py-5 border-b">
          <p className="text-sm tracking-widest text-gray-400">ERP</p>
          <h2 className="text-lg font-semibold">Bhaskara</h2>
        </div>

        <nav className="p-4 space-y-1 text-sm">
          <SidebarLink href="/dashboard/owner" label="Owner Dashboard" />
          <SidebarLink href="/dashboard/pm" label="Project Manager" />
          <SidebarLink href="/dashboard/finance" label="Finance" />
          <SidebarLink href="/dashboard/purchasing" label="Purchasing" />
          <SidebarLink href="/dashboard/logistik" label="Logistik" />
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

function SidebarLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
    >
      {label}
    </Link>
  );
}
