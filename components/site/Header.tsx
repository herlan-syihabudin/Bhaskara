"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto h-[76px] px-6 flex items-center justify-between">

        {/* BRAND */}
        <Link
          href="/"
          className="text-[17px] font-semibold tracking-tight text-gray-900"
        >
          Bhaskara Buana Mulya
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/about" className="nav-link">
            About
          </Link>

          <Link href="/industries" className="nav-link">
            Industries
          </Link>

          <Link href="/capabilities" className="nav-link">
            Capabilities
          </Link>

          <Link href="/services" className="nav-link">
            Services
          </Link>

          <Link href="/projects" className="nav-link">
            Projects
          </Link>

          <Link href="/contact" className="btn-outline ml-2">
            Contact
          </Link>
        </nav>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="md:hidden inline-flex items-center justify-center w-10 h-10
                     border border-gray-300 rounded-md
                     hover:bg-gray-50 transition"
        >
          <div className="space-y-1.5">
            <span className="block w-5 h-px bg-gray-900" />
            <span className="block w-5 h-px bg-gray-900" />
            <span className="block w-5 h-px bg-gray-900" />
          </div>
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200
        ${open ? "max-h-[420px] border-t border-gray-200" : "max-h-0"}`}
      >
        <nav className="flex flex-col px-6 py-6 gap-4 text-sm bg-white">

          <Link href="/about" className="nav-link" onClick={() => setOpen(false)}>
            About
          </Link>

          <Link href="/industries" className="nav-link" onClick={() => setOpen(false)}>
            Industries
          </Link>

          <Link href="/capabilities" className="nav-link" onClick={() => setOpen(false)}>
            Capabilities
          </Link>

          <Link href="/services" className="nav-link" onClick={() => setOpen(false)}>
            Services
          </Link>

          <Link href="/projects" className="nav-link" onClick={() => setOpen(false)}>
            Projects
          </Link>

          <Link
            href="/contact"
            className="btn-primary mt-4 w-fit"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
