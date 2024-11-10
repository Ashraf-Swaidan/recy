import type { Metadata } from "next";
import Image from "next/image";
import {
  ClerkProvider,
  ClerkLoaded,
  ClerkLoading
} from '@clerk/nextjs'
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
// import {Inter} from 'next/font/google';

// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["400", "700"],  
//   variable: "--font-inter",
// });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

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
      <body className={geistSans.className}>
        <ClerkLoading>
          <div className="flex flex-col gap-6 items-center justify-center h-screen">
         
            <Image
            src="/yay.gif"
            alt="loading.." 
            width={400}
            height={400}
            className="rounded-full bg-transparent"
           />
           
          </div>
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
