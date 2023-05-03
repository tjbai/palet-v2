"use client";

import { Flex, Link, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex
      w="100%"
      borderTop="1px solid black"
      h="60px"
      position="relative"
      align="center"
      justify="flex-end"
      display={{ base: "none", sm: "flex" }}
    >
      <Text fontWeight="bold">
        <Link href="mailto:omar@paletapp.com">Contact us</Link>
      </Text>
    </Flex>
  );
}
