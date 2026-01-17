import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://bhaskara-lqtk.vercel.app"),
  title: {
    default: "PT Bhaskara Buana Mulya | Engineering & Construction",
    template: "%s | PT Bhaskara Buana Mulya",
  },
  description:
    "PT Bhaskara Buana Mulya is an engineering-driven general contractor delivering civil, structural, MEP, and interior works with disciplined execution and safety-first principles.",
  openGraph: {
    title: "PT Bhaskara Buana Mulya",
    description:
      "Engineering-driven contractor delivering construction and MEP solutions.",
    images: ["/og-cover.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
