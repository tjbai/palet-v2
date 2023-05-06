import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function BelowNowPlayingWrapper(props: {
  children: ReactNode;
  height: number;
  padding: number;
}) {
  return (
    <Flex
      h={`${props.height}vh`}
      position="relative"
      w="100%"
      m={0}
      zIndex={10}
    >
      <Flex
        position="relative"
        top={{ base: "115px", md: "130px" }}
        direction="column"
        overflowX="scroll"
        pt={`${props.padding}px`}
        w="100%"
      >
        {props.children}
      </Flex>
    </Flex>
  );
}
