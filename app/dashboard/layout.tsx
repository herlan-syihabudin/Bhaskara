// app/dashboard/layout.tsx
import Link from "next/link";
import { ReactNode } from "react";
import Sidebar from "./sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN AREA */}
        <div className="flex-1 min-w-0">
          {/* TOPBAR */}
          <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
            <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl border bg-white flex items-center justify-center text-xs font-semibold text-gray-700">
                  BBM
                </div>
                <div className="leading-tight">
                  <p className="text-xs tracking-[0.35em] text-gray-400 uppercase">
                    ERP Dashboard
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    Bhaskara Buana Mulya
                  </p>
                </div>
              </div>

              {/* quick actions placeholder */}
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="text-sm px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                >
                  Back to Site
                </Link>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="px-6 lg:px-8 py-8">{children}</main>

          {/* FOOTER (optional, halus) */}
          <footer className="px-6 lg:px-8 py-6 text-xs text-gray-400">
            © {new Date().getFullYear()} PT Bhaskara Buana Mulya — Internal ERP
          </footer>
        </div>
      </div>
    </div>
  );
}
