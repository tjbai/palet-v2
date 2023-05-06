import NowPlaying from "@/components/Player/NowPlaying";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NowPlaying />
      {children}
    </>
  );
}
