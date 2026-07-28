import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FLOWELL — Producer & Beatmaker",
  description: "Afrobeats, R&B, and hip-hop production. 400+ beats, producer packs, and custom production services.",
  keywords: "flowell, beats, producer, afrobeats, R&B, hip-hop, instrumentals, beat licensing",
  openGraph: {
    title: "FLOWELL",
    description: "Afrobeats, R&B, and hip-hop production",
    type: "website",
  },
  icons: {
    icon: '/images/favicon-bolt.svg',
    apple: '/images/flowell-logo.jpg',
  },
};

const GA_ID = "G-ZY38V4JW78";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body className="bg-black text-white min-h-screen">
        <div className="grain-overlay" />
        <Navbar />
        <div className="pt-16">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
