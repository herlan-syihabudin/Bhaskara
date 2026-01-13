"use client";

import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto h-[72px] px-6 flex items-center justify-between">
        {/* Brand */}
        <a
          href="/"
          className="text-lg font-bold tracking-tight text-gray-900"
        >
          Bhaskara Buana Mulya
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="/about" className="nav-link">
            About
          </a>
          <a href="/services" className="nav-link">
            Services
          </a>
          <a href="/projects" className="nav-link">
            Projects
          </a>
          <a href="/capabilities" className="nav-link">
            Capabilities
          </a>

          <a href="/contact" className="btn-outline ml-2">
            Contact
          </a>
        </nav>

        {/* Mobile Button */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 border border-gray-300"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Open Menu</span>
          <div className="space-y-1.5">
            <span className="block w-5 h-px bg-gray-900" />
            <span className="block w-5 h-px bg-gray-900" />
            <span className="block w-5 h-px bg-gray-900" />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col px-6 py-4 gap-4 text-sm">
            <a href="/about" className="nav-link" onClick={() => setOpen(false)}>
              About
            </a>
            <a
              href="/services"
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              Services
            </a>
            <a
              href="/projects"
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              Projects
            </a>
            <a
              href="/capabilities"
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              Capabilities
            </a>

            <a
              href="/contact"
              className="btn-primary mt-2"
              onClick={() => setOpen(false)}
            >
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
