import ClientLayout from "@/Global-Components/ClientLayout/ClientLayout";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://www.myfurnituremecca.com"),

  title:
    "Free Delivery & Free Setup | Furniture Sale – Save Up to 75% Furniture Mecca",

  description:
    "Free Delivery & FREE Setup on all furniture during our Furniture Sale! Save up to 75% on living room, bedroom & dining sets. Limited-time offer—shop now!",

  keywords: [
    "Furniture Mecca",
    "Furniture Store",
    "Living Room Furniture",
    "Bedroom Furniture",
    "Dining Room Furniture",
    "Mattresses",
    "Furniture Sale",
    "Affordable Furniture",
    "Free Delivery Furniture",
    "Free Setup Furniture",
  ],

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title:
      "Free Delivery & Free Setup | Furniture Sale – Save Up to 75% | Furniture Mecca",

    description:
      "Shop furniture and mattresses with Free Delivery & Free Setup. Save up to 75% on top furniture collections.",

    url: "https://www.myfurnituremecca.com",

    siteName: "Furniture Mecca",

    locale: "en_US",


    images: [
      {
        url: "https://www.myfurnituremecca.com/Assets/Logo/fm-new-logo.png",
        width: 1200,
        height: 630,
        alt: "Furniture Mecca Logo",
      },
    ],

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Free Delivery & Free Setup | Furniture Sale – Save Up to 75% | Furniture Mecca",

    description:
      "Shop furniture and mattresses with Free Delivery & Free Setup. Save up to 75% on top furniture collections.",

    images: [
      "https://www.myfurnituremecca.com/Assets/Logo/fm-new-logo.png",
    ],
  }
};

export default function RootLayout({ children }) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.myfurnituremecca.com/#organization",
        name: "Furniture Mecca",
        url: "https://www.myfurnituremecca.com",
        logo: {
          "@type": "ImageObject",
          url: "https://www.myfurnituremecca.com/Assets/Logo/fm-new-logo.png",
          width: 512,
          height: 512
        },
        image: "https://www.myfurnituremecca.com/Assets/Logo/fm-new-logo.png",
      },
      {
        "@type": "WebSite",
        "@id": "https://www.myfurnituremecca.com/#website",
        url: "https://www.myfurnituremecca.com",
        name: "Furniture Mecca",
        publisher: {
          "@id": "https://www.myfurnituremecca.com/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://www.myfurnituremecca.com/searched-products?query={search_term_string}",
          },
          "query-input": {
            "@type": "PropertyValueSpecification",
            valueRequired: true,
            valueName: "search_term_string",
          },
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.png" sizes="any" />

        {/* Viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        {/* Leaflet */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />

        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      </head>

      <body>
        {/* Website + Organization Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];
            t=b.createElement(e);
            t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s);
            }(
              window,
              document,
              'script',
              'https://connect.facebook.net/en_US/fbevents.js'
            );

            fbq('init', '1187186698819806');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GQL4WY726N"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', 'G-GQL4WY726N', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Facebook Pixel NoScript */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1187186698819806&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}