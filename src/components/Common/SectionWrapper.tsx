import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function SectionWrapper(props: { children: ReactNode }) {
  return (
    <Flex position="relative" top="60px" h="calc(100vh - 60px)" pt="1.5vw">
      {props.children}
    </Flex>
  );
}
