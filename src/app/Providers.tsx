"use client";

import ModalProvider from "@/components/Providers/ModalProvider";
import StyleProvider from "@/components/Providers/StyleProvider";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../chakra/theme";
import PlayerProvider from "@/components/Providers/PlayerProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <PlayerProvider>
          <StyleProvider>
            <ModalProvider>{children}</ModalProvider>
          </StyleProvider>
        </PlayerProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
