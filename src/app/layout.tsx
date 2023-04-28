"use client";

import Footer from "@/components/Common/Footer";
import Header from "@/components/Common/Header";
import Background from "@/components/Common/Background";
import "./globals.css";
import Providers from "./Providers";
import { Router } from "next/router";
import { useState, useEffect } from "react";
import Loader from "@/components/Loader";
import JoinModal from "@/components/Common/JoinModal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    Router.events.on("routeChangeStart", () => {
      setLoading(true);
    });

    Router.events.on("routeChangeComplete", () => {
      setLoading(false);
    });

    Router.events.on("routeChangeError", () => {
      setLoading(false);
    });
  }, [Router]);

  return (
    <html lang="en">
      <body>
        <Providers>
          <Background>
            <Header />
            <JoinModal />
            {isLoading ? <Loader /> : null}
            {children}
            <Footer />
          </Background>
        </Providers>
      </body>
    </html>
  );
}
