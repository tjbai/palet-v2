import { Flex } from "@chakra-ui/react";

export default function Kandi({ size }: { size: number }) {
  return (
    <Flex
      fontWeight="bold"
      color="white"
      bg="#e80778"
      w={`${size}px`}
      h={`${size}px`}
      align="center"
      justify="center"
      mr={5}
      borderRadius="5px"
      border="1px solid white"
    >
      K
    </Flex>
  );
}
