import type { Metadata } from "next";

import {
  ClerkProvider,
  ClerkLoaded,
  ClerkLoading
} from '@clerk/nextjs'
// import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Recy",
  description: "Your Go-to Recipe Library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        <ClerkLoading>
          <div>Loading app...</div>
        </ClerkLoading>
        <ClerkLoaded>
          <Navbar />
          {children}
        </ClerkLoaded>
        
      </body>
    </html>
  </ClerkProvider>
  );
}
