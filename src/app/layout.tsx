"use client";

import Footer from "@/components/Common/Footer";
import Header from "@/components/Common/Header";
import Background from "@/components/Common/Background";
import "./globals.css";
import Providers from "./Providers";

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
            {children}
            <Footer />
          </Background>
        </Providers>
      </body>
    </html>
  );
}
