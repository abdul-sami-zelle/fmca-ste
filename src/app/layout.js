import ClientLayout from "@/Global-Components/ClientLayout/ClientLayout";
import Script from "next/script";

export const metadata = {
  title: "Free Delivery & Free Setup | Furniture Sale – Save Up to 75% Furniture Mecca",
  description:
    "Free Delivery & FREE Setup on all furniture during our Furniture Sale! Save up to 75% on living room, bedroom & dining sets. Limited-time offer—shop now!",
  openGraph: {
    title: "Free Delivery & Free Setup | Furniture Sale – Save Up to 75% Furniture Mecca",
    description:
      "Free Delivery & FREE Setup on all furniture during our Furniture Sale! Save up to 75% on living room, bedroom & dining sets. Limited-time offer—shop now!",
    url: "https://myfurnituremecca.com",
    siteName: "Furniture Mecca",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.png" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      </head>
      <body>
        {/*  Meta Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
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
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GQL4WY726N', {
              page_path: window.location.pathname,
            });
          `}
        </Script>



        {/* NoScript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1187186698819806&ev=PageView&noscript=1"
          />
        </noscript>

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
