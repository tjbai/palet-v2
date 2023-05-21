"use client";

import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useStyles } from "../Providers/StyleProvider";
import "./index.css";

/*
Example implementation using middleware headers. 
*/

// export default function Background({ children }: { children: ReactNode }) {
//   const headersList = headers();
//   const url = headersList.get("x-url") || "";
//   const pathname = new URL(url).pathname;

//   if (pathname === "/" || pathname === "")
//     return <div className="backgroundImage">{children}</div>;
//   else if (pathname === "/about")
//     return <div className="backgroundImage bg--about">{children}</div>;
//   else return <div className="backgroundImage">{children}</div>;
// }

/*
Someday this will either be a server component or we just won't have one big "controller"
component for every screen's background. 
*/
export default function Background({ children }: { children: ReactNode }) {
  const { gradient, backgroundImage } = useStyles();

  console.log(backgroundImage);

  return (
    <Box
      backgroundImage={backgroundImage}
      backgroundColor="#dcdcdc"
      backgroundSize="cover"
      backgroundPosition="center center"
      backgroundAttachment="fixed"
      position="relative"
      zIndex="0"
      h="100vh"
      width="100%"
      px="25px"
      overflowY="scroll"
      _before={{
        content: `""`,
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        transition: "1s",
        background: gradient.exists
          ? gradient.position === "bottom"
            ? `linear-gradient(to bottom, rgba(255,255,255,0) ${gradient.intensity}%, rgba(255,255,255,1) 100%)`
            : `linear-gradient(to top, rgba(255,255,255,0) ${gradient.intensity}%, rgba(255,255,255,1) 100%)`
          : "",
        zIndex: "-1",
      }}
    >
      {children}
    </Box>
  );
}
