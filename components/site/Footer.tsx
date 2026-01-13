export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container-bbm py-16">
        <div className="max-w-2xl">
          <strong className="text-gray-900">
            PT Bhaskara Buana Mulya
          </strong>

          <p className="mt-4 text-sm">
            Engineering-driven general contractor delivering civil,
            structural, MEP, and interior solutions with a strong
            commitment to safety, quality, and execution excellence.
          </p>

          <p className="mt-10 text-xs text-gray-500">
            © {new Date().getFullYear()} PT Bhaskara Buana Mulya.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
