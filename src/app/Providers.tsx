"use client";

import StyleProvider from "@/components/Common/StyleProvider";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../chakra/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <StyleProvider>{children}</StyleProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
