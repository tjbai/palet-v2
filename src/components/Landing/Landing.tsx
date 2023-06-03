"use client";

import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useModal } from "../Providers/ModalProvider";
import { useStyles } from "../Providers/StyleProvider";

export default function Landing() {
  const { setBackground } = useStyles();

  useEffect(() => {
    setBackground("landing");
  }, []);

  return (
    <Flex direction="column" position="relative" id="parent">
      <IntroSection />
    </Flex>
  );
}

function IntroSection() {
  const { setJoinModal } = useModal();
  const router = useRouter();

  return (
    <Flex position="relative" pb="60px" h={{ base: "80vh", sm: "calc(100vh)" }}>
      <Flex
        maxW="100vw"
        overflowWrap="break-word"
        direction="column"
        id="section-1"
        align={{ base: "center", sm: "flex-start" }}
        justify="flex-end"
      >
        <Text
          fontSize={{ base: "60px", md: "9.5vw" }}
          lineHeight={{ base: "65px", md: "9vw" }}
          fontWeight={{ base: "bold", md: "medium" }}
          mb={2}
          textAlign={{ base: "center", sm: "start" }}
        >
          just music.
        </Text>
        <Flex
          w="fit-content"
          direction={{ base: "column", md: "row" }}
          mt={5}
          align="center"
          fontWeight="bold"
        >
          <Button
            variant="base"
            w={{ base: "100%", md: "400px" }}
            fontWeight="bold"
            fontSize={{ base: "15px", sm: "17px" }}
            border="2px"
            onClick={() => setJoinModal(true)}
            _hover={{ borderColor: "black", color: "white", bg: "black" }}
          >
            Win tickets to Boiler Room NYC
          </Button>
          <Button
            variant="base"
            w={{ base: "100%", md: "200px" }}
            ml={{ base: 0, md: 5 }}
            mt={{ base: 2, md: 0 }}
            onClick={() => {
              router.push("/about");
            }}
            bg="black"
            color="white"
            border="2px solid black"
            _hover={{ borderColor: "black", bg: "none", color: "black" }}
            fontSize={{ base: "15px", sm: "17px" }}
          >
            Learn more
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
