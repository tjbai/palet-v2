import { Box } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { useStyles } from "./StyleProvider";

export default function Landing({ children }: { children: ReactNode }) {
  const { gradientPosition } = useStyles();

  return (
    <Box
      backgroundImage="/images/landing-bg-v2.jpg"
      backgroundSize="cover"
      backgroundPosition="center center"
      backgroundAttachment="fixed"
      position="relative"
      zIndex="0"
      h="100vh"
      width="100%"
      overflowY="scroll"
      _before={{
        content: `""`,
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        transition: "1s",
        background:
          gradientPosition === "bottom"
            ? "linear-gradient(to bottom, rgba(255,255,255,0) 20%, rgba(255,255,255,1) 100%)"
            : "linear-gradient(to top, rgba(255,255,255,0) 20%, rgba(255,255,255,1) 100%)",
        zIndex: "-1",
      }}
      px="25px"
    >
      {children}
    </Box>
  );
}
