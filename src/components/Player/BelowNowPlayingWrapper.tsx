import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function BelowNowPlayingWrapper(props: {
  children: ReactNode;
  height: number;
  padding: number;
  showBorder?: boolean;
}) {
  return (
    <Flex
      h={`${props.height}vh`}
      position="fixed"
      w="100%"
      m={0}
      zIndex={3}
      border={props.showBorder ? "1px solid red" : "none"}
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
