import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useStyles } from "../Providers/StyleProvider";

export default function Background({ children }: { children: ReactNode }) {
  const { gradient, backgroundImage } = useStyles();

  return (
    <Box
      backgroundImage={backgroundImage}
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
          gradient.position === "bottom"
            ? `linear-gradient(to bottom, rgba(255,255,255,0) ${gradient.intensity}%, rgba(255,255,255,1) 100%)`
            : `linear-gradient(to top, rgba(255,255,255,0) ${gradient.intensity}%, rgba(255,255,255,1) 100%)`,
        zIndex: "-1",
      }}
      px="25px"
    >
      {children}
    </Box>
  );
}
