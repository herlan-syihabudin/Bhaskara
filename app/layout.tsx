import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = "https://bhaskara-lqtk.vercel.app";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      /* ================= ORGANIZATION + LOCAL BUSINESS ================= */
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${baseUrl}#organization`,
        name: "PT Bhaskara Buana Mulya",
        legalName: "PT Bhaskara Buana Mulya",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description:
          "Engineering-driven general contractor delivering civil, structural, MEP, and interior works with disciplined execution and safety-first culture.",

        /* ===== BUSINESS CATEGORY (MATCH GOOGLE BUSINESS) ===== */
        additionalType: [
          "https://schema.org/GeneralContractor",
          "https://schema.org/ConstructionCompany",
        ],

        /* ===== ADDRESS (NAP CONSISTENT) ===== */
        address: {
          "@type": "PostalAddress",
          streetAddress: "Jl. Raya Kedaung, RT.002/RW.004, Cimuning",
          addressLocality: "Bekasi",
          addressRegion: "Jawa Barat",
          postalCode: "17155",
          addressCountry: "ID",
        },

        /* ===== GEO LOCATION ===== */
        geo: {
          "@type": "GeoCoordinates",
          latitude: -6.2735,
          longitude: 107.0206,
        },

        /* ===== GOOGLE MAPS SIGNAL (IMPORTANT) ===== */
        hasMap:
          "https://www.google.com/maps/search/?api=1&query=PT+Bhaskara+Buana+Mulya+Bekasi",

        /* ===== CONTACT ===== */
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+62-21-3871-6066",
          contactType: "Project Inquiry",
          availableLanguage: ["id", "en"],
        },

        /* ===== LOCAL SEO AREA ===== */
        areaServed: [
          { "@type": "AdministrativeArea", name: "Bekasi" },
          { "@type": "AdministrativeArea", name: "Jabodetabek" },
          { "@type": "AdministrativeArea", name: "Jawa Barat" },
          { "@type": "AdministrativeArea", name: "Jawa Tengah" },
          { "@type": "AdministrativeArea", name: "Jawa Timur" },
          { "@type": "Country", name: "Indonesia" },
        ],

        /* ===== SERVICE SIGNAL (CLEAN, NON-SPAM) ===== */
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Construction & MEP Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "General Contracting",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "MEP Engineering",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Civil & Structural Construction",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Interior Fit-Out",
              },
            },
          ],
        },

        /* ===== SOCIAL / GBP LINK (ISI NANTI) ===== */
        sameAs: [],
      },

      /* ================= WEBSITE ================= */
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        url: baseUrl,
        name: "PT Bhaskara Buana Mulya",
        publisher: {
          "@id": `${baseUrl}#organization`,
        },
        inLanguage: "id-ID",
      },
    ],
  };

  return (
    <html lang="id">
      <head>
        {/* ===== GLOBAL SEO + LOCAL BUSINESS SCHEMA ===== */}
        <Script
          id="global-local-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
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
