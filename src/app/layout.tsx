"use client";

import Background from "@/components/Common/Background";
import Footer from "@/components/Common/Footer";
import Header from "@/components/Common/Header";
import JoinModal from "@/components/Common/JoinModal";
import { Analytics } from "@vercel/analytics/react";
import Providers from "./Providers";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Background>
            <Header />
            <JoinModal />
            {children}
            <Footer />
          </Background>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
