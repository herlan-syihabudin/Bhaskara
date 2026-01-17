import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        {/* ================= ORGANIZATION SCHEMA ================= */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PT Bhaskara Buana Mulya",
              legalName: "PT Bhaskara Buana Mulya",
              url: "https://bhaskara-lqtk.vercel.app",
              logo: "https://bhaskara-lqtk.vercel.app/logo.png",
              description:
                "Engineering-driven general contractor delivering civil, structural, MEP, and interior works with disciplined execution and safety-first culture.",
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "Jl. Raya Kedaung, RT.002/RW.004, Cimuning",
                addressLocality: "Bekasi",
                addressRegion: "Jawa Barat",
                postalCode: "17155",
                addressCountry: "ID",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+62-21-3871-6066",
                contactType: "business inquiries",
                areaServed: "ID",
                availableLanguage: ["id", "en"],
              },
              sameAs: [],
            }),
          }}
        />
      </head>

      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
