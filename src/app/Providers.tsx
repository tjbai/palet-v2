"use client";

import ModalProvider from "@/components/Providers/ModalProvider";
import PlayerProvider from "@/components/Providers/PlayerProvider";
import StyleProvider from "@/components/Providers/StyleProvider";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../lib/chakra/theme";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        {/* application state */}
        <QueryClientProvider client={queryClient}>
          <PlayerProvider>
            <StyleProvider>
              <ModalProvider>{children}</ModalProvider>
            </StyleProvider>
          </PlayerProvider>
        </QueryClientProvider>
        {/* application state */}
      </ChakraProvider>
    </CacheProvider>
  );
}
