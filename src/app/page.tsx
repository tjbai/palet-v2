import Background from "@/components/Common/Background";
import Landing from "@/components/Landing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Palet",
  description: "More than just music.",
  openGraph: {
    images: "/images/landing-bg-v2.jpg",
    title: "Palet",
    description: "More than just music.",
    siteName: "paletapp.com",
    url: "https://paletapp.com",
  },
};

export default function Home({ params }: { params: any }) {
  return <Landing />;
}
