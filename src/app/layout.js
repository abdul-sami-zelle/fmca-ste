import ClientLayout from "@/Global-Components/ClientLayout/ClientLayout";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://myfurnituremecca.com"),

  title:
    "Affordable Furniture Store in Philadelphia | Furniture Mecca",

  description:
    "Find affordable furniture in Philadelphia at Furniture Mecca. Shop quality living room, bedroom, dining room furniture, mattresses, and enjoy flexible financing options.",


  robots: {
    index: true,
    follow: true
  },
  keywords: [
    "Furniture Mecca",
    "Furniture Store",
    "Living Room Furniture",
    "Bedroom Furniture",
    "Dining Room Furniture",
    "Mattresses",
    "Furniture Sale",
    "Affordable Furniture"
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
      "Affordable Furniture Store in Philadelphia | Furniture Mecca",

    description:
      "Find affordable furniture in Philadelphia at Furniture Mecca. Shop quality living room, bedroom, dining room furniture, mattresses, and enjoy flexible financing options.",

    url: "https://myfurnituremecca.com",

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
      "Affordable Furniture Store in Philadelphia | Furniture Mecca",

    description:
      "Find affordable furniture in Philadelphia at Furniture Mecca. Shop quality living room, bedroom, dining room furniture, mattresses, and enjoy flexible financing options.",

    images: [
      "https://www.myfurnituremecca.com/Assets/Logo/fm-new-logo.png",
    ],
  }
};

export default function RootLayout({ children }) {


  const FurnitureStoreSchema = {
    "@type": "FurnitureStore",
    "@id": "https://www.myfurnituremecca.com/#localbusiness",
    "name": "Furniture Mecca",
    "alternateName": [
      "My Furniture Mecca",
      "myfurnituremecca",
      "MyFurnitureMecca"
    ],
    "url": "https://www.myfurnituremecca.com",
    "image": "https://www.myfurnituremecca.com/Assets/Logo/fm-new-logo.png",
    "logo": "https://www.myfurnituremecca.com/Assets/Logo/fm-new-logo.png",
    "email": "meccacustomercare@gmail.com",
    "telephone": "+1-215-352-1600",
    "sameAs": [
      "https://www.facebook.com/myfurnituremecca",
      "https://www.instagram.com/myfurnituremecca",
      "https://www.youtube.com/@FurnitureMecca1",
      "https://www.tiktok.com/@myfurnituremecca"
    ],
    "priceRange": "$$",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Cash, Credit Card, Debit Card, Financing",
    "areaServed": [
      {
        "@type": "State",
        "name": "Pennsylvania"
      },
      {
        "@type": "State",
        "name": "New Jersey"
      }
    ],
    "hasPOS": [
      {
        "@type": "FurnitureStore",
        "name": "Furniture Mecca - Venango Store",
        "telephone": "+1-267-639-6801",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "101 E Venango St",
          "addressLocality": "Philadelphia",
          "addressRegion": "PA",
          "postalCode": "19134",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 40.0045027,
          "longitude": -75.1276754
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "19:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "10:00",
            "closes": "18:00"
          }
        ]
      },

      {
        "@type": "FurnitureStore",
        "name": "Furniture Mecca - Hunting Park Store",
        "telephone": "+1-267-297-8558",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1430 W Hunting Park Ave",
          "addressLocality": "Philadelphia",
          "addressRegion": "PA",
          "postalCode": "19140",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 40.0168774,
          "longitude": -75.1511918
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:30",
            "closes": "19:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "10:00",
            "closes": "18:00"
          }
        ]
      },

      {
        "@type": "FurnitureStore",
        "name": "Furniture Mecca - Upper Darby Store",
        "telephone": "+1-610-352-3500",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "501 S 69th St #4232",
          "addressLocality": "Upper Darby",
          "addressRegion": "PA",
          "postalCode": "19082",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 39.952179,
          "longitude": -75.255919
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:30",
            "closes": "19:30"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "10:00",
            "closes": "18:30"
          }
        ]
      },

      {
        "@type": "FurnitureStore",
        "name": "Furniture Mecca - Lansdowne Store",
        "telephone": "+1-484-462-0282",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "130 E Baltimore Ave",
          "addressLocality": "Lansdowne",
          "addressRegion": "PA",
          "postalCode": "19050",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 39.9391447,
          "longitude": -75.2657429
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "19:00"
          }
        ]
      },

      {
        "@type": "FurnitureStore",
        "name": "Furniture Mecca - Allentown Store",
        "telephone": "+1-484-221-8230",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "611 W Brookdale St",
          "addressLocality": "Allentown",
          "addressRegion": "PA",
          "postalCode": "18103",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 40.5828577,
          "longitude": -75.4610601
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Monday",
            "opens": "09:30",
            "closes": "19:30"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:30",
            "closes": "19:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "10:00",
            "closes": "18:00"
          }
        ]
      },

      {
        "@type": "FurnitureStore",
        "name": "Furniture Mecca - Folcroft Store",
        "telephone": "+1-215-422-3883",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1830 Delmar Dr",
          "addressLocality": "Folcroft",
          "addressRegion": "PA",
          "postalCode": "19032",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 39.8928319,
          "longitude": -75.2840838
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "19:00"
          }
        ]
      },

      {
        "@type": "FurnitureStore",
        "name": "Furniture Mecca - Lancaster Store",
        "telephone": "+1-215-877-1200",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "5648 Lancaster Ave",
          "addressLocality": "Philadelphia",
          "addressRegion": "PA",
          "postalCode": "19131",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 39.9805468,
          "longitude": -75.2355337
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:30",
            "closes": "19:30"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "10:00",
            "closes": "18:00"
          }
        ]
      },

      {
        "@type": "FurnitureStore",
        "name": "Furniture Mecca - Reading Store",
        "telephone": "+1-484-869-5338",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "408 Penn St",
          "addressLocality": "Reading",
          "addressRegion": "PA",
          "postalCode": "19602",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 40.3352932,
          "longitude": -75.9294978
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:30",
            "closes": "19:00"
          }
        ]
      },

      {
        "@type": "FurnitureStore",
        "name": "Furniture Mecca - Ewing Township Store",
        "telephone": "+1-609-392-2800",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1600 N Olden Ave",
          "addressLocality": "Ewing Township",
          "addressRegion": "NJ",
          "postalCode": "08638",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 40.2441288,
          "longitude": -74.7573557
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:30",
            "closes": "19:30"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "10:00",
            "closes": "18:00"
          }
        ]
      }
    ]
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.myfurnituremecca.com/#organization",
        "name": "Furniture Mecca",
        "alternateName": [
          "My Furniture Mecca",
          "myfurnituremecca",
          "MyFurnitureMecca"

        ],
        "url": "https://www.myfurnituremecca.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.myfurnituremecca.com/Assets/Logo/fm-new-logo.png"
        },
        "image": "https://www.myfurnituremecca.com/Assets/Logo/fm-new-logo.png",
        "email": "meccacustomercare@gmail.com",
        "telephone": "+1-215-352-1600",
        "sameAs": [
          "https://www.facebook.com/myfurnituremecca",
          "https://www.instagram.com/myfurnituremecca",
          "https://www.youtube.com/@FurnitureMecca1",
          "https://www.tiktok.com/@myfurnituremecca"
        ]
      },

      {
        "@type": "WebSite",
        "@id": "https://www.myfurnituremecca.com/#website",
        url: "https://www.myfurnituremecca.com",
        name: "Furniture Mecca",
        alternateName: [
          "My Furniture Mecca",
          "myfurnituremecca",
          "MyFurnitureMecca"

        ],
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

      FurnitureStoreSchema
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

{/* Google Analytics + Google Ads */}
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-GQL4WY726N"
  strategy="afterInteractive"
/>

<Script id="google-tags" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      dataLayer.push(arguments);
    }

    gtag('js', new Date());

    // Google Analytics 4
    gtag('config', 'G-GQL4WY726N', {
      page_path: window.location.pathname,
    });

    // Google Ads
    gtag('config', 'AW-985619704');
  `}
</Script>

{/* Google Tag Manager */}
<Script id="google-tag-manager" strategy="afterInteractive">
  {`
    (function(w,d,s,l,i){
      w[l]=w[l]||[];
      w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),
          dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-K24JR7X4');
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