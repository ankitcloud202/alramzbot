'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from 'react-hot-toast';
import { ConfigureAmplify } from "./ConfigureAmplify";
import { Authenticator } from "@aws-amplify/ui-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const metadata: Metadata = {
  title: "Al Ramz Bot",
  description: "Developed by Cloud202",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <Authenticator.Provider>

    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        >
          <Authenticator className="mt-[20vh]">
        <Navbar/>
        <Toaster />
        <ConfigureAmplify />
        {children}
        <Footer/>
        </Authenticator>
      </body>
    </html>
  </Authenticator.Provider>
  );
}
