import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EclipsoTrack",
  description: "Track celestial events, planetary positions, and space phenomena in real-time with EclipsoTrack.",
  keywords: ["astronomy", "celestial events", "space", "eclipse", "meteor shower", "ISS tracking", "star map"],
  authors: [{ name: "Binayak Bartaula" }],
  icons: {
    icon: "/favicon.png",  
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Track celestial events, planetary positions, and space phenomena in real-time with EclipsoTrack." />
        <meta name="keywords" content="astronomy, celestial events, space, eclipse, meteor shower, ISS tracking, star map" />
        <meta name="author" content="EclipsoTrack Team" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
