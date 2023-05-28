import { Flex, Link, Text, VStack } from "@chakra-ui/react";
import { Suspense, useEffect, useState } from "react";
import { useStyles } from "../Providers/StyleProvider";

export default function About() {
  return (
    <Flex direction="column" maxW={{ sm: "100%", md: "60%" }}>
      <MainSection />
    </Flex>
  );
}

type Selections = "artists" | "listeners" | "kandi";

function MainSection() {
  const [selection, setSelection] = useState<Selections>("listeners");
  const { setBackground } = useStyles();

  useEffect(() => setBackground("about"), []);

  return (
    <Suspense>
      <Flex position="relative" top="60px" h="100vh">
        <Flex position="relative" top="-60px" id="section-2" />
        <Flex
          direction="column"
          id="section-2"
          pt={{ base: "20px", md: "1.5vw" }}
          onClick={() => console.log("clicked")}
          // border="1px solid red"
        >
          <Flex
            w="fit-content"
            fontSize={{ base: "30px", md: "5vw" }}
            lineHeight={{ base: "30px", md: "4vw" }}
          >
            <Text
              _hover={{
                cursor: "pointer",
              }}
              onClick={() => {
                setSelection("listeners");
              }}
              fontWeight={selection === "listeners" ? "bold" : "fine"}
            >
              Listeners
            </Text>
            <Text
              ml="1.5vw"
              _hover={{
                cursor: "pointer",
              }}
              onClick={() => {
                setSelection("artists");
              }}
              fontWeight={selection === "artists" ? "bold" : "fine"}
            >
              Artists
            </Text>
            <Text
              ml="1.5vw"
              _hover={{ cursor: "pointer" }}
              onClick={() => setSelection("kandi")}
              fontWeight={selection === "kandi" ? "bold" : "fine"}
            >
              Kandi
            </Text>
          </Flex>

          <Text maxW={{ base: "100%", md: "100vw" }} mt="1.5vw" fontSize="25px">
            {selection === "listeners" ? (
              <ListenerSpew />
            ) : selection === "artists" ? (
              <ArtistSpew />
            ) : (
              <KandiSpew />
            )}
          </Text>
        </Flex>
      </Flex>
    </Suspense>
  );
}

function KandiSpew() {
  return (
    <VStack
      align="flex-start"
      fontSize={{ base: "20px", md: "2vw" }}
      mt={3}
      position="absolute"
    >
      <Text>Meritocratic monetization and discovery, at last.</Text>
      <Text>Users gift. Artists receive. It&apos;s that simple (really).</Text>
      <Text>No more label in the middle.</Text>
      <Text>Show your support and unlock exclusive benefits...</Text>
      <Text>
        Still confused? That&apos;s okay.
        <Link href="mailto:omar@paletapp.com" ml={2} fontWeight="bold">
          Contact us.
        </Link>
      </Text>
    </VStack>
  );
}

function ListenerSpew() {
  return (
    <VStack align="flex-start" fontSize={{ base: "20px", md: "2vw" }} mt={3}>
      <Text>
        Palet is a streaming platform that builds on the ways you stream,
        discover, and engage with music.
      </Text>
      <Text>
        For the superfans, club rats, and audiophiles of the world, connect with
        fellow fans and artists like never before.
      </Text>
      <Text>
        From better live event discovery to providing more opportunities to
        connect with artists, we want to do it all.
      </Text>

      <Text>
        Confused? That&apos;s okay.
        <Link href="mailto:omar@paletapp.com" ml={2} fontWeight="bold">
          Contact us.
        </Link>
      </Text>
    </VStack>
  );
}

function ArtistSpew() {
  return (
    <VStack align="flex-start" fontSize={{ base: "20px", md: "2vw" }} mt={3}>
      <Text>We make your life easy.</Text>
      <Text>
        Palet puts all the tools you might need to build a career and brand in
        one place.
      </Text>
      <Text>
        Rather than hopping between platforms and subscriptions, we merge
        functionality like hosting music, monetization, and managing live
        events.
      </Text>
      <Text>
        Confused? That&apos;s okay.
        <Link href="google.com" ml={2} fontWeight="bold">
          Contact us.
        </Link>
      </Text>
    </VStack>
  );
}
