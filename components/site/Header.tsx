export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto h-[72px] px-6 flex items-center justify-between">
        {/* Brand */}
        <a href="/" className="text-lg font-bold text-gray-900">
          Bhaskara Buana Mulya
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="/about" className="text-gray-700 hover:text-gray-900">
            About
          </a>
          <a href="/services" className="text-gray-700 hover:text-gray-900">
            Services
          </a>
          <a href="/projects" className="text-gray-700 hover:text-gray-900">
            Projects
          </a>
          <a href="/capabilities" className="text-gray-700 hover:text-gray-900">
            Capabilities
          </a>
          <a
            href="/contact"
            className="ml-2 px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
