import type { Metadata } from "next";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        <div className="grain-overlay" />
        <Navbar />
        <div className="pt-16">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
