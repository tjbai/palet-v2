"use client";

import trackClickthrough from "@/lib/funcs/trackClickthrough";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import JoinModal from "../Common/JoinModal";
import { useModal } from "../Providers/ModalProvider";
import { useStyles } from "../Providers/StyleProvider";

export default function Landing({}: {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref");
  const { setGradientPosition } = useStyles();

  useEffect(() => {
    async function logRef(ref: string) {
      await trackClickthrough(ref);
      router.replace("/");
    }
    if (ref) logRef(ref);
    setGradientPosition("bottom");
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
    // <SectionWrapper>
    <Flex position="relative" pb="60px" h="calc(100vh)">
      <Flex
        maxW="100vw"
        overflowWrap="break-word"
        direction="column"
        id="section-1"
        align={{ sm: "center", md: "flex-start" }}
        justify="flex-end"
      >
        <Text
          fontSize={{ sm: "65px", md: "9.5vw" }}
          lineHeight={{ sm: "65px", md: "9vw" }}
          fontWeight={{ sm: "bold", md: "medium" }}
          mb={2}
          textAlign={{ sm: "center", md: "start" }}
        >
          {/* Connecting electronic music culture. */}
          More than just music.
        </Text>
        <Flex
          w="fit-content"
          direction={{ sm: "column", md: "row" }}
          mt={5}
          align="center"
          fontWeight="bold"
        >
          <Button
            variant="base"
            w="400px"
            fontWeight="bold"
            fontSize="17px"
            border="2px"
            onClick={() => setJoinModal(true)}
            _hover={{ borderColor: "black", color: "white", bg: "black" }}
          >
            Win tickets to Boiler Room NYC
          </Button>
          <Button
            variant="base"
            w={{ sm: "100%", md: "200px" }}
            ml={{ sm: 0, md: 5 }}
            mt={{ sm: 2, md: 0 }}
            onClick={() => {
              router.push("/about");
            }}
            bg="black"
            color="white"
            border="2px solid black"
            _hover={{ borderColor: "black", bg: "none", color: "black" }}
            fontSize="17px"
          >
            Learn more
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
