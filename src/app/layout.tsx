import Background from "@/components/Common/Background";
import Header from "@/components/Common/Header";
import JoinModal from "@/components/Common/JoinModal";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import Providers from "./Providers";
import "./globals.css";

export const metadata = {
  title: {
    default: "Palet",
    template: "%s | Palet",
  },
  description: "More than just music",
  keywords: ["EDM", "House", "Music", "Streaming", "Kandi"],
  openGraph: {
    title: "Palet",
    description: "More than just music",
    url: "https://paletapp.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Providers>
            <Background>
              <Header />
              <JoinModal />
              {children}
            </Background>
          </Providers>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
